import { describe, expect, it } from "vitest"

import { syntheticFreeTextSchema } from "@/features/clinical/forms/synthetic-free-text-schema"

describe("syntheticFreeTextSchema", () => {
  const schema = syntheticFreeTextSchema({ label: "El campo", max: 200, required: true })

  it.each([
    "persona@example.com",
    "12.345.678-5",
    "12345678-5",
    "123456785",
  ])("rechaza el identificador directo %s", (value) => {
    const result = schema.safeParse(value)

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        "No ingreses RUT ni correos reales"
      )
    }
  })

  it("normaliza texto sintético y permite un campo opcional vacío", () => {
    expect(schema.parse("  Descriptor sintético  ")).toBe("Descriptor sintético")
    expect(
      syntheticFreeTextSchema({ label: "La nota", max: 20, required: false }).parse(
        "   "
      )
    ).toBe("")
  })
})

