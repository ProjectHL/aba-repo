import { describe, expect, it } from "vitest"

import { supabaseTimestampSchema } from "@/lib/supabase/timestamp-schema"

describe("supabaseTimestampSchema", () => {
  it("acepta el timestamp con zona horaria devuelto por Postgres", () => {
    expect(supabaseTimestampSchema.parse("2026-08-24 17:52:46.432492+00")).toBe(
      "2026-08-24 17:52:46.432492+00"
    )
  })

  it("rechaza valores que no son una fecha", () => {
    expect(() => supabaseTimestampSchema.parse("not-a-timestamp")).toThrow()
  })
})
