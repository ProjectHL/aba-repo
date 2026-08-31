import { useCallback, useMemo, useState } from "react"

import { useAuth } from "@/auth/auth-context"
import {
  createEmptyFrontendClinicalDraft,
  FrontendDraftContext,
  type ClientContextDraft,
  type ClinicalHistoryDraft,
  type FrontendClinicalDraft,
} from "@/features/clinical/forms/frontend-draft-store"

type DraftStore = Record<string, FrontendClinicalDraft>

export function FrontendDraftProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { identity, status } = useAuth()
  const sessionKey = identity?.id ?? status
  return <FrontendDraftSession key={sessionKey}>{children}</FrontendDraftSession>
}

function FrontendDraftSession({ children }: { children: React.ReactNode }) {
  const [drafts, setDrafts] = useState<DraftStore>({})

  const getDraft = useCallback(
    (clientId: string) =>
      drafts[clientId] ?? createEmptyFrontendClinicalDraft(),
    [drafts]
  )

  const updateContext = useCallback(
    (clientId: string, patch: Partial<ClientContextDraft>) => {
      setDrafts((current) => {
        const existing =
          current[clientId] ?? createEmptyFrontendClinicalDraft()
        return {
          ...current,
          [clientId]: {
            ...existing,
            context: { ...existing.context, ...patch },
          },
        }
      })
    },
    []
  )

  const updateHistory = useCallback(
    (clientId: string, history: ClinicalHistoryDraft) => {
      setDrafts((current) => ({
        ...current,
        [clientId]: {
          ...(current[clientId] ?? createEmptyFrontendClinicalDraft()),
          history,
        },
      }))
    },
    []
  )

  const value = useMemo(
    () => ({ getDraft, updateContext, updateHistory }),
    [getDraft, updateContext, updateHistory]
  )

  return (
    <FrontendDraftContext.Provider value={value}>
      {children}
    </FrontendDraftContext.Provider>
  )
}
