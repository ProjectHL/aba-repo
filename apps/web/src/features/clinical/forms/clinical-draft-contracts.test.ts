import { describe, expect, it } from "vitest"

import {
  clientContextDraftSchema,
  clinicalHistoryDraftSchema,
} from "@/features/clinical/forms/clinical-draft-contracts"

describe("contratos de borradores clinicos CF-02/03", () => {
  it("rechaza fechas futuras en cada seccion historica", () => {
    const future = "2999-01-01"
    const result = clinicalHistoryDraftSchema.safeParse({
      diagnoses: [{ uiId: "diag-a", label: "Descriptor sintetico", occurredOn: future }],
      historicalAssessments: [
        { uiId: "assessment-a", name: "Evaluacion sintetica", occurredOn: future },
      ],
      procedures: [
        { uiId: "procedure-a", procedure: "Procedimiento sintetico", occurredOn: future },
      ],
      medications: [],
    })

    expect(result.success).toBe(false)
    expect(result.error?.issues).toHaveLength(3)
    expect(result.error?.issues.every((issue) => issue.message === "La fecha no puede ser futura")).toBe(true)
  })

  it("rechaza un termino de medicamento anterior al inicio", () => {
    const result = clinicalHistoryDraftSchema.safeParse({
      diagnoses: [],
      historicalAssessments: [],
      procedures: [],
      medications: [
        {
          uiId: "med-a",
          name: "Medicamento sintetico",
          dose: "Dosis sintetica",
          prescriberDescriptor: "Profesional sintetico",
          startedOn: "2026-02-10",
          endedOn: "2026-02-09",
        },
      ],
    })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toBe(
      "El termino no puede ser anterior al inicio"
    )
  })

  it("aplica el rechazo central de identificadores a contexto e historia", () => {
    expect(
      clientContextDraftSchema.safeParse({
        homeAdaptations: "Contactar a ejemplo@correo.cl",
        schooling: "",
        schoolAdaptations: "",
      }).success
    ).toBe(false)

    expect(
      clinicalHistoryDraftSchema.safeParse({
        diagnoses: [
          { uiId: "diag-a", label: "12.345.678-5", occurredOn: "" },
        ],
        historicalAssessments: [],
        procedures: [],
        medications: [],
      }).success
    ).toBe(false)
  })

  it("permite secciones vacias, pero exige el descriptor principal de cada fila anadida", () => {
    expect(
      clinicalHistoryDraftSchema.safeParse({
        diagnoses: [],
        historicalAssessments: [],
        procedures: [],
        medications: [],
      }).success
    ).toBe(true)

    const result = clinicalHistoryDraftSchema.safeParse({
      diagnoses: [{ uiId: "diag-a", label: "", occurredOn: "" }],
      historicalAssessments: [
        { uiId: "assessment-a", name: "", occurredOn: "" },
      ],
      procedures: [{ uiId: "procedure-a", procedure: "", occurredOn: "" }],
      medications: [
        {
          uiId: "med-a",
          name: "",
          dose: "",
          prescriberDescriptor: "",
          startedOn: "",
          endedOn: "",
        },
      ],
    })

    expect(result.success).toBe(false)
    expect(result.error?.issues).toHaveLength(4)
  })
})
