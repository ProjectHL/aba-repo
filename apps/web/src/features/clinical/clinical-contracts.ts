export type ConnectionState = "connected" | "contract-ready" | "schema-pending"

export type InitialInterviewDraft = {
  clientId: string
  consultationReason: string
  developmentHistory: string
  familyContext: string
  priorities: string
}

export type PreferenceAssessmentDraft = {
  clientId: string
  assessmentType: string
  items: Array<{ label: string; response: string; position: number }>
  notes: string
}

export type FunctionalAssessmentDraft = {
  clientId: string
  targetBehavior: string
  antecedent: string
  consequence: string
  hypothesizedFunction: string
}

export type AcquisitionGoalDraft = {
  clientId: string
  skillArea: string
  name: string
  masteryCriterion: string
  teachingProcedure: string
}

export type BehaviorPlanDraft = {
  clientId: string
  name: string
  operationalDefinition: string
  measurementUnit: "frequency" | "duration" | "latency" | "interval"
  hypothesizedFunction: string
  replacementBehavior: string
}

export type SessionDraft = {
  clientId: string
  occurredOn: string
  behaviorMeasurements: Array<{ behaviorId: string; value: number }>
  acquisitionTrials: Array<{ goalId: string; correct: number; incorrect: number }>
  notes: string
}

export type ReportKind = "progress" | "assessment" | "complete"

export type ClinicalRepository = {
  saveInitialInterview: (draft: InitialInterviewDraft) => Promise<{ id: string }>
  savePreferenceAssessment: (draft: PreferenceAssessmentDraft) => Promise<{ id: string }>
  saveFunctionalAssessment: (draft: FunctionalAssessmentDraft) => Promise<{ id: string }>
  saveAcquisitionGoal: (draft: AcquisitionGoalDraft) => Promise<{ id: string }>
  saveBehaviorPlan: (draft: BehaviorPlanDraft) => Promise<{ id: string }>
  saveSession: (draft: SessionDraft) => Promise<{ id: string }>
}

export const clinicalConnectionRegistry = {
  clientInformation: "connected",
  familyContext: "connected",
  initialInterview: "connected",
  preferenceAssessment: "connected",
  functionalAssessment: "connected",
  acquisitionGoals: "connected",
  behaviorPlans: "connected",
  sessions: "connected",
  reports: "contract-ready",
} as const satisfies Record<string, ConnectionState>
