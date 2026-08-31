/* eslint-disable react-refresh/only-export-components -- provider and hook form one repository boundary */
import { createContext, useContext } from "react"

import type { ClinicalReportRepository } from "@/features/reports/clinical-report-repository-contract"

const ClinicalReportRepositoryContext =
  createContext<ClinicalReportRepository | null>(null)

export function ClinicalReportRepositoryProvider({
  children,
  repository,
}: {
  children: React.ReactNode
  repository: ClinicalReportRepository
}) {
  return (
    <ClinicalReportRepositoryContext.Provider value={repository}>
      {children}
    </ClinicalReportRepositoryContext.Provider>
  )
}

export function useClinicalReportRepository() {
  const repository = useContext(ClinicalReportRepositoryContext)
  if (!repository)
    throw new Error("ClinicalReportRepository no está configurado")
  return repository
}
