import { describe, expect, it, vi } from "vitest"

const rpc = vi.hoisted(() => vi.fn())

vi.mock("@/lib/supabase/client", () => ({
  getSupabaseClient: () => ({ rpc }),
}))

import { supabaseClinicalPlansRepository } from "@/features/clinical/supabase-clinical-plans-repository"

const clientId = "11111111-1111-4111-8111-111111111111"
const versionId = "22222222-2222-4222-8222-222222222222"
const design = {
  kind: "acquisition" as const,
  goal: "Solicitar",
  skillArea: "Comunicación",
  antecedent: "Objeto visible",
  steps: ["Orientarse", "Solicitar"],
  teachingProcedure: "Ensayo sintético",
  sets: [{ name: "Set A", items: ["Objeto A"] }],
  promptLevels: ["Independiente"],
  errorCorrection: "Repetir con ayuda",
  masteryCriterion: "80% en tres sesiones",
  generalization: null,
  maintenance: null,
}

describe("supabaseClinicalPlansRepository lifecycle", () => {
  it("crea el borrador mediante RPC sin aceptar organización o actor desde UI", async () => {
    rpc.mockResolvedValue({
      data: {
        id: versionId,
        client_id: clientId,
        program_id: "33333333-3333-4333-8333-333333333333",
        program_type: "acquisition",
        version: 1,
        version_state: "draft",
        title: "Programa sintético",
        design,
        activated_at: null,
      },
      error: null,
    })

    await supabaseClinicalPlansRepository.createVersionedProgramDraft?.({
      clientId,
      type: "acquisition",
      title: " Programa sintético ",
      design,
    })

    expect(rpc).toHaveBeenCalledWith("create_program_draft", {
      p_client_id: clientId,
      p_program_type: "acquisition",
      p_title: "Programa sintético",
      p_design: design,
    })
    expect(rpc.mock.calls.at(-1)?.[1]).not.toHaveProperty("organization_id")
    expect(rpc.mock.calls.at(-1)?.[1]).not.toHaveProperty("created_by")
  })

  it("rechaza una respuesta remota que no cumple el contrato versionado", async () => {
    rpc.mockResolvedValue({ data: { id: versionId }, error: null })

    await expect(
      supabaseClinicalPlansRepository.createVersionedProgramDraft?.({
        clientId,
        type: "acquisition",
        title: "Programa sintético",
        design,
      })
    ).rejects.toMatchObject({ code: "INVALID_DATA_RESPONSE" })
  })
})
