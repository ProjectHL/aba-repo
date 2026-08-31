import { z } from "zod"

import { syntheticFreeTextSchema } from "@/features/clinical/forms/synthetic-free-text-schema"

const optionalDateSchema = z
  .string()
  .refine(
    (value) => !value || /^\d{4}-\d{2}-\d{2}$/.test(value),
    "Usa una fecha valida"
  )
  .refine(
    (value) => !value || value <= new Date().toISOString().slice(0, 10),
    "La fecha no puede ser futura"
  )

const uiIdSchema = z.string().min(1)

export const clientContextDraftSchema = z.object({
  homeAdaptations: syntheticFreeTextSchema({
    label: "Adaptaciones en el hogar",
    max: 2000,
    required: false,
  }),
  schooling: syntheticFreeTextSchema({
    label: "Escolarizacion",
    max: 500,
    required: false,
  }),
  schoolAdaptations: syntheticFreeTextSchema({
    label: "Adaptaciones escolares",
    max: 2000,
    required: false,
  }),
})

const diagnosisSchema = z.object({
  uiId: uiIdSchema,
  label: syntheticFreeTextSchema({
    label: "Descriptor del diagnostico",
    max: 200,
    required: true,
  }),
  occurredOn: optionalDateSchema,
})

const historicalAssessmentSchema = z.object({
  uiId: uiIdSchema,
  name: syntheticFreeTextSchema({
    label: "Nombre de la evaluacion",
    max: 200,
    required: true,
  }),
  occurredOn: optionalDateSchema,
})

const procedureSchema = z.object({
  uiId: uiIdSchema,
  procedure: syntheticFreeTextSchema({
    label: "Procedimiento",
    max: 200,
    required: true,
  }),
  occurredOn: optionalDateSchema,
})

const medicationSchema = z
  .object({
    uiId: uiIdSchema,
    name: syntheticFreeTextSchema({
      label: "Nombre del medicamento",
      max: 200,
      required: true,
    }),
    dose: syntheticFreeTextSchema({ label: "Dosis", max: 120, required: false }),
    prescriberDescriptor: syntheticFreeTextSchema({
      label: "Descriptor del prescriptor",
      max: 120,
      required: false,
    }),
    startedOn: optionalDateSchema,
    endedOn: optionalDateSchema,
  })
  .superRefine((medication, context) => {
    if (
      medication.startedOn &&
      medication.endedOn &&
      medication.endedOn < medication.startedOn
    ) {
      context.addIssue({
        code: "custom",
        message: "El termino no puede ser anterior al inicio",
        path: ["endedOn"],
      })
    }
  })

export const clinicalHistoryDraftSchema = z.object({
  diagnoses: z.array(diagnosisSchema),
  historicalAssessments: z.array(historicalAssessmentSchema),
  procedures: z.array(procedureSchema),
  medications: z.array(medicationSchema),
})

export type ClientContextFormValues = z.infer<typeof clientContextDraftSchema>
export type ClinicalHistoryFormValues = z.infer<typeof clinicalHistoryDraftSchema>

const consentDateSchema = z.string().refine(
  (value) => !value || /^\d{4}-\d{2}-\d{2}$/.test(value),
  "Usa una fecha valida"
)

export const consentReferenceSchema = z.object({
  purposeCode: syntheticFreeTextSchema({ label: "La finalidad", max: 80, required: true }),
  noticeVersion: syntheticFreeTextSchema({ label: "La versión del aviso", max: 80, required: true }),
  grantorDescriptor: syntheticFreeTextSchema({ label: "El descriptor del otorgante", max: 120, required: true }),
  channel: syntheticFreeTextSchema({ label: "El canal", max: 80, required: true }),
  evidenceReference: syntheticFreeTextSchema({ label: "La referencia", max: 200, required: false }),
  status: z.enum(["pending_review", "valid"]),
  effectiveAt: consentDateSchema,
  expiresAt: consentDateSchema,
}).superRefine((value, context) => {
  if (value.effectiveAt && value.expiresAt && value.expiresAt <= value.effectiveAt) {
    context.addIssue({ code: "custom", message: "El vencimiento debe ser posterior a la vigencia", path: ["expiresAt"] })
  }
})

export type ConsentReferenceFormValues = z.infer<typeof consentReferenceSchema>
