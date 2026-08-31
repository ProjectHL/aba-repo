import { z } from "zod"

import { dateOnlyInTimeZone, parseDateOnly } from "@/lib/date-only"

function validDate(value: string) {
  return parseDateOnly(value) !== null
}

const directIdentifierPattern = /^(?:\d{1,2}\.?\d{3}\.?\d{3}-?[\dkK]|[^\s@]+@[^\s@]+\.[^\s@]+)$/

function containsDirectIdentifier(value: string) {
  return directIdentifierPattern.test(value)
}

export function createClientFormSchema(now: Date) {
  const today = dateOnlyInTimeZone(now)
  const optionalBirthDate = z
    .string()
    .refine((value) => !value || validDate(value), "La fecha no es válida")
    .refine((value) => !value || value <= today, "La fecha no puede estar en el futuro")
  const person = z.object({
    initials: z.string().trim().min(1, "Las iniciales son obligatorias").max(12),
    birthDate: optionalBirthDate,
  })

  return z.object({
    clientInitials: z.string().trim().min(1, "Las iniciales son obligatorias").max(12),
    clinicalId: z
      .string()
      .trim()
      .min(1, "El ID clínico es obligatorio")
      .max(64)
      .refine((value) => !containsDirectIdentifier(value), "No ingreses RUT ni correos reales"),
    primaryLanguage: z.string().trim().min(1, "El idioma es obligatorio").max(32),
    birthDate: z
      .string()
      .min(1, "La fecha de nacimiento es obligatoria")
      .refine(validDate, "La fecha no es válida")
      .refine((value) => !value || value <= today, "La fecha no puede estar en el futuro"),
    livingArrangement: z
      .string()
      .trim()
      .max(500)
      .refine((value) => !containsDirectIdentifier(value), "No ingreses RUT ni correos reales"),
    guardians: z.array(person),
    siblings: z.array(person),
    syntheticDataConfirmed: z
      .boolean()
      .refine(Boolean, "Confirma que usarás exclusivamente datos sintéticos"),
  })
}
