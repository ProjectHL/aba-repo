import { z } from "zod"

import type { ClientFormValues } from "@/features/clients/client-form"
import type { Database, Json } from "@/integrations/supabase/database.types"

const clientRowSchema = z.object({
  id: z.uuid(),
  clinical_id: z.string().min(1).max(64),
  initials: z.string().min(1).max(12),
  primary_language: z.string().min(1).max(32),
  birth_date: z.iso.date(),
  status: z.enum(["active", "archived"]),
})

const relatedPersonSchema = z.object({
  id: z.uuid(),
  initials: z.string().min(1).max(12),
  birth_date: z.iso.date().nullable(),
  position: z.number().int().nonnegative(),
})

const clientDetailRowSchema = clientRowSchema.extend({
  living_arrangement: z.string().nullable(),
  guardians: z.array(relatedPersonSchema),
  siblings: z.array(relatedPersonSchema),
})

export type ClientSummary = {
  id: string
  clinicalId: string
  initials: string
  primaryLanguage: string
  birthDate: string
  status: "active" | "archived"
}

export type RelatedPerson = {
  id: string
  initials: string
  birthDate: string | null
  position: number
}

export type ClientDetail = ClientSummary & {
  livingArrangement: string | null
  guardians: RelatedPerson[]
  siblings: RelatedPerson[]
}

export function parseClientRows(value: unknown): ClientSummary[] {
  return z.array(clientRowSchema).parse(value).map((row) => ({
    id: row.id,
    clinicalId: row.clinical_id,
    initials: row.initials,
    primaryLanguage: row.primary_language,
    birthDate: row.birth_date,
    status: row.status,
  }))
}

export function parseClientDetailRow(value: unknown): ClientDetail {
  const row = clientDetailRowSchema.parse(value)
  const mapPerson = (person: z.infer<typeof relatedPersonSchema>): RelatedPerson => ({
    id: person.id,
    initials: person.initials,
    birthDate: person.birth_date,
    position: person.position,
  })

  return {
    id: row.id,
    clinicalId: row.clinical_id,
    initials: row.initials,
    primaryLanguage: row.primary_language,
    birthDate: row.birth_date,
    status: row.status,
    livingArrangement: row.living_arrangement,
    guardians: row.guardians.map(mapPerson).sort((a, b) => a.position - b.position),
    siblings: row.siblings.map(mapPerson).sort((a, b) => a.position - b.position),
  }
}

type CreateClientArgs = Database["public"]["Functions"]["create_client"]["Args"]

function mapPerson(person: { initials: string; birthDate: string }): Json {
  return {
    initials: person.initials.trim().toUpperCase(),
    ...(person.birthDate ? { birth_date: person.birthDate } : {}),
  }
}

export function toCreateClientArgs(
  values: ClientFormValues,
  testRunId?: string
): CreateClientArgs {
  const livingArrangement = values.livingArrangement.trim()
  return {
    p_birth_date: values.birthDate,
    p_clinical_id: values.clinicalId.trim(),
    p_guardians: values.guardians.map(mapPerson),
    p_initials: values.clientInitials.trim().toUpperCase(),
    ...(livingArrangement ? { p_living_arrangement: livingArrangement } : {}),
    p_primary_language: values.primaryLanguage.trim(),
    p_siblings: values.siblings.map(mapPerson),
    ...(testRunId ? { p_test_run_id: testRunId } : {}),
  }
}
