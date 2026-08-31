import { ArrowRight, CheckCircle2, Circle } from "lucide-react"
import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  clinicalJourneySteps,
  type WorkspaceTab,
} from "@/features/clinical/forms/clinical-journey-contract"

export function ClinicalJourneyCompass({
  activeStep,
  clientId,
  onTabChange,
}: {
  activeStep: WorkspaceTab
  clientId: string
  onTabChange: (tab: WorkspaceTab) => void
}) {
  const current = clinicalJourneySteps.find((step) => step.id === activeStep)
  const next = current?.next
  const reportParams = new URLSearchParams({ client: clientId })

  return (
    <Card aria-label="Brújula del expediente">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Brújula del expediente</CardTitle>
        <p className="text-sm text-slate-500">
          Orden recomendado; no representa aprobación clínica ni bloquea el avance.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-6">
          {clinicalJourneySteps.map((step) => {
            const active = step.id === activeStep
            return (
              <li
                aria-current={active ? "step" : undefined}
                className={`flex items-start gap-2 rounded-lg border p-2 text-xs ${
                  active
                    ? "border-blue-300 bg-blue-50 font-semibold text-blue-800"
                    : "border-slate-200 text-slate-600"
                }`}
                key={step.id}
              >
                {active ? (
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
                ) : (
                  <Circle className="mt-0.5 size-4 shrink-0" />
                )}
                <span>{step.label}</span>
              </li>
            )
          })}
        </ol>
        {next?.kind === "tab" ? (
          <Button
            className="w-full sm:w-auto"
            onClick={() => onTabChange(next.tab)}
            type="button"
          >
            {next.label}
            <ArrowRight className="size-4" />
          </Button>
        ) : next?.kind === "route" ? (
          <Button asChild className="w-full sm:w-auto">
            <Link to={`/informes?${reportParams.toString()}`}>
              {next.label}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        ) : null}
      </CardContent>
    </Card>
  )
}
