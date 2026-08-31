import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"

import { useAuth } from "@/auth/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function PasswordRecoveryPage() {
  const { requestPasswordRecovery, status } = useAuth()
  const alertRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    if (error) alertRef.current?.focus()
  }, [error])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    const email = String(
      new FormData(event.currentTarget).get("email") ?? ""
    ).trim()
    try {
      await requestPasswordRecovery(email)
      setCompleted(true)
    } catch {
      setError("No pudimos enviar el vínculo. Intenta nuevamente más tarde.")
    }
  }

  return (
    <main className="grid min-h-svh place-items-center bg-slate-50 px-4 py-10">
      <Card className="w-full max-w-md border-slate-200 shadow-xl">
        <CardHeader>
          <p className="text-sm font-semibold text-blue-700">ABA Data Hub</p>
          <CardTitle>
            <h1 className="text-2xl">Recuperar acceso</h1>
          </CardTitle>
          <p className="text-sm text-slate-600">
            Te enviaremos un vínculo seguro para definir una nueva contraseña.
          </p>
        </CardHeader>
        <CardContent>
          {completed ? (
            <div className="space-y-4">
              <div
                className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900"
                role="status"
              >
                Si el correo corresponde a una cuenta, recibirás un vínculo para
                restablecer la contraseña.
              </div>
              <Button asChild className="w-full" variant="outline">
                <Link to="/login">Volver a iniciar sesión</Link>
              </Button>
            </div>
          ) : (
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
                <Label htmlFor="recovery-email">Correo</Label>
                <Input
                  id="recovery-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                />
              </div>
              <Button
                className="w-full"
                disabled={status === "authenticating"}
                type="submit"
              >
                {status === "authenticating" ? "Enviando…" : "Enviar vínculo"}
              </Button>
              <Button asChild className="w-full" variant="ghost">
                <Link to="/login">Volver a iniciar sesión</Link>
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
