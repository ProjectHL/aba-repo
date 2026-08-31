import { useEffect, useRef, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"

import { useAuth } from "@/auth/auth-context"
import { getSafeReturnPath } from "@/auth/route-utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LoginPage() {
  const { signIn, signInWithGoogle, status } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const alertRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const googleAuthEnabled = import.meta.env.VITE_GOOGLE_AUTH_ENABLED !== "false"

  useEffect(() => {
    if (error) alertRef.current?.focus()
  }, [error])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    const form = new FormData(event.currentTarget)
    const email = String(form.get("email") ?? "").trim()
    const password = String(form.get("password") ?? "")

    try {
      await signIn({ email, password })
      navigate(getSafeReturnPath(location.state), { replace: true })
    } catch {
      setError("Credenciales no válidas")
    }
  }

  async function handleGoogleSignIn() {
    setError(null)
    if (!googleAuthEnabled) {
      setError(
        "El acceso con Google está en configuración. Puedes usar el acceso existente mientras lo habilitamos."
      )
      return
    }

    try {
      await signInWithGoogle()
    } catch {
      setError("No pudimos iniciar con Google")
    }
  }

  const submitting = status === "authenticating"

  return (
    <main className="grid min-h-svh place-items-center bg-slate-50 px-4 py-10">
      <Card className="w-full max-w-md border-slate-200 shadow-xl">
        <CardHeader>
          <p className="text-sm font-semibold text-blue-700">ABA Data Hub</p>
          <CardTitle>
            <h1 className="text-2xl">Iniciar sesión</h1>
          </CardTitle>
          <p className="text-sm text-slate-600">
            Acceso al entorno seguro de reconstrucción.
          </p>
        </CardHeader>
        <CardContent>
          <Button
            className="w-full bg-white text-slate-900 shadow-sm hover:bg-slate-50"
            disabled={submitting}
            onClick={handleGoogleSignIn}
            type="button"
            variant="outline"
          >
            <span
              aria-hidden="true"
              className="grid size-5 place-items-center rounded-full bg-white text-sm font-bold text-blue-600"
            >
              G
            </span>
            Crear cuenta o continuar con Google
          </Button>
          <p className="mt-2 text-center text-xs leading-relaxed text-slate-500">
            Si es tu primera vez, Google creará tu cuenta y quedará pendiente de
            aprobación.
          </p>
          <div className="my-5 flex items-center gap-3" aria-hidden="true">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs font-medium tracking-wide text-slate-400 uppercase">
              o
            </span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>
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
              <Label htmlFor="email">Correo</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
              />
            </div>
            <Button className="w-full" disabled={submitting} type="submit">
              {submitting ? "Ingresando…" : "Iniciar sesión"}
            </Button>
          </form>
          <Button asChild className="mt-3 w-full" variant="ghost">
            <Link to="/recuperar-acceso">¿Olvidaste tu contraseña?</Link>
          </Button>
          <Button asChild className="mt-4 w-full" variant="outline">
            <Link to="/registro">Crear cuenta con correo</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}
