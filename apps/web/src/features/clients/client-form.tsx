import { useEffect, useMemo, useRef } from "react"
import { Plus, Trash2 } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm, useWatch } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { createClientFormSchema } from "@/features/clients/client-form-schema"
import type { DomainError } from "@/lib/supabase/domain-error"
import { calculateAge } from "@/lib/age"

export type ClientFormValues = {
  clientInitials: string
  clinicalId: string
  primaryLanguage: string
  birthDate: string
  livingArrangement: string
  guardians: Array<{ initials: string; birthDate: string }>
  siblings: Array<{ initials: string; birthDate: string }>
  syntheticDataConfirmed: boolean
}

type ClientFormProps = {
  now?: Date
  onSubmit: (values: ClientFormValues) => void | Promise<void>
  onCancel?: () => void
  serverError?: DomainError | null
}

export function ClientForm({ now = new Date(), onCancel, onSubmit, serverError }: ClientFormProps) {
  const errorSummaryRef = useRef<HTMLDivElement>(null)
  const {
    control,
    handleSubmit,
    register,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ClientFormValues>({
    resolver: zodResolver(createClientFormSchema(now)),
    defaultValues: {
      clientInitials: "",
      clinicalId: "",
      primaryLanguage: "Español",
      birthDate: "",
      livingArrangement: "",
      guardians: [],
      siblings: [],
      syntheticDataConfirmed: false,
    },
  })

  const guardians = useFieldArray({ control, name: "guardians" })
  const siblings = useFieldArray({ control, name: "siblings" })
  const birthDate = useWatch({ control, name: "birthDate" })
  const hasErrors = Object.keys(errors).length > 0 || Boolean(serverError)
  const clinicalIdError =
    errors.clinicalId?.message ??
    (serverError?.field === "clinicalId" ? serverError.message : undefined)

  useEffect(() => {
    if (hasErrors) errorSummaryRef.current?.focus()
  }, [hasErrors])

  const age = useMemo(() => {
    if (!birthDate) return ""
    try {
      return calculateAge(birthDate, now).label
    } catch {
      return ""
    }
  }, [birthDate, now])

  return (
    <Card className="mx-auto w-full max-w-5xl border-slate-200 shadow-xl">
      <CardHeader className="border-b border-slate-100">
        <CardTitle className="text-2xl">
          <h1>Añadir nuevo cliente</h1>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
          {hasErrors ? (
            <div
              ref={errorSummaryRef}
              className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 outline-none focus:ring-2 focus:ring-red-500"
              role="alert"
              tabIndex={-1}
            >
              {serverError?.field ? "Revisa el campo indicado antes de continuar." : serverError?.message ?? "Revisa los campos obligatorios antes de continuar."}
            </div>
          ) : null}
          <section className="space-y-4" aria-labelledby="basic-information-heading">
            <h2 id="basic-information-heading" className="text-lg font-semibold">
              Información básica
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              <Field error={errors.clientInitials?.message} label="Iniciales del cliente" htmlFor="clientInitials">
                <Input aria-invalid={Boolean(errors.clientInitials)} disabled={isSubmitting} id="clientInitials" {...register("clientInitials")} />
              </Field>
              <Field error={clinicalIdError} label="ID del cliente" htmlFor="clinicalId">
                <Input
                  aria-describedby={clinicalIdError ? "clinicalId-error" : undefined}
                  aria-invalid={Boolean(clinicalIdError)}
                  disabled={isSubmitting}
                  id="clinicalId"
                  {...register("clinicalId")}
                />
              </Field>
              <Field label="Idioma principal" htmlFor="primaryLanguage">
                <Select
                  defaultValue="Español"
                  disabled={isSubmitting}
                  onValueChange={(value) => setValue("primaryLanguage", value)}
                >
                  <SelectTrigger id="primaryLanguage" aria-label="Idioma principal">
                    <SelectValue placeholder="Seleccionar idioma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Español">Español</SelectItem>
                    <SelectItem value="Inglés">Inglés</SelectItem>
                    <SelectItem value="Otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field error={errors.birthDate?.message} label="Fecha de nacimiento" htmlFor="birthDate">
                <Input aria-invalid={Boolean(errors.birthDate)} disabled={isSubmitting} id="birthDate" type="date" {...register("birthDate")} />
              </Field>
              <Field label="Edad calculada" htmlFor="calculatedAge">
                <Input
                  id="calculatedAge"
                  aria-label="Edad calculada"
                  value={age}
                  readOnly
                  placeholder="Se calcula automáticamente"
                />
              </Field>
            </div>
          </section>

          <Separator />

          <section className="space-y-4" aria-labelledby="family-information-heading">
            <div>
              <h2 id="family-information-heading" className="text-lg font-semibold">
                Información familiar y de convivencia
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Añade sólo información sintética durante esta etapa de reconstrucción.
              </p>
            </div>

            <RepeatablePeople
              title="Padres o tutores"
              singular="padre o tutor"
              fields={guardians.fields}
              registerInitials={(index) => register(`guardians.${index}.initials`)}
              registerBirthDate={(index) => register(`guardians.${index}.birthDate`)}
              onAdd={() => guardians.append({ initials: "", birthDate: "" })}
              onRemove={(index) => guardians.remove(index)}
              disabled={isSubmitting}
              initialError={(index) => errors.guardians?.[index]?.initials?.message}
              birthDateError={(index) => errors.guardians?.[index]?.birthDate?.message}
            />

            <RepeatablePeople
              title="Hermanos"
              singular="hermano"
              fields={siblings.fields}
              registerInitials={(index) => register(`siblings.${index}.initials`)}
              registerBirthDate={(index) => register(`siblings.${index}.birthDate`)}
              onAdd={() => siblings.append({ initials: "", birthDate: "" })}
              onRemove={(index) => siblings.remove(index)}
              disabled={isSubmitting}
              initialError={(index) => errors.siblings?.[index]?.initials?.message}
              birthDateError={(index) => errors.siblings?.[index]?.birthDate?.message}
            />

            <Field label="¿Con quién vive el cliente? (sin nombres)" htmlFor="livingArrangement">
              <Input
                id="livingArrangement"
                disabled={isSubmitting}
                placeholder="Ej.: madre, padre, hermano; nunca nombres reales"
                {...register("livingArrangement")}
              />
            </Field>

            <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">
              <label className="flex items-start gap-3" htmlFor="syntheticDataConfirmed">
                <input
                  aria-invalid={Boolean(errors.syntheticDataConfirmed)}
                  className="mt-0.5 size-4"
                  disabled={isSubmitting}
                  id="syntheticDataConfirmed"
                  type="checkbox"
                  {...register("syntheticDataConfirmed")}
                />
                <span>
                  Confirmo que usaré exclusivamente datos sintéticos y que no corresponden a
                  pacientes actuales ni antiguos.
                </span>
              </label>
              {errors.syntheticDataConfirmed ? (
                <p className="mt-2 text-red-700">{errors.syntheticDataConfirmed.message}</p>
              ) : null}
            </div>
          </section>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-6">
            <Button disabled={isSubmitting} onClick={onCancel} type="button" variant="outline">
              Cancelar
            </Button>
            <Button disabled={isSubmitting} type="submit">
              {isSubmitting ? "Guardando…" : "Continuar con datos sintéticos"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

type FieldProps = {
  label: string
  htmlFor: string
  children: React.ReactNode
  error?: string
}

function Field({ children, error, htmlFor, label }: FieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error ? <p className="text-sm text-red-700" id={`${htmlFor}-error`}>{error}</p> : null}
    </div>
  )
}

type RepeatablePeopleProps = {
  title: string
  singular: string
  fields: Array<{ id: string }>
  registerInitials: (index: number) => object
  registerBirthDate: (index: number) => object
  onAdd: () => void
  onRemove: (index: number) => void
  disabled: boolean
  initialError: (index: number) => string | undefined
  birthDateError: (index: number) => string | undefined
}

function RepeatablePeople({
  fields,
  birthDateError,
  disabled,
  initialError,
  onAdd,
  onRemove,
  registerBirthDate,
  registerInitials,
  singular,
  title,
}: RepeatablePeopleProps) {
  return (
    <div className="space-y-3">
      <h3 className="font-medium">{title}</h3>
      {fields.map((field, index) => {
        const label = singular.charAt(0).toUpperCase() + singular.slice(1)
        return (
          <div key={field.id} className="grid gap-3 rounded-lg border bg-slate-50 p-4 md:grid-cols-2">
            <Field error={initialError(index)} label={`Iniciales del ${singular} ${index + 1}`} htmlFor={`${singular}-initials-${index}`}>
              <Input disabled={disabled} id={`${singular}-initials-${index}`} {...registerInitials(index)} />
            </Field>
            <Field error={birthDateError(index)} label={`Fecha de nacimiento de ${label} ${index + 1}`} htmlFor={`${singular}-birth-${index}`}>
              <Input disabled={disabled} id={`${singular}-birth-${index}`} type="date" {...registerBirthDate(index)} />
            </Field>
            <div className="md:col-span-2">
              <Button
                disabled={disabled}
                onClick={() => onRemove(index)}
                size="sm"
                type="button"
                variant="ghost"
              >
                <Trash2 aria-hidden="true" /> Quitar {singular} {index + 1}
              </Button>
            </div>
          </div>
        )
      })}
      <Button disabled={disabled} type="button" variant="outline" size="sm" onClick={onAdd}>
        <Plus aria-hidden="true" /> Añadir {singular}
      </Button>
    </div>
  )
}
