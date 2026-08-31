import { z, ZodError } from "zod"

import { notifySessionInvalidated } from "@/auth/session-invalidation"
import type { ClinicalSessionRepository } from "@/features/clinical/clinical-session-repository-contract"
import { getSupabaseClient } from "@/lib/supabase/client"
import {
  DomainError,
  normalizeSupabaseError,
} from "@/lib/supabase/domain-error"
import { supabaseTimestampSchema } from "@/lib/supabase/timestamp-schema"

const sessionRow = z.object({
  id: z.uuid(),
  client_id: z.uuid(),
  occurred_on: z.iso.date(),
  status: z.enum(["draft", "completed", "archived"]),
  notes: z.string().nullable(),
  updated_at: supabaseTimestampSchema,
})

const SESSION_COLUMNS = "id, client_id, occurred_on, status, notes, updated_at"

function normalizeAndNotify(error: unknown) {
  const normalized = normalizeSupabaseError(error)
  if (normalized.code === "UNAUTHORIZED") notifySessionInvalidated()
  return normalized
}

function parseRows(value: unknown) {
  try {
    return z
      .array(sessionRow)
      .parse(value)
      .map((row) => ({
        id: row.id,
        clientId: row.client_id,
        occurredOn: row.occurred_on,
        status: row.status,
        notes: row.notes,
        updatedAt: row.updated_at,
      }))
  } catch (error) {
    if (error instanceof ZodError)
      throw new DomainError(
        "INVALID_DATA_RESPONSE",
        "El servicio devolvió sesiones inválidas"
      )
    throw error
  }
}

export const supabaseClinicalSessionRepository: ClinicalSessionRepository = {
  async listByClient(clientId, signal) {
    let query = getSupabaseClient()
      .from("clinical_sessions")
      .select(SESSION_COLUMNS)
      .eq("client_id", clientId)
      .neq("status", "archived")
      .order("occurred_on", { ascending: false })
    if (signal) query = query.abortSignal(signal)
    const { data, error } = await query
    if (error) throw normalizeAndNotify(error)
    return parseRows(data)
  },

  async createAtomic(draft) {
    const { data, error } = await getSupabaseClient().rpc(
      "create_clinical_session",
      {
        p_client_id: draft.clientId,
        p_occurred_on: draft.occurredOn,
        p_notes: draft.notes?.trim() || null,
        p_behavior_measurements: draft.behaviorMeasurements.map(
          (measurement) => {
            if (measurement.measurementUnit === "interval")
              return {
                behavior_plan_id: measurement.behaviorPlanId,
                measurement_unit: measurement.measurementUnit,
                observed: measurement.observed,
                total: measurement.total,
              }
            return {
              behavior_plan_id: measurement.behaviorPlanId,
              measurement_unit: measurement.measurementUnit,
              value: measurement.value,
              ...(measurement.measurementUnit === "frequency"
                ? {}
                : { unit: measurement.unit }),
            }
          }
        ),
        p_acquisition_trials: draft.acquisitionTrials.map((trial) => ({
          goal_id: trial.goalId,
          correct: trial.correct,
          incorrect: trial.incorrect,
        })),
        p_test_run_id: draft.testRunId ?? null,
      }
    )
    if (error) throw normalizeAndNotify(error)
    const [session] = parseRows(data ? [data] : [])
    if (!session)
      throw new DomainError(
        "INVALID_DATA_RESPONSE",
        "El servicio no devolvió la sesión creada"
      )
    return session
  },
}
