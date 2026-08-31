import type { Json } from "@/integrations/supabase/database.types"

export type AssessmentKind = "initial_interview" | "preference" | "functional"

export type AssessmentSummary = {
  id: string
  clientId: string
  kind: AssessmentKind
  status: "draft" | "completed" | "archived"
  title: string
  occurredOn: string | null
  payload: Json
  updatedAt: string
}

export type CreateAssessmentDraft = {
  clientId: string
  kind: AssessmentKind
  title: string
  payload: Json
  occurredOn?: string
  testRunId?: string
}

export type AssessmentRepository = {
  listByClient: (clientId: string, signal?: AbortSignal) => Promise<AssessmentSummary[]>
  create: (draft: CreateAssessmentDraft) => Promise<AssessmentSummary>
}
