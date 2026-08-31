import { useEffect, useState, type FormEvent } from "react"

import { useAuth } from "@/auth/auth-context"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useClinicalPlansRepository } from "@/features/clinical/clinical-plans-repository-context"
import type { VersionedProgramSummary } from "@/features/clinical/clinical-plans-repository-contract"
import type {
  ProgramDesign,
  ProgramStatus,
  ProgramType,
} from "@/features/clinical/program-lifecycle"
import { useStudentRecordRepository } from "@/features/clinical/student-record/student-record-repository-context"

const statusLabel: Record<ProgramStatus, string> = {
  draft: "Borrador",
  active: "Activo",
  paused: "Pausado",
  achieved: "Logrado",
  discontinued: "Descontinuado",
}

const lines = (value: FormDataEntryValue | null) =>
  String(value ?? "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean)

function text(data: FormData, name: string) {
  return String(data.get(name) ?? "").trim()
}

function nullable(value: string) {
  return value || null
}

function designFromForm(type: ProgramType, data: FormData): ProgramDesign {
  if (type === "acquisition") {
    const sets = lines(data.get("sets")).map((line) => {
      const [name, items = ""] = line.split(":", 2)
      return {
        name: name.trim(),
        items: items
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      }
    })
    return {
      kind: "acquisition",
      goal: text(data, "goal"),
      skillArea: text(data, "skillArea"),
      antecedent: text(data, "antecedent"),
      steps: lines(data.get("steps")),
      teachingProcedure: text(data, "teachingProcedure"),
      sets,
      promptLevels: lines(data.get("promptLevels")),
      errorCorrection: text(data, "errorCorrection"),
      masteryCriterion: text(data, "masteryCriterion"),
      generalization: nullable(text(data, "generalization")),
      maintenance: nullable(text(data, "maintenance")),
    }
  }
  return {
    kind: "behavior",
    topography: text(data, "topography"),
    operationalDefinition: text(data, "operationalDefinition"),
    hypothesizedFunction: text(data, "hypothesizedFunction"),
    precursors: lines(data.get("precursors")),
    replacementBehavior: text(data, "replacementBehavior"),
    measurementUnit: text(data, "measurementUnit") as
      "frequency" | "duration" | "latency" | "interval",
    preventionStrategy: text(data, "preventionStrategy"),
    responseStrategy: text(data, "responseStrategy"),
    crisisPlan: nullable(text(data, "crisisPlan")),
    masteryCriterion: text(data, "masteryCriterion"),
  }
}

function textareaDefault(design: ProgramDesign | undefined, field: string) {
  if (!design) return ""
  const value = design[field as keyof ProgramDesign]
  if (Array.isArray(value)) {
    if (field === "sets")
      return (value as Array<{ name: string; items: string[] }>)
        .map((set) => `${set.name}: ${set.items.join(", ")}`)
        .join("\n")
    return (value as string[]).join("\n")
  }
  return typeof value === "string" ? value : ""
}

export function ProgramLifecycleCard({
  clientId,
  type,
}: {
  clientId: string
  type: ProgramType
}) {
  const repository = useClinicalPlansRepository()
  const accessRepository = useStudentRecordRepository()
  const { identity } = useAuth()
  const [programs, setPrograms] = useState<VersionedProgramSummary[]>([])
  const [canEdit, setCanEdit] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [editing, setEditing] = useState<{
    programId?: string
    versionId?: string
    title: string
    design?: ProgramDesign
  } | null>(null)
  const [saving, setSaving] = useState(false)

  const supported = Boolean(repository.listVersionedProgramsByClient)

  const load = async (signal?: AbortSignal) => {
    if (!repository.listVersionedProgramsByClient || !identity) return
    try {
      const [nextPrograms, access] = await Promise.all([
        repository.listVersionedProgramsByClient(clientId, signal),
        accessRepository.loadAccess(clientId, identity.id, signal),
      ])
      setPrograms(nextPrograms.filter((program) => program.type === type))
      setCanEdit(access.capabilities.includes("program.edit"))
      setError(false)
    } catch (cause) {
      if (cause instanceof DOMException && cause.name === "AbortError") return
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!repository.listVersionedProgramsByClient || !identity) return
    const controller = new AbortController()
    Promise.all([
      repository.listVersionedProgramsByClient(clientId, controller.signal),
      accessRepository.loadAccess(clientId, identity.id, controller.signal),
    ])
      .then(([nextPrograms, access]) => {
        setPrograms(nextPrograms.filter((program) => program.type === type))
        setCanEdit(access.capabilities.includes("program.edit"))
        setError(false)
      })
      .catch((cause: unknown) => {
        if (cause instanceof DOMException && cause.name === "AbortError") return
        setError(true)
      })
      .finally(() => setLoading(false))
    return () => controller.abort()
  }, [accessRepository, clientId, identity, repository, type])

  if (!supported) return null

  const transition = async (
    program: VersionedProgramSummary,
    nextStatus: Exclude<ProgramStatus, "draft">,
    publishDraft = false
  ) => {
    if (!repository.transitionVersionedProgram) return
    setSaving(true)
    try {
      await repository.transitionVersionedProgram({
        programId: program.id,
        ...(publishDraft && program.draftVersion
          ? { versionId: program.draftVersion.id }
          : {}),
        nextStatus,
      })
      await load()
    } catch {
      setError(true)
    } finally {
      setSaving(false)
    }
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!editing || !repository.createVersionedProgramDraft) return
    const data = new FormData(event.currentTarget)
    const title = text(data, "title")
    const design = designFromForm(type, data)
    setSaving(true)
    try {
      if (editing.versionId && repository.updateVersionedProgramDraft) {
        await repository.updateVersionedProgramDraft({
          versionId: editing.versionId,
          title,
          design,
        })
      } else {
        await repository.createVersionedProgramDraft({
          clientId,
          type,
          title,
          design,
        })
      }
      setEditing(null)
      await load()
    } catch {
      setError(true)
    } finally {
      setSaving(false)
    }
  }

  const startSuccessor = async (program: VersionedProgramSummary) => {
    if (!program.currentVersion || !repository.createVersionedProgramSuccessor)
      return
    setSaving(true)
    try {
      const draft = await repository.createVersionedProgramSuccessor({
        versionId: program.currentVersion.id,
        title: program.currentVersion.title,
        design: program.currentVersion.design,
      })
      if (draft)
        setEditing({
          programId: program.id,
          versionId: draft.id,
          title: draft.title,
          design: draft.design,
        })
      await load()
    } catch {
      setError(true)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="md:col-span-2 xl:col-span-3">
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle>Ciclo de vida versionado</CardTitle>
            <CardDescription>
              {type === "acquisition" ? "Adquisición" : "Conducta"}: borrador,
              activación, pausa, logro y discontinuación sin borrar historia.
            </CardDescription>
          </div>
          {canEdit && !editing ? (
            <Button
              onClick={() => setEditing({ title: "" })}
              size="sm"
              type="button"
            >
              Nuevo programa versionado
            </Button>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? <p role="status">Cargando programas versionados…</p> : null}
        {error ? (
          <p className="text-sm text-rose-700" role="alert">
            No pudimos completar la operación del programa. Los valores se
            conservaron.
          </p>
        ) : null}
        {!loading && programs.length === 0 ? (
          <p className="text-sm text-slate-500">Sin programas versionados.</p>
        ) : null}
        <div className="grid gap-3 sm:grid-cols-2">
          {programs.map((program) => {
            const shown = program.draftVersion ?? program.currentVersion
            return (
              <article
                className="rounded-xl border border-slate-200 p-4"
                key={program.id}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-semibold">
                      {shown?.title ?? "Programa sin versión"}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {statusLabel[program.status]} · versión{" "}
                      {shown?.version ?? "—"}
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium">
                    {statusLabel[program.status]}
                  </span>
                </div>
                {canEdit ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {program.draftVersion ? (
                      <>
                        <Button
                          onClick={() =>
                            setEditing({
                              programId: program.id,
                              versionId: program.draftVersion?.id,
                              title: program.draftVersion?.title ?? "",
                              design: program.draftVersion?.design,
                            })
                          }
                          size="xs"
                          type="button"
                          variant="outline"
                        >
                          Editar borrador
                        </Button>
                        {program.status === "draft" ? (
                          <Button
                            disabled={saving}
                            onClick={() => transition(program, "active", true)}
                            size="xs"
                            type="button"
                          >
                            Activar
                          </Button>
                        ) : null}
                        {program.status === "active" ||
                        program.status === "paused" ? (
                          <Button
                            disabled={saving}
                            onClick={() => transition(program, "active", true)}
                            size="xs"
                            type="button"
                          >
                            Publicar versión
                          </Button>
                        ) : null}
                      </>
                    ) : null}
                    {program.status === "active" ? (
                      <>
                        <Button
                          onClick={() => transition(program, "paused")}
                          size="xs"
                          type="button"
                          variant="outline"
                        >
                          Pausar
                        </Button>
                        {!program.draftVersion ? (
                          <Button
                            onClick={() => startSuccessor(program)}
                            size="xs"
                            type="button"
                            variant="outline"
                          >
                            Nueva versión
                          </Button>
                        ) : null}
                        <Button
                          onClick={() => transition(program, "achieved")}
                          size="xs"
                          type="button"
                          variant="outline"
                        >
                          Marcar logrado
                        </Button>
                        <Button
                          onClick={() => transition(program, "discontinued")}
                          size="xs"
                          type="button"
                          variant="destructive"
                        >
                          Descontinuar
                        </Button>
                      </>
                    ) : null}
                    {program.status === "paused" ? (
                      <>
                        <Button
                          onClick={() => transition(program, "active")}
                          size="xs"
                          type="button"
                        >
                          Reactivar
                        </Button>
                        {!program.draftVersion ? (
                          <Button
                            onClick={() => startSuccessor(program)}
                            size="xs"
                            type="button"
                            variant="outline"
                          >
                            Nueva versión
                          </Button>
                        ) : null}
                        <Button
                          onClick={() => transition(program, "discontinued")}
                          size="xs"
                          type="button"
                          variant="destructive"
                        >
                          Descontinuar
                        </Button>
                      </>
                    ) : null}
                  </div>
                ) : null}
              </article>
            )
          })}
        </div>
        {editing ? (
          <ProgramDraftForm
            design={editing.design}
            disabled={saving}
            key={editing.versionId ?? "new"}
            onCancel={() => setEditing(null)}
            onSubmit={submit}
            title={editing.title}
            type={type}
          />
        ) : null}
      </CardContent>
    </Card>
  )
}

function ProgramDraftForm({
  design,
  disabled,
  onCancel,
  onSubmit,
  title,
  type,
}: {
  design?: ProgramDesign
  disabled: boolean
  onCancel: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  title: string
  type: ProgramType
}) {
  const field = (name: string, label: string, required = true) => (
    <div className="space-y-1">
      <Label htmlFor={`program-${type}-${name}`}>{label}</Label>
      <Input
        defaultValue={name === "title" ? title : textareaDefault(design, name)}
        id={`program-${type}-${name}`}
        name={name}
        required={required}
      />
    </div>
  )
  const area = (name: string, label: string, required = true) => (
    <div className="space-y-1 sm:col-span-2">
      <Label htmlFor={`program-${type}-${name}`}>{label}</Label>
      <textarea
        className="min-h-20 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
        defaultValue={textareaDefault(design, name)}
        id={`program-${type}-${name}`}
        name={name}
        required={required}
      />
    </div>
  )
  return (
    <form
      className="grid gap-3 rounded-xl border border-blue-200 bg-blue-50/40 p-4 sm:grid-cols-2"
      onSubmit={onSubmit}
    >
      <h4 className="font-semibold sm:col-span-2">Diseño del programa</h4>
      {field("title", "Nombre del programa")}
      {type === "acquisition" ? (
        <>
          {field("skillArea", "Área de habilidad")}
          {area("goal", "Objetivo")}
          {area("antecedent", "Antecedente")}
          {area("steps", "Pasos (uno por línea)")}
          {area("teachingProcedure", "Procedimiento de enseñanza")}
          {area("sets", "Sets (Set: ítem 1, ítem 2)")}
          {area("promptLevels", "Niveles de ayuda (uno por línea)")}
          {area("errorCorrection", "Corrección de error")}
          {area("masteryCriterion", "Criterio de logro")}
          {area("generalization", "Generalización", false)}
          {area("maintenance", "Mantención", false)}
        </>
      ) : (
        <>
          {field(
            "measurementUnit",
            "Dimensión: frequency, duration, latency o interval"
          )}
          {area("topography", "Topografía")}
          {area("operationalDefinition", "Definición operacional")}
          {area("hypothesizedFunction", "Función hipotética")}
          {area("precursors", "Conductas precursoras (una por línea)", false)}
          {area("replacementBehavior", "Conducta de reemplazo")}
          {area("preventionStrategy", "Prevención")}
          {area("responseStrategy", "Respuesta")}
          {area("crisisPlan", "Plan de crisis informativo", false)}
          {area("masteryCriterion", "Criterio de logro")}
          <p className="text-xs text-amber-800 sm:col-span-2">
            El plan de crisis es informativo y no sustituye un protocolo de
            emergencia.
          </p>
        </>
      )}
      <div className="flex gap-2 sm:col-span-2">
        <Button disabled={disabled} type="submit">
          Guardar borrador versionado
        </Button>
        <Button onClick={onCancel} type="button" variant="outline">
          Cancelar
        </Button>
      </div>
    </form>
  )
}
