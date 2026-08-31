import { describe, expect, it, vi } from "vitest"

const rpc = vi.hoisted(() => vi.fn())

vi.mock("@/lib/supabase/client", () => ({
  getSupabaseClient: () => ({ rpc }),
}))

import { supabaseStudentRecordRepository } from "@/features/clinical/student-record/supabase-student-record-repository"

const clientId = "11111111-1111-4111-8111-111111111111"

describe("supabaseStudentRecordRepository", () => {
  it("guarda el contexto mediante la RPC versionada", async () => {
    rpc.mockResolvedValue({
      data: {
        client_id: clientId,
        home_adaptations: "Adaptación sintética",
        schooling: "Escuela sintética",
        school_adaptations: null,
        version: 2,
        updated_at: "2026-08-30T12:00:00.000Z",
      },
      error: null,
    })

    await supabaseStudentRecordRepository.saveContext({
      clientId,
      expectedVersion: 1,
      homeAdaptations: " Adaptación sintética ",
      schooling: " Escuela sintética ",
      schoolAdaptations: "",
    })

    expect(rpc).toHaveBeenCalledWith("save_client_context", {
      p_client_id: clientId,
      p_expected_version: 1,
      p_home_adaptations: "Adaptación sintética",
      p_school_adaptations: "",
      p_schooling: "Escuela sintética",
    })
  })

  it("añade historia sin enviar IDs de organización o actor", async () => {
    rpc.mockResolvedValue({
      data: {
        id: "22222222-2222-4222-8222-222222222222",
        client_id: clientId,
        kind: "medication",
        descriptor: "Medicamento sintético",
        occurred_on: null,
        dose: "Dosis sintética",
        prescriber_descriptor: null,
        started_on: "2026-08-01",
        ended_on: null,
        status: "active",
        supersedes_id: null,
        created_at: "2026-08-30T12:00:00.000Z",
      },
      error: null,
    })

    await supabaseStudentRecordRepository.appendHistoryEntry({
      clientId,
      kind: "medication",
      descriptor: " Medicamento sintético ",
      dose: " Dosis sintética ",
      startedOn: "2026-08-01",
    })

    expect(rpc).toHaveBeenCalledWith(
      "append_clinical_history_entry",
      expect.objectContaining({
        p_client_id: clientId,
        p_descriptor: "Medicamento sintético",
        p_dose: "Dosis sintética",
        p_kind: "medication",
      })
    )
    expect(rpc.mock.calls.at(-1)?.[1]).not.toHaveProperty("organization_id")
    expect(rpc.mock.calls.at(-1)?.[1]).not.toHaveProperty("created_by")
  })
})

