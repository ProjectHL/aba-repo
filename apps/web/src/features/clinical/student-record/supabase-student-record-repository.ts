import { z, ZodError } from "zod"

import { notifySessionInvalidated } from "@/auth/session-invalidation"
import type {
  AppendHistoryDraft,
  AuthorizationDecision,
  AuthorizationRequest,
  ClinicalHistoryEntry,
  ConsentReference,
  SaveContextDraft,
  StudentAccess,
  StudentAssignment,
  StudentContext,
  StudentRecord,
  StudentRecordRepository,
} from "@/features/clinical/student-record/student-record-repository-contract"
import { getSupabaseClient } from "@/lib/supabase/client"
import { DomainError, normalizeSupabaseError } from "@/lib/supabase/domain-error"
import { supabaseTimestampSchema } from "@/lib/supabase/timestamp-schema"

type QueryResult = { data: unknown; error: unknown }
type QueryBuilder = {
  select: (columns: string) => QueryBuilder
  eq: (column: string, value: string) => QueryBuilder
  order: (column: string, options: { ascending: boolean }) => QueryBuilder
  abortSignal: (signal: AbortSignal) => QueryBuilder
  maybeSingle: () => Promise<QueryResult>
  then: Promise<QueryResult>["then"]
}
type StudentRecordClient = {
  from: (table: string) => QueryBuilder
  rpc: (name: string, args: Record<string, unknown>) => Promise<QueryResult>
}

const client = () => getSupabaseClient() as unknown as StudentRecordClient

const contextRowSchema = z.object({
  client_id: z.uuid(),
  home_adaptations: z.string().nullable(),
  schooling: z.string().nullable(),
  school_adaptations: z.string().nullable(),
  version: z.number().int().positive(),
  updated_at: supabaseTimestampSchema,
})
const historyRowSchema = z.object({
  id: z.uuid(), client_id: z.uuid(),
  kind: z.enum(["reported_diagnosis", "assessment", "procedure", "medication"]),
  descriptor: z.string().min(1), occurred_on: z.iso.date().nullable(),
  dose: z.string().nullable(), prescriber_descriptor: z.string().nullable(),
  started_on: z.iso.date().nullable(), ended_on: z.iso.date().nullable(),
  status: z.enum(["active", "superseded", "entered_in_error"]),
  supersedes_id: z.uuid().nullable(), created_at: supabaseTimestampSchema,
})
const consentRowSchema = z.object({
  id: z.uuid(), client_id: z.uuid(), purpose_code: z.string().min(1),
  notice_version: z.string().min(1), grantor_descriptor: z.string().min(1),
  channel: z.string().min(1), evidence_reference: z.string().nullable(),
  status: z.enum(["pending_review", "valid", "revoked", "expired", "superseded"]),
  effective_at: supabaseTimestampSchema.nullable(), expires_at: supabaseTimestampSchema.nullable(),
  supersedes_id: z.uuid().nullable(), created_at: supabaseTimestampSchema,
})
const assignmentRowSchema = z.object({
  id: z.uuid(), client_id: z.uuid(), user_id: z.uuid(),
  role: z.enum(["supervisor", "coordinator", "therapist", "family"]),
  is_primary: z.boolean(), status: z.enum(["active", "inactive"]),
})
const requestRowSchema = z.object({
  id: z.uuid(), client_id: z.uuid(), requester_user_id: z.uuid(),
  resource_type: z.enum(["student", "program", "record_config", "chart"]),
  requested_actions: z.array(z.string().min(1)), reason: z.string().min(1),
  status: z.enum(["pending", "approved", "denied"]), created_at: supabaseTimestampSchema,
})
const decisionRowSchema = z.object({
  id: z.uuid(), client_id: z.uuid(), request_id: z.uuid(),
  decision: z.enum(["approved", "denied", "revoked"]),
  granted_actions: z.array(z.string()), expires_at: supabaseTimestampSchema.nullable(),
  supersedes_decision_id: z.uuid().nullable(), created_at: supabaseTimestampSchema,
})

const CONTEXT_COLUMNS = "client_id, home_adaptations, schooling, school_adaptations, version, updated_at"
const HISTORY_COLUMNS = "id, client_id, kind, descriptor, occurred_on, dose, prescriber_descriptor, started_on, ended_on, status, supersedes_id, created_at"
const CONSENT_COLUMNS = "id, client_id, purpose_code, notice_version, grantor_descriptor, channel, evidence_reference, status, effective_at, expires_at, supersedes_id, created_at"
const ASSIGNMENT_COLUMNS = "id, client_id, user_id, role, is_primary, status"
const REQUEST_COLUMNS = "id, client_id, requester_user_id, resource_type, requested_actions, reason, status, created_at"
const DECISION_COLUMNS = "id, client_id, request_id, decision, granted_actions, expires_at, supersedes_decision_id, created_at"

function normalizeAndNotify(error: unknown) {
  const normalized = normalizeSupabaseError(error)
  if (normalized.code === "UNAUTHORIZED") notifySessionInvalidated()
  return normalized
}

function parse<T>(schema: z.ZodType<T>, value: unknown, message: string): T {
  try { return schema.parse(value) }
  catch (error) {
    if (error instanceof ZodError) throw new DomainError("INVALID_DATA_RESPONSE", message)
    throw error
  }
}

function mapContext(value: unknown): StudentContext {
  const row = parse(contextRowSchema, value, "El servicio devolvió contexto inválido")
  return {
    clientId: row.client_id, homeAdaptations: row.home_adaptations ?? "",
    schooling: row.schooling ?? "", schoolAdaptations: row.school_adaptations ?? "",
    version: row.version, updatedAt: row.updated_at,
  }
}

function mapHistory(value: unknown): ClinicalHistoryEntry {
  const row = parse(historyRowSchema, value, "El servicio devolvió historia inválida")
  return {
    id: row.id, clientId: row.client_id, kind: row.kind, descriptor: row.descriptor,
    ...(row.occurred_on ? { occurredOn: row.occurred_on } : {}),
    ...(row.dose ? { dose: row.dose } : {}),
    ...(row.prescriber_descriptor ? { prescriberDescriptor: row.prescriber_descriptor } : {}),
    ...(row.started_on ? { startedOn: row.started_on } : {}),
    ...(row.ended_on ? { endedOn: row.ended_on } : {}),
    status: row.status, ...(row.supersedes_id ? { supersedesId: row.supersedes_id } : {}),
    createdAt: row.created_at,
  }
}

function mapConsent(value: unknown): ConsentReference {
  const row = parse(consentRowSchema, value, "El servicio devolvió consentimiento inválido")
  return {
    id: row.id, clientId: row.client_id, purposeCode: row.purpose_code,
    noticeVersion: row.notice_version, grantorDescriptor: row.grantor_descriptor,
    channel: row.channel, ...(row.evidence_reference ? { evidenceReference: row.evidence_reference } : {}),
    status: row.status, ...(row.effective_at ? { effectiveAt: row.effective_at } : {}),
    ...(row.expires_at ? { expiresAt: row.expires_at } : {}),
    ...(row.supersedes_id ? { supersedesId: row.supersedes_id } : {}), createdAt: row.created_at,
  }
}

function mapAssignment(value: unknown): StudentAssignment {
  const row = parse(assignmentRowSchema, value, "El servicio devolvió asignación inválida")
  return { id: row.id, clientId: row.client_id, userId: row.user_id, role: row.role, isPrimary: row.is_primary, status: row.status }
}

function mapRequest(value: unknown): AuthorizationRequest {
  const row = parse(requestRowSchema, value, "El servicio devolvió solicitud inválida")
  return { id: row.id, clientId: row.client_id, requesterUserId: row.requester_user_id, resourceType: row.resource_type, requestedActions: row.requested_actions, reason: row.reason, status: row.status, createdAt: row.created_at }
}

function mapDecision(value: unknown): AuthorizationDecision {
  const row = parse(decisionRowSchema, value, "El servicio devolvió decisión inválida")
  return {
    id: row.id, clientId: row.client_id, requestId: row.request_id,
    decision: row.decision, grantedActions: row.granted_actions,
    ...(row.expires_at ? { expiresAt: row.expires_at } : {}),
    ...(row.supersedes_decision_id ? { supersedesDecisionId: row.supersedes_decision_id } : {}),
    createdAt: row.created_at,
  }
}

function optional(key: string, value: string | undefined) {
  return value ? { [key]: value } : {}
}

export const supabaseStudentRecordRepository: StudentRecordRepository = {
  async load(clientId, signal): Promise<StudentRecord> {
    let contextQuery = client().from("client_context_profiles").select(CONTEXT_COLUMNS).eq("client_id", clientId)
    let historyQuery = client().from("clinical_history_entries").select(HISTORY_COLUMNS).eq("client_id", clientId).order("created_at", { ascending: false })
    let consentQuery = client().from("consent_records").select(CONSENT_COLUMNS).eq("client_id", clientId).order("created_at", { ascending: false })
    if (signal) {
      contextQuery = contextQuery.abortSignal(signal)
      historyQuery = historyQuery.abortSignal(signal)
      consentQuery = consentQuery.abortSignal(signal)
    }
    const [contextResult, historyResult, consentResult] = await Promise.all([
      contextQuery.maybeSingle(), historyQuery, consentQuery,
    ])
    for (const result of [contextResult, historyResult, consentResult]) if (result.error) throw normalizeAndNotify(result.error)
    return {
      context: contextResult.data ? mapContext(contextResult.data) : null,
      history: parse(z.array(historyRowSchema), historyResult.data, "El servicio devolvió historia inválida").map(mapHistory),
      consents: parse(z.array(consentRowSchema), consentResult.data, "El servicio devolvió consentimientos inválidos").map(mapConsent),
    }
  },

  async loadAccess(clientId, currentUserId, signal): Promise<StudentAccess> {
    let teamQuery = client().from("student_assignments").select(ASSIGNMENT_COLUMNS).eq("client_id", clientId)
    let requestsQuery = client().from("student_authorization_requests").select(REQUEST_COLUMNS).eq("client_id", clientId).order("created_at", { ascending: false })
    let decisionsQuery = client().from("student_authorization_decisions").select(DECISION_COLUMNS).eq("client_id", clientId).order("created_at", { ascending: false })
    if (signal) { teamQuery = teamQuery.abortSignal(signal); requestsQuery = requestsQuery.abortSignal(signal); decisionsQuery = decisionsQuery.abortSignal(signal) }
    const [teamResult, requestsResult, decisionsResult, capabilitiesResult] = await Promise.all([
      teamQuery, requestsQuery, decisionsQuery, client().rpc("get_student_capabilities", { p_client_id: clientId }),
    ])
    if (teamResult.error) throw normalizeAndNotify(teamResult.error)
    if (requestsResult.error) throw normalizeAndNotify(requestsResult.error)
    if (decisionsResult.error) throw normalizeAndNotify(decisionsResult.error)
    if (capabilitiesResult.error) throw normalizeAndNotify(capabilitiesResult.error)
    const team = parse(z.array(assignmentRowSchema), teamResult.data, "El servicio devolvió equipo inválido").map(mapAssignment)
    const requests = parse(z.array(requestRowSchema), requestsResult.data, "El servicio devolvió solicitudes inválidas").map(mapRequest)
    const decisions = parse(z.array(decisionRowSchema), decisionsResult.data, "El servicio devolvió decisiones inválidas").map(mapDecision)
    const capabilities = parse(z.array(z.string()), capabilitiesResult.data, "El servicio devolvió capacidades inválidas")
    return { currentAssignment: team.find((item) => item.userId === currentUserId && item.status === "active") ?? null, team, requests, decisions, capabilities }
  },

  async saveContext(draft: SaveContextDraft) {
    const { data, error } = await client().rpc("save_client_context", {
      p_client_id: draft.clientId,
      ...(draft.expectedVersion ? { p_expected_version: draft.expectedVersion } : {}),
      p_home_adaptations: draft.homeAdaptations.trim(),
      p_school_adaptations: draft.schoolAdaptations.trim(),
      p_schooling: draft.schooling.trim(),
    })
    if (error) throw normalizeAndNotify(error)
    return mapContext(data)
  },

  async appendHistoryEntry(draft: AppendHistoryDraft) {
    const { data, error } = await client().rpc("append_clinical_history_entry", {
      p_client_id: draft.clientId, p_kind: draft.kind, p_descriptor: draft.descriptor.trim(),
      ...optional("p_occurred_on", draft.occurredOn), ...optional("p_dose", draft.dose?.trim()),
      ...optional("p_prescriber_descriptor", draft.prescriberDescriptor?.trim()),
      ...optional("p_started_on", draft.startedOn), ...optional("p_ended_on", draft.endedOn),
      ...optional("p_supersedes_id", draft.supersedesId),
    })
    if (error) throw normalizeAndNotify(error)
    return mapHistory(data)
  },

  async appendHistoryEntries(clientId, drafts) {
    const { data, error } = await client().rpc("append_clinical_history_entries", {
      p_client_id: clientId,
      p_entries: drafts.map((draft) => ({
        kind: draft.kind,
        descriptor: draft.descriptor.trim(),
        ...(draft.occurredOn ? { occurred_on: draft.occurredOn } : {}),
        ...(draft.dose?.trim() ? { dose: draft.dose.trim() } : {}),
        ...(draft.prescriberDescriptor?.trim() ? { prescriber_descriptor: draft.prescriberDescriptor.trim() } : {}),
        ...(draft.startedOn ? { started_on: draft.startedOn } : {}),
        ...(draft.endedOn ? { ended_on: draft.endedOn } : {}),
        ...(draft.supersedesId ? { supersedes_id: draft.supersedesId } : {}),
      })),
    })
    if (error) throw normalizeAndNotify(error)
    return parse(z.array(historyRowSchema), data, "El servicio devolvió historia inválida").map(mapHistory)
  },

  async recordConsent(draft) {
    const { data, error } = await client().rpc("record_consent_reference", {
      p_client_id: draft.clientId, p_purpose_code: draft.purposeCode.trim(),
      p_notice_version: draft.noticeVersion.trim(), p_grantor_descriptor: draft.grantorDescriptor.trim(),
      p_channel: draft.channel.trim(), p_status: draft.status,
      ...optional("p_effective_at", draft.effectiveAt), ...optional("p_expires_at", draft.expiresAt),
      ...optional("p_evidence_reference", draft.evidenceReference?.trim()), ...optional("p_supersedes_id", draft.supersedesId),
    })
    if (error) throw normalizeAndNotify(error)
    return mapConsent(data)
  },

  async requestAuthorization(draft) {
    const { data, error } = await client().rpc("request_student_authorization", {
      p_client_id: draft.clientId, p_resource_type: draft.resourceType,
      p_actions: draft.actions, p_reason: draft.reason.trim(),
    })
    if (error) throw normalizeAndNotify(error)
    return mapRequest(data)
  },

  async decideAuthorization(requestId, decision, expiresAt) {
    const { error } = await client().rpc("decide_student_authorization", {
      p_request_id: requestId, p_decision: decision, ...optional("p_expires_at", expiresAt),
    })
    if (error) throw normalizeAndNotify(error)
  },

  async revokeAuthorization(decisionId) {
    const { error } = await client().rpc("revoke_student_authorization", { p_decision_id: decisionId })
    if (error) throw normalizeAndNotify(error)
  },

  async setAssignment(draft) {
    const { data, error } = await client().rpc("set_student_assignment", {
      p_client_id: draft.clientId, p_user_id: draft.userId, p_role: draft.role, p_status: draft.status,
    })
    if (error) throw normalizeAndNotify(error)
    return mapAssignment(data)
  },
}
