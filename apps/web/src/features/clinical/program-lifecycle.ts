export const programTypes = ["acquisition", "behavior"] as const
export type ProgramType = (typeof programTypes)[number]

export const programStatuses = [
  "draft",
  "active",
  "paused",
  "achieved",
  "discontinued",
] as const
export type ProgramStatus = (typeof programStatuses)[number]

export type AcquisitionProgramDesign = {
  kind: "acquisition"
  goal: string
  skillArea: string
  antecedent: string
  steps: string[]
  teachingProcedure: string
  sets: Array<{ name: string; items: string[] }>
  promptLevels: string[]
  errorCorrection: string
  masteryCriterion: string
  generalization: string | null
  maintenance: string | null
}

export type BehaviorProgramDesign = {
  kind: "behavior"
  topography: string
  operationalDefinition: string
  hypothesizedFunction: string
  precursors: string[]
  replacementBehavior: string
  measurementUnit: "frequency" | "duration" | "latency" | "interval"
  preventionStrategy: string
  responseStrategy: string
  crisisPlan: string | null
  masteryCriterion: string
}

export type ProgramDesign = AcquisitionProgramDesign | BehaviorProgramDesign

export type ProgramVersion = {
  id: string
  programId: string
  clientId: string
  type: ProgramType
  version: number
  status: ProgramStatus
  title: string
  design: ProgramDesign
  activatedAt: string | null
  supersedesVersionId: string | null
}

const transitions: Record<ProgramStatus, readonly ProgramStatus[]> = {
  draft: ["active", "discontinued"],
  active: ["paused", "achieved", "discontinued"],
  paused: ["active", "discontinued"],
  achieved: [],
  discontinued: [],
}

export function canTransitionProgram(from: ProgramStatus, to: ProgramStatus) {
  return transitions[from].includes(to)
}

const missing = (value: string) => value.trim().length === 0

export function validateProgramForActivation(
  version: ProgramVersion
): string[] {
  const errors: string[] = []
  if (missing(version.title)) errors.push("title")

  if (version.design.kind === "acquisition") {
    const design = version.design
    if (missing(design.goal)) errors.push("goal")
    if (missing(design.skillArea)) errors.push("skillArea")
    if (missing(design.antecedent)) errors.push("antecedent")
    if (design.steps.length === 0 || design.steps.some(missing))
      errors.push("steps")
    if (missing(design.teachingProcedure)) errors.push("teachingProcedure")
    if (
      design.sets.length === 0 ||
      design.sets.some(
        (set) =>
          missing(set.name) || set.items.length === 0 || set.items.some(missing)
      )
    )
      errors.push("sets")
    if (design.promptLevels.length === 0 || design.promptLevels.some(missing))
      errors.push("promptLevels")
    if (missing(design.errorCorrection)) errors.push("errorCorrection")
    if (missing(design.masteryCriterion)) errors.push("masteryCriterion")
  } else {
    const design = version.design
    if (missing(design.topography)) errors.push("topography")
    if (missing(design.operationalDefinition))
      errors.push("operationalDefinition")
    if (missing(design.hypothesizedFunction))
      errors.push("hypothesizedFunction")
    if (missing(design.replacementBehavior)) errors.push("replacementBehavior")
    if (missing(design.preventionStrategy)) errors.push("preventionStrategy")
    if (missing(design.responseStrategy)) errors.push("responseStrategy")
    if (missing(design.masteryCriterion)) errors.push("masteryCriterion")
  }

  return errors
}

export function createSuccessorVersion(
  current: ProgramVersion,
  changes: Partial<Pick<ProgramVersion, "title" | "design">>
): ProgramVersion {
  if (current.status !== "active" && current.status !== "paused") {
    throw new Error("PROGRAM_TRANSITION_INVALID")
  }

  return {
    ...current,
    ...changes,
    id: crypto.randomUUID(),
    version: current.version + 1,
    status: "draft",
    activatedAt: null,
    supersedesVersionId: current.id,
    design: structuredClone(changes.design ?? current.design),
  }
}
