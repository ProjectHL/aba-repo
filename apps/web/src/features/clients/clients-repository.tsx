import { ClientsRepositoryContext } from "@/features/clients/clients-repository-context"
import type { ClientsRepository } from "@/features/clients/clients-repository-contract"

export type { ClientsRepository } from "@/features/clients/clients-repository-contract"

export function ClientsRepositoryProvider({
  children,
  repository,
}: {
  children: React.ReactNode
  repository: ClientsRepository
}) {
  return (
    <ClientsRepositoryContext.Provider value={repository}>
      {children}
    </ClientsRepositoryContext.Provider>
  )
}
