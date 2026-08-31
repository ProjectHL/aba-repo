import type {
  AcquisitionGoalSummary,
  BehaviorPlanSummary,
} from "@/features/clinical/clinical-plans-repository-contract"
import type {
  ClinicalReportSource,
  ReportDateRange,
} from "@/features/reports/clinical-report-repository-contract"

export type ClinicalReport = {
  sessionCount: number
  behaviorSeries: Array<{
    planId: string
    planName: string
    points: Array<{
      occurredOn: string
      measurementUnit: ClinicalReportSource["behaviorMeasurements"][number]["measurementUnit"]
      intervalObserved: number | null
      intervalTotal: number | null
      value: number
    }>
  }>
  acquisitionProgress: Array<{
    goalId: string
    goalName: string
    correct: number
    incorrect: number
    percentage: number | null
  }>
}

type ReportInput = ClinicalReportSource & {
  clientId: string
  dateRange: ReportDateRange
  behaviorPlans: Array<Pick<BehaviorPlanSummary, "id" | "clientId" | "name">>
  goals: Array<Pick<AcquisitionGoalSummary, "id" | "clientId" | "name">>
}

function ensureClient(rows: Array<{ clientId: string }>, clientId: string) {
  if (rows.some((row) => row.clientId !== clientId))
    throw new Error("El informe recibió datos de un cliente distinto")
}

function inRange(date: string, range: ReportDateRange) {
  return (!range.from || date >= range.from) && (!range.to || date <= range.to)
}

export function buildClinicalReport(input: ReportInput): ClinicalReport {
  ensureClient(input.sessions, input.clientId)
  ensureClient(input.behaviorMeasurements, input.clientId)
  ensureClient(input.acquisitionTrials, input.clientId)
  ensureClient(input.behaviorPlans, input.clientId)
  ensureClient(input.goals, input.clientId)

  const sessions = input.sessions.filter(
    (session) =>
      session.status !== "archived" &&
      inRange(session.occurredOn, input.dateRange)
  )
  const sessionDates = new Map(
    sessions.map((session) => [session.id, session.occurredOn])
  )
  const measurements = input.behaviorMeasurements.filter((row) =>
    sessionDates.has(row.sessionId)
  )
  const trials = input.acquisitionTrials.filter((row) =>
    sessionDates.has(row.sessionId)
  )

  const behaviorSeries = input.behaviorPlans
    .map((plan) => ({
      planId: plan.id,
      planName: plan.name,
      points: measurements
        .filter((row) => row.behaviorPlanId === plan.id)
        .map((row) => ({
          occurredOn: sessionDates.get(row.sessionId)!,
          measurementUnit: row.measurementUnit,
          intervalObserved: row.intervalObserved,
          intervalTotal: row.intervalTotal,
          value: row.value,
        }))
        .sort((a, b) => a.occurredOn.localeCompare(b.occurredOn)),
    }))
    .filter((series) => series.points.length > 0)

  const acquisitionProgress = input.goals.map((goal) => {
    const total = trials
      .filter((row) => row.goalId === goal.id)
      .reduce(
        (sum, row) => ({
          correct: sum.correct + row.correct,
          incorrect: sum.incorrect + row.incorrect,
        }),
        { correct: 0, incorrect: 0 }
      )
    const count = total.correct + total.incorrect
    return {
      goalId: goal.id,
      goalName: goal.name,
      ...total,
      percentage: count
        ? Math.round((total.correct / count) * 1000) / 10
        : null,
    }
  })

  return { sessionCount: sessions.length, behaviorSeries, acquisitionProgress }
}
