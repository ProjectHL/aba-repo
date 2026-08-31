import { z, ZodError } from "zod"

import { notifySessionInvalidated } from "@/auth/session-invalidation"
import type { ClinicalReportRepository } from "@/features/reports/clinical-report-repository-contract"
import {
  DomainError,
  normalizeSupabaseError,
} from "@/lib/supabase/domain-error"
import { getSupabaseClient } from "@/lib/supabase/client"

const sessionRow = z.object({
  id: z.uuid(),
  client_id: z.uuid(),
  occurred_on: z.iso.date(),
  status: z.enum(["draft", "completed", "archived"]),
})
const behaviorRow = z.object({
  session_id: z.uuid(),
  client_id: z.uuid(),
  behavior_plan_id: z.uuid(),
  measurement_unit: z
    .enum(["frequency", "duration", "latency", "interval"])
    .nullable(),
  interval_observed: z.number().int().nonnegative().nullable(),
  interval_total: z.number().int().nonnegative().nullable(),
  value: z.number().nonnegative(),
})
const trialRow = z.object({
  session_id: z.uuid(),
  client_id: z.uuid(),
  goal_id: z.uuid(),
  correct: z.number().int().nonnegative(),
  incorrect: z.number().int().nonnegative(),
})

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

export const supabaseClinicalReportRepository: ClinicalReportRepository = {
  async readByClient(clientId, dateRange = {}, signal) {
    let sessionQuery = getSupabaseClient()
      .from("clinical_sessions")
      .select("id, client_id, occurred_on, status")
      .eq("client_id", clientId)
      .neq("status", "archived")
      .order("occurred_on", { ascending: true })
    if (dateRange.from)
      sessionQuery = sessionQuery.gte("occurred_on", dateRange.from)
    if (dateRange.to)
      sessionQuery = sessionQuery.lte("occurred_on", dateRange.to)
    if (signal) sessionQuery = sessionQuery.abortSignal(signal)
    const { data: sessionData, error: sessionError } = await sessionQuery
    if (sessionError) throw normalizeAndNotify(sessionError)
    const sessions = parse(
      z.array(sessionRow),
      sessionData,
      "El servicio devolvió sesiones inválidas"
    ).map((row) => ({
      id: row.id,
      clientId: row.client_id,
      occurredOn: row.occurred_on,
      status: row.status,
    }))
    if (!sessions.length)
      return { sessions, behaviorMeasurements: [], acquisitionTrials: [] }

    const sessionIds = sessions.map((session) => session.id)
    let behaviorQuery = getSupabaseClient()
      .from("session_behavior_measurements")
      .select(
        "session_id, client_id, behavior_plan_id, measurement_unit, value, interval_observed, interval_total"
      )
      .eq("client_id", clientId)
      .in("session_id", sessionIds)
    let trialQuery = getSupabaseClient()
      .from("session_acquisition_trials")
      .select("session_id, client_id, goal_id, correct, incorrect")
      .eq("client_id", clientId)
      .in("session_id", sessionIds)
    if (signal) {
      behaviorQuery = behaviorQuery.abortSignal(signal)
      trialQuery = trialQuery.abortSignal(signal)
    }
    const [
      { data: behaviorData, error: behaviorError },
      { data: trialData, error: trialError },
    ] = await Promise.all([behaviorQuery, trialQuery])
    if (behaviorError) throw normalizeAndNotify(behaviorError)
    if (trialError) throw normalizeAndNotify(trialError)
    const behaviorMeasurements = parse(
      z.array(behaviorRow),
      behaviorData,
      "El servicio devolvió mediciones inválidas"
    ).map((row) => ({
      sessionId: row.session_id,
      clientId: row.client_id,
      behaviorPlanId: row.behavior_plan_id,
      measurementUnit: row.measurement_unit,
      intervalObserved: row.interval_observed,
      intervalTotal: row.interval_total,
      value: row.value,
    }))
    const acquisitionTrials = parse(
      z.array(trialRow),
      trialData,
      "El servicio devolvió ensayos inválidos"
    ).map((row) => ({
      sessionId: row.session_id,
      clientId: row.client_id,
      goalId: row.goal_id,
      correct: row.correct,
      incorrect: row.incorrect,
    }))
    return { sessions, behaviorMeasurements, acquisitionTrials }
  },
}
