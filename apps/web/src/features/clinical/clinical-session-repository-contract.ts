export type ClinicalSessionSummary = {
  id: string
  clientId: string
  occurredOn: string
  status: "draft" | "completed" | "archived"
  notes: string | null
  updatedAt: string
}

export type BehaviorMeasurementUnit =
  | "frequency"
  | "duration"
  | "latency"
  | "interval"

export type CreateBehaviorMeasurementDraft =
  | {
      behaviorPlanId: string
      measurementUnit: "frequency"
      value: number
    }
  | {
      behaviorPlanId: string
      measurementUnit: "duration" | "latency"
      unit: "seconds"
      value: number
    }
  | {
      behaviorPlanId: string
      measurementUnit: "interval"
      observed: number
      total: number
    }

export type CreateClinicalSessionDraft = {
  clientId: string
  occurredOn: string
  notes?: string
  behaviorMeasurements: CreateBehaviorMeasurementDraft[]
  acquisitionTrials: Array<{ goalId: string; correct: number; incorrect: number }>
  testRunId?: string
}

export type ClinicalSessionRepository = {
  listByClient: (clientId: string, signal?: AbortSignal) => Promise<ClinicalSessionSummary[]>
  createAtomic: (draft: CreateClinicalSessionDraft) => Promise<ClinicalSessionSummary>
}
