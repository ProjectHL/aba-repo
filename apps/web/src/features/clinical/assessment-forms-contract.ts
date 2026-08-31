import { z } from "zod"

import { syntheticFreeTextSchema } from "@/features/clinical/forms/synthetic-free-text-schema"

const requiredText = (label: string, max = 200) =>
  syntheticFreeTextSchema({ label, max, required: true })

const optionalText = (label: string, max = 200) =>
  syntheticFreeTextSchema({ label, max, required: false })

const optionalOccurredOnSchema = z
  .string()
  .trim()
  .refine(
    (value) => value === "" || /^\d{4}-\d{2}-\d{2}$/.test(value),
    "La fecha no es válida"
  )
  .refine(
    (value) => value === "" || value <= new Date().toISOString().slice(0, 10),
    "La fecha no puede ser futura"
  )

export const preferenceAssessmentFormSchema = z.object({
  occurredOn: optionalOccurredOnSchema,
  assessmentType: requiredText("El tipo de evaluación"),
  highestPreference: requiredText("La preferencia más alta"),
  response: optionalText("La respuesta", 1000),
  lowestPreference: optionalText("La preferencia más baja"),
  topography: optionalText("La topografía", 1000),
  notes: optionalText("Las notas", 2000),
})

export type PreferenceAssessmentFormValues = z.infer<
  typeof preferenceAssessmentFormSchema
>

export type PreferenceAssessmentPayloadV1 = {
  schema_version: 1
  assessment_type: string
  highest_preference: string
  response?: string
  lowest_preference?: string
  topography?: string
  notes?: string
}

export type PreferenceAssessmentSubmission = {
  occurredOn?: string
  payload: PreferenceAssessmentPayloadV1
}

export const functionalAssessmentFormSchema = z.object({
  occurredOn: optionalOccurredOnSchema,
  assessmentType: optionalText("El tipo de evaluación"),
  targetBehavior: requiredText("La conducta observada", 1000),
  antecedent: optionalText("El antecedente", 2000),
  consequence: optionalText("La consecuencia", 2000),
  hypothesizedFunction: optionalText("La función probable", 1000),
  topography: optionalText("La topografía", 1000),
})

export type FunctionalAssessmentFormValues = z.infer<
  typeof functionalAssessmentFormSchema
>

export type FunctionalAssessmentPayloadV1 = {
  schema_version: 1
  assessment_type?: string
  target_behavior: string
  antecedent?: string
  consequence?: string
  hypothesized_function?: string
  topography?: string
}

export type FunctionalAssessmentSubmission = {
  occurredOn?: string
  payload: FunctionalAssessmentPayloadV1
}

const optionalValue = (value: string) => {
  const normalized = value.trim()
  return normalized === "" ? undefined : normalized
}

export function toPreferenceAssessmentSubmission(
  values: PreferenceAssessmentFormValues
): PreferenceAssessmentSubmission {
  return {
    ...(optionalValue(values.occurredOn)
      ? { occurredOn: optionalValue(values.occurredOn) }
      : {}),
    payload: {
      schema_version: 1,
      assessment_type: values.assessmentType.trim(),
      highest_preference: values.highestPreference.trim(),
      ...(optionalValue(values.response)
        ? { response: optionalValue(values.response) }
        : {}),
      ...(optionalValue(values.lowestPreference)
        ? { lowest_preference: optionalValue(values.lowestPreference) }
        : {}),
      ...(optionalValue(values.topography)
        ? { topography: optionalValue(values.topography) }
        : {}),
      ...(optionalValue(values.notes) ? { notes: optionalValue(values.notes) } : {}),
    },
  }
}

export function toFunctionalAssessmentSubmission(
  values: FunctionalAssessmentFormValues
): FunctionalAssessmentSubmission {
  return {
    ...(optionalValue(values.occurredOn)
      ? { occurredOn: optionalValue(values.occurredOn) }
      : {}),
    payload: {
      schema_version: 1,
      ...(optionalValue(values.assessmentType)
        ? { assessment_type: optionalValue(values.assessmentType) }
        : {}),
      target_behavior: values.targetBehavior.trim(),
      ...(optionalValue(values.antecedent)
        ? { antecedent: optionalValue(values.antecedent) }
        : {}),
      ...(optionalValue(values.consequence)
        ? { consequence: optionalValue(values.consequence) }
        : {}),
      ...(optionalValue(values.hypothesizedFunction)
        ? { hypothesized_function: optionalValue(values.hypothesizedFunction) }
        : {}),
      ...(optionalValue(values.topography)
        ? { topography: optionalValue(values.topography) }
        : {}),
    },
  }
}
