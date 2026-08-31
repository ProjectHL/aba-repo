import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"

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
  functionalAssessmentFormSchema,
  preferenceAssessmentFormSchema,
  toFunctionalAssessmentSubmission,
  toPreferenceAssessmentSubmission,
  type FunctionalAssessmentFormValues,
  type FunctionalAssessmentSubmission,
  type PreferenceAssessmentFormValues,
  type PreferenceAssessmentSubmission,
} from "@/features/clinical/assessment-forms-contract"

type SaveOutcome = "saved" | "saved-stale"
type SaveState = "idle" | "invalid" | "saving" | "saved" | "saved-stale" | "error"

const preferenceDefaults: PreferenceAssessmentFormValues = {
  occurredOn: "",
  assessmentType: "",
  highestPreference: "",
  response: "",
  lowestPreference: "",
  topography: "",
  notes: "",
}

const functionalDefaults: FunctionalAssessmentFormValues = {
  occurredOn: "",
  assessmentType: "",
  targetBehavior: "",
  antecedent: "",
  consequence: "",
  hypothesizedFunction: "",
  topography: "",
}

type RemoteFormCallbacks<TSubmission> = {
  onRetryRefresh: () => Promise<boolean>
  onSave: (submission: TSubmission) => Promise<SaveOutcome>
}

export function PreferenceAssessmentFormDialog({
  onRetryRefresh,
  onSave,
}: RemoteFormCallbacks<PreferenceAssessmentSubmission>) {
  const [attachmentName, setAttachmentName] = useState("")
  const [saveState, setSaveState] = useState<SaveState>("idle")
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<PreferenceAssessmentFormValues>({
    resolver: zodResolver(preferenceAssessmentFormSchema),
    defaultValues: preferenceDefaults,
  })
  const submit = handleSubmit(
    async (values) => {
      setSaveState("saving")
      try {
        const outcome = await onSave(toPreferenceAssessmentSubmission(values))
        setSaveState(outcome)
        reset(preferenceDefaults)
        setAttachmentName("")
      } catch {
        setSaveState("error")
      }
    },
    () => setSaveState("invalid")
  )

  return (
    <AssessmentDialogFrame
      attachmentName={attachmentName}
      onAttachmentNameChange={setAttachmentName}
      onRetryRefresh={onRetryRefresh}
      onSubmit={submit}
      saveState={saveState}
      setSaveState={setSaveState}
      title="Evaluación de preferencias"
    >
      <AssessmentInput
        error={errors.occurredOn?.message}
        id="preference-occurred-on"
        label="Fecha de evaluación (opcional)"
        register={register("occurredOn")}
        type="date"
      />
      <AssessmentInput
        error={errors.assessmentType?.message}
        id="preference-assessment-type"
        label="Tipo de evaluación"
        register={register("assessmentType")}
      />
      <AssessmentInput
        error={errors.highestPreference?.message}
        id="preference-highest"
        label="Preferencia más alta"
        register={register("highestPreference")}
      />
      <AssessmentInput
        error={errors.response?.message}
        id="preference-response"
        label="Respuesta (opcional)"
        register={register("response")}
      />
      <AssessmentInput
        error={errors.lowestPreference?.message}
        id="preference-lowest"
        label="Preferencia más baja (opcional)"
        register={register("lowestPreference")}
      />
      <AssessmentTextArea
        error={errors.topography?.message}
        id="preference-topography"
        label="Topografía observada (opcional)"
        register={register("topography")}
      />
      <AssessmentTextArea
        error={errors.notes?.message}
        id="preference-notes"
        label="Notas (opcional)"
        register={register("notes")}
      />
    </AssessmentDialogFrame>
  )
}

export function FunctionalAssessmentFormDialog({
  onRetryRefresh,
  onSave,
}: RemoteFormCallbacks<FunctionalAssessmentSubmission>) {
  const [attachmentName, setAttachmentName] = useState("")
  const [saveState, setSaveState] = useState<SaveState>("idle")
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<FunctionalAssessmentFormValues>({
    resolver: zodResolver(functionalAssessmentFormSchema),
    defaultValues: functionalDefaults,
  })
  const submit = handleSubmit(
    async (values) => {
      setSaveState("saving")
      try {
        const outcome = await onSave(toFunctionalAssessmentSubmission(values))
        setSaveState(outcome)
        reset(functionalDefaults)
        setAttachmentName("")
      } catch {
        setSaveState("error")
      }
    },
    () => setSaveState("invalid")
  )

  return (
    <AssessmentDialogFrame
      attachmentName={attachmentName}
      onAttachmentNameChange={setAttachmentName}
      onRetryRefresh={onRetryRefresh}
      onSubmit={submit}
      saveState={saveState}
      setSaveState={setSaveState}
      title="Evaluación funcional"
    >
      <AssessmentInput
        error={errors.occurredOn?.message}
        id="functional-occurred-on"
        label="Fecha de evaluación (opcional)"
        register={register("occurredOn")}
        type="date"
      />
      <AssessmentInput
        error={errors.assessmentType?.message}
        id="functional-assessment-type"
        label="Tipo de evaluación (opcional)"
        register={register("assessmentType")}
      />
      <AssessmentTextArea
        error={errors.targetBehavior?.message}
        id="functional-target"
        label="Conducta observada"
        register={register("targetBehavior")}
      />
      <AssessmentTextArea
        error={errors.antecedent?.message}
        id="functional-antecedent"
        label="Antecedente (opcional)"
        register={register("antecedent")}
      />
      <AssessmentTextArea
        error={errors.consequence?.message}
        id="functional-consequence"
        label="Consecuencia (opcional)"
        register={register("consequence")}
      />
      <AssessmentTextArea
        error={errors.hypothesizedFunction?.message}
        id="functional-function"
        label="Función probable (opcional)"
        register={register("hypothesizedFunction")}
      />
      <AssessmentTextArea
        error={errors.topography?.message}
        id="functional-topography"
        label="Topografía observada (opcional)"
        register={register("topography")}
      />
    </AssessmentDialogFrame>
  )
}

function AssessmentDialogFrame({
  attachmentName,
  children,
  onAttachmentNameChange,
  onRetryRefresh,
  onSubmit,
  saveState,
  setSaveState,
  title,
}: {
  attachmentName: string
  children: React.ReactNode
  onAttachmentNameChange: (name: string) => void
  onRetryRefresh: () => Promise<boolean>
  onSubmit: React.FormEventHandler<HTMLFormElement>
  saveState: SaveState
  setSaveState: (state: SaveState) => void
  title: "Evaluación de preferencias" | "Evaluación funcional"
}) {
  const saving = saveState === "saving"
  const retryRefresh = async () => {
    if (saving) return
    setSaveState("saving")
    try {
      setSaveState((await onRetryRefresh()) ? "saved" : "saved-stale")
    } catch {
      setSaveState("saved-stale")
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          aria-label={`Ver formulario de ${title}`}
          className="w-full"
          variant="outline"
        >
          Ver formulario
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85svh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Borrador remoto para Supabase staging. Usa exclusivamente datos sintéticos.
          </DialogDescription>
        </DialogHeader>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
          Conectado · payload v1 · RLS
        </div>
        <form onSubmit={onSubmit}>
          {saveState === "invalid" ? (
            <p className="mt-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700" role="alert">
              Revisa los campos indicados antes de guardar.
            </p>
          ) : null}
          <div className="grid gap-4 py-4 sm:grid-cols-2">{children}</div>
          <div className="grid gap-2">
            <Label htmlFor={`${title}-attachment`}>Documento de apoyo (opcional)</Label>
            <Input
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              disabled={saving}
              id={`${title}-attachment`}
              onChange={(event) =>
                onAttachmentNameChange(event.currentTarget.files?.[0]?.name ?? "")
              }
              type="file"
            />
            {attachmentName ? (
              <p className="text-xs font-medium text-amber-700">
                Archivo seleccionado · no cargado: {attachmentName}
              </p>
            ) : (
              <p className="text-xs text-amber-700">
                El archivo no se lee, sube ni incluye en el payload.
              </p>
            )}
          </div>
          <RemoteSaveStatus
            onRetryRefresh={retryRefresh}
            saveState={saveState}
          />
          <DialogFooter className="mt-5">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cerrar borrador
              </Button>
            </DialogClose>
            <Button disabled={saving} type="submit">
              {saving ? "Guardando…" : "Guardar borrador"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function RemoteSaveStatus({
  onRetryRefresh,
  saveState,
}: {
  onRetryRefresh: () => Promise<void>
  saveState: SaveState
}) {
  if (saveState === "saved") {
    return (
      <p className="mt-4 text-sm font-medium text-emerald-700" role="status">
        Guardado en staging con RLS
      </p>
    )
  }
  if (saveState === "saved-stale") {
    return (
      <div className="mt-4 flex flex-wrap items-center gap-2" role="status">
        <p className="text-sm font-medium text-amber-700">
          Guardado en staging con RLS, pero la lista no se actualizó.
        </p>
        <Button onClick={onRetryRefresh} size="sm" type="button" variant="outline">
          Reintentar actualización
        </Button>
      </div>
    )
  }
  if (saveState === "error") {
    return (
      <p className="mt-4 text-sm font-medium text-rose-700" role="alert">
        No pudimos guardar el borrador. Conservamos tus valores para reintentar.
      </p>
    )
  }
  return null
}

function AssessmentInput({
  error,
  id,
  label,
  register,
  type = "text",
}: {
  error?: string
  id: string
  label: string
  register: object
  type?: "date" | "text"
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        aria-invalid={Boolean(error)}
        autoComplete="off"
        id={id}
        placeholder={type === "text" ? "Dato sintético" : undefined}
        type={type}
        {...register}
      />
      {error ? <p className="text-xs text-rose-700">{error}</p> : null}
    </div>
  )
}

function AssessmentTextArea({
  error,
  id,
  label,
  register,
}: {
  error?: string
  id: string
  label: string
  register: object
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <textarea
        aria-invalid={Boolean(error)}
        className="min-h-24 rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        id={id}
        placeholder="Dato exclusivamente sintético"
        {...register}
      />
      {error ? <p className="text-xs text-rose-700">{error}</p> : null}
    </div>
  )
}
