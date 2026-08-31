/* eslint-disable react-refresh/only-export-components -- provider and hook share one boundary */
import { createContext, useContext } from "react"

import type { StudentRecordRepository } from "@/features/clinical/student-record/student-record-repository-contract"

const StudentRecordRepositoryContext = createContext<StudentRecordRepository | null>(null)

export function StudentRecordRepositoryProvider({ children, repository }: { children: React.ReactNode; repository: StudentRecordRepository }) {
  return <StudentRecordRepositoryContext.Provider value={repository}>{children}</StudentRecordRepositoryContext.Provider>
}

export function useStudentRecordRepository() {
  const repository = useContext(StudentRecordRepositoryContext)
  if (!repository) throw new Error("StudentRecordRepository no está configurado")
  return repository
}

