import { describe, expect, it } from "vitest"

import {
  initialInterviewFormSchema,
  toInitialInterviewPayload,
} from "@/features/clinical/initial-interview-contract"

const validInterview = {
  consultationReason: " Motivo sintético ",
  developmentHistory: " Historia sintética ",
  familyContext: " Contexto sintético ",
  priorities: " Prioridad sintética ",
  informants: [
    {
      informant: " Tutor sintético ",
      strengths: " Fortaleza sintética ",
      needs: " Necesidad sintética ",
    },
  ],
}

describe("InitialInterviewPayloadV1", () => {
  it("normaliza una matriz válida al payload versionado", () => {
    const parsed = initialInterviewFormSchema.parse(validInterview)

    expect(toInitialInterviewPayload(parsed)).toEqual({
      schema_version: 1,
      consultation_reason: "Motivo sintético",
      development_history: "Historia sintética",
      family_context: "Contexto sintético",
      priorities: "Prioridad sintética",
      informants: [
        {
          informant: "Tutor sintético",
          strengths: "Fortaleza sintética",
          needs: "Necesidad sintética",
        },
      ],
    })
  })

  it("rechaza identificadores directos y matrices vacías", () => {
    expect(
      initialInterviewFormSchema.safeParse({
        ...validInterview,
        informants: [
          {
            informant: "persona@example.com",
            strengths: "Fortaleza sintética",
            needs: "Necesidad sintética",
          },
        ],
      }).success
    ).toBe(false)
    expect(
      initialInterviewFormSchema.safeParse({
        ...validInterview,
        informants: [],
      }).success
    ).toBe(false)
  })
})
