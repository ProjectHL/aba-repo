/* eslint-disable react-refresh/only-export-components -- provider and hook form a single repository boundary */
import { createContext, useContext } from "react"

import type { ClinicalPlansRepository } from "@/features/clinical/clinical-plans-repository-contract"

const ClinicalPlansRepositoryContext = createContext<ClinicalPlansRepository | null>(null)

export function ClinicalPlansRepositoryProvider({ children, repository }: { children: React.ReactNode; repository: ClinicalPlansRepository }) {
  return <ClinicalPlansRepositoryContext.Provider value={repository}>{children}</ClinicalPlansRepositoryContext.Provider>
}

export function useClinicalPlansRepository() {
  const repository = useContext(ClinicalPlansRepositoryContext)
  if (!repository) throw new Error("ClinicalPlansRepository no está configurado")
  return repository
}
