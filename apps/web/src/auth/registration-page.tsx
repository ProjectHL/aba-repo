import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"

import { useAuth } from "@/auth/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const MINIMUM_PASSWORD_LENGTH = 12

export function RegistrationPage() {
  const { signUp, status } = useAuth()
  const alertRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    if (error) alertRef.current?.focus()
  }, [error])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    const form = new FormData(event.currentTarget)
    const email = String(form.get("email") ?? "").trim()
    const password = String(form.get("password") ?? "")
    const passwordConfirmation = String(form.get("passwordConfirmation") ?? "")

    if (password.length < MINIMUM_PASSWORD_LENGTH) {
      setError(`La contraseña debe tener al menos ${MINIMUM_PASSWORD_LENGTH} caracteres`)
      return
    }
    if (password !== passwordConfirmation) {
      setError("Las contraseñas no coinciden")
      return
    }

    try {
      await signUp({ email, password })
      setCompleted(true)
    } catch {
      setError("No pudimos crear la cuenta. Intenta nuevamente más tarde.")
    }
  }

  if (completed) {
    return (
      <main className="grid min-h-svh place-items-center bg-slate-50 px-4 py-10">
        <Card className="w-full max-w-md border-slate-200 shadow-xl">
          <CardHeader>
            <p className="text-sm font-semibold text-blue-700">ABA Data Hub</p>
            <CardTitle>
              <h1 className="text-2xl">Confirma tu correo</h1>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900" role="status">
              Revisa tu correo para confirmar la cuenta. Después podrás iniciar sesión y solicitar
              la aprobación de acceso al piloto.
            </div>
            <Button asChild className="w-full" variant="outline">
              <Link to="/login">Volver a iniciar sesión</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    )
  }

  const submitting = status === "authenticating"

  return (
    <main className="grid min-h-svh place-items-center bg-slate-50 px-4 py-10">
      <Card className="w-full max-w-md border-slate-200 shadow-xl">
        <CardHeader>
          <p className="text-sm font-semibold text-blue-700">ABA Data Hub</p>
          <CardTitle>
            <h1 className="text-2xl">Crear cuenta</h1>
          </CardTitle>
          <p className="text-sm text-slate-600">
            Tu cuenta quedará pendiente de aprobación antes de acceder al piloto.
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
              <Label htmlFor="registration-email">Correo</Label>
              <Input
                id="registration-email"
                name="email"
                type="email"
                autoComplete="email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="registration-password">Contraseña</Label>
              <Input
                id="registration-password"
                name="password"
                type="password"
                autoComplete="new-password"
                minLength={MINIMUM_PASSWORD_LENGTH}
                required
              />
              <p className="text-xs text-slate-500">Usa al menos 12 caracteres.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="registration-password-confirmation">Repetir contraseña</Label>
              <Input
                id="registration-password-confirmation"
                name="passwordConfirmation"
                type="password"
                autoComplete="new-password"
                minLength={MINIMUM_PASSWORD_LENGTH}
                required
              />
            </div>
            <Button className="w-full" disabled={submitting} type="submit">
              {submitting ? "Creando cuenta…" : "Crear cuenta"}
            </Button>
            <Button asChild className="w-full" variant="ghost">
              <Link to="/login">Ya tengo una cuenta</Link>
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
