import { z } from "zod"

import type { ClinicalPlansRepository } from "@/features/clinical/clinical-plans-repository-contract"
import { syntheticFreeTextSchema } from "@/features/clinical/forms/synthetic-free-text-schema"

const required = (label: string, max = 2000) =>
  syntheticFreeTextSchema({ label, max, required: true })
const optional = (label: string, max = 2000) =>
  syntheticFreeTextSchema({ label, max, required: false })

export const programFormSchema = z.object({
  name: required("El nombre del programa", 200),
  description: optional("La descripción"),
})

export const goalFormSchema = z.object({
  programId: z.string().trim().min(1, "Selecciona un programa"),
  skillArea: required("El área de habilidad", 200),
  name: required("El nombre de la meta", 200),
  masteryCriterion: required("El criterio de dominio", 500),
  teachingProcedure: required("El procedimiento de enseñanza", 4000),
  promptFading: optional("El desvanecimiento de ayudas"),
  correctResponse: optional("La respuesta correcta"),
  generalization: optional("La generalización"),
  maintenance: optional("El mantenimiento"),
})

export const behaviorPlanFormSchema = z.object({
  name: required("La conducta objetivo", 200),
  operationalDefinition: required("La definición operacional", 4000),
  measurementUnit: z.enum(["frequency", "duration", "latency", "interval"]),
  hypothesizedFunction: optional("La función hipotética"),
  antecedentStrategy: optional("La estrategia antecedente"),
  replacementBehavior: optional("La conducta de reemplazo"),
  responseStrategy: optional("La respuesta del equipo"),
  baseline: optional("La línea base"),
  baselineSource: optional("La fuente de línea base"),
  currentLevel: optional("El nivel actual"),
  intensity: optional("La intensidad"),
})

export type ProgramFormValues = z.infer<typeof programFormSchema>
export type GoalFormValues = z.infer<typeof goalFormSchema>
export type BehaviorPlanFormValues = z.infer<typeof behaviorPlanFormSchema>

export function composeDocumentedClinicalText(
  primary: string,
  sections: Array<[label: string, value: string | undefined]>
) {
  const supplement = sections
    .filter(([, value]) => value?.trim())
    .map(([label, value]) => `${label}: ${value!.trim()}`)
  return supplement.length
    ? `${primary.trim()}\n\n${supplement.join("\n")}`
    : primary.trim()
}

export function toGoalDraft(
  clientId: string,
  values: GoalFormValues
): Parameters<ClinicalPlansRepository["createGoal"]>[0] {
  return {
    clientId,
    programId: values.programId,
    skillArea: values.skillArea,
    name: values.name,
    masteryCriterion: values.masteryCriterion,
    teachingProcedure: composeDocumentedClinicalText(values.teachingProcedure, [
      ["Desvanecimiento de ayudas", values.promptFading],
      ["Respuesta correcta", values.correctResponse],
      ["Generalización", values.generalization],
      ["Mantenimiento", values.maintenance],
    ]),
  }
}

export function toBehaviorPlanDraft(
  clientId: string,
  values: BehaviorPlanFormValues
): Parameters<ClinicalPlansRepository["createBehaviorPlan"]>[0] {
  return {
    clientId,
    name: values.name,
    operationalDefinition: composeDocumentedClinicalText(
      values.operationalDefinition,
      [
        ["Línea base", values.baseline],
        ["Fuente de línea base", values.baselineSource],
        ["Nivel actual", values.currentLevel],
        ["Intensidad", values.intensity],
      ]
    ),
    measurementUnit: values.measurementUnit,
    hypothesizedFunction: values.hypothesizedFunction || undefined,
    antecedentStrategy: values.antecedentStrategy || undefined,
    replacementBehavior: values.replacementBehavior || undefined,
    responseStrategy: values.responseStrategy || undefined,
  }
}

