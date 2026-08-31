import { useEffect, useMemo, useRef, useState } from "react"
import { Link } from "react-router-dom"
import {
  BarChart3,
  FileText,
  FileDown,
  Printer,
  RefreshCw,
  ShieldCheck,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useClinicalPlansRepository } from "@/features/clinical/clinical-plans-repository-context"
import { useOptionalAssessmentRepository } from "@/features/clinical/assessment-repository-context"
import type { ClientSummary } from "@/features/clients/client-contracts"
import { useClientsRepository } from "@/features/clients/clients-repository-context"
import {
  buildClinicalReport,
  type ClinicalReport,
} from "@/features/reports/report-analytics"
import { downloadCompleteReportPdf } from "@/features/reports/complete-report-pdf"
import {
  AcquisitionProgressChart,
  BehaviorLineChart,
} from "@/features/reports/report-charts"
import type { ReportDateRange } from "@/features/reports/clinical-report-repository-contract"
import { useClinicalReportRepository } from "@/features/reports/clinical-report-repository-context"
import {
  buildAcquisitionReportSection,
  buildBehaviorReductionReportSection,
  buildEvaluationReportSection,
  type AcquisitionReportSection,
  type BehaviorReductionReportSection,
  type EvaluationReportItem,
  type EvaluationReportSection,
} from "@/features/reports/report-sections"

type PageState =
  | { status: "loading" }
  | {
      status: "ready"
      report: ClinicalReport
      evaluation: EvaluationReportSection
      acquisition: AcquisitionReportSection
      behaviorReduction: BehaviorReductionReportSection
    }
  | { status: "error" }
  | { status: "empty-clients" }

type ReportMode = "progress" | "evaluation" | "complete"

const reportModes: Record<
  ReportMode,
  { eyebrow: string; title: string; description: string; printLabel: string }
> = {
  progress: {
    eyebrow: "Informes clínicos derivados",
    title: "Informes y progreso",
    description:
      "Evolución calculada desde sesiones persistidas. No se crean ni duplican registros clínicos.",
    printLabel: "Imprimir resumen",
  },
  evaluation: {
    eyebrow: "Informe de evaluación",
    title: "Síntesis de evaluación conductual",
    description:
      "Vista imprimible basada en registros existentes. No incluye adjuntos ni información identificatoria adicional.",
    printLabel: "Imprimir informe de evaluación",
  },
  complete: {
    eyebrow: "Informe completo",
    title: "Resumen integral del expediente",
    description:
      "Vista imprimible que consolida únicamente indicadores derivados y elementos activos del expediente sintético.",
    printLabel: "Imprimir informe completo",
  },
}

export function ReportsPage({ mode = "progress" }: { mode?: ReportMode }) {
  const clientsRepository = useClientsRepository()
  const plansRepository = useClinicalPlansRepository()
  const assessmentRepository = useOptionalAssessmentRepository()
  const reportRepository = useClinicalReportRepository()
  const [clients, setClients] = useState<ClientSummary[]>([])
  const [selectedClientId, setSelectedClientId] = useState("")
  const [dateRange, setDateRange] = useState<ReportDateRange>({})
  const [draftRange, setDraftRange] = useState<ReportDateRange>({})
  const [state, setState] = useState<PageState>({ status: "loading" })
  const [attempt, setAttempt] = useState(0)
  const [rangeError, setRangeError] = useState("")
  const selectedClient = useMemo(
    () => clients.find((client) => client.id === selectedClientId),
    [clients, selectedClientId]
  )
  const copy = reportModes[mode]

  useEffect(() => {
    const controller = new AbortController()
    clientsRepository
      .list({ signal: controller.signal })
      .then((rows) => {
        const active = rows.filter((client) => client.status === "active")
        setClients(active)
        setSelectedClientId((current) => current || active[0]?.id || "")
        if (!active.length) setState({ status: "empty-clients" })
      })
      .catch(() => setState({ status: "error" }))
    return () => controller.abort()
  }, [clientsRepository])
  useEffect(() => {
    if (!selectedClientId) return
    const controller = new AbortController()
    Promise.all([
      reportRepository.readByClient(
        selectedClientId,
        dateRange,
        controller.signal
      ),
      plansRepository.listBehaviorPlansByClient(
        selectedClientId,
        controller.signal
      ),
      plansRepository.listGoalsByClient(selectedClientId, controller.signal),
      mode === "complete"
        ? plansRepository.listProgramsByClient(selectedClientId, controller.signal)
        : Promise.resolve([]),
      mode === "progress"
        ? Promise.resolve([])
        : assessmentRepository
          ? assessmentRepository.listByClient(selectedClientId, controller.signal)
          : Promise.reject(new Error("AssessmentRepository no está configurado")),
    ])
      .then(([source, behaviorPlans, goals, programs, assessments]) =>
        setState({
          status: "ready",
          report: buildClinicalReport({
            clientId: selectedClientId,
            dateRange,
            ...source,
            behaviorPlans,
            goals,
          }),
          evaluation: buildEvaluationReportSection({
            assessments,
            clientId: selectedClientId,
            dateRange,
          }),
          acquisition: buildAcquisitionReportSection({
            clientId: selectedClientId,
            programs,
            goals: mode === "complete" ? goals : [],
          }),
          behaviorReduction: buildBehaviorReductionReportSection({
            clientId: selectedClientId,
            plans: mode === "complete" ? behaviorPlans : [],
          }),
        })
      )
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return
        setState({ status: "error" })
      })
    return () => controller.abort()
  }, [
    assessmentRepository,
    attempt,
    dateRange,
    mode,
    plansRepository,
    reportRepository,
    selectedClientId,
  ])
  const applyRange = () => {
    if (draftRange.from && draftRange.to && draftRange.from > draftRange.to) {
      setRangeError("La fecha inicial no puede ser posterior a la fecha final.")
      return
    }
    setRangeError("")
    setState({ status: "loading" })
    setDateRange(draftRange)
  }

  return (
    <div className="space-y-6 print:space-y-4">
      <section className="print:hidden">
        <p className="text-sm font-semibold text-blue-700">{copy.eyebrow}</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">{copy.title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          {copy.description}
        </p>
      </section>
      <nav
        aria-label="Tipos de informe"
        className="flex flex-wrap gap-2 print:hidden"
      >
        <Button
          asChild
          size="sm"
          variant={mode === "progress" ? "default" : "outline"}
        >
          <Link to="/informes">Progreso y gráficos</Link>
        </Button>
        <Button
          asChild
          size="sm"
          variant={mode === "evaluation" ? "default" : "outline"}
        >
          <Link
            aria-label="Abrir informe de evaluación"
            to="/informes/evaluacion"
          >
            Informe de evaluación
          </Link>
        </Button>
        <Button
          asChild
          size="sm"
          variant={mode === "complete" ? "default" : "outline"}
        >
          <Link aria-label="Abrir informe completo" to="/informes/completo">
            Informe completo
          </Link>
        </Button>
      </nav>
      <Card className="print:hidden">
        <CardHeader>
          <CardTitle>Periodo del informe</CardTitle>
          <CardDescription>
            Selecciona un expediente sintético y, si hace falta, limita el
            periodo.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-[1.4fr_1fr_1fr_auto] md:items-end">
          <label className="grid gap-1.5 text-sm font-medium">
            Cliente
            <select
              aria-label="Cliente"
              className="h-9 rounded-lg border border-slate-300 bg-white px-3"
              value={selectedClientId}
              onChange={(event) => {
                setState({ status: "loading" })
                setSelectedClientId(event.target.value)
              }}
              disabled={!clients.length}
            >
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.initials} · {client.clinicalId}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1.5 text-sm font-medium">
            Desde
            <input
              aria-label="Desde"
              className="h-9 rounded-lg border border-slate-300 px-3"
              type="date"
              value={draftRange.from ?? ""}
              onChange={(event) =>
                setDraftRange((range) => ({
                  ...range,
                  from: event.target.value || undefined,
                }))
              }
            />
          </label>
          <label className="grid gap-1.5 text-sm font-medium">
            Hasta
            <input
              aria-label="Hasta"
              className="h-9 rounded-lg border border-slate-300 px-3"
              type="date"
              value={draftRange.to ?? ""}
              onChange={(event) =>
                setDraftRange((range) => ({
                  ...range,
                  to: event.target.value || undefined,
                }))
              }
            />
          </label>
          <Button type="button" onClick={applyRange}>
            Aplicar periodo
          </Button>
        </CardContent>
        {rangeError ? (
          <p className="mx-6 mb-5 text-sm text-rose-700" role="alert">
            {rangeError}
          </p>
        ) : null}
      </Card>
      {state.status === "loading" ? (
        <p aria-label="Cargando informe" role="status">
          Cargando informe…
        </p>
      ) : null}
      {state.status === "empty-clients" ? (
        <EmptyReport message="Crea un cliente sintético activo para preparar su primer informe." />
      ) : null}
      {state.status === "error" ? (
        <Card>
          <CardContent className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
            <p role="alert" className="text-sm text-rose-700">
              No pudimos preparar el informe. Verifica la conexión e inténtalo
              otra vez.
            </p>
            <Button
              onClick={() => {
                setState({ status: "loading" })
                setAttempt((value) => value + 1)
              }}
              variant="outline"
            >
              <RefreshCw />
              Reintentar
            </Button>
          </CardContent>
        </Card>
      ) : null}
      {state.status === "ready" && selectedClient ? (
        <ReportView
          client={selectedClient}
          dateRange={dateRange}
          report={state.report}
          evaluation={state.evaluation}
          acquisition={state.acquisition}
          behaviorReduction={state.behaviorReduction}
          mode={mode}
          printLabel={copy.printLabel}
        />
      ) : null}
    </div>
  )
}

function ReportView({
  client,
  dateRange,
  mode,
  printLabel,
  report,
  evaluation,
  acquisition,
  behaviorReduction,
}: {
  client: ClientSummary
  dateRange: ReportDateRange
  mode: ReportMode
  printLabel: string
  report: ClinicalReport
  evaluation: EvaluationReportSection
  acquisition: AcquisitionReportSection
  behaviorReduction: BehaviorReductionReportSection
}) {
  const [downloadError, setDownloadError] = useState("")
  const [exportStatus, setExportStatus] = useState<
    "idle" | "exporting" | "exported"
  >("idle")
  const exportingRef = useRef(false)
  const label =
    dateRange.from || dateRange.to
      ? `${dateRange.from ?? "inicio"} — ${dateRange.to ?? "hoy"}`
      : "Todo el historial"
  const isEmpty = report.sessionCount === 0
  return (
    <>
      <section
        aria-label="Resumen imprimible"
        className="hidden break-inside-avoid rounded-xl border border-slate-300 p-4 print:block"
      >
        <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
          Resumen profesional · datos sintéticos
        </p>
        <h2 className="mt-1 text-xl font-bold">
          {mode === "evaluation"
            ? "Informe de evaluación"
            : mode === "complete"
              ? "Informe completo"
              : "Informe de progreso"}
        </h2>
        <p className="mt-2 text-sm">
          Cliente: {client.initials} · {client.clinicalId}
        </p>
        <p className="text-sm">Periodo: {label}</p>
      </section>
      <section className="flex items-center justify-between print:hidden">
        <div>
          <h2 className="text-lg font-bold">
            {mode === "evaluation"
              ? "Resumen de evaluación"
              : mode === "complete"
                ? "Resumen integral"
                : "Resumen de progreso"}
          </h2>
          <p className="text-sm text-slate-600">{label}</p>
        </div>
        <Button
          className="print:hidden"
          onClick={() => window.print()}
          variant="outline"
        >
          <Printer />
          {printLabel}
        </Button>
        {mode === "complete" ? (
          <Button
            className="print:hidden"
            onClick={async () => {
              if (exportingRef.current) return
              exportingRef.current = true
              setExportStatus("exporting")
              try {
                await downloadCompleteReportPdf({
                  client,
                  dateRange,
                  report,
                  evaluation,
                  acquisition,
                  behaviorReduction,
                })
                setDownloadError("")
                setExportStatus("exported")
              } catch {
                setExportStatus("idle")
                setDownloadError(
                  "No pudimos crear el PDF local. Inténtalo de nuevo en este navegador."
                )
              } finally {
                exportingRef.current = false
              }
            }}
            variant="outline"
            disabled={
              evaluation.status === "unsupported" || exportStatus === "exporting"
            }
          >
            <FileDown />
            Descargar PDF del informe completo
          </Button>
        ) : null}
      </section>
      {exportStatus !== "idle" ? (
        <p className="text-sm text-slate-600 print:hidden" role="status">
          {exportStatus === "exporting"
            ? "Preparando PDF local…"
            : "El navegador inició la descarga del PDF local."}
        </p>
      ) : null}
      {downloadError ? (
        <p className="text-sm text-rose-700 print:hidden" role="alert">
          {downloadError}
        </p>
      ) : null}
      {mode === "evaluation" ? (
        <EvaluationSection section={evaluation} />
      ) : null}
      {mode === "complete" ? (
        <>
          <Card className="break-inside-avoid">
            <CardHeader>
              <CardTitle>Alcance del informe completo</CardTitle>
              <CardDescription>
                Incluye evaluación, programas, planes y progreso derivado del
                periodo seleccionado.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-slate-600">
              La vista omite fecha de nacimiento, familiares, notas, adjuntos,
              borradores frontend, consentimiento y usuarios asignados.
            </CardContent>
          </Card>
          <EvaluationSection section={evaluation} />
          <AcquisitionSection section={acquisition} />
          <BehaviorReductionSection section={behaviorReduction} />
        </>
      ) : null}
      {mode !== "evaluation" && isEmpty ? (
        <EmptyReport message="Sin registros clínicos en el periodo seleccionado." />
      ) : mode !== "evaluation" ? (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <Metric
              label="Sesiones"
              value={`${report.sessionCount}`}
              description={
                report.sessionCount === 1
                  ? "1 sesión en el periodo"
                  : `${report.sessionCount} sesiones en el periodo`
              }
            />
            <Metric
              label="Planes con datos"
              value={`${report.behaviorSeries.length}`}
              description="Series observadas"
            />
            <Metric
              label="Metas revisadas"
              value={`${report.acquisitionProgress.length}`}
              description="Con o sin ensayos"
            />
          </div>
          <Card className="break-inside-avoid">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="size-5 text-blue-600" />
                Evolución por plan de conducta
              </CardTitle>
              <CardDescription>
                Valores registrados por sesión; las fechas sin medición no se
                rellenan.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5 lg:grid-cols-2">
              {report.behaviorSeries.length ? (
                report.behaviorSeries.map((series) => (
                  <BehaviorSeries
                    key={series.planId}
                    {...series}
                  />
                ))
              ) : (
                <p className="text-sm text-slate-600">
                  No hay mediciones de conducta en este periodo.
                </p>
              )}
            </CardContent>
          </Card>
          <Card className="break-inside-avoid">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="size-5 text-emerald-600" />
                Progreso por meta de adquisición
              </CardTitle>
              <CardDescription>
                Porcentaje acumulado de ensayos correctos en el periodo.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <AcquisitionProgressChart goals={report.acquisitionProgress} />
              {report.acquisitionProgress.length ? (
                report.acquisitionProgress.map((goal) => (
                  <div
                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 p-3"
                    key={goal.goalId}
                  >
                    <div>
                      <p className="font-semibold">{goal.goalName}</p>
                      <p className="text-sm text-slate-600">
                        {goal.correct} correctos · {goal.incorrect} incorrectos
                      </p>
                    </div>
                    <p className="text-lg font-bold text-emerald-700">
                      {goal.percentage === null
                        ? "Sin ensayos"
                        : `${goal.percentage.toFixed(1)}%`}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-600">
                  No hay metas activas para resumir.
                </p>
              )}
            </CardContent>
          </Card>
          <p className="flex items-center gap-2 text-xs text-slate-500 print:text-slate-700">
            <ShieldCheck className="size-4" />
            Resumen derivado exclusivamente de registros existentes en staging
            con datos sintéticos.
          </p>
        </>
      ) : null}
    </>
  )
}

function AcquisitionSection({ section }: { section: AcquisitionReportSection }) {
  if (section.status === "empty")
    return <EmptyReport message="Sin programas de adquisición vigentes." />
  return (
    <Card className="break-inside-avoid">
      <CardHeader>
        <CardTitle>Programas y metas de adquisición</CardTitle>
        <CardDescription>Estado vigente del expediente.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {section.items.map(({ program, goals }) => (
          <section className="rounded-lg border border-slate-200 p-3" key={program.name}>
            <h4 className="font-semibold">{program.name}</h4>
            {program.description ? <p className="text-sm text-slate-600">{program.description}</p> : null}
            <p className="text-sm">Estado: {program.status}</p>
            {goals.length ? (
              <div className="mt-3 space-y-3">
                {goals.map((goal) => (
                  <div key={`${program.name}-${goal.name}`}>
                    <p className="font-semibold">{goal.name}</p>
                    <p className="text-sm">Área: {goal.skillArea}</p>
                    <p className="text-sm">Criterio: {goal.masteryCriterion}</p>
                    <p className="text-sm">Procedimiento: {goal.teachingProcedure}</p>
                    <p className="text-sm">Estado: {goal.status}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-sm text-slate-600">Sin metas vigentes.</p>
            )}
          </section>
        ))}
      </CardContent>
    </Card>
  )
}

function BehaviorReductionSection({
  section,
}: {
  section: BehaviorReductionReportSection
}) {
  if (section.status === "empty")
    return <EmptyReport message="Sin planes de conducta vigentes." />
  return (
    <Card className="break-inside-avoid">
      <CardHeader>
        <CardTitle>Planes de reducción de conducta</CardTitle>
        <CardDescription>Definiciones y estrategias persistidas.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {section.items.map((plan) => (
          <section className="rounded-lg border border-slate-200 p-3" key={plan.name}>
            <h4 className="font-semibold">{plan.name}</h4>
            <ReportField label="Definición" value={plan.operationalDefinition} />
            <ReportField label="Dimensión" value={plan.measurementUnit} />
            <ReportField label="Función" value={plan.hypothesizedFunction ?? undefined} />
            <ReportField label="Estrategia antecedente" value={plan.antecedentStrategy ?? undefined} />
            <ReportField label="Conducta de reemplazo" value={plan.replacementBehavior ?? undefined} />
            <ReportField label="Estrategia de respuesta" value={plan.responseStrategy ?? undefined} />
            <ReportField label="Estado" value={plan.status} />
          </section>
        ))}
      </CardContent>
    </Card>
  )
}

function EvaluationSection({ section }: { section: EvaluationReportSection }) {
  if (section.status === "unsupported")
    return (
      <Card>
        <CardContent className="p-6 text-sm text-amber-800" role="alert">
          Hay una evaluación con una versión no compatible. No mostramos su
          contenido ni JSON interno.
        </CardContent>
      </Card>
    )
  if (section.status === "empty")
    return (
      <EmptyReport message="Sin evaluaciones compatibles en el periodo seleccionado." />
    )
  return (
    <section className="space-y-4" aria-labelledby="evaluation-heading">
      <div>
        <h3 className="text-lg font-bold" id="evaluation-heading">
          Evaluaciones persistidas
        </h3>
        {section.omittedUndatedCount ? (
          <p className="text-sm text-slate-600">
            {section.omittedUndatedCount} evaluación(es) sin fecha se omitieron
            por el filtro activo.
          </p>
        ) : null}
      </div>
      {section.items.map((item) => (
        <EvaluationItem item={item} key={item.sourceId} />
      ))}
    </section>
  )
}

function EvaluationItem({ item }: { item: EvaluationReportItem }) {
  return (
    <Card className="break-inside-avoid">
      <CardHeader>
        <CardTitle>{item.title}</CardTitle>
        <CardDescription>
          {item.occurredOn ?? "Sin fecha"} · {item.status === "completed" ? "Completada" : "Borrador"}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2 text-sm text-slate-700">
        {item.kind === "initial_interview" ? (
          <>
            <ReportField label="Motivo de consulta" value={item.payload.consultation_reason} />
            <ReportField label="Historia del desarrollo" value={item.payload.development_history} />
            <ReportField label="Contexto familiar" value={item.payload.family_context} />
            <ReportField label="Prioridades" value={item.payload.priorities} />
            {item.payload.informants.map((informant, index) => (
              <div className="rounded-lg border border-slate-200 p-3" key={`${informant.informant}-${index}`}>
                <p className="font-semibold">{informant.informant}</p>
                <p>Fortalezas: {informant.strengths}</p>
                <p>Necesidades: {informant.needs}</p>
              </div>
            ))}
          </>
        ) : item.kind === "preference" ? (
          <>
            <ReportField label="Tipo" value={item.payload.assessment_type} />
            <ReportField label="Preferencia más alta" value={item.payload.highest_preference} />
            <ReportField label="Respuesta" value={item.payload.response} />
            <ReportField label="Preferencia más baja" value={item.payload.lowest_preference} />
            <ReportField label="Topografía" value={item.payload.topography} />
          </>
        ) : (
          <>
            <ReportField label="Tipo" value={item.payload.assessment_type} />
            <ReportField label="Conducta observada" value={item.payload.target_behavior} />
            <ReportField label="Antecedente" value={item.payload.antecedent} />
            <ReportField label="Consecuencia" value={item.payload.consequence} />
            <ReportField label="Función probable" value={item.payload.hypothesized_function} />
            <ReportField label="Topografía" value={item.payload.topography} />
          </>
        )}
      </CardContent>
    </Card>
  )
}

function ReportField({ label, value }: { label: string; value?: string }) {
  return value ? (
    <p>
      <span className="font-semibold">{label}:</span> {value}
    </p>
  ) : null
}
function BehaviorSeries({
  planId,
  planName,
  points,
}: {
  planId: string
  planName: string
  points: Array<{ occurredOn: string; value: number }>
}) {
  return (
    <div className="min-w-0 break-inside-avoid rounded-xl border border-slate-200 p-4">
      <p className="font-semibold">{planName}</p>
      <BehaviorLineChart chartId={planId} planName={planName} points={points} />
      <ul className="sr-only" aria-label={`Valores de ${planName}`}>
        {points.map((point) => (
          <li key={`${point.occurredOn}-${point.value}`}>
            {point.occurredOn}: {point.value}
          </li>
        ))}
      </ul>
    </div>
  )
}
function Metric({
  description,
  label,
  value,
}: {
  description: string
  label: string
  value: string
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-sm text-slate-600">{label}</p>
        <p className="mt-1 text-2xl font-bold">{value}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </CardContent>
    </Card>
  )
}
function EmptyReport({ message }: { message: string }) {
  return (
    <Card>
      <CardContent className="p-6 text-sm text-slate-600">
        {message}
      </CardContent>
    </Card>
  )
}
