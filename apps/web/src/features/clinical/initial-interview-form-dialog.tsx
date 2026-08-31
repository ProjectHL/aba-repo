import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Trash2 } from "lucide-react"
import { useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"

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
  initialInterviewFormSchema,
  toInitialInterviewPayload,
  type InitialInterviewFormValues,
  type InitialInterviewPayloadV1,
} from "@/features/clinical/initial-interview-contract"

type SaveOutcome = "saved" | "saved-stale"

const emptyInformant = () => ({ informant: "", strengths: "", needs: "" })

export function InitialInterviewFormDialog({
  onRetryRefresh,
  onSave,
}: {
  onRetryRefresh: () => Promise<boolean>
  onSave: (payload: InitialInterviewPayloadV1) => Promise<SaveOutcome>
}) {
  const [saveState, setSaveState] = useState<
    "idle" | "saving" | "saved" | "saved-stale" | "error"
  >("idle")
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<InitialInterviewFormValues>({
    resolver: zodResolver(initialInterviewFormSchema),
    defaultValues: {
      consultationReason: "",
      developmentHistory: "",
      familyContext: "",
      priorities: "",
      informants: [emptyInformant()],
    },
  })
  const informants = useFieldArray({ control, name: "informants" })
  const saving = saveState === "saving"

  const submit = handleSubmit(async (values) => {
    setSaveState("saving")
    try {
      const outcome = await onSave(toInitialInterviewPayload(values))
      setSaveState(outcome)
      reset({
        consultationReason: "",
        developmentHistory: "",
        familyContext: "",
        priorities: "",
        informants: [emptyInformant()],
      })
    } catch {
      setSaveState("error")
    }
  })

  const retryRefresh = async () => {
    if (saving) return
    setSaveState("saving")
    setSaveState((await onRetryRefresh()) ? "saved" : "saved-stale")
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          aria-label="Ver formulario de Entrevista inicial"
          className="w-full"
          variant="outline"
        >
          Ver formulario
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85svh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Entrevista inicial</DialogTitle>
          <DialogDescription>
            Borrador conectado a Supabase staging. Usa descriptores sintéticos,
            nunca nombres, correos ni RUT.
          </DialogDescription>
        </DialogHeader>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
          Conectado · guardado con RLS · payload v1
        </div>
        <form onSubmit={submit}>
          <div className="grid gap-4 py-4 sm:grid-cols-2">
            <InterviewTextArea
              error={errors.consultationReason?.message}
              id="interview-consultation-reason"
              label="Motivo de consulta"
              register={register("consultationReason")}
            />
            <InterviewTextArea
              error={errors.developmentHistory?.message}
              id="interview-development-history"
              label="Historia del desarrollo"
              register={register("developmentHistory")}
            />
            <InterviewTextArea
              error={errors.familyContext?.message}
              id="interview-family-context"
              label="Contexto familiar"
              register={register("familyContext")}
            />
            <InterviewTextArea
              error={errors.priorities?.message}
              id="interview-priorities"
              label="Prioridades"
              register={register("priorities")}
            />
          </div>

          <section aria-labelledby="interview-informants" className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold" id="interview-informants">
                  Informantes
                </h3>
                <p className="text-xs text-slate-500">
                  El orden se conserva en el borrador.
                </p>
              </div>
              <Button
                disabled={saving}
                onClick={() => informants.append(emptyInformant())}
                size="sm"
                type="button"
                variant="outline"
              >
                <Plus aria-hidden="true" /> Añadir informante
              </Button>
            </div>
            {informants.fields.map((field, index) => (
              <div
                className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4"
                key={field.id}
              >
                <div className="flex items-end gap-3">
                  <div className="grid flex-1 gap-2">
                    <Label htmlFor={`interview-informant-${field.id}`}>
                      Informante {index + 1}
                    </Label>
                    <Input
                      id={`interview-informant-${field.id}`}
                      maxLength={80}
                      placeholder="Ej.: tutor sintético"
                      {...register(`informants.${index}.informant`)}
                    />
                    {errors.informants?.[index]?.informant ? (
                      <p className="text-xs text-rose-700">
                        {errors.informants[index]?.informant?.message}
                      </p>
                    ) : null}
                  </div>
                  <Button
                    aria-label={`Quitar informante ${index + 1}`}
                    disabled={saving || informants.fields.length === 1}
                    onClick={() => informants.remove(index)}
                    size="icon-sm"
                    type="button"
                    variant="ghost"
                  >
                    <Trash2 aria-hidden="true" />
                  </Button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <InterviewTextArea
                    error={errors.informants?.[index]?.strengths?.message}
                    id={`interview-strengths-${field.id}`}
                    label={`Fortalezas del informante ${index + 1}`}
                    register={register(`informants.${index}.strengths`)}
                  />
                  <InterviewTextArea
                    error={errors.informants?.[index]?.needs?.message}
                    id={`interview-needs-${field.id}`}
                    label={`Necesidades del informante ${index + 1}`}
                    register={register(`informants.${index}.needs`)}
                  />
                </div>
              </div>
            ))}
          </section>

          {saveState === "saved" ? (
            <p className="mt-4 text-sm font-medium text-emerald-700" role="status">
              Borrador sintético guardado.
            </p>
          ) : null}
          {saveState === "saved-stale" ? (
            <div className="mt-4 flex flex-wrap items-center gap-2" role="status">
              <p className="text-sm font-medium text-amber-700">
                El borrador se guardó, pero no pudimos actualizar la lista.
              </p>
              <Button onClick={retryRefresh} size="sm" type="button" variant="outline">
                Reintentar actualización
              </Button>
            </div>
          ) : null}
          {saveState === "error" ? (
            <p className="mt-4 text-sm font-medium text-rose-700" role="alert">
              No pudimos guardar el borrador.
            </p>
          ) : null}
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

function InterviewTextArea({
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
        maxLength={4000}
        placeholder="Dato exclusivamente sintético"
        {...register}
      />
      {error ? <p className="text-xs text-rose-700">{error}</p> : null}
    </div>
  )
}
