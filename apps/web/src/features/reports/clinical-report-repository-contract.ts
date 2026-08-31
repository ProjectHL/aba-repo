export type ReportDateRange = { from?: string; to?: string }

export type ReportSession = {
  id: string
  clientId: string
  occurredOn: string
  status: "draft" | "completed" | "archived"
}

export type ReportBehaviorMeasurement = {
  sessionId: string
  clientId: string
  behaviorPlanId: string
  measurementUnit: BehaviorMeasurementUnit | null
  intervalObserved: number | null
  intervalTotal: number | null
  value: number
}

export type ReportAcquisitionTrial = {
  sessionId: string
  clientId: string
  goalId: string
  correct: number
  incorrect: number
}

export type ClinicalReportSource = {
  sessions: ReportSession[]
  behaviorMeasurements: ReportBehaviorMeasurement[]
  acquisitionTrials: ReportAcquisitionTrial[]
}

export type ClinicalReportRepository = {
  readByClient: (
    clientId: string,
    dateRange?: ReportDateRange,
    signal?: AbortSignal
  ) => Promise<ClinicalReportSource>
}
import type { BehaviorMeasurementUnit } from "@/features/clinical/clinical-session-repository-contract"
