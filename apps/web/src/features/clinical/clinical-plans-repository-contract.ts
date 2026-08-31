export type AcquisitionProgramSummary = {
  id: string
  clientId: string
  name: string
  description: string | null
  status: "draft" | "active" | "mastered" | "archived"
  updatedAt: string
}

export type AcquisitionGoalSummary = {
  id: string
  clientId: string
  programId: string
  skillArea: string
  name: string
  masteryCriterion: string
  teachingProcedure: string
  status: "draft" | "active" | "mastered" | "archived"
  position: number
  updatedAt: string
}

export type BehaviorPlanSummary = {
  id: string
  clientId: string
  name: string
  operationalDefinition: string
  measurementUnit: "frequency" | "duration" | "latency" | "interval"
  hypothesizedFunction: string | null
  antecedentStrategy: string | null
  replacementBehavior: string | null
  responseStrategy: string | null
  status: "draft" | "active" | "resolved" | "archived"
  updatedAt: string
}

export type VersionedProgramSummary = {
  id: string
  clientId: string
  type: ProgramType
  status: ProgramStatus
  updatedAt: string
  currentVersion: {
    id: string
    version: number
    title: string
    design: ProgramDesign
    activatedAt: string | null
  } | null
  draftVersion: {
    id: string
    version: number
    title: string
    design: ProgramDesign
  } | null
}

export type CreateVersionedProgramDraft = {
  clientId: string
  type: ProgramType
  title: string
  design: ProgramDesign
  testRunId?: string
}

export type ClinicalPlansRepository = {
  listProgramsByClient: (
    clientId: string,
    signal?: AbortSignal
  ) => Promise<AcquisitionProgramSummary[]>
  listGoalsByClient: (
    clientId: string,
    signal?: AbortSignal
  ) => Promise<AcquisitionGoalSummary[]>
  listBehaviorPlansByClient: (
    clientId: string,
    signal?: AbortSignal
  ) => Promise<BehaviorPlanSummary[]>
  createProgram: (draft: {
    clientId: string
    name: string
    description?: string
    testRunId?: string
  }) => Promise<AcquisitionProgramSummary>
  createGoal: (draft: {
    clientId: string
    programId: string
    skillArea: string
    name: string
    masteryCriterion: string
    teachingProcedure: string
    testRunId?: string
  }) => Promise<AcquisitionGoalSummary>
  createBehaviorPlan: (draft: {
    clientId: string
    name: string
    operationalDefinition: string
    measurementUnit: BehaviorPlanSummary["measurementUnit"]
    hypothesizedFunction?: string
    antecedentStrategy?: string
    replacementBehavior?: string
    responseStrategy?: string
    testRunId?: string
  }) => Promise<BehaviorPlanSummary>
  listVersionedProgramsByClient?: (
    clientId: string,
    signal?: AbortSignal
  ) => Promise<VersionedProgramSummary[]>
  createVersionedProgramDraft?: (
    draft: CreateVersionedProgramDraft
  ) => Promise<VersionedProgramSummary["draftVersion"]>
  updateVersionedProgramDraft?: (draft: {
    versionId: string
    title: string
    design: ProgramDesign
  }) => Promise<VersionedProgramSummary["draftVersion"]>
  createVersionedProgramSuccessor?: (draft: {
    versionId: string
    title: string
    design: ProgramDesign
    testRunId?: string
  }) => Promise<VersionedProgramSummary["draftVersion"]>
  transitionVersionedProgram?: (command: {
    programId: string
    versionId?: string
    nextStatus: Exclude<ProgramStatus, "draft">
    testRunId?: string
  }) => Promise<void>
}
import type {
  ProgramDesign,
  ProgramStatus,
  ProgramType,
} from "@/features/clinical/program-lifecycle"
