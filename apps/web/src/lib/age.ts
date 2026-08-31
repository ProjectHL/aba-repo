export type CalculatedAge = {
  years: number
  months: number
  label: string
}

function unit(value: number, singular: string, plural: string) {
  return `${value} ${value === 1 ? singular : plural}`
}

export function calculateAge(birthDate: string, now = new Date()): CalculatedAge {
  const birth = parseDateOnly(birthDate)
  if (!birth) {
    throw new Error("La fecha de nacimiento no es válida")
  }

  const referenceValue = dateOnlyInTimeZone(now)
  const reference = parseDateOnly(referenceValue)
  if (!reference) throw new Error("La fecha de referencia no es válida")

  if (birthDate > referenceValue) {
    throw new Error("La fecha de nacimiento no puede estar en el futuro")
  }

  let totalMonths =
    (reference.year - birth.year) * 12 + reference.month - birth.month

  if (reference.day < birth.day) {
    totalMonths -= 1
  }

  const years = Math.floor(totalMonths / 12)
  const months = totalMonths % 12

  return {
    years,
    months,
    label: `${unit(years, "año", "años")}, ${unit(months, "mes", "meses")}`,
  }
}
import { dateOnlyInTimeZone, parseDateOnly } from "@/lib/date-only"
