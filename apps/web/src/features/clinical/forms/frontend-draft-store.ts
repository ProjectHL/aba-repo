import { createContext, useContext } from "react"

export type ClientContextDraft = {
  homeAdaptations: string
  schooling: string
  schoolAdaptations: string
}

export type ClinicalHistoryDraft = {
  diagnoses: Array<{ uiId: string; label: string; occurredOn: string }>
  historicalAssessments: Array<{ uiId: string; name: string; occurredOn: string }>
  procedures: Array<{ uiId: string; procedure: string; occurredOn: string }>
  medications: Array<{
    uiId: string
    name: string
    dose: string
    prescriberDescriptor: string
    startedOn: string
    endedOn: string
  }>
}

export type FrontendClinicalDraft = {
  context: ClientContextDraft
  history: ClinicalHistoryDraft
}

export type FrontendDraftContextValue = {
  getDraft: (clientId: string) => FrontendClinicalDraft
  updateContext: (clientId: string, patch: Partial<ClientContextDraft>) => void
  updateHistory: (clientId: string, history: ClinicalHistoryDraft) => void
}

export const FrontendDraftContext =
  createContext<FrontendDraftContextValue | null>(null)

export function createEmptyFrontendClinicalDraft(): FrontendClinicalDraft {
  return {
    context: { homeAdaptations: "", schooling: "", schoolAdaptations: "" },
    history: {
      diagnoses: [],
      historicalAssessments: [],
      procedures: [],
      medications: [],
    },
  }
}

export function useFrontendClinicalDrafts() {
  const value = useContext(FrontendDraftContext)
  if (!value) {
    throw new Error(
      "useFrontendClinicalDrafts debe usarse dentro de FrontendDraftProvider"
    )
  }
  return value
}

