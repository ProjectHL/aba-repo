/* eslint-disable react-refresh/only-export-components -- provider and hook form a single repository boundary */
import { createContext, useContext } from "react"

import type { AssessmentRepository } from "@/features/clinical/assessment-repository-contract"

const AssessmentRepositoryContext = createContext<AssessmentRepository | null>(null)

export function AssessmentRepositoryProvider({ children, repository }: { children: React.ReactNode; repository: AssessmentRepository }) {
  return <AssessmentRepositoryContext.Provider value={repository}>{children}</AssessmentRepositoryContext.Provider>
}

export function useAssessmentRepository() {
  const repository = useContext(AssessmentRepositoryContext)
  if (!repository) throw new Error("AssessmentRepository no está configurado")
  return repository
}

export function useOptionalAssessmentRepository() {
  return useContext(AssessmentRepositoryContext)
}
