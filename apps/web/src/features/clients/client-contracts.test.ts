import { describe, expect, it } from "vitest"

import {
  parseClientDetailRow,
  parseClientRows,
  toCreateClientArgs,
} from "@/features/clients/client-contracts"

describe("contratos de Clientes", () => {
  it("valida y traduce filas Supabase al modelo frontend", () => {
    expect(
      parseClientRows([
        {
          id: "11111111-1111-4111-8111-111111111111",
          clinical_id: "SYN-001",
          initials: "AB",
          primary_language: "Español",
          birth_date: "2018-03-28",
          status: "active",
        },
      ])
    ).toEqual([
      {
        id: "11111111-1111-4111-8111-111111111111",
        clinicalId: "SYN-001",
        initials: "AB",
        primaryLanguage: "Español",
        birthDate: "2018-03-28",
        status: "active",
      },
    ])
  })

  it("rechaza respuestas parciales o deformadas", () => {
    expect(() => parseClientRows([{ id: "not-a-uuid", initials: "AB" }])).toThrow()
  })

  it("valida la relación anidada de cliente, tutores y hermanos", () => {
    expect(
      parseClientDetailRow({
        id: "11111111-1111-4111-8111-111111111111",
        clinical_id: "SYN-DETAIL-001",
        initials: "AB",
        primary_language: "Español",
        birth_date: "2018-03-28",
        living_arrangement: "Convivencia sintética",
        status: "active",
        guardians: [
          {
            id: "22222222-2222-4222-8222-222222222222",
            initials: "TU",
            birth_date: "1985-01-10",
            position: 0,
          },
        ],
        siblings: [],
      })
    ).toMatchObject({
      livingArrangement: "Convivencia sintética",
      guardians: [{ initials: "TU", birthDate: "1985-01-10", position: 0 }],
      siblings: [],
    })
  })

  it("traduce el formulario al contrato RPC sin organization_id", () => {
    const args = toCreateClientArgs(
      {
        clientInitials: " ab ",
        clinicalId: " syn-002 ",
        primaryLanguage: "Español",
        birthDate: "2017-02-01",
        livingArrangement: " convivencia sintética ",
        guardians: [{ initials: " cd ", birthDate: "1980-04-05" }],
        siblings: [{ initials: " ef ", birthDate: "2014-06-07" }],
        syntheticDataConfirmed: true,
      },
      "22222222-2222-4222-8222-222222222222"
    )

    expect(args).toEqual({
      p_birth_date: "2017-02-01",
      p_clinical_id: "syn-002",
      p_guardians: [{ initials: "CD", birth_date: "1980-04-05" }],
      p_initials: "AB",
      p_living_arrangement: "convivencia sintética",
      p_primary_language: "Español",
      p_siblings: [{ initials: "EF", birth_date: "2014-06-07" }],
      p_test_run_id: "22222222-2222-4222-8222-222222222222",
    })
    expect(args).not.toHaveProperty("organization_id")
  })
})
