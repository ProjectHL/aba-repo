import { z } from "zod"

const directIdentifierPattern =
  /(?:\b\d{1,2}\.?\d{3}\.?\d{3}-?[\dkK]\b)|(?:\b[^\s@]+@[^\s@]+\.[^\s@]+\b)/

export function containsDirectIdentifier(value: string) {
  directIdentifierPattern.lastIndex = 0
  return directIdentifierPattern.test(value)
}

export function syntheticFreeTextSchema({
  label,
  max,
  required,
}: {
  label: string
  max: number
  required: boolean
}) {
  let schema = z
    .string()
    .trim()
    .max(max, `${label} supera el máximo permitido`)
    .refine(
      (value) => !containsDirectIdentifier(value),
      "No ingreses RUT ni correos reales"
    )

  if (required) schema = schema.min(1, `${label} es obligatorio`)
  return schema
}

