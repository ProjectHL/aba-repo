import { z } from "zod"

import { syntheticFreeTextSchema } from "@/features/clinical/forms/synthetic-free-text-schema"

const syntheticText = (label: string, maximum: number) =>
  syntheticFreeTextSchema({ label, max: maximum, required: true })

export const initialInterviewFormSchema = z.object({
  consultationReason: syntheticText("El motivo de consulta", 2000),
  developmentHistory: syntheticText("La historia del desarrollo", 4000),
  familyContext: syntheticText("El contexto familiar", 2000),
  priorities: syntheticText("Las prioridades", 2000),
  informants: z
    .array(
      z.object({
        informant: syntheticText("El informante", 80),
        strengths: syntheticText("Las fortalezas", 2000),
        needs: syntheticText("Las necesidades", 2000),
      })
    )
    .min(1, "Añade al menos un informante"),
})

export type InitialInterviewFormValues = z.infer<
  typeof initialInterviewFormSchema
>

export type InitialInterviewPayloadV1 = {
  schema_version: 1
  consultation_reason: string
  development_history: string
  family_context: string
  priorities: string
  informants: Array<{
    informant: string
    strengths: string
    needs: string
  }>
}

export function toInitialInterviewPayload(
  values: InitialInterviewFormValues
): InitialInterviewPayloadV1 {
  return {
    schema_version: 1,
    consultation_reason: values.consultationReason.trim(),
    development_history: values.developmentHistory.trim(),
    family_context: values.familyContext.trim(),
    priorities: values.priorities.trim(),
    informants: values.informants.map((row) => ({
      informant: row.informant.trim(),
      strengths: row.strengths.trim(),
      needs: row.needs.trim(),
    })),
  }
}
