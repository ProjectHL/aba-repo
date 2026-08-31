/* eslint-disable react-refresh/only-export-components -- provider and hook form a single repository boundary */
import { createContext, useContext } from "react"

import type { ClinicalSessionRepository } from "@/features/clinical/clinical-session-repository-contract"

const ClinicalSessionRepositoryContext = createContext<ClinicalSessionRepository | null>(null)

export function ClinicalSessionRepositoryProvider({ children, repository }: { children: React.ReactNode; repository: ClinicalSessionRepository }) {
  return <ClinicalSessionRepositoryContext.Provider value={repository}>{children}</ClinicalSessionRepositoryContext.Provider>
}

export function useClinicalSessionRepository() {
  const repository = useContext(ClinicalSessionRepositoryContext)
  if (!repository) throw new Error("ClinicalSessionRepository no está configurado")
  return repository
}
