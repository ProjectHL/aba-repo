export type StudentRole = "supervisor" | "coordinator" | "therapist" | "family"
export type HistoryEntryKind = "reported_diagnosis" | "assessment" | "procedure" | "medication"
export type HistoryEntryStatus = "active" | "superseded" | "entered_in_error"
export type ConsentStatus = "pending_review" | "valid" | "revoked" | "expired" | "superseded"

export type StudentContext = {
  clientId: string
  homeAdaptations: string
  schooling: string
  schoolAdaptations: string
  version: number
  updatedAt: string
}

export type ClinicalHistoryEntry = {
  id: string
  clientId: string
  kind: HistoryEntryKind
  descriptor: string
  occurredOn?: string
  dose?: string
  prescriberDescriptor?: string
  startedOn?: string
  endedOn?: string
  status: HistoryEntryStatus
  supersedesId?: string
  createdAt: string
}

export type ConsentReference = {
  id: string
  clientId: string
  purposeCode: string
  noticeVersion: string
  grantorDescriptor: string
  channel: string
  evidenceReference?: string
  status: ConsentStatus
  effectiveAt?: string
  expiresAt?: string
  supersedesId?: string
  createdAt: string
}

export type StudentRecord = {
  context: StudentContext | null
  history: ClinicalHistoryEntry[]
  consents: ConsentReference[]
}

export type SaveContextDraft = {
  clientId: string
  expectedVersion?: number
  homeAdaptations: string
  schooling: string
  schoolAdaptations: string
}

export type AppendHistoryDraft = {
  clientId: string
  kind: HistoryEntryKind
  descriptor: string
  occurredOn?: string
  dose?: string
  prescriberDescriptor?: string
  startedOn?: string
  endedOn?: string
  supersedesId?: string
}

export type RecordConsentDraft = {
  clientId: string
  purposeCode: string
  noticeVersion: string
  grantorDescriptor: string
  channel: string
  status: ConsentStatus
  effectiveAt?: string
  expiresAt?: string
  evidenceReference?: string
  supersedesId?: string
}

export type StudentAssignment = {
  id: string
  clientId: string
  userId: string
  role: StudentRole
  isPrimary: boolean
  status: "active" | "inactive"
}

export type AuthorizationRequest = {
  id: string
  clientId: string
  requesterUserId: string
  resourceType: "student" | "program" | "record_config" | "chart"
  requestedActions: string[]
  reason: string
  status: "pending" | "approved" | "denied"
  createdAt: string
}

export type AuthorizationDecision = {
  id: string
  clientId: string
  requestId: string
  decision: "approved" | "denied" | "revoked"
  grantedActions: string[]
  expiresAt?: string
  supersedesDecisionId?: string
  createdAt: string
}

export type StudentAccess = {
  currentAssignment: StudentAssignment | null
  team: StudentAssignment[]
  requests: AuthorizationRequest[]
  decisions: AuthorizationDecision[]
  capabilities: string[]
}

export type StudentRecordRepository = {
  load: (clientId: string, signal?: AbortSignal) => Promise<StudentRecord>
  loadAccess: (clientId: string, currentUserId: string, signal?: AbortSignal) => Promise<StudentAccess>
  saveContext: (draft: SaveContextDraft) => Promise<StudentContext>
  appendHistoryEntry: (draft: AppendHistoryDraft) => Promise<ClinicalHistoryEntry>
  appendHistoryEntries: (clientId: string, drafts: AppendHistoryDraft[]) => Promise<ClinicalHistoryEntry[]>
  recordConsent: (draft: RecordConsentDraft) => Promise<ConsentReference>
  requestAuthorization: (draft: {
    clientId: string
    resourceType: AuthorizationRequest["resourceType"]
    actions: string[]
    reason: string
  }) => Promise<AuthorizationRequest>
  decideAuthorization: (requestId: string, decision: "approved" | "denied", expiresAt?: string) => Promise<void>
  revokeAuthorization: (decisionId: string) => Promise<void>
  setAssignment: (draft: {
    clientId: string
    userId: string
    role: StudentRole
    status: "active" | "inactive"
  }) => Promise<StudentAssignment>
}
