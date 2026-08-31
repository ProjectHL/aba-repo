export type WorkspaceTab =
  | "information"
  | "assessment"
  | "acquisition"
  | "reduction"
  | "sessions"

export type ClinicalJourneyStep = {
  id: WorkspaceTab | "reports"
  label: string
  capability: "remote" | "frontend-draft" | "mixed" | "blocked"
  next:
    | { kind: "tab"; tab: WorkspaceTab; label: string }
    | { kind: "route"; label: string }
    | null
}

export const clinicalJourneySteps: ClinicalJourneyStep[] = [
  {
    id: "information",
    label: "Información, contexto e historia",
    capability: "mixed",
    next: { kind: "tab", tab: "assessment", label: "Continuar a Evaluación" },
  },
  {
    id: "assessment",
    label: "Evaluación conductual",
    capability: "remote",
    next: { kind: "tab", tab: "acquisition", label: "Continuar a Adquisición" },
  },
  {
    id: "acquisition",
    label: "Programas de adquisición",
    capability: "remote",
    next: { kind: "tab", tab: "reduction", label: "Continuar a Reducción" },
  },
  {
    id: "reduction",
    label: "Reducción de conductas",
    capability: "remote",
    next: { kind: "tab", tab: "sessions", label: "Continuar a Sesiones" },
  },
  {
    id: "sessions",
    label: "Sesiones",
    capability: "remote",
    next: { kind: "route", label: "Continuar a Informes" },
  },
  {
    id: "reports",
    label: "Informes",
    capability: "remote",
    next: null,
  },
]

