import { createContext, useContext } from "react"

import type { ClientsRepository } from "@/features/clients/clients-repository-contract"

export const ClientsRepositoryContext = createContext<ClientsRepository | null>(null)

export function useClientsRepository() {
  const repository = useContext(ClientsRepositoryContext)
  if (!repository) {
    throw new Error("ClientsRepository no está configurado")
  }
  return repository
}
