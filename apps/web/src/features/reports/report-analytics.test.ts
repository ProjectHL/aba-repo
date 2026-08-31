import { describe, expect, it } from "vitest"

import { buildClinicalReport } from "@/features/reports/report-analytics"

const clientId = "11111111-1111-4111-8111-111111111111"

describe("buildClinicalReport", () => {
  it("deriva series y porcentajes sólo desde registros del cliente y rango solicitados", () => {
    const report = buildClinicalReport({
      clientId,
      dateRange: { from: "2026-08-02", to: "2026-08-31" },
      sessions: [
        {
          id: "session-1",
          clientId,
          occurredOn: "2026-08-01",
          status: "completed",
        },
        {
          id: "session-2",
          clientId,
          occurredOn: "2026-08-08",
          status: "completed",
        },
        {
          id: "session-3",
          clientId,
          occurredOn: "2026-08-15",
          status: "completed",
        },
      ],
      behaviorMeasurements: [
        {
          sessionId: "session-1",
          clientId,
          behaviorPlanId: "plan-1",
          measurementUnit: null,
          intervalObserved: null,
          intervalTotal: null,
          value: 8,
        },
        {
          sessionId: "session-2",
          clientId,
          behaviorPlanId: "plan-1",
          measurementUnit: "frequency",
          intervalObserved: null,
          intervalTotal: null,
          value: 5,
        },
        {
          sessionId: "session-3",
          clientId,
          behaviorPlanId: "plan-1",
          measurementUnit: "frequency",
          intervalObserved: null,
          intervalTotal: null,
          value: 3,
        },
      ],
      acquisitionTrials: [
        {
          sessionId: "session-2",
          clientId,
          goalId: "goal-1",
          correct: 7,
          incorrect: 3,
        },
        {
          sessionId: "session-3",
          clientId,
          goalId: "goal-1",
          correct: 8,
          incorrect: 2,
        },
      ],
      behaviorPlans: [{ id: "plan-1", clientId, name: "Conducta sintética" }],
      goals: [{ id: "goal-1", clientId, name: "Meta sintética" }],
    })

    expect(report.behaviorSeries).toEqual([
      {
        planId: "plan-1",
        planName: "Conducta sintética",
        points: [
          {
            occurredOn: "2026-08-08",
            measurementUnit: "frequency",
            intervalObserved: null,
            intervalTotal: null,
            value: 5,
          },
          {
            occurredOn: "2026-08-15",
            measurementUnit: "frequency",
            intervalObserved: null,
            intervalTotal: null,
            value: 3,
          },
        ],
      },
    ])
    expect(report.acquisitionProgress).toEqual([
      {
        goalId: "goal-1",
        goalName: "Meta sintética",
        correct: 15,
        incorrect: 5,
        percentage: 75,
      },
    ])
  })

  it("no inventa porcentaje cuando una meta no tiene ensayos", () => {
    const report = buildClinicalReport({
      clientId,
      dateRange: {},
      sessions: [],
      behaviorMeasurements: [],
      acquisitionTrials: [],
      behaviorPlans: [],
      goals: [{ id: "goal-1", clientId, name: "Meta sin ensayos" }],
    })

    expect(report.acquisitionProgress[0]).toMatchObject({
      correct: 0,
      incorrect: 0,
      percentage: null,
    })
  })

  it("conserva segundos, intervalos y la ausencia de unidad legacy", () => {
    const report = buildClinicalReport({
      clientId,
      dateRange: {},
      sessions: [
        { id: "session-1", clientId, occurredOn: "2026-08-20", status: "completed" },
        { id: "session-2", clientId, occurredOn: "2026-08-21", status: "completed" },
        { id: "session-3", clientId, occurredOn: "2026-08-22", status: "completed" },
      ],
      behaviorMeasurements: [
        {
          sessionId: "session-1",
          clientId,
          behaviorPlanId: "plan-1",
          measurementUnit: "duration",
          intervalObserved: null,
          intervalTotal: null,
          value: 12.5,
        },
        {
          sessionId: "session-2",
          clientId,
          behaviorPlanId: "plan-1",
          measurementUnit: "interval",
          intervalObserved: 4,
          intervalTotal: 5,
          value: 80,
        },
        {
          sessionId: "session-3",
          clientId,
          behaviorPlanId: "plan-1",
          measurementUnit: null,
          intervalObserved: null,
          intervalTotal: null,
          value: 7,
        },
      ],
      acquisitionTrials: [],
      behaviorPlans: [{ id: "plan-1", clientId, name: "Conducta sintética" }],
      goals: [],
    })

    expect(report.behaviorSeries[0]?.points).toEqual([
      expect.objectContaining({ measurementUnit: "duration", value: 12.5 }),
      expect.objectContaining({
        measurementUnit: "interval",
        intervalObserved: 4,
        intervalTotal: 5,
        value: 80,
      }),
      expect.objectContaining({ measurementUnit: null, value: 7 }),
    ])
  })

  it("rechaza cualquier fila que pueda mezclar un cliente distinto", () => {
    expect(() =>
      buildClinicalReport({
        clientId,
        dateRange: {},
        sessions: [
          {
            id: "session-foreign",
            clientId: "22222222-2222-4222-8222-222222222222",
            occurredOn: "2026-08-08",
            status: "completed",
          },
        ],
        behaviorMeasurements: [],
        acquisitionTrials: [],
        behaviorPlans: [],
        goals: [],
      })
    ).toThrow("cliente distinto")
  })
})
