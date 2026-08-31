import { ZodError } from "zod"

import {
  parseClientDetailRow,
  parseClientRows,
  toCreateClientArgs,
} from "@/features/clients/client-contracts"
import type { ClientsRepository } from "@/features/clients/clients-repository-contract"
import { notifySessionInvalidated } from "@/auth/session-invalidation"
import {
  DomainError,
  normalizeSupabaseError,
} from "@/lib/supabase/domain-error"
import { getSupabaseClient } from "@/lib/supabase/client"

const CLIENT_COLUMNS =
  "id, clinical_id, initials, primary_language, birth_date, status"
const CLIENT_DETAIL_COLUMNS = `${CLIENT_COLUMNS}, living_arrangement, guardians(id, initials, birth_date, position), siblings(id, initials, birth_date, position)`

function parseRows(value: unknown) {
  try {
    return parseClientRows(value)
  } catch (error) {
    if (error instanceof ZodError) {
      throw new DomainError(
        "INVALID_DATA_RESPONSE",
        "El servicio devolvió datos inválidos"
      )
    }
    throw error
  }
}

async function readOnce<T>(
  operation: () => PromiseLike<{ data: T; error: unknown }>
) {
  const { data, error } = await operation()
  if (error) throw normalizeAndNotify(error)
  return data
}

function normalizeAndNotify(error: unknown) {
  const normalized = normalizeSupabaseError(error)
  if (normalized.code === "UNAUTHORIZED") notifySessionInvalidated()
  return normalized
}

async function readWithSingleNetworkRetry<T>(
  operation: () => PromiseLike<{ data: T; error: unknown }>
) {
  try {
    return await readOnce(operation)
  } catch (error) {
    if (!(error instanceof DomainError) || error.code !== "NETWORK_ERROR")
      throw error
    return readOnce(operation)
  }
}

export const supabaseClientsRepository: ClientsRepository = {
  async list(options) {
    const data = await readWithSingleNetworkRetry(() => {
      let query = getSupabaseClient()
        .from("clients")
        .select(CLIENT_DETAIL_COLUMNS)
        .order("created_at", { ascending: false })
      if (options?.signal) query = query.abortSignal(options.signal)
      return query
    })
    return parseRows(data)
  },

  async create(values, testRunId) {
    const { data, error } = await getSupabaseClient().rpc(
      "create_client",
      toCreateClientArgs(values, testRunId)
    )
    if (error) throw normalizeAndNotify(error)
    const [client] = parseRows(data ? [data] : [])
    if (!client) {
      throw new DomainError(
        "INVALID_DATA_RESPONSE",
        "El servicio devolvió datos inválidos"
      )
    }
    return client
  },

  async getById(id, options) {
    const data = await readWithSingleNetworkRetry(() => {
      let query = getSupabaseClient()
        .from("clients")
        .select(CLIENT_DETAIL_COLUMNS)
        .eq("id", id)
      if (options?.signal) query = query.abortSignal(options.signal)
      return query.maybeSingle()
    })
    if (!data)
      throw new DomainError("CLIENT_NOT_FOUND", "Cliente no encontrado")
    try {
      return parseClientDetailRow(data)
    } catch (error) {
      if (error instanceof ZodError) {
        throw new DomainError(
          "INVALID_DATA_RESPONSE",
          "El servicio devolvió datos inválidos"
        )
      }
      throw error
    }
  },
}
