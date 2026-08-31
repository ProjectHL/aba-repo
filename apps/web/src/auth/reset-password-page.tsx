import { useEffect, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import { useAuth } from "@/auth/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const MINIMUM_PASSWORD_LENGTH = 12

export function ResetPasswordPage() {
  const { passwordRecoveryReady, signOut, updatePassword } = useAuth()
  const navigate = useNavigate()
  const alertRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  useEffect(() => {
    if (error) alertRef.current?.focus()
  }, [error])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    const form = new FormData(event.currentTarget)
    const password = String(form.get("password") ?? "")
    const confirmation = String(form.get("passwordConfirmation") ?? "")
    if (password.length < MINIMUM_PASSWORD_LENGTH) {
      setError(
        `La contraseña debe tener al menos ${MINIMUM_PASSWORD_LENGTH} caracteres`
      )
      return
    }
    if (password !== confirmation) {
      setError("Las contraseñas no coinciden")
      return
    }
    setSubmitting(true)
    try {
      await updatePassword(password)
      await signOut()
      navigate("/login", { replace: true })
    } catch {
      setError(
        "No pudimos actualizar la contraseña. Solicita un nuevo vínculo e inténtalo otra vez."
      )
      setSubmitting(false)
    }
  }

  if (!passwordRecoveryReady)
    return (
      <main className="grid min-h-svh place-items-center bg-slate-50 px-4 py-10">
        <Card className="w-full max-w-md border-slate-200 shadow-xl">
          <CardHeader>
            <p className="text-sm font-semibold text-blue-700">ABA Data Hub</p>
            <CardTitle>
              <h1 className="text-2xl">Vínculo no disponible</h1>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600">
              Este vínculo de recuperación es inválido o ya expiró. Solicita uno
              nuevo para continuar.
            </p>
            <Button asChild className="w-full" variant="outline">
              <Link to="/recuperar-acceso">Solicitar nuevo vínculo</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    )

  return (
    <main className="grid min-h-svh place-items-center bg-slate-50 px-4 py-10">
      <Card className="w-full max-w-md border-slate-200 shadow-xl">
        <CardHeader>
          <p className="text-sm font-semibold text-blue-700">ABA Data Hub</p>
          <CardTitle>
            <h1 className="text-2xl">Nueva contraseña</h1>
          </CardTitle>
          <p className="text-sm text-slate-600">
            Usa al menos 12 caracteres y no reutilices una contraseña conocida.
          </p>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error ? (
              <div
                ref={alertRef}
                className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 outline-none focus:ring-2 focus:ring-red-500"
                role="alert"
                tabIndex={-1}
              >
                {error}
              </div>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor="new-password">Nueva contraseña</Label>
              <Input
                id="new-password"
                name="password"
                type="password"
                autoComplete="new-password"
                minLength={MINIMUM_PASSWORD_LENGTH}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password-confirmation">
                Repetir contraseña
              </Label>
              <Input
                id="new-password-confirmation"
                name="passwordConfirmation"
                type="password"
                autoComplete="new-password"
                minLength={MINIMUM_PASSWORD_LENGTH}
                required
              />
            </div>
            <Button className="w-full" disabled={submitting} type="submit">
              {submitting ? "Actualizando…" : "Actualizar contraseña"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
