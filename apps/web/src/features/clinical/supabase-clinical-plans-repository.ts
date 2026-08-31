import { z, ZodError } from "zod"

import { notifySessionInvalidated } from "@/auth/session-invalidation"
import {
  acquisitionGoalStatusSchema,
  acquisitionProgramStatusSchema,
  behaviorPlanStatusSchema,
} from "@/features/clinical/clinical-plan-status"
import type { ClinicalPlansRepository } from "@/features/clinical/clinical-plans-repository-contract"
import type { ProgramDesign } from "@/features/clinical/program-lifecycle"
import { getSupabaseClient } from "@/lib/supabase/client"
import {
  DomainError,
  normalizeSupabaseError,
} from "@/lib/supabase/domain-error"
import { supabaseTimestampSchema } from "@/lib/supabase/timestamp-schema"

const measurementUnit = z.enum(["frequency", "duration", "latency", "interval"])

type QueryResult = { data: unknown; error: unknown }
type LifecycleQuery = {
  select: (columns: string) => LifecycleQuery
  eq: (column: string, value: string) => LifecycleQuery
  order: (column: string, options: { ascending: boolean }) => LifecycleQuery
  abortSignal: (signal: AbortSignal) => LifecycleQuery
  update: (value: Record<string, unknown>) => LifecycleQuery
  single: () => Promise<QueryResult>
  then: Promise<QueryResult>["then"]
}
type LifecycleClient = {
  from: (table: string) => LifecycleQuery
  rpc: (name: string, args: Record<string, unknown>) => Promise<QueryResult>
}

const lifecycleClient = () => getSupabaseClient() as unknown as LifecycleClient

const acquisitionDesignSchema = z.object({
  kind: z.literal("acquisition"),
  goal: z.string(),
  skillArea: z.string(),
  antecedent: z.string(),
  steps: z.array(z.string()),
  teachingProcedure: z.string(),
  sets: z.array(z.object({ name: z.string(), items: z.array(z.string()) })),
  promptLevels: z.array(z.string()),
  errorCorrection: z.string(),
  masteryCriterion: z.string(),
  generalization: z.string().nullable(),
  maintenance: z.string().nullable(),
})
const behaviorDesignSchema = z.object({
  kind: z.literal("behavior"),
  topography: z.string(),
  operationalDefinition: z.string(),
  hypothesizedFunction: z.string(),
  precursors: z.array(z.string()),
  replacementBehavior: z.string(),
  measurementUnit,
  preventionStrategy: z.string(),
  responseStrategy: z.string(),
  crisisPlan: z.string().nullable(),
  masteryCriterion: z.string(),
})
const programDesignSchema = z.discriminatedUnion("kind", [
  acquisitionDesignSchema,
  behaviorDesignSchema,
])
const lifecycleProgramRow = z.object({
  id: z.uuid(),
  client_id: z.uuid(),
  program_type: z.enum(["acquisition", "behavior"]),
  status: z.enum(["draft", "active", "paused", "achieved", "discontinued"]),
  current_version_id: z.uuid().nullable(),
  updated_at: supabaseTimestampSchema,
})
const lifecycleVersionRow = z.object({
  id: z.uuid(),
  client_id: z.uuid(),
  program_id: z.uuid(),
  program_type: z.enum(["acquisition", "behavior"]),
  version: z.number().int().positive(),
  version_state: z.enum(["draft", "released", "superseded"]),
  title: z.string().min(1),
  design: programDesignSchema,
  activated_at: supabaseTimestampSchema.nullable(),
})

const LIFECYCLE_PROGRAM_COLUMNS =
  "id, client_id, program_type, status, current_version_id, updated_at"
const LIFECYCLE_VERSION_COLUMNS =
  "id, client_id, program_id, program_type, version, version_state, title, design, activated_at"

const programRow = z.object({
  id: z.uuid(),
  client_id: z.uuid(),
  name: z.string().min(1),
  description: z.string().nullable(),
  status: acquisitionProgramStatusSchema,
  updated_at: supabaseTimestampSchema,
})
const goalRow = z.object({
  id: z.uuid(),
  client_id: z.uuid(),
  program_id: z.uuid(),
  skill_area: z.string().min(1),
  name: z.string().min(1),
  mastery_criterion: z.string().min(1),
  teaching_procedure: z.string().min(1),
  status: acquisitionGoalStatusSchema,
  position: z.number().int(),
  updated_at: supabaseTimestampSchema,
})
const behaviorRow = z.object({
  id: z.uuid(),
  client_id: z.uuid(),
  name: z.string().min(1),
  operational_definition: z.string().min(1),
  measurement_unit: measurementUnit,
  hypothesized_function: z.string().nullable(),
  antecedent_strategy: z.string().nullable(),
  replacement_behavior: z.string().nullable(),
  response_strategy: z.string().nullable(),
  status: behaviorPlanStatusSchema,
  updated_at: supabaseTimestampSchema,
})

const PROGRAM_COLUMNS = "id, client_id, name, description, status, updated_at"
const GOAL_COLUMNS =
  "id, client_id, program_id, skill_area, name, mastery_criterion, teaching_procedure, status, position, updated_at"
const BEHAVIOR_COLUMNS =
  "id, client_id, name, operational_definition, measurement_unit, hypothesized_function, antecedent_strategy, replacement_behavior, response_strategy, status, updated_at"

function normalizeAndNotify(error: unknown) {
  const normalized = normalizeSupabaseError(error)
  if (normalized.code === "UNAUTHORIZED") notifySessionInvalidated()
  return normalized
}

function parse<T>(schema: z.ZodType<T>, value: unknown, message: string): T {
  try {
    return schema.parse(value)
  } catch (error) {
    if (error instanceof ZodError)
      throw new DomainError("INVALID_DATA_RESPONSE", message)
    throw error
  }
}

const mapProgram = (row: z.infer<typeof programRow>) => ({
  id: row.id,
  clientId: row.client_id,
  name: row.name,
  description: row.description,
  status: row.status,
  updatedAt: row.updated_at,
})
const mapGoal = (row: z.infer<typeof goalRow>) => ({
  id: row.id,
  clientId: row.client_id,
  programId: row.program_id,
  skillArea: row.skill_area,
  name: row.name,
  masteryCriterion: row.mastery_criterion,
  teachingProcedure: row.teaching_procedure,
  status: row.status,
  position: row.position,
  updatedAt: row.updated_at,
})
const mapBehavior = (row: z.infer<typeof behaviorRow>) => ({
  id: row.id,
  clientId: row.client_id,
  name: row.name,
  operationalDefinition: row.operational_definition,
  measurementUnit: row.measurement_unit,
  hypothesizedFunction: row.hypothesized_function,
  antecedentStrategy: row.antecedent_strategy,
  replacementBehavior: row.replacement_behavior,
  responseStrategy: row.response_strategy,
  status: row.status,
  updatedAt: row.updated_at,
})

function mapLifecycleDraft(value: unknown) {
  const row = parse(
    lifecycleVersionRow,
    value,
    "El servicio devolvió una versión de programa inválida"
  )
  return {
    id: row.id,
    version: row.version,
    title: row.title,
    design: row.design as ProgramDesign,
  }
}

export const supabaseClinicalPlansRepository: ClinicalPlansRepository = {
  async listProgramsByClient(clientId, signal) {
    let query = getSupabaseClient()
      .from("acquisition_programs")
      .select(PROGRAM_COLUMNS)
      .eq("client_id", clientId)
      .neq("status", "archived")
      .order("updated_at", { ascending: false })
    if (signal) query = query.abortSignal(signal)
    const { data, error } = await query
    if (error) throw normalizeAndNotify(error)
    return parse(
      z.array(programRow),
      data,
      "El servicio devolvió programas inválidos"
    ).map(mapProgram)
  },
  async listGoalsByClient(clientId, signal) {
    let query = getSupabaseClient()
      .from("acquisition_goals")
      .select(GOAL_COLUMNS)
      .eq("client_id", clientId)
      .neq("status", "archived")
      .order("position", { ascending: true })
    if (signal) query = query.abortSignal(signal)
    const { data, error } = await query
    if (error) throw normalizeAndNotify(error)
    return parse(
      z.array(goalRow),
      data,
      "El servicio devolvió metas inválidas"
    ).map(mapGoal)
  },
  async listBehaviorPlansByClient(clientId, signal) {
    let query = getSupabaseClient()
      .from("behavior_plans")
      .select(BEHAVIOR_COLUMNS)
      .eq("client_id", clientId)
      .neq("status", "archived")
      .order("updated_at", { ascending: false })
    if (signal) query = query.abortSignal(signal)
    const { data, error } = await query
    if (error) throw normalizeAndNotify(error)
    return parse(
      z.array(behaviorRow),
      data,
      "El servicio devolvió planes inválidos"
    ).map(mapBehavior)
  },
  async createProgram(draft) {
    const { data, error } = await getSupabaseClient()
      .from("acquisition_programs")
      .insert({
        client_id: draft.clientId,
        name: draft.name.trim(),
        description: draft.description?.trim() || null,
        ...(draft.testRunId ? { test_run_id: draft.testRunId } : {}),
      })
      .select(PROGRAM_COLUMNS)
      .single()
    if (error) throw normalizeAndNotify(error)
    return mapProgram(
      parse(programRow, data, "El servicio no devolvió el programa creado")
    )
  },
  async createGoal(draft) {
    const { data, error } = await getSupabaseClient()
      .from("acquisition_goals")
      .insert({
        client_id: draft.clientId,
        program_id: draft.programId,
        skill_area: draft.skillArea.trim(),
        name: draft.name.trim(),
        mastery_criterion: draft.masteryCriterion.trim(),
        teaching_procedure: draft.teachingProcedure.trim(),
        ...(draft.testRunId ? { test_run_id: draft.testRunId } : {}),
      })
      .select(GOAL_COLUMNS)
      .single()
    if (error) throw normalizeAndNotify(error)
    return mapGoal(
      parse(goalRow, data, "El servicio no devolvió la meta creada")
    )
  },
  async createBehaviorPlan(draft) {
    const { data, error } = await getSupabaseClient()
      .from("behavior_plans")
      .insert({
        client_id: draft.clientId,
        name: draft.name.trim(),
        operational_definition: draft.operationalDefinition.trim(),
        measurement_unit: draft.measurementUnit,
        hypothesized_function: draft.hypothesizedFunction?.trim() || null,
        antecedent_strategy: draft.antecedentStrategy?.trim() || null,
        replacement_behavior: draft.replacementBehavior?.trim() || null,
        response_strategy: draft.responseStrategy?.trim() || null,
        ...(draft.testRunId ? { test_run_id: draft.testRunId } : {}),
      })
      .select(BEHAVIOR_COLUMNS)
      .single()
    if (error) throw normalizeAndNotify(error)
    return mapBehavior(
      parse(behaviorRow, data, "El servicio no devolvió el plan creado")
    )
  },
  async listVersionedProgramsByClient(clientId, signal) {
    let programsQuery = lifecycleClient()
      .from("programs")
      .select(LIFECYCLE_PROGRAM_COLUMNS)
      .eq("client_id", clientId)
      .order("updated_at", { ascending: false })
    let versionsQuery = lifecycleClient()
      .from("program_versions")
      .select(LIFECYCLE_VERSION_COLUMNS)
      .eq("client_id", clientId)
      .order("version", { ascending: false })
    if (signal) {
      programsQuery = programsQuery.abortSignal(signal)
      versionsQuery = versionsQuery.abortSignal(signal)
    }
    const [programsResult, versionsResult] = await Promise.all([
      programsQuery,
      versionsQuery,
    ])
    if (programsResult.error) throw normalizeAndNotify(programsResult.error)
    if (versionsResult.error) throw normalizeAndNotify(versionsResult.error)
    const programs = parse(
      z.array(lifecycleProgramRow),
      programsResult.data,
      "El servicio devolvió programas versionados inválidos"
    )
    const versions = parse(
      z.array(lifecycleVersionRow),
      versionsResult.data,
      "El servicio devolvió versiones de programa inválidas"
    )
    return programs.map((program) => {
      const related = versions.filter(
        (version) => version.program_id === program.id
      )
      const current = related.find(
        (version) => version.id === program.current_version_id
      )
      const draft = related.find((version) => version.version_state === "draft")
      return {
        id: program.id,
        clientId: program.client_id,
        type: program.program_type,
        status: program.status,
        updatedAt: program.updated_at,
        currentVersion: current
          ? {
              id: current.id,
              version: current.version,
              title: current.title,
              design: current.design as ProgramDesign,
              activatedAt: current.activated_at,
            }
          : null,
        draftVersion: draft
          ? {
              id: draft.id,
              version: draft.version,
              title: draft.title,
              design: draft.design as ProgramDesign,
            }
          : null,
      }
    })
  },
  async createVersionedProgramDraft(draft) {
    const { data, error } = await lifecycleClient().rpc(
      "create_program_draft",
      {
        p_client_id: draft.clientId,
        p_program_type: draft.type,
        p_title: draft.title.trim(),
        p_design: draft.design,
        ...(draft.testRunId ? { p_test_run_id: draft.testRunId } : {}),
      }
    )
    if (error) throw normalizeAndNotify(error)
    return mapLifecycleDraft(data)
  },
  async updateVersionedProgramDraft(draft) {
    const { data, error } = await lifecycleClient()
      .from("program_versions")
      .update({ title: draft.title.trim(), design: draft.design })
      .eq("id", draft.versionId)
      .eq("version_state", "draft")
      .select(LIFECYCLE_VERSION_COLUMNS)
      .single()
    if (error) throw normalizeAndNotify(error)
    return mapLifecycleDraft(data)
  },
  async createVersionedProgramSuccessor(draft) {
    const { data, error } = await lifecycleClient().rpc(
      "create_program_successor",
      {
        p_version_id: draft.versionId,
        p_title: draft.title.trim(),
        p_design: draft.design,
        ...(draft.testRunId ? { p_test_run_id: draft.testRunId } : {}),
      }
    )
    if (error) throw normalizeAndNotify(error)
    return mapLifecycleDraft(data)
  },
  async transitionVersionedProgram(command) {
    const { error } = await lifecycleClient().rpc("transition_program", {
      p_program_id: command.programId,
      p_version_id: command.versionId ?? null,
      p_next_status: command.nextStatus,
      ...(command.testRunId ? { p_test_run_id: command.testRunId } : {}),
    })
    if (error) throw normalizeAndNotify(error)
  },
}
