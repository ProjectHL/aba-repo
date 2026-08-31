import { describe, expect, it, vi } from "vitest"

const rpc = vi.hoisted(() => vi.fn())

vi.mock("@/lib/supabase/client", () => ({
  getSupabaseClient: () => ({ rpc }),
}))

import { supabaseClinicalSessionRepository } from "@/features/clinical/supabase-clinical-session-repository"

describe("supabaseClinicalSessionRepository.createAtomic", () => {
  it("preserva la dimensión clínica en el payload de la RPC", async () => {
    rpc.mockResolvedValue({
      data: {
        id: "11111111-1111-4111-8111-111111111111",
        client_id: "22222222-2222-4222-8222-222222222222",
        occurred_on: "2026-08-25",
        status: "completed",
        notes: "fixture sintético",
        updated_at: "2026-08-25T12:00:00.000Z",
      },
      error: null,
    })

    await supabaseClinicalSessionRepository.createAtomic({
      clientId: "22222222-2222-4222-8222-222222222222",
      occurredOn: "2026-08-25",
      notes: "fixture sintético",
      behaviorMeasurements: [
        {
          behaviorPlanId: "33333333-3333-4333-8333-333333333333",
          measurementUnit: "frequency",
          value: 3,
        },
        {
          behaviorPlanId: "44444444-4444-4444-8444-444444444444",
          measurementUnit: "duration",
          unit: "seconds",
          value: 12.5,
        },
        {
          behaviorPlanId: "55555555-5555-4555-8555-555555555555",
          measurementUnit: "latency",
          unit: "seconds",
          value: 2.25,
        },
        {
          behaviorPlanId: "66666666-6666-4666-8666-666666666666",
          measurementUnit: "interval",
          observed: 4,
          total: 5,
        },
      ],
      acquisitionTrials: [],
    })

    expect(rpc).toHaveBeenCalledWith(
      "create_clinical_session",
      expect.objectContaining({
        p_behavior_measurements: [
          {
            behavior_plan_id: "33333333-3333-4333-8333-333333333333",
            measurement_unit: "frequency",
            value: 3,
          },
          {
            behavior_plan_id: "44444444-4444-4444-8444-444444444444",
            measurement_unit: "duration",
            unit: "seconds",
            value: 12.5,
          },
          {
            behavior_plan_id: "55555555-5555-4555-8555-555555555555",
            measurement_unit: "latency",
            unit: "seconds",
            value: 2.25,
          },
          {
            behavior_plan_id: "66666666-6666-4666-8666-666666666666",
            measurement_unit: "interval",
            observed: 4,
            total: 5,
          },
        ],
      })
    )
  })
})
