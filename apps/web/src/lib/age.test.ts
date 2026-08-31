import { describe, expect, it } from "vitest"

import { calculateAge } from "@/lib/age"

describe("calculateAge", () => {
  it("calcula años y meses completos", () => {
    expect(calculateAge("2018-03-28", new Date("2025-09-15T12:00:00Z"))).toEqual({
      years: 7,
      months: 5,
      label: "7 años, 5 meses",
    })
  })

  it("usa singular para un año y un mes", () => {
    expect(calculateAge("2024-01-15", new Date("2025-02-15T12:00:00Z")).label).toBe(
      "1 año, 1 mes"
    )
  })

  it("rechaza fechas futuras", () => {
    expect(() => calculateAge("2030-01-01", new Date("2025-09-15T12:00:00Z"))).toThrow(
      "La fecha de nacimiento no puede estar en el futuro"
    )
  })

  it("rechaza fechas de calendario imposibles", () => {
    expect(() => calculateAge("2026-02-31", new Date("2026-03-10T12:00:00Z"))).toThrow(
      "La fecha de nacimiento no es válida"
    )
  })
})
