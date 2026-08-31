import { z } from "zod"

export const supabaseTimestampSchema = z
  .string()
  .refine((value) => Number.isFinite(Date.parse(value)), "Timestamp inválido")
