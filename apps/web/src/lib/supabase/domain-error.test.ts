import { describe, expect, it } from "vitest"

import { DomainError, normalizeSupabaseError } from "@/lib/supabase/domain-error"

describe("normalizeSupabaseError", () => {
  it("convierte duplicados en un conflicto estable del ID clínico", () => {
    expect(normalizeSupabaseError({ code: "23505", message: "raw constraint detail" })).toEqual(
      new DomainError("CLINICAL_ID_CONFLICT", "El ID clínico ya está en uso", "clinicalId")
    )
  })

  it("convierte falta de permiso sin conservar SQL crudo", () => {
    const error = normalizeSupabaseError({ code: "42501", message: "private SQL detail" })

    expect(error.code).toBe("FORBIDDEN")
    expect(error.message).not.toContain("private SQL detail")
  })

  it("clasifica fallos de red sin exponer el error original", () => {
    const error = normalizeSupabaseError(new TypeError("Failed to fetch secret endpoint"))

    expect(error.code).toBe("NETWORK_ERROR")
    expect(error.message).toBe("No fue posible conectar con el servicio")
  })
})
