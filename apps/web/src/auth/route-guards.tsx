import { Navigate, Outlet, useLocation } from "react-router-dom"

import { useAuth } from "@/auth/auth-context"
import { getSafeReturnPath } from "@/auth/route-utils"
import { Button } from "@/components/ui/button"

function SessionLoading() {
  return (
    <div className="grid min-h-svh place-items-center bg-slate-50" role="status">
      <p className="text-sm font-medium text-slate-600">Comprobando sesión…</p>
    </div>
  )
}

function ServiceUnavailable() {
  return (
    <main className="grid min-h-svh place-items-center bg-slate-50 px-6">
      <div className="max-w-md rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm" role="alert">
        <h1 className="text-lg font-semibold text-slate-950">
          El entorno de pruebas no está disponible
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Intenta nuevamente más tarde o contacta a la persona responsable del piloto.
        </p>
      </div>
    </main>
  )
}

function AccessGate({ access, onSignOut }: { access: "pending" | "inactive"; onSignOut: () => Promise<void> }) {
  const pending = access === "pending"
  return (
    <main className="grid min-h-svh place-items-center bg-slate-50 px-6">
      <div className="max-w-md rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        <p className="text-sm font-semibold text-blue-700">ABA Data Hub</p>
        <h1 className="mt-2 text-xl font-semibold text-slate-950">
          {pending ? "Acceso pendiente de aprobación" : "Acceso desactivado"}
        </h1>
        <p className="mt-3 text-sm text-slate-600">
          {pending
            ? "Tu cuenta está confirmada. Una persona administradora debe aprobar tu acceso al piloto."
            : "Tu cuenta sigue identificada, pero actualmente no tiene acceso a información del piloto."}
        </p>
        <Button className="mt-5" onClick={() => void onSignOut()} type="button" variant="outline">
          Cerrar sesión
        </Button>
      </div>
    </main>
  )
}

export function ProtectedRoute() {
  const { identity, signOut, status } = useAuth()
  const location = useLocation()

  if (status === "unavailable") return <ServiceUnavailable />
  if (["initializing", "authenticating", "signingOut"].includes(status)) {
    return <SessionLoading />
  }
  if (status === "anonymous") {
    return (
      <Navigate
        replace
        state={{ from: `${location.pathname}${location.search}` }}
        to="/login"
      />
    )
  }
  if (identity?.access === "pending" || identity?.access === "inactive") {
    return <AccessGate access={identity.access} onSignOut={signOut} />
  }
  return <Outlet />
}

export function PublicOnlyRoute() {
  const { status } = useAuth()
  const location = useLocation()

  if (status === "unavailable") return <ServiceUnavailable />
  if (["initializing", "signingOut"].includes(status)) {
    return <SessionLoading />
  }
  if (status === "authenticated") {
    return <Navigate replace to={getSafeReturnPath(location.state)} />
  }
  return <Outlet />
}
