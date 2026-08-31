import { describe, expect, it } from "vitest"

import {
  functionalAssessmentFormSchema,
  preferenceAssessmentFormSchema,
  toFunctionalAssessmentSubmission,
  toPreferenceAssessmentSubmission,
} from "@/features/clinical/assessment-forms-contract"

describe("formularios tipados CF-05", () => {
  it("mapea preferencias a payload v1 sin duplicar fecha ni adjunto", () => {
    const values = preferenceAssessmentFormSchema.parse({
      occurredOn: "2025-06-10",
      assessmentType: " Elección múltiple sintética ",
      highestPreference: " Actividad sensorial sintética ",
      response: " Aproximación inmediata ",
      lowestPreference: " Tarea neutra ",
      topography: " Contacto durante 8 segundos ",
      notes: " Registro exclusivamente sintético ",
    })

    const submission = toPreferenceAssessmentSubmission(values)

    expect(submission).toEqual({
      occurredOn: "2025-06-10",
      payload: {
        schema_version: 1,
        assessment_type: "Elección múltiple sintética",
        highest_preference: "Actividad sensorial sintética",
        response: "Aproximación inmediata",
        lowest_preference: "Tarea neutra",
        topography: "Contacto durante 8 segundos",
        notes: "Registro exclusivamente sintético",
      },
    })
    expect(submission.payload).not.toHaveProperty("occurredOn")
    expect(submission.payload).not.toHaveProperty("occurred_on")
    expect(submission.payload).not.toHaveProperty("attachment")
    expect(submission.payload).not.toHaveProperty("fileName")
  })

  it("mapea funcional a payload v1 y omite opcionales vacíos", () => {
    const values = functionalAssessmentFormSchema.parse({
      occurredOn: "",
      assessmentType: "",
      targetBehavior: " Conducta sintética observable ",
      antecedent: "",
      consequence: "",
      hypothesizedFunction: "",
      topography: "",
    })

    expect(toFunctionalAssessmentSubmission(values)).toEqual({
      payload: {
        schema_version: 1,
        target_behavior: "Conducta sintética observable",
      },
    })
  })

  it("rechaza identificadores directos en ambos contratos", () => {
    expect(
      preferenceAssessmentFormSchema.safeParse({
        occurredOn: "",
        assessmentType: "Lista sintética",
        highestPreference: "persona@example.com",
        response: "",
        lowestPreference: "",
        topography: "",
        notes: "",
      }).success
    ).toBe(false)

    const functional = functionalAssessmentFormSchema.safeParse({
      occurredOn: "",
      assessmentType: "",
      targetBehavior: "Conducta sintética",
      antecedent: "RUT 12.345.678-5",
      consequence: "",
      hypothesizedFunction: "",
      topography: "",
    })
    expect(functional.success).toBe(false)
    if (!functional.success) {
      expect(functional.error.issues.map((issue) => issue.message)).toContain(
        "No ingreses RUT ni correos reales"
      )
    }
  })
})
