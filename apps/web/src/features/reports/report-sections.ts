import { z } from "zod"

import type {
  AssessmentSummary,
} from "@/features/clinical/assessment-repository-contract"
import type {
  AcquisitionGoalSummary,
  AcquisitionProgramSummary,
  BehaviorPlanSummary,
} from "@/features/clinical/clinical-plans-repository-contract"
import type { ReportDateRange } from "@/features/reports/clinical-report-repository-contract"

const initialInterviewPayloadSchema = z.object({
  schema_version: z.literal(1),
  consultation_reason: z.string(),
  development_history: z.string(),
  family_context: z.string(),
  priorities: z.string(),
  informants: z.array(
    z.object({
      informant: z.string(),
      strengths: z.string(),
      needs: z.string(),
    })
  ),
})

const preferencePayloadSchema = z.object({
  schema_version: z.literal(1),
  assessment_type: z.string(),
  highest_preference: z.string(),
  response: z.string().optional(),
  lowest_preference: z.string().optional(),
  topography: z.string().optional(),
  notes: z.string().optional(),
})

const functionalPayloadSchema = z.object({
  schema_version: z.literal(1),
  assessment_type: z.string().optional(),
  target_behavior: z.string(),
  antecedent: z.string().optional(),
  consequence: z.string().optional(),
  hypothesized_function: z.string().optional(),
  topography: z.string().optional(),
})

type InitialInterviewPayload = z.infer<typeof initialInterviewPayloadSchema>
type PreferencePayload = z.infer<typeof preferencePayloadSchema>
type FunctionalPayload = z.infer<typeof functionalPayloadSchema>

export type EvaluationReportItem =
  | (EvaluationReportBase & {
      kind: "initial_interview"
      payload: InitialInterviewPayload
    })
  | (EvaluationReportBase & {
      kind: "preference"
      payload: PreferencePayload
    })
  | (EvaluationReportBase & {
      kind: "functional"
      payload: FunctionalPayload
    })

type EvaluationReportBase = {
  sourceId: string
  title: string
  occurredOn: string | null
  status: "draft" | "completed"
}

export type EvaluationReportSection =
  | {
      status: "ready"
      items: EvaluationReportItem[]
      omittedUndatedCount: number
    }
  | { status: "empty"; omittedUndatedCount: number }
  | { status: "unsupported" }

export type AcquisitionReportItem = {
  program: Pick<
    AcquisitionProgramSummary,
    "name" | "description" | "status"
  >
  goals: Array<
    Pick<
      AcquisitionGoalSummary,
      | "skillArea"
      | "name"
      | "masteryCriterion"
      | "teachingProcedure"
      | "status"
    >
  >
}

export type AcquisitionReportSection =
  | { status: "ready"; items: AcquisitionReportItem[] }
  | { status: "empty" }

export type BehaviorReductionReportItem = Pick<
  BehaviorPlanSummary,
  | "name"
  | "operationalDefinition"
  | "measurementUnit"
  | "hypothesizedFunction"
  | "antecedentStrategy"
  | "replacementBehavior"
  | "responseStrategy"
  | "status"
>

export type BehaviorReductionReportSection =
  | { status: "ready"; items: BehaviorReductionReportItem[] }
  | { status: "empty" }

function hasDateRange(dateRange: ReportDateRange) {
  return Boolean(dateRange.from || dateRange.to)
}

function isInRange(occurredOn: string, dateRange: ReportDateRange) {
  return (
    (!dateRange.from || occurredOn >= dateRange.from) &&
    (!dateRange.to || occurredOn <= dateRange.to)
  )
}

export function buildEvaluationReportSection({
  assessments,
  clientId,
  dateRange,
}: {
  assessments: AssessmentSummary[]
  clientId: string
  dateRange: ReportDateRange
}): EvaluationReportSection {
  if (assessments.some((assessment) => assessment.clientId !== clientId))
    throw new Error("El informe recibió una evaluación de otro cliente")

  const active = assessments.filter(
    (
      assessment
    ): assessment is AssessmentSummary & { status: "draft" | "completed" } =>
      assessment.status !== "archived"
  )
  const omittedUndatedCount = hasDateRange(dateRange)
    ? active.filter((assessment) => assessment.occurredOn === null).length
    : 0
  const filtered = active.filter(
    (assessment) =>
      assessment.occurredOn === null
        ? !hasDateRange(dateRange)
        : isInRange(assessment.occurredOn, dateRange)
  )
  const items: EvaluationReportItem[] = []

  for (const assessment of filtered) {
    const base = {
      sourceId: assessment.id,
      title: assessment.title,
      occurredOn: assessment.occurredOn,
      status: assessment.status,
    }
    if (assessment.kind === "initial_interview") {
      const payload = initialInterviewPayloadSchema.safeParse(assessment.payload)
      if (!payload.success) return { status: "unsupported" }
      items.push({ ...base, kind: assessment.kind, payload: payload.data })
    } else if (assessment.kind === "preference") {
      const payload = preferencePayloadSchema.safeParse(assessment.payload)
      if (!payload.success) return { status: "unsupported" }
      items.push({ ...base, kind: assessment.kind, payload: payload.data })
    } else {
      const payload = functionalPayloadSchema.safeParse(assessment.payload)
      if (!payload.success) return { status: "unsupported" }
      items.push({ ...base, kind: assessment.kind, payload: payload.data })
    }
  }

  return items.length
    ? { status: "ready", items, omittedUndatedCount }
    : { status: "empty", omittedUndatedCount }
}

export function buildAcquisitionReportSection({
  clientId,
  goals,
  programs,
}: {
  clientId: string
  goals: AcquisitionGoalSummary[]
  programs: AcquisitionProgramSummary[]
}): AcquisitionReportSection {
  if ([...programs, ...goals].some((row) => row.clientId !== clientId))
    throw new Error("El informe recibió adquisición de otro cliente")

  const activePrograms = programs.filter((program) => program.status !== "archived")
  const activeGoals = goals.filter((goal) => goal.status !== "archived")
  const programIds = new Set(activePrograms.map((program) => program.id))
  if (activeGoals.some((goal) => !programIds.has(goal.programId)))
    throw new Error("El informe recibió una meta sin programa compatible")

  const items = activePrograms.map((program) => ({
    program: {
      name: program.name,
      description: program.description,
      status: program.status,
    },
    goals: activeGoals
      .filter((goal) => goal.programId === program.id)
      .sort((a, b) => a.position - b.position)
      .map((goal) => ({
        skillArea: goal.skillArea,
        name: goal.name,
        masteryCriterion: goal.masteryCriterion,
        teachingProcedure: goal.teachingProcedure,
        status: goal.status,
      })),
  }))
  return items.length ? { status: "ready", items } : { status: "empty" }
}

export function buildBehaviorReductionReportSection({
  clientId,
  plans,
}: {
  clientId: string
  plans: BehaviorPlanSummary[]
}): BehaviorReductionReportSection {
  if (plans.some((plan) => plan.clientId !== clientId))
    throw new Error("El informe recibió un plan de otro cliente")

  const items = plans
    .filter((plan) => plan.status !== "archived")
    .map((plan) => ({
      name: plan.name,
      operationalDefinition: plan.operationalDefinition,
      measurementUnit: plan.measurementUnit,
      hypothesizedFunction: plan.hypothesizedFunction,
      antecedentStrategy: plan.antecedentStrategy,
      replacementBehavior: plan.replacementBehavior,
      responseStrategy: plan.responseStrategy,
      status: plan.status,
    }))
  return items.length ? { status: "ready", items } : { status: "empty" }
}
