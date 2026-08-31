import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Trash2 } from "lucide-react"
import { useState } from "react"
import {
  useFieldArray,
  useForm,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form"

import { Button } from "@/components/ui/button"
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
import {
  clinicalHistoryDraftSchema,
  type ClinicalHistoryFormValues,
} from "@/features/clinical/forms/clinical-draft-contracts"
import type { AppendHistoryDraft } from "@/features/clinical/student-record/student-record-repository-contract"
import { useStudentRecordRepository } from "@/features/clinical/student-record/student-record-repository-context"

let nextDraftRow = 0
const createUiId = (kind: string) => `${kind}-${++nextDraftRow}`
const today = () => new Date().toISOString().slice(0, 10)

function hasValues(row: Record<string, string>) {
  return Object.entries(row).some(([key, value]) => key !== "uiId" && value.trim())
}

function collectMessages(value: unknown, seen = new WeakSet<object>()): string[] {
  if (!value || typeof value !== "object") return []
  if (seen.has(value)) return []
  seen.add(value)
  const record = value as Record<string, unknown>
  const own = typeof record.message === "string" ? [record.message] : []
  return own.concat(
    Object.entries(record)
      .filter(([key]) => key !== "ref")
      .flatMap(([, child]) => collectMessages(child, seen))
  )
}

const emptyHistory: ClinicalHistoryFormValues = { diagnoses: [], historicalAssessments: [], procedures: [], medications: [] }

export function ClinicalHistoryFormDialog({ clientId, onSaved }: { clientId: string; onSaved: () => void }) {
  const [open, setOpen] = useState(false)
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle")
  const [validationMessages, setValidationMessages] = useState<string[]>([])
  const repository = useStudentRecordRepository()
  const {
    control,
    getValues,
    handleSubmit,
    register,
    reset,
  } = useForm<ClinicalHistoryFormValues>({
    resolver: zodResolver(clinicalHistoryDraftSchema),
    defaultValues: emptyHistory,
  })
  const diagnoses = useFieldArray({ control, name: "diagnoses" })
  const assessments = useFieldArray({ control, name: "historicalAssessments" })
  const procedures = useFieldArray({ control, name: "procedures" })
  const medications = useFieldArray({ control, name: "medications" })

  const changeOpen = (nextOpen: boolean) => {
    setOpen(nextOpen)
    if (nextOpen) {
      reset(emptyHistory)
      setSaveState("idle")
      setValidationMessages([])
    }
  }

  const submit = handleSubmit(
    async (values) => {
      const entries: AppendHistoryDraft[] = [
        ...values.diagnoses.map((row) => ({ clientId, kind: "reported_diagnosis" as const, descriptor: row.label, ...(row.occurredOn ? { occurredOn: row.occurredOn } : {}) })),
        ...values.historicalAssessments.map((row) => ({ clientId, kind: "assessment" as const, descriptor: row.name, ...(row.occurredOn ? { occurredOn: row.occurredOn } : {}) })),
        ...values.procedures.map((row) => ({ clientId, kind: "procedure" as const, descriptor: row.procedure, ...(row.occurredOn ? { occurredOn: row.occurredOn } : {}) })),
        ...values.medications.map((row) => ({
          clientId, kind: "medication" as const, descriptor: row.name,
          ...(row.dose ? { dose: row.dose } : {}),
          ...(row.prescriberDescriptor ? { prescriberDescriptor: row.prescriberDescriptor } : {}),
          ...(row.startedOn ? { startedOn: row.startedOn } : {}),
          ...(row.endedOn ? { endedOn: row.endedOn } : {}),
        })),
      ]
      if (entries.length === 0) {
        setValidationMessages(["Añade al menos una entrada sintética"])
        return
      }
      setSaveState("saving")
      try {
        await repository.appendHistoryEntries(clientId, entries)
        setValidationMessages([])
        setSaveState("saved")
        reset(emptyHistory)
        onSaved()
      } catch {
        setSaveState("error")
      }
    },
    (errors: FieldErrors<ClinicalHistoryFormValues>) => {
      setSaveState("idle")
      setValidationMessages([...new Set(collectMessages(errors))])
    }
  )

  const confirmRemove = (row: Record<string, string>) =>
    !hasValues(row) ||
    window.confirm("Esta fila contiene valores. ¿Quieres quitarla del borrador temporal?")

  return (
    <Dialog onOpenChange={changeOpen} open={open}>
      <DialogTrigger asChild>
        <Button aria-label="Ver formulario de Historia clínica" variant="outline">
          Ver formulario de historia
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Historia clínica estructurada</DialogTitle>
          <DialogDescription>
            Registra sólo descriptores sintéticos. Las entradas se anexan de forma atómica y no se borran.
          </DialogDescription>
        </DialogHeader>
        <p className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-900">
          Historial persistente · sin sobrescritura ni borrado
        </p>
        <form onChange={() => setSaveState("idle")} onSubmit={submit}>
          {validationMessages.length ? (
            <div className="mb-4 rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800" role="alert">
              {validationMessages.join(". ")}
            </div>
          ) : null}
          <div className="space-y-6 py-4">
            <RepeatableHeading
              action="Añadir diagnóstico"
              onAdd={() => diagnoses.append({ uiId: createUiId("diagnosis"), label: "", occurredOn: "" })}
              title="Diagnósticos"
            />
            {diagnoses.fields.length === 0 ? <EmptyRows /> : null}
            {diagnoses.fields.map((field, index) => (
              <fieldset className="grid gap-3 rounded-xl border p-4 sm:grid-cols-[1fr_12rem_auto]" key={field.id}>
                <legend className="sr-only">Diagnóstico {index + 1}</legend>
                <input type="hidden" {...register(`diagnoses.${index}.uiId`)} />
                <TextField
                  id={`diagnosis-label-${field.id}`}
                  label={`Descriptor del diagnóstico ${index + 1}`}
                  maxLength={200}
                  register={register(`diagnoses.${index}.label`)}
                />
                <DateField
                  id={`diagnosis-date-${field.id}`}
                  label={`Fecha del diagnóstico ${index + 1}`}
                  register={register(`diagnoses.${index}.occurredOn`)}
                />
                <RemoveButton
                  label={`Quitar diagnóstico ${index + 1}`}
                  onRemove={() => {
                    const row = getValues(`diagnoses.${index}`)
                    if (confirmRemove(row)) diagnoses.remove(index)
                  }}
                />
              </fieldset>
            ))}

            <RepeatableHeading
              action="Añadir evaluación histórica"
              onAdd={() => assessments.append({ uiId: createUiId("assessment"), name: "", occurredOn: "" })}
              title="Evaluaciones históricas"
            />
            {assessments.fields.length === 0 ? <EmptyRows /> : null}
            {assessments.fields.map((field, index) => (
              <fieldset className="grid gap-3 rounded-xl border p-4 sm:grid-cols-[1fr_12rem_auto]" key={field.id}>
                <legend className="sr-only">Evaluación histórica {index + 1}</legend>
                <input type="hidden" {...register(`historicalAssessments.${index}.uiId`)} />
                <TextField
                  id={`assessment-name-${field.id}`}
                  label={`Nombre de la evaluación ${index + 1}`}
                  maxLength={200}
                  register={register(`historicalAssessments.${index}.name`)}
                />
                <DateField
                  id={`assessment-date-${field.id}`}
                  label={`Fecha de la evaluación ${index + 1}`}
                  register={register(`historicalAssessments.${index}.occurredOn`)}
                />
                <RemoveButton
                  label={`Quitar evaluación ${index + 1}`}
                  onRemove={() => {
                    const row = getValues(`historicalAssessments.${index}`)
                    if (confirmRemove(row)) assessments.remove(index)
                  }}
                />
              </fieldset>
            ))}

            <RepeatableHeading
              action="Añadir procedimiento"
              onAdd={() => procedures.append({ uiId: createUiId("procedure"), procedure: "", occurredOn: "" })}
              title="Operaciones y procedimientos"
            />
            {procedures.fields.length === 0 ? <EmptyRows /> : null}
            {procedures.fields.map((field, index) => (
              <fieldset className="grid gap-3 rounded-xl border p-4 sm:grid-cols-[1fr_12rem_auto]" key={field.id}>
                <legend className="sr-only">Procedimiento {index + 1}</legend>
                <input type="hidden" {...register(`procedures.${index}.uiId`)} />
                <TextField
                  id={`procedure-name-${field.id}`}
                  label={`Procedimiento ${index + 1}`}
                  maxLength={200}
                  register={register(`procedures.${index}.procedure`)}
                />
                <DateField
                  id={`procedure-date-${field.id}`}
                  label={`Fecha del procedimiento ${index + 1}`}
                  register={register(`procedures.${index}.occurredOn`)}
                />
                <RemoveButton
                  label={`Quitar procedimiento ${index + 1}`}
                  onRemove={() => {
                    const row = getValues(`procedures.${index}`)
                    if (confirmRemove(row)) procedures.remove(index)
                  }}
                />
              </fieldset>
            ))}

            <RepeatableHeading
              action="Añadir medicamento"
              onAdd={() => medications.append({
                uiId: createUiId("medication"),
                name: "",
                dose: "",
                prescriberDescriptor: "",
                startedOn: "",
                endedOn: "",
              })}
              title="Medicamentos"
            />
            {medications.fields.length === 0 ? <EmptyRows /> : null}
            {medications.fields.map((field, index) => (
              <fieldset aria-label={`Medicamento ${index + 1}`} className="grid gap-3 rounded-xl border p-4 sm:grid-cols-2" key={field.id}>
                <legend className="sr-only">Medicamento {index + 1}</legend>
                <input type="hidden" {...register(`medications.${index}.uiId`)} />
                <TextField
                  id={`medication-name-${field.id}`}
                  label={`Nombre del medicamento ${index + 1}`}
                  maxLength={200}
                  register={register(`medications.${index}.name`)}
                />
                <TextField
                  id={`medication-dose-${field.id}`}
                  label={`Dosis del medicamento ${index + 1}`}
                  maxLength={120}
                  register={register(`medications.${index}.dose`)}
                />
                <TextField
                  id={`medication-prescriber-${field.id}`}
                  label={`Descriptor del prescriptor ${index + 1}`}
                  maxLength={120}
                  register={register(`medications.${index}.prescriberDescriptor`)}
                />
                <div className="grid grid-cols-2 gap-3">
                  <DateField
                    id={`medication-start-${field.id}`}
                    label={`Inicio del medicamento ${index + 1}`}
                    register={register(`medications.${index}.startedOn`)}
                  />
                  <DateField
                    id={`medication-end-${field.id}`}
                    label={`Término del medicamento ${index + 1}`}
                    register={register(`medications.${index}.endedOn`)}
                  />
                </div>
                <div className="sm:col-span-2 sm:justify-self-end">
                  <RemoveButton
                    label={`Quitar medicamento ${index + 1}`}
                    onRemove={() => {
                      const row = getValues(`medications.${index}`)
                      if (confirmRemove(row)) medications.remove(index)
                    }}
                  />
                </div>
              </fieldset>
            ))}
          </div>
          {saveState === "saved" ? (
            <p className="mb-4 text-sm font-medium text-emerald-700" role="status">
              Historia guardada en staging con RLS
            </p>
          ) : null}
          {saveState === "error" ? <p className="mb-4 text-sm text-rose-700" role="alert">No pudimos guardar el lote. Tus valores permanecen en el formulario.</p> : null}
          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="outline">Cerrar</Button></DialogClose>
            <Button disabled={saveState === "saving"} type="submit">{saveState === "saving" ? "Guardando…" : "Guardar entradas"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function RepeatableHeading({ action, onAdd, title }: { action: string; onAdd: () => void; title: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-5 first:border-0 first:pt-0">
      <h3 className="font-semibold">{title}</h3>
      <Button onClick={onAdd} size="sm" type="button" variant="outline">
        <Plus aria-hidden="true" /> {action}
      </Button>
    </div>
  )
}

function EmptyRows() {
  return <p className="text-sm text-slate-500">Sin entradas nuevas en este formulario.</p>
}

function TextField({ id, label, maxLength, register }: { id: string; label: string; maxLength: number; register: ReturnType<UseFormRegister<ClinicalHistoryFormValues>> }) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} maxLength={maxLength} placeholder="Descriptor sintético" {...register} />
    </div>
  )
}

function DateField({ id, label, register }: { id: string; label: string; register: ReturnType<UseFormRegister<ClinicalHistoryFormValues>> }) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} max={today()} type="date" {...register} />
    </div>
  )
}

function RemoveButton({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <Button aria-label={label} onClick={onRemove} size="icon-sm" type="button" variant="ghost">
      <Trash2 aria-hidden="true" />
    </Button>
  )
}
