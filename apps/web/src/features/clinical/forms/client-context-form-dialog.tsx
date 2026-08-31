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
import { Label } from "@/components/ui/label"
import {
  clientContextDraftSchema,
  type ClientContextFormValues,
} from "@/features/clinical/forms/clinical-draft-contracts"
import type { StudentContext } from "@/features/clinical/student-record/student-record-repository-contract"
import { useStudentRecordRepository } from "@/features/clinical/student-record/student-record-repository-context"

export function ClientContextFormDialog({ clientId, context, onSaved }: { clientId: string; context: StudentContext | null; onSaved: () => void }) {
  const [open, setOpen] = useState(false)
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle")
  const repository = useStudentRecordRepository()
  const values = {
    homeAdaptations: context?.homeAdaptations ?? "",
    schooling: context?.schooling ?? "",
    schoolAdaptations: context?.schoolAdaptations ?? "",
  }
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<ClientContextFormValues>({
    resolver: zodResolver(clientContextDraftSchema),
    defaultValues: values,
  })

  const changeOpen = (nextOpen: boolean) => {
    setOpen(nextOpen)
    if (nextOpen) {
      reset(values)
      setSaveState("idle")
    }
  }

  const submit = handleSubmit(async (formValues) => {
    setSaveState("saving")
    try {
      await repository.saveContext({ clientId, expectedVersion: context?.version, ...formValues })
      setSaveState("saved")
      onSaved()
    } catch {
      setSaveState("error")
    }
  })

  const messages = Object.values(errors)
    .map((error) => error?.message)
    .filter(Boolean)

  return (
    <Dialog onOpenChange={changeOpen} open={open}>
      <DialogTrigger asChild>
        <Button aria-label="Ver formulario de Contexto hogar y colegio" variant="outline">
          Ver formulario de contexto
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85svh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Contexto hogar y colegio</DialogTitle>
          <DialogDescription>
            Describe sólo situaciones sintéticas. El guardado remoto está protegido por asignación y RLS.
          </DialogDescription>
        </DialogHeader>
        <p className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-900">
          Expediente persistente · ABA_staging sintético
        </p>
        <form
          onChange={() => setSaveState("idle")}
          onSubmit={submit}
        >
          {messages.length ? (
            <div className="mb-4 text-sm text-rose-700" role="alert">
              {messages.join(". ")}
            </div>
          ) : null}
          <div className="grid gap-4 py-4">
            <DraftTextArea
              error={errors.homeAdaptations?.message}
              id="context-home-adaptations"
              label="Adaptaciones en el hogar"
              maxLength={2000}
              register={register("homeAdaptations")}
            />
            <DraftTextArea
              error={errors.schooling?.message}
              id="context-schooling"
              label="Escolarización"
              maxLength={500}
              register={register("schooling")}
            />
            <DraftTextArea
              error={errors.schoolAdaptations?.message}
              id="context-school-adaptations"
              label="Adaptaciones escolares"
              maxLength={2000}
              register={register("schoolAdaptations")}
            />
          </div>
          {saveState === "saved" ? (
            <p className="mb-4 text-sm font-medium text-emerald-700" role="status">
              Contexto guardado en staging con RLS
            </p>
          ) : null}
          {saveState === "error" ? <p className="mb-4 text-sm text-rose-700" role="alert">No pudimos guardar. Tus valores permanecen en el formulario.</p> : null}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cerrar</Button>
            </DialogClose>
            <Button disabled={saveState === "saving"} type="submit">{saveState === "saving" ? "Guardando…" : "Guardar contexto"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function DraftTextArea({
  error,
  id,
  label,
  maxLength,
  register,
}: {
  error?: string
  id: string
  label: string
  maxLength: number
  register: object
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <textarea
        aria-invalid={Boolean(error)}
        className="min-h-24 rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        id={id}
        maxLength={maxLength}
        placeholder="Dato exclusivamente sintético"
        {...register}
      />
    </div>
  )
}
