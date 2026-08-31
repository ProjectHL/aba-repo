import type { ClientFormValues } from "@/features/clients/client-form"
import type { ClientDetail, ClientSummary } from "@/features/clients/client-contracts"

export type ReadOptions = { signal?: AbortSignal }

export type ClientsRepository = {
  list: (options?: ReadOptions) => Promise<ClientSummary[]>
  create: (values: ClientFormValues, testRunId?: string) => Promise<ClientSummary>
  getById: (id: string, options?: ReadOptions) => Promise<ClientDetail>
}
