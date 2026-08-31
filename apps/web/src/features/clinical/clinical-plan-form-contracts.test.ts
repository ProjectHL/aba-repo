import { describe, expect, it } from "vitest"

import {
  behaviorPlanFormSchema,
  goalFormSchema,
  toBehaviorPlanDraft,
  toGoalDraft,
} from "@/features/clinical/clinical-plan-form-contracts"

describe("contratos de formularios de planes clínicos", () => {
  it("serializa suplementos de meta en orden y sin etiquetas vacías", () => {
    const values = goalFormSchema.parse({
      programId: "program-synthetic",
      skillArea: "Comunicación sintética",
      name: "Solicitud sintética",
      masteryCriterion: "80 por ciento sintético",
      teachingProcedure: "Ensayo sintético",
      promptFading: "Retiro sintético",
      correctResponse: "Respuesta sintética",
      generalization: "",
      maintenance: "Mantención sintética",
    })

    expect(toGoalDraft("client-synthetic", values)).toEqual({
      clientId: "client-synthetic",
      programId: "program-synthetic",
      skillArea: "Comunicación sintética",
      name: "Solicitud sintética",
      masteryCriterion: "80 por ciento sintético",
      teachingProcedure:
        "Ensayo sintético\n\nDesvanecimiento de ayudas: Retiro sintético\nRespuesta correcta: Respuesta sintética\nMantenimiento: Mantención sintética",
    })
  })

  it("serializa el plan y rechaza identificadores directos en suplementos", () => {
    const invalid = behaviorPlanFormSchema.safeParse({
      name: "Conducta sintética",
      operationalDefinition: "Definición sintética",
      measurementUnit: "frequency",
      hypothesizedFunction: "Acceso sintético",
      antecedentStrategy: "Agenda sintética",
      replacementBehavior: "Solicitud sintética",
      responseStrategy: "Refuerzo sintético",
      baseline: "persona@example.com",
      baselineSource: "",
      currentLevel: "Nivel sintético",
      intensity: "",
    })
    expect(invalid.success).toBe(false)

    const values = behaviorPlanFormSchema.parse({
      name: "Conducta sintética",
      operationalDefinition: "Definición sintética",
      measurementUnit: "duration",
      hypothesizedFunction: "",
      antecedentStrategy: "",
      replacementBehavior: "",
      responseStrategy: "",
      baseline: "12 segundos sintéticos",
      baselineSource: "Observación sintética",
      currentLevel: "",
      intensity: "Moderada sintética",
    })
    expect(toBehaviorPlanDraft("client-synthetic", values)).toEqual({
      clientId: "client-synthetic",
      name: "Conducta sintética",
      operationalDefinition:
        "Definición sintética\n\nLínea base: 12 segundos sintéticos\nFuente de línea base: Observación sintética\nIntensidad: Moderada sintética",
      measurementUnit: "duration",
      hypothesizedFunction: undefined,
      antecedentStrategy: undefined,
      replacementBehavior: undefined,
      responseStrategy: undefined,
    })
  })
})

