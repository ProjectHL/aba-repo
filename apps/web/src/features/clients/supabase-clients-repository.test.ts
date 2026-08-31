import { describe, expect, it, vi } from "vitest"

const queryMocks = vi.hoisted(() => ({
  from: vi.fn(),
  select: vi.fn(),
  eq: vi.fn(),
  maybeSingle: vi.fn(),
}))

vi.mock("@/lib/supabase/client", () => ({
  getSupabaseClient: () => ({ from: queryMocks.from }),
}))

import { supabaseClientsRepository } from "@/features/clients/supabase-clients-repository"

const clientId = "11111111-1111-4111-8111-111111111111"

describe("supabaseClientsRepository.getById", () => {
  it("solicita la información familiar que requiere el detalle del expediente", async () => {
    queryMocks.from.mockReturnValue({ select: queryMocks.select })
    queryMocks.select.mockReturnValue({ eq: queryMocks.eq })
    queryMocks.eq.mockReturnValue({ maybeSingle: queryMocks.maybeSingle })
    queryMocks.maybeSingle.mockResolvedValue({
      data: {
        id: clientId,
        clinical_id: "SYNTH-A",
        initials: "ZX",
        primary_language: "Español",
        birth_date: "1990-01-01",
        status: "active",
        living_arrangement: "hogar sintético",
        guardians: [],
        siblings: [],
      },
      error: null,
    })

    await expect(
      supabaseClientsRepository.getById(clientId)
    ).resolves.toMatchObject({
      id: clientId,
      livingArrangement: "hogar sintético",
    })

    expect(queryMocks.select).toHaveBeenCalledWith(
      expect.stringContaining("living_arrangement")
    )
  })
})
