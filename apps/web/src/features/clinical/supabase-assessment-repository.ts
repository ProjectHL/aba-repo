import { z, ZodError } from "zod"

import type {
  AssessmentRepository,
  AssessmentSummary,
} from "@/features/clinical/assessment-repository-contract"
import { notifySessionInvalidated } from "@/auth/session-invalidation"
import { getSupabaseClient } from "@/lib/supabase/client"
import {
  DomainError,
  normalizeSupabaseError,
} from "@/lib/supabase/domain-error"
import { supabaseTimestampSchema } from "@/lib/supabase/timestamp-schema"

const assessmentRowSchema = z.object({
  id: z.uuid(),
  client_id: z.uuid(),
  kind: z.enum(["initial_interview", "preference", "functional"]),
  status: z.enum(["draft", "completed", "archived"]),
  title: z.string().min(1),
  occurred_on: z.iso.date().nullable(),
  payload: z.json(),
  updated_at: supabaseTimestampSchema,
})

const COLUMNS =
  "id, client_id, kind, status, title, occurred_on, payload, updated_at"

function normalizeAndNotify(error: unknown) {
  const normalized = normalizeSupabaseError(error)
  if (normalized.code === "UNAUTHORIZED") notifySessionInvalidated()
  return normalized
}

function parseRows(value: unknown): AssessmentSummary[] {
  try {
    return z
      .array(assessmentRowSchema)
      .parse(value)
      .map((row) => ({
        id: row.id,
        clientId: row.client_id,
        kind: row.kind,
        status: row.status,
        title: row.title,
        occurredOn: row.occurred_on,
        payload: row.payload,
        updatedAt: row.updated_at,
      }))
  } catch (error) {
    if (error instanceof ZodError)
      throw new DomainError(
        "INVALID_DATA_RESPONSE",
        "El servicio devolvió evaluaciones inválidas"
      )
    throw error
  }
}

export const supabaseAssessmentRepository: AssessmentRepository = {
  async listByClient(clientId, signal) {
    let query = getSupabaseClient()
      .from("assessments")
      .select(COLUMNS)
      .eq("client_id", clientId)
      .neq("status", "archived")
      .order("updated_at", { ascending: false })
    if (signal) query = query.abortSignal(signal)
    const { data, error } = await query
    if (error) throw normalizeAndNotify(error)
    return parseRows(data)
  },

  async create(draft) {
    const { data, error } = await getSupabaseClient()
      .from("assessments")
      .insert({
        client_id: draft.clientId,
        kind: draft.kind,
        title: draft.title.trim(),
        payload: draft.payload,
        ...(draft.occurredOn ? { occurred_on: draft.occurredOn } : {}),
        ...(draft.testRunId ? { test_run_id: draft.testRunId } : {}),
      })
      .select(COLUMNS)
      .single()
    if (error) throw normalizeAndNotify(error)
    const [assessment] = parseRows([data])
    if (!assessment)
      throw new DomainError(
        "INVALID_DATA_RESPONSE",
        "El servicio no devolvió la evaluación creada"
      )
    return assessment
  },
}
