import { describe, expect, it } from "vitest"

import { readSupabaseEnv } from "@/lib/supabase/env"

describe("readSupabaseEnv", () => {
  it("acepta únicamente URL https y clave publicable", () => {
    expect(
      readSupabaseEnv({
        VITE_SUPABASE_URL: "https://synthetic-ref.supabase.co",
        VITE_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_synthetic",
      })
    ).toEqual({
      url: "https://synthetic-ref.supabase.co",
      publishableKey: "sb_publishable_synthetic",
    })
  })

  it("falla sin revelar valores cuando falta configuración", () => {
    expect(() => readSupabaseEnv({})).toThrow("Configuración de Supabase inválida")
  })

  it("rechaza claves secretas en el cliente", () => {
    expect(() =>
      readSupabaseEnv({
        VITE_SUPABASE_URL: "https://synthetic-ref.supabase.co",
        VITE_SUPABASE_PUBLISHABLE_KEY: "sb_secret_never-client-side",
      })
    ).toThrow("Configuración de Supabase inválida")
  })
})
