import { useEffect, useState, type ReactNode } from "react"
import {
  Activity,
  BookOpenCheck,
  ClipboardCheck,
  FileText,
  HeartPulse,
  Minus,
  Plus,
  ShieldAlert,
  Target,
  Users,
} from "lucide-react"
import { Link, useParams } from "react-router-dom"

import { useAuth } from "@/auth/auth-context"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { ClientDetail } from "@/features/clients/client-contracts"
import { useClientsRepository } from "@/features/clients/clients-repository-context"
import type { ConnectionState } from "@/features/clinical/clinical-contracts"
import type { AssessmentKind } from "@/features/clinical/assessment-repository-contract"
import { useAssessmentRepository } from "@/features/clinical/assessment-repository-context"
import { useClinicalPlansRepository } from "@/features/clinical/clinical-plans-repository-context"
import type {
  AcquisitionGoalSummary,
  AcquisitionProgramSummary,
  BehaviorPlanSummary,
} from "@/features/clinical/clinical-plans-repository-contract"
import { useClinicalSessionRepository } from "@/features/clinical/clinical-session-repository-context"
import { ProgramLifecycleCard } from "@/features/clinical/program-lifecycle-card"
import type { CreateBehaviorMeasurementDraft } from "@/features/clinical/clinical-session-repository-contract"
import { InitialInterviewFormDialog } from "@/features/clinical/initial-interview-form-dialog"
import type { InitialInterviewPayloadV1 } from "@/features/clinical/initial-interview-contract"
import {
  FunctionalAssessmentFormDialog,
  PreferenceAssessmentFormDialog,
} from "@/features/clinical/assessment-forms-dialog"
import type { Json } from "@/integrations/supabase/database.types"
import {
  behaviorPlanFormSchema,
  goalFormSchema,
  programFormSchema,
  toBehaviorPlanDraft,
  toGoalDraft,
} from "@/features/clinical/clinical-plan-form-contracts"
import { ClinicalJourneyCompass } from "@/features/clinical/forms/clinical-journey-compass"
import type { WorkspaceTab } from "@/features/clinical/forms/clinical-journey-contract"
import { ClientContextFormDialog } from "@/features/clinical/forms/client-context-form-dialog"
import { ClinicalHistoryFormDialog } from "@/features/clinical/forms/clinical-history-form-dialog"
import type {
  StudentAccess,
  StudentRecord,
} from "@/features/clinical/student-record/student-record-repository-contract"
import { useStudentRecordRepository } from "@/features/clinical/student-record/student-record-repository-context"
import { ConsentReferenceDialog } from "@/features/clinical/student-record/consent-reference-dialog"
import { StudentAccessCard } from "@/features/clinical/student-record/student-access-card"
import { dateOnlyInTimeZone } from "@/lib/date-only"
import { DomainError } from "@/lib/supabase/domain-error"

type DetailState =
  | { status: "loading" }
  | { status: "success"; client: ClientDetail }
  | { status: "not-found" }
  | { status: "error" }

const tabs: { id: WorkspaceTab; label: string }[] = [
  { id: "information", label: "Información" },
  { id: "assessment", label: "Evaluación conductual" },
  { id: "acquisition", label: "Programas de adquisición" },
  { id: "reduction", label: "Reducción de conductas" },
  { id: "sessions", label: "Sesiones" },
]

export function ClientDetailPage() {
  const { id = "" } = useParams()
  const repository = useClientsRepository()
  const [state, setState] = useState<DetailState>({ status: "loading" })
  const [attempt, setAttempt] = useState(0)
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("information")

  useEffect(() => {
    const controller = new AbortController()
    repository
      .getById(id, { signal: controller.signal })
      .then((client) => setState({ status: "success", client }))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return
        if (error instanceof DomainError && error.code === "CLIENT_NOT_FOUND") {
          setState({ status: "not-found" })
          return
        }
        setState({ status: "error" })
      })
    return () => controller.abort()
  }, [attempt, id, repository])

  if (state.status === "loading") return <p role="status">Cargando cliente…</p>
  if (state.status === "not-found")
    return <DetailMessage title="Cliente no encontrado" />
  if (state.status === "error") {
    return (
      <DetailMessage
        onRetry={() => {
          setState({ status: "loading" })
          setAttempt((value) => value + 1)
        }}
        title="No pudimos cargar el cliente"
      />
    )
  }

  const client = state.client
  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center">
        <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-blue-100 text-xl font-bold text-blue-700">
          {client.initials}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-blue-700">
            Expediente sintético
          </p>
          <h1 className="text-2xl font-bold tracking-tight">
            Detalle del cliente
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            ID clínico{" "}
            <span className="font-medium text-slate-800">
              {client.clinicalId}
            </span>
          </p>
        </div>
        <div className="sm:ml-auto">
          <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
            Expediente activo
          </span>
        </div>
      </section>

      <div
        className="overflow-x-auto border-b border-slate-200"
        role="tablist"
        aria-label="Áreas del expediente"
      >
        <div className="flex min-w-max gap-1">
          {tabs.map((tab) => (
            <button
              aria-controls={`panel-${tab.id}`}
              aria-selected={activeTab === tab.id}
              className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${activeTab === tab.id ? "border-blue-600 text-blue-700" : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-900"}`}
              id={`tab-${tab.id}`}
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              role="tab"
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <section
        aria-labelledby={`tab-${activeTab}`}
        id={`panel-${activeTab}`}
        role="tabpanel"
      >
        {activeTab === "information" && <InformationPanel client={client} />}
        {activeTab === "assessment" && <AssessmentPanel clientId={client.id} />}
        {activeTab === "acquisition" && (
          <AcquisitionPanel clientId={client.id} />
        )}
        {activeTab === "reduction" && <ReductionPanel clientId={client.id} />}
        {activeTab === "sessions" && <SessionsPanel clientId={client.id} />}
      </section>

      <ClinicalJourneyCompass
        activeStep={activeTab}
        clientId={client.id}
        onTabChange={setActiveTab}
      />
    </div>
  )
}

function InformationPanel({ client }: { client: ClientDetail }) {
  const repository = useStudentRecordRepository()
  const { identity } = useAuth()
  const [record, setRecord] = useState<StudentRecord | null>(null)
  const [access, setAccess] = useState<StudentAccess | null>(null)
  const [recordError, setRecordError] = useState(false)
  const [recordAttempt, setRecordAttempt] = useState(0)
  useEffect(() => {
    if (!identity) return
    const controller = new AbortController()
    Promise.all([
      repository.load(client.id, controller.signal),
      repository.loadAccess(client.id, identity.id, controller.signal),
    ])
      .then(([nextRecord, nextAccess]) => {
        setRecord(nextRecord)
        setAccess(nextAccess)
        setRecordError(false)
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return
        setRecordError(true)
      })
    return () => controller.abort()
  }, [client.id, identity, recordAttempt, repository])
  const reloadRecord = () => setRecordAttempt((value) => value + 1)
  const canEdit = access?.capabilities.includes("student.edit") ?? false
  return (
    <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Información general</CardTitle>
          <CardDescription>
            Datos disponibles en el expediente actual.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <DetailField label="Iniciales" value={client.initials} />
          <DetailField label="ID clínico" value={client.clinicalId} />
          <DetailField
            label="Idioma principal"
            value={client.primaryLanguage}
          />
          <DetailField label="Fecha de nacimiento" value={client.birthDate} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="size-4 text-blue-600" />
                Contexto familiar
              </CardTitle>
              <CardDescription>
                Tutores, hermanos y convivencia.
              </CardDescription>
            </div>
            <ConnectionBadge label="Conectado" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
              Convivencia
            </p>
            <p className="mt-1 text-sm">
              {client.livingArrangement ?? "Sin información registrada"}
            </p>
          </div>
          <PeopleGroup
            empty="Sin tutores registrados"
            people={client.guardians}
            title="Tutores"
          />
          <PeopleGroup
            empty="Sin hermanos registrados"
            people={client.siblings}
            title="Hermanos"
          />
          <div className="border-t border-slate-200 pt-4">
            <p className="mb-2 text-xs text-blue-800">
              Hogar y colegio:{" "}
              {record?.context
                ? `versión ${record.context.version}`
                : "sin información registrada"}
            </p>
            {canEdit ? (
              <ClientContextFormDialog
                clientId={client.id}
                context={record?.context ?? null}
                onSaved={reloadRecord}
              />
            ) : null}
          </div>
        </CardContent>
      </Card>
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <CardTitle className="flex items-center gap-2">
              <HeartPulse className="size-4 text-rose-600" />
              Historia clínica
            </CardTitle>
            {canEdit ? (
              <ClinicalHistoryFormDialog
                clientId={client.id}
                onSaved={reloadRecord}
              />
            ) : null}
          </div>
          <CardDescription>
            Resumen clínico organizado por categoría.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [
              "Diagnósticos reportados",
              record?.history.filter(
                (entry) =>
                  entry.kind === "reported_diagnosis" &&
                  entry.status === "active"
              ).length ?? 0,
            ],
            [
              "Evaluaciones",
              record?.history.filter(
                (entry) =>
                  entry.kind === "assessment" && entry.status === "active"
              ).length ?? 0,
            ],
            [
              "Procedimientos",
              record?.history.filter(
                (entry) =>
                  entry.kind === "procedure" && entry.status === "active"
              ).length ?? 0,
            ],
            [
              "Medicamentos",
              record?.history.filter(
                (entry) =>
                  entry.kind === "medication" && entry.status === "active"
              ).length ?? 0,
            ],
          ].map(([title, count]) => (
            <div className="rounded-xl border border-slate-200 p-4" key={title}>
              <p className="font-semibold">{title}</p>
              <p className="mt-2 text-sm text-slate-500">
                {count} entrada(s) persistida(s)
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle>Consentimiento por finalidad</CardTitle>
              <CardDescription>
                Referencia demostrativa; no contiene archivo ni firma y no
                declara validez legal.
              </CardDescription>
            </div>
            {access?.currentAssignment?.role === "supervisor" &&
            access.currentAssignment.isPrimary ? (
              <ConsentReferenceDialog
                clientId={client.id}
                onSaved={reloadRecord}
              />
            ) : null}
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {record?.consents.length ? (
            record.consents.map((consent) => (
              <div className="rounded-lg border p-3 text-sm" key={consent.id}>
                <p className="font-medium">{consent.purposeCode}</p>
                <p className="text-slate-500">
                  {consent.noticeVersion} · {consent.status} · {consent.channel}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500">
              Sin referencias visibles para tu rol.
            </p>
          )}
        </CardContent>
      </Card>
      <StudentAccessCard
        access={access}
        clientId={client.id}
        onChanged={reloadRecord}
      />
      {recordError ? (
        <p className="text-sm text-rose-700 lg:col-span-2" role="alert">
          No pudimos cargar el expediente mínimo o sus capacidades.{" "}
          <Button onClick={reloadRecord} size="sm" variant="outline">
            Reintentar
          </Button>
        </p>
      ) : null}
    </div>
  )
}

function AssessmentPanel({ clientId }: { clientId: string }) {
  const repository = useAssessmentRepository()
  const [counts, setCounts] = useState<Record<AssessmentKind, number>>({
    initial_interview: 0,
    preference: 0,
    functional: 0,
  })
  const [loadError, setLoadError] = useState(false)

  const loadAssessments = async (signal?: AbortSignal) => {
    try {
      const rows = await repository.listByClient(clientId, signal)
      setCounts({
        initial_interview: rows.filter(
          (row) => row.kind === "initial_interview"
        ).length,
        preference: rows.filter((row) => row.kind === "preference").length,
        functional: rows.filter((row) => row.kind === "functional").length,
      })
      setLoadError(false)
      return true
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError")
        return false
      setLoadError(true)
      return false
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    repository
      .listByClient(clientId, controller.signal)
      .then((rows) => {
        setCounts({
          initial_interview: rows.filter(
            (row) => row.kind === "initial_interview"
          ).length,
          preference: rows.filter((row) => row.kind === "preference").length,
          functional: rows.filter((row) => row.kind === "functional").length,
        })
        setLoadError(false)
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return
        setLoadError(true)
      })
    return () => controller.abort()
  }, [clientId, repository])

  const saveAssessment = async (
    kind: AssessmentKind,
    title: string,
    payload: Json | InitialInterviewPayloadV1,
    occurredOn?: string
  ) => {
    await repository.create({
      clientId,
      kind,
      title,
      payload,
      ...(occurredOn ? { occurredOn } : {}),
    })
    return (await loadAssessments()) ? "saved" : "saved-stale"
  }

  return (
    <WorkspaceSection
      connected
      description="Organiza la línea base antes de construir los programas de intervención."
      title="Evaluación conductual"
    >
      {loadError ? (
        <div className="md:col-span-2 xl:col-span-3" role="alert">
          <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
            No se pudo leer el historial de evaluaciones.
          </p>
        </div>
      ) : null}
      <FeatureCard
        accent="blue"
        connection="connected"
        description={`Historia de desarrollo, comunicación, entorno y prioridades familiares. ${counts.initial_interview} borrador(es).`}
        icon={<FileText className="size-5" />}
        title="Entrevista inicial"
      >
        <InitialInterviewFormDialog
          onRetryRefresh={() => loadAssessments()}
          onSave={(payload) =>
            saveAssessment("initial_interview", "Entrevista inicial", payload)
          }
        />
      </FeatureCard>
      <FeatureCard
        accent="violet"
        connection="connected"
        description={`Registro estructurado de estímulos, actividades y reforzadores potenciales. ${counts.preference} borrador(es).`}
        icon={<Target className="size-5" />}
        title="Evaluación de preferencias"
      >
        <PreferenceAssessmentFormDialog
          onRetryRefresh={() => loadAssessments()}
          onSave={({ occurredOn, payload }) =>
            saveAssessment(
              "preference",
              "Evaluación de preferencias",
              payload,
              occurredOn
            )
          }
        />
      </FeatureCard>
      <FeatureCard
        accent="amber"
        connection="connected"
        description={`Antecedente, conducta, consecuencia e hipótesis de función. ${counts.functional} borrador(es).`}
        icon={<Activity className="size-5" />}
        title="Evaluación funcional"
      >
        <FunctionalAssessmentFormDialog
          onRetryRefresh={() => loadAssessments()}
          onSave={({ occurredOn, payload }) =>
            saveAssessment(
              "functional",
              "Evaluación funcional",
              payload,
              occurredOn
            )
          }
        />
      </FeatureCard>
    </WorkspaceSection>
  )
}

function AcquisitionPanel({ clientId }: { clientId: string }) {
  const repository = useClinicalPlansRepository()
  const [programs, setPrograms] = useState<AcquisitionProgramSummary[]>([])
  const [goals, setGoals] = useState<AcquisitionGoalSummary[]>([])
  const [loadError, setLoadError] = useState(false)

  const load = async (signal?: AbortSignal) => {
    try {
      const [nextPrograms, nextGoals] = await Promise.all([
        repository.listProgramsByClient(clientId, signal),
        repository.listGoalsByClient(clientId, signal),
      ])
      setPrograms(nextPrograms)
      setGoals(nextGoals)
      setLoadError(false)
      return true
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError")
        return false
      setLoadError(true)
      return false
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    Promise.all([
      repository.listProgramsByClient(clientId, controller.signal),
      repository.listGoalsByClient(clientId, controller.signal),
    ])
      .then(([nextPrograms, nextGoals]) => {
        setPrograms(nextPrograms)
        setGoals(nextGoals)
        setLoadError(false)
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return
        setLoadError(true)
      })
    return () => controller.abort()
  }, [clientId, repository])

  return (
    <WorkspaceSection
      connected
      description="Define habilidades, objetivos medibles y protocolos de enseñanza."
      title="Programas de adquisición"
    >
      {loadError ? (
        <div className="md:col-span-2 xl:col-span-3" role="alert">
          <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
            No se pudieron cargar los programas y metas.
          </p>
        </div>
      ) : null}
      <ProgramLifecycleCard clientId={clientId} type="acquisition" />
      <FeatureCard
        accent="blue"
        connection="connected"
        description={`${programs.length} programa(s) activo(s). Agrupa metas por área de intervención.`}
        icon={<BookOpenCheck className="size-5" />}
        title="Programas"
      >
        <FormPreview
          onRetryRefresh={() => load()}
          onSave={async (payload) => {
            const values = programFormSchema.parse(payload)
            await repository.createProgram({
              clientId,
              name: values.name,
              description: values.description,
            })
            return (await load()) ? "saved" : "saved-stale"
          }}
          title="Nuevo programa"
          fields={[
            { name: "name", label: "Nombre del programa" },
            { name: "description", label: "Descripción" },
          ]}
        />
      </FeatureCard>
      <FeatureCard
        accent="emerald"
        connection="connected"
        description={`${goals.length} meta(s) activa(s) con criterio y procedimiento de enseñanza.`}
        icon={<ClipboardCheck className="size-5" />}
        title="Metas de adquisición"
      >
        {programs.length ? (
          <FormPreview
            onRetryRefresh={() => load()}
            onSave={async (payload) => {
              const values = goalFormSchema.parse({
                programId: payload.program_id,
                skillArea: payload.skill_area,
                name: payload.name,
                masteryCriterion: payload.mastery_criterion,
                teachingProcedure: payload.teaching_procedure,
                promptFading: payload.prompt_fading,
                correctResponse: payload.correct_response,
                generalization: payload.generalization,
                maintenance: payload.maintenance,
              })
              await repository.createGoal(toGoalDraft(clientId, values))
              return (await load()) ? "saved" : "saved-stale"
            }}
            title="Nueva meta de adquisición"
            fields={[
              {
                name: "program_id",
                label: "Programa",
                options: programs.map((program) => ({
                  label: program.name,
                  value: program.id,
                })),
              },
              { name: "skill_area", label: "Área de habilidad" },
              { name: "name", label: "Nombre de la meta" },
              { name: "mastery_criterion", label: "Criterio de dominio" },
              {
                name: "teaching_procedure",
                label: "Procedimiento de enseñanza",
              },
              {
                name: "prompt_fading",
                label: "Desvanecimiento de ayudas",
                kind: "textarea",
                optional: true,
              },
              {
                name: "correct_response",
                label: "Respuesta correcta",
                kind: "textarea",
                optional: true,
              },
              {
                name: "generalization",
                label: "Generalización",
                kind: "textarea",
                optional: true,
              },
              {
                name: "maintenance",
                label: "Mantenimiento",
                kind: "textarea",
                optional: true,
              },
            ]}
          />
        ) : (
          <EmptyState text="Crea un programa antes de registrar una meta." />
        )}
      </FeatureCard>
    </WorkspaceSection>
  )
}

function ReductionPanel({ clientId }: { clientId: string }) {
  const repository = useClinicalPlansRepository()
  const [plans, setPlans] = useState<BehaviorPlanSummary[]>([])
  const [loadError, setLoadError] = useState(false)

  const load = async (signal?: AbortSignal) => {
    try {
      setPlans(await repository.listBehaviorPlansByClient(clientId, signal))
      setLoadError(false)
      return true
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError")
        return false
      setLoadError(true)
      return false
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    repository
      .listBehaviorPlansByClient(clientId, controller.signal)
      .then((nextPlans) => {
        setPlans(nextPlans)
        setLoadError(false)
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return
        setLoadError(true)
      })
    return () => controller.abort()
  }, [clientId, repository])

  return (
    <WorkspaceSection
      connected
      description="Documenta conductas observables y estrategias basadas en su función."
      title="Reducción de conductas"
    >
      {loadError ? (
        <div className="md:col-span-2 xl:col-span-3" role="alert">
          <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
            No se pudieron cargar los planes de conducta.
          </p>
        </div>
      ) : null}
      <ProgramLifecycleCard clientId={clientId} type="behavior" />
      <FeatureCard
        accent="rose"
        connection="connected"
        description={`${plans.length} plan(es) activo(s). Cada plan integra conducta, medición y respuesta.`}
        icon={<ShieldAlert className="size-5" />}
        title="Planes de conducta"
      >
        <FormPreview
          onRetryRefresh={() => load()}
          onSave={async (payload) => {
            const values = behaviorPlanFormSchema.parse({
              name: payload.name,
              operationalDefinition: payload.operational_definition,
              measurementUnit: payload.measurement_unit,
              hypothesizedFunction: payload.hypothesized_function,
              antecedentStrategy: payload.antecedent_strategy,
              replacementBehavior: payload.replacement_behavior,
              responseStrategy: payload.response_strategy,
              baseline: payload.baseline,
              baselineSource: payload.baseline_source,
              currentLevel: payload.current_level,
              intensity: payload.intensity,
            })
            await repository.createBehaviorPlan(
              toBehaviorPlanDraft(clientId, values)
            )
            return (await load()) ? "saved" : "saved-stale"
          }}
          title="Nuevo plan de conducta"
          fields={[
            { name: "name", label: "Conducta objetivo" },
            { name: "operational_definition", label: "Definición operacional" },
            {
              name: "measurement_unit",
              label: "Unidad de medición",
              options: [
                { label: "Frecuencia", value: "frequency" },
                { label: "Duración", value: "duration" },
                { label: "Latencia", value: "latency" },
                { label: "Intervalo", value: "interval" },
              ],
            },
            { name: "hypothesized_function", label: "Función hipotética" },
            { name: "antecedent_strategy", label: "Estrategia antecedente" },
            { name: "replacement_behavior", label: "Conducta de reemplazo" },
            { name: "response_strategy", label: "Respuesta del equipo" },
            {
              name: "baseline",
              label: "Línea base",
              kind: "textarea",
              optional: true,
            },
            {
              name: "baseline_source",
              label: "Fuente de línea base",
              optional: true,
            },
            {
              name: "current_level",
              label: "Nivel actual",
              optional: true,
            },
            {
              name: "intensity",
              label: "Intensidad observada",
              optional: true,
            },
          ]}
        />
      </FeatureCard>
      <FeatureCard
        accent="amber"
        connection="connected"
        description="Vista compacta de funciones y estrategias actualmente configuradas."
        icon={<Activity className="size-5" />}
        title="Funciones e intervención"
      >
        {plans.length ? (
          <div className="space-y-2">
            {plans.slice(0, 4).map((plan) => (
              <div
                className="rounded-lg border border-slate-200 p-3 text-sm"
                key={plan.id}
              >
                <p className="font-semibold">{plan.name}</p>
                <p className="mt-1 text-slate-500">
                  {plan.hypothesizedFunction || "Función aún no especificada"}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState text="No hay planes activos registrados." />
        )}
      </FeatureCard>
    </WorkspaceSection>
  )
}

function SessionsPanel({ clientId }: { clientId: string }) {
  const plansRepository = useClinicalPlansRepository()
  const sessionRepository = useClinicalSessionRepository()
  const [plans, setPlans] = useState<BehaviorPlanSummary[]>([])
  const [goals, setGoals] = useState<AcquisitionGoalSummary[]>([])
  const [measurements, setMeasurements] = useState<Record<string, string>>({})
  const [intervalMeasurements, setIntervalMeasurements] = useState<
    Record<string, { observed: string; total: string }>
  >({})
  const [trials, setTrials] = useState<
    Record<string, { correct: number; incorrect: number }>
  >({})
  const [occurredOn, setOccurredOn] = useState(() =>
    dateOnlyInTimeZone(new Date())
  )
  const [notes, setNotes] = useState("")
  const [sessionCount, setSessionCount] = useState(0)
  const [loadError, setLoadError] = useState(false)
  const [saveState, setSaveState] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle")

  useEffect(() => {
    const controller = new AbortController()
    Promise.all([
      plansRepository.listBehaviorPlansByClient(clientId, controller.signal),
      plansRepository.listGoalsByClient(clientId, controller.signal),
      sessionRepository.listByClient(clientId, controller.signal),
    ])
      .then(([nextPlans, nextGoals, sessions]) => {
        setPlans(nextPlans)
        setGoals(nextGoals)
        setSessionCount(sessions.length)
        setLoadError(false)
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return
        setLoadError(true)
      })
    return () => controller.abort()
  }, [clientId, plansRepository, sessionRepository])

  const hasTargets = plans.length + goals.length > 0
  const behaviorMeasurements: CreateBehaviorMeasurementDraft[] = plans.map(
    (plan) => {
      if (plan.measurementUnit === "interval") {
        const interval = intervalMeasurements[plan.id]
        return {
          behaviorPlanId: plan.id,
          measurementUnit: "interval",
          observed: Number(interval?.observed || 0),
          total: Number(interval?.total || 0),
        }
      }
      const value = Number(measurements[plan.id] || 0)
      if (plan.measurementUnit === "frequency")
        return {
          behaviorPlanId: plan.id,
          measurementUnit: "frequency",
          value,
        }
      return {
        behaviorPlanId: plan.id,
        measurementUnit: plan.measurementUnit,
        unit: "seconds",
        value,
      }
    }
  )
  const hasInvalidMeasurements = behaviorMeasurements.some((measurement) => {
    if (measurement.measurementUnit === "interval")
      return (
        !Number.isInteger(measurement.observed) ||
        !Number.isInteger(measurement.total) ||
        measurement.observed < 0 ||
        measurement.total < 0 ||
        measurement.observed > measurement.total
      )
    if (!Number.isFinite(measurement.value) || measurement.value < 0)
      return true
    if (measurement.measurementUnit === "frequency")
      return !Number.isInteger(measurement.value)
    return Math.round(measurement.value * 100) !== measurement.value * 100
  })
  const saveSession = async () => {
    if (!hasTargets || hasInvalidMeasurements || saveState === "saving") return
    setSaveState("saving")
    try {
      await sessionRepository.createAtomic({
        clientId,
        occurredOn,
        notes,
        behaviorMeasurements,
        acquisitionTrials: goals.map((goal) => ({
          goalId: goal.id,
          correct: trials[goal.id]?.correct ?? 0,
          incorrect: trials[goal.id]?.incorrect ?? 0,
        })),
      })
      setMeasurements({})
      setIntervalMeasurements({})
      setTrials({})
      setNotes("")
      setSessionCount((value) => value + 1)
      setSaveState("saved")
    } catch {
      setSaveState("error")
    }
  }

  return (
    <div className="space-y-5">
      <ConstructionNotice connected />
      <div>
        <h2 className="text-xl font-bold">Registro de sesión</h2>
        <p className="mt-1 text-sm text-slate-500">
          Captura atómica: la cabecera, mediciones y ensayos se guardan juntos o
          no se guarda nada. {sessionCount} sesión(es) registrada(s).
        </p>
      </div>
      {loadError ? (
        <p
          className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700"
          role="alert"
        >
          No se pudieron cargar los objetivos de la sesión.
        </p>
      ) : null}
      <Card>
        <CardContent className="grid gap-4 pt-6 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="session-date">Fecha de sesión</Label>
            <Input
              id="session-date"
              max={dateOnlyInTimeZone(new Date())}
              onChange={(event) => setOccurredOn(event.target.value)}
              type="date"
              value={occurredOn}
            />
          </div>
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="session-notes">Notas de sesión</Label>
            <textarea
              className="min-h-24 rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              id="session-notes"
              maxLength={4000}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Sólo información sintética"
              value={notes}
            />
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-t-4 border-t-rose-500">
          <CardHeader>
            <CardTitle>Conductas a disminuir</CardTitle>
            <CardDescription>
              Valor observado según la unidad configurada en cada plan.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {plans.length ? (
              plans.map((plan) => (
                <div
                  className="grid gap-3 rounded-xl bg-rose-50 p-4 sm:grid-cols-[1fr_auto] sm:items-center"
                  key={plan.id}
                >
                  <div>
                    <p className="font-semibold">{plan.name}</p>
                    <p className="text-xs text-rose-700">
                      {plan.measurementUnit === "frequency"
                        ? "ocurrencias"
                        : plan.measurementUnit === "interval"
                          ? "intervalos observados / total"
                          : "segundos"}
                    </p>
                  </div>
                  {plan.measurementUnit === "frequency" ? (
                    <div className="flex items-center gap-3">
                      <Button
                        aria-label={`Disminuir ${plan.name}`}
                        onClick={() =>
                          setMeasurements((values) => ({
                            ...values,
                            [plan.id]: String(
                              Math.max(0, Number(values[plan.id] || 0) - 1)
                            ),
                          }))
                        }
                        size="icon-sm"
                        variant="outline"
                      >
                        <Minus />
                      </Button>
                      <strong className="w-8 text-center text-2xl">
                        {measurements[plan.id] || "0"}
                      </strong>
                      <Button
                        aria-label={`Aumentar ${plan.name}`}
                        onClick={() =>
                          setMeasurements((values) => ({
                            ...values,
                            [plan.id]: String(Number(values[plan.id] || 0) + 1),
                          }))
                        }
                        size="icon-sm"
                      >
                        <Plus />
                      </Button>
                    </div>
                  ) : plan.measurementUnit === "interval" ? (
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        aria-label={`Intervalos observados de ${plan.name}`}
                        min={0}
                        onChange={(event) =>
                          setIntervalMeasurements((values) => ({
                            ...values,
                            [plan.id]: {
                              observed: event.target.value,
                              total: values[plan.id]?.total ?? "",
                            },
                          }))
                        }
                        placeholder="Observados"
                        step={1}
                        type="number"
                        value={intervalMeasurements[plan.id]?.observed ?? ""}
                      />
                      <Input
                        aria-label={`Intervalos totales de ${plan.name}`}
                        min={0}
                        onChange={(event) =>
                          setIntervalMeasurements((values) => ({
                            ...values,
                            [plan.id]: {
                              observed: values[plan.id]?.observed ?? "",
                              total: event.target.value,
                            },
                          }))
                        }
                        placeholder="Total"
                        step={1}
                        type="number"
                        value={intervalMeasurements[plan.id]?.total ?? ""}
                      />
                      <p className="col-span-2 text-right text-xs text-rose-700">
                        {Number(intervalMeasurements[plan.id]?.total || 0) > 0
                          ? `${Math.round((Number(intervalMeasurements[plan.id]?.observed || 0) / Number(intervalMeasurements[plan.id]?.total)) * 100)}% observado`
                          : "0% observado"}
                      </p>
                    </div>
                  ) : (
                    <Input
                      aria-label={`${plan.name} en segundos`}
                      className="w-36"
                      min={0}
                      onChange={(event) =>
                        setMeasurements((values) => ({
                          ...values,
                          [plan.id]: event.target.value,
                        }))
                      }
                      placeholder="0.00"
                      step="0.01"
                      type="number"
                      value={measurements[plan.id] ?? ""}
                    />
                  )}
                </div>
              ))
            ) : (
              <EmptyState text="Crea un plan de conducta para habilitar mediciones." />
            )}
          </CardContent>
        </Card>
        <Card className="border-t-4 border-t-blue-500">
          <CardHeader>
            <CardTitle>Metas en adquisición</CardTitle>
            <CardDescription>Ensayos correctos e incorrectos.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {goals.length ? (
              goals.map((goal) => (
                <div
                  className="space-y-3 rounded-xl border border-blue-100 p-4"
                  key={goal.id}
                >
                  <p className="font-semibold">{goal.name}</p>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      className="bg-emerald-600 hover:bg-emerald-700"
                      onClick={() =>
                        setTrials((values) => ({
                          ...values,
                          [goal.id]: {
                            correct: (values[goal.id]?.correct ?? 0) + 1,
                            incorrect: values[goal.id]?.incorrect ?? 0,
                          },
                        }))
                      }
                    >
                      Correcto · {trials[goal.id]?.correct ?? 0}
                    </Button>
                    <Button
                      className="bg-rose-600 hover:bg-rose-700"
                      onClick={() =>
                        setTrials((values) => ({
                          ...values,
                          [goal.id]: {
                            correct: values[goal.id]?.correct ?? 0,
                            incorrect: (values[goal.id]?.incorrect ?? 0) + 1,
                          },
                        }))
                      }
                    >
                      Incorrecto · {trials[goal.id]?.incorrect ?? 0}
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState text="Crea una meta de adquisición para habilitar ensayos." />
            )}
          </CardContent>
        </Card>
      </div>
      {saveState === "saved" ? (
        <p
          className="rounded-lg bg-emerald-50 p-3 text-sm font-medium text-emerald-700"
          role="status"
        >
          Sesión sintética guardada de forma atómica.
        </p>
      ) : null}
      {saveState === "error" ? (
        <p
          className="rounded-lg bg-rose-50 p-3 text-sm font-medium text-rose-700"
          role="alert"
        >
          No se guardó ninguna parte de la sesión. Puedes reintentar sin perder
          los valores.
        </p>
      ) : null}
      {hasInvalidMeasurements ? (
        <p
          className="rounded-lg bg-rose-50 p-3 text-sm font-medium text-rose-700"
          role="alert"
        >
          Los intervalos observados no pueden superar el total.
        </p>
      ) : null}
      <div className="flex justify-end">
        <Button
          disabled={
            !hasTargets ||
            hasInvalidMeasurements ||
            saveState === "saving" ||
            !occurredOn
          }
          onClick={saveSession}
        >
          {saveState === "saving" ? "Guardando sesión…" : "Guardar sesión"}
        </Button>
      </div>
    </div>
  )
}

function WorkspaceSection({
  children,
  connected = false,
  description,
  title,
}: {
  children: ReactNode
  connected?: boolean
  description: string
  title: string
}) {
  return (
    <div className="space-y-5">
      <ConstructionNotice connected={connected} />
      <div>
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{children}</div>
    </div>
  )
}

function ConstructionNotice({
  connected = false,
  simulation = false,
}: {
  connected?: boolean
  simulation?: boolean
}) {
  return (
    <div
      className={`flex gap-3 rounded-xl border p-4 text-sm ${connected ? "border-emerald-200 bg-emerald-50 text-emerald-950" : "border-amber-200 bg-amber-50 text-amber-950"}`}
    >
      <ShieldAlert className="mt-0.5 size-5 shrink-0" />
      <div>
        <p className="font-semibold">
          {connected ? "Conectado a staging" : "Vista en construcción"}
        </p>
        <p>
          {connected
            ? "Los borradores sintéticos de esta área se guardan en Supabase con RLS."
            : simulation
              ? "Simulación visual: los valores se reinician al recargar y aún no se guardan."
              : "Los formularios permiten revisar el flujo, pero aún no guardan información clínica."}
        </p>
      </div>
    </div>
  )
}

function FeatureCard({
  accent,
  children,
  connection,
  description,
  icon,
  title,
}: {
  accent: "amber" | "blue" | "emerald" | "rose" | "violet"
  children: ReactNode
  connection: ConnectionState
  description: string
  icon: ReactNode
  title: string
}) {
  const colors = {
    amber: "bg-amber-50 text-amber-700",
    blue: "bg-blue-50 text-blue-700",
    emerald: "bg-emerald-50 text-emerald-700",
    rose: "bg-rose-50 text-rose-700",
    violet: "bg-violet-50 text-violet-700",
  }
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div
            className={`grid size-10 place-items-center rounded-xl ${colors[accent]}`}
          >
            {icon}
          </div>
          <ConnectionBadge
            label={
              connection === "connected"
                ? "Conectado"
                : connection === "contract-ready"
                  ? "Contrato listo"
                  : "Esquema pendiente"
            }
            tone={connection === "connected" ? "green" : "blue"}
          />
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

type FormPreviewField =
  | string
  | {
      name: string
      label: string
      kind?: "date" | "file" | "textarea"
      optional?: boolean
      options?: Array<{ label: string; value: string }>
    }

function FormPreview({
  fields,
  onRetryRefresh,
  onSave,
  title,
}: {
  fields: FormPreviewField[]
  onRetryRefresh?: () => Promise<boolean>
  onSave?: (payload: Record<string, string>) => Promise<"saved" | "saved-stale">
  title: string
}) {
  const [saveState, setSaveState] = useState<
    "idle" | "saving" | "saved" | "saved-stale" | "error"
  >("idle")
  const normalizedFields = fields.map((field) =>
    typeof field === "string"
      ? { name: field.toLowerCase().replaceAll(" ", "_"), label: field }
      : field
  )

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!onSave) return
    const form = event.currentTarget
    setSaveState("saving")
    const values = Object.fromEntries(
      [...new FormData(form).entries()].filter(
        ([, value]) => !(value instanceof File)
      )
    )
    try {
      const outcome = await onSave(
        Object.fromEntries(
          Object.entries(values).map(([key, value]) => [key, String(value)])
        )
      )
      setSaveState(outcome)
      form.reset()
    } catch {
      setSaveState("error")
    }
  }

  const retryRefresh = async () => {
    if (!onRetryRefresh || saveState === "saving") return
    setSaveState("saving")
    setSaveState((await onRetryRefresh()) ? "saved" : "saved-stale")
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full" variant="outline">
          Ver formulario de {title}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85svh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {onSave
              ? "Borrador conectado a Supabase staging. Usa solamente información sintética."
              : "Borrador frontend utilizable. Los valores no se guardan todavía en Supabase."}
          </DialogDescription>
        </DialogHeader>
        <div
          className={`rounded-lg border px-3 py-2 text-xs ${onSave ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-blue-200 bg-blue-50 text-blue-800"}`}
        >
          {onSave
            ? "Conectado · guardado con RLS"
            : "Contrato visual listo · repositorio pendiente"}
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4 sm:grid-cols-2">
            {normalizedFields.map((field, index) => (
              <div
                className={`grid gap-2 ${index === normalizedFields.length - 1 ? "sm:col-span-2" : ""}`}
                key={field.name}
              >
                <Label htmlFor={`preview-${title}-${field.name}`}>
                  {field.label}
                  {field.optional ? " (opcional)" : ""}
                </Label>
                {field.options ? (
                  <select
                    className="h-9 rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                    id={`preview-${title}-${field.name}`}
                    name={field.name}
                    required={!field.optional}
                  >
                    <option value="">Selecciona una opción</option>
                    {field.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : field.kind === "file" ? (
                  <div className="grid gap-2">
                    <Input
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      id={`preview-${title}-${field.name}`}
                      name={field.name}
                      type="file"
                    />
                    <p className="text-xs text-amber-700">
                      El adjunto no se carga ni se guarda todavía. La
                      persistencia en Storage está pendiente.
                    </p>
                  </div>
                ) : field.kind === "textarea" ||
                  index === normalizedFields.length - 1 ? (
                  <textarea
                    className="min-h-24 rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                    id={`preview-${title}-${field.name}`}
                    name={field.name}
                    placeholder="Escribe una nota sintética…"
                    required={!field.optional}
                  />
                ) : (
                  <Input
                    autoComplete="off"
                    id={`preview-${title}-${field.name}`}
                    name={field.name}
                    placeholder="Dato sintético"
                    required={!field.optional}
                    type={field.kind === "date" ? "date" : "text"}
                  />
                )}
              </div>
            ))}
          </div>
          {saveState === "saved" ? (
            <p
              className="mb-3 text-sm font-medium text-emerald-700"
              role="status"
            >
              Borrador sintético guardado.
            </p>
          ) : null}
          {saveState === "saved-stale" ? (
            <div
              className="mb-3 flex flex-wrap items-center gap-2"
              role="status"
            >
              <p className="text-sm font-medium text-amber-700">
                El borrador se guardó, pero no pudimos actualizar la lista.
              </p>
              {onRetryRefresh ? (
                <Button
                  onClick={retryRefresh}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  Reintentar actualización
                </Button>
              ) : null}
            </div>
          ) : null}
          {saveState === "error" ? (
            <p className="mb-3 text-sm font-medium text-rose-700" role="alert">
              No pudimos guardar el borrador.
            </p>
          ) : null}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cerrar borrador
              </Button>
            </DialogClose>
            {onSave ? (
              <Button disabled={saveState === "saving"} type="submit">
                {saveState === "saving" ? "Guardando…" : "Guardar borrador"}
              </Button>
            ) : null}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 font-medium">{value}</p>
    </div>
  )
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center text-sm text-slate-500">
      {text}
    </div>
  )
}

function PeopleGroup({
  empty,
  people,
  title,
}: {
  empty: string
  people: ClientDetail["guardians"]
  title: string
}) {
  return (
    <div>
      <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
        {title}
      </p>
      {people.length ? (
        <div className="mt-2 flex flex-wrap gap-2">
          {people.map((person) => (
            <span
              className="rounded-lg bg-slate-100 px-3 py-2 text-sm"
              key={person.id}
            >
              <strong>{person.initials}</strong>
              {person.birthDate ? (
                <span className="ml-2 text-slate-500">{person.birthDate}</span>
              ) : null}
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-1 text-sm text-slate-500">{empty}</p>
      )}
    </div>
  )
}

function ConnectionBadge({
  label,
  tone = "green",
}: {
  label: string
  tone?: "blue" | "green"
}) {
  return (
    <span
      className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${tone === "green" ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : "bg-blue-50 text-blue-700 ring-blue-200"}`}
    >
      {label}
    </span>
  )
}

function DetailMessage({
  onRetry,
  title,
}: {
  onRetry?: () => void
  title: string
}) {
  return (
    <div className="grid min-h-72 place-items-center text-center">
      <div>
        <h1 className="text-xl font-bold">{title}</h1>
        {onRetry ? (
          <Button className="mt-4" onClick={onRetry} variant="outline">
            Reintentar
          </Button>
        ) : null}
        <Button asChild className="mt-4">
          <Link to="/clientes">Volver a clientes</Link>
        </Button>
      </div>
    </div>
  )
}
