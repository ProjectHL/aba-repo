import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { consentReferenceSchema, type ConsentReferenceFormValues } from "@/features/clinical/forms/clinical-draft-contracts"
import { useStudentRecordRepository } from "@/features/clinical/student-record/student-record-repository-context"

const defaults: ConsentReferenceFormValues = {
  purposeCode: "", noticeVersion: "", grantorDescriptor: "", channel: "",
  evidenceReference: "", status: "pending_review", effectiveAt: "", expiresAt: "",
}

export function ConsentReferenceDialog({ clientId, onSaved }: { clientId: string; onSaved: () => void }) {
  const repository = useStudentRecordRepository()
  const [open, setOpen] = useState(false)
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle")
  const { formState: { errors }, handleSubmit, register, reset } = useForm<ConsentReferenceFormValues>({
    resolver: zodResolver(consentReferenceSchema), defaultValues: defaults,
  })
  const submit = handleSubmit(async (values) => {
    setState("saving")
    try {
      await repository.recordConsent({
        clientId, purposeCode: values.purposeCode, noticeVersion: values.noticeVersion,
        grantorDescriptor: values.grantorDescriptor, channel: values.channel, status: values.status,
        ...(values.evidenceReference ? { evidenceReference: values.evidenceReference } : {}),
        ...(values.effectiveAt ? { effectiveAt: `${values.effectiveAt}T00:00:00.000Z` } : {}),
        ...(values.expiresAt ? { expiresAt: `${values.expiresAt}T00:00:00.000Z` } : {}),
      })
      setState("saved"); reset(defaults); onSaved()
    } catch { setState("error") }
  })
  return (
    <Dialog open={open} onOpenChange={(next) => { setOpen(next); if (next) setState("idle") }}>
      <DialogTrigger asChild><Button variant="outline">Registrar referencia</Button></DialogTrigger>
      <DialogContent className="max-h-[85svh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader><DialogTitle>Referencia de consentimiento</DialogTitle><DialogDescription>Metadatos sintéticos por finalidad. No carga archivos, firmas ni enlaces públicos.</DialogDescription></DialogHeader>
        <form onChange={() => setState("idle")} onSubmit={submit}>
          <div className="grid gap-4 py-4 sm:grid-cols-2">
            <Field error={errors.purposeCode?.message} id="consent-purpose" label="Finalidad" register={register("purposeCode")} />
            <Field error={errors.noticeVersion?.message} id="consent-version" label="Versión del aviso" register={register("noticeVersion")} />
            <Field error={errors.grantorDescriptor?.message} id="consent-grantor" label="Descriptor del otorgante" register={register("grantorDescriptor")} />
            <Field error={errors.channel?.message} id="consent-channel" label="Canal" register={register("channel")} />
            <Field error={errors.evidenceReference?.message} id="consent-reference" label="Referencia opaca opcional" register={register("evidenceReference")} />
            <div className="grid gap-2"><Label htmlFor="consent-status">Estado</Label><select className="h-9 rounded-md border border-input bg-transparent px-3 text-sm" id="consent-status" {...register("status")}><option value="pending_review">Pendiente de revisión</option><option value="valid">Válido demostrativo</option></select></div>
            <DateField error={errors.effectiveAt?.message} id="consent-effective" label="Vigencia desde" register={register("effectiveAt")} />
            <DateField error={errors.expiresAt?.message} id="consent-expires" label="Vence" register={register("expiresAt")} />
          </div>
          {state === "saved" ? <p className="mb-4 text-sm text-emerald-700" role="status">Referencia guardada en staging; no constituye firma legal</p> : null}
          {state === "error" ? <p className="mb-4 text-sm text-rose-700" role="alert">No pudimos guardar. Los valores permanecen.</p> : null}
          <DialogFooter><DialogClose asChild><Button type="button" variant="outline">Cerrar</Button></DialogClose><Button disabled={state === "saving"} type="submit">{state === "saving" ? "Guardando…" : "Guardar referencia"}</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function Field({ error, id, label, register }: { error?: string; id: string; label: string; register: object }) {
  return <div className="grid gap-2"><Label htmlFor={id}>{label}</Label><Input aria-invalid={Boolean(error)} id={id} maxLength={200} placeholder="Dato sintético" {...register} />{error ? <p className="text-xs text-rose-700">{error}</p> : null}</div>
}
function DateField({ error, id, label, register }: { error?: string; id: string; label: string; register: object }) {
  return <div className="grid gap-2"><Label htmlFor={id}>{label}</Label><Input aria-invalid={Boolean(error)} id={id} type="date" {...register} />{error ? <p className="text-xs text-rose-700">{error}</p> : null}</div>
}

