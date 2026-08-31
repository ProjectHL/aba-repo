import { LogOut } from "lucide-react"
import { NavLink, Outlet } from "react-router-dom"

import { useAuth } from "@/auth/auth-context"
import { Button } from "@/components/ui/button"

export function AppShell() {
  const { identity, signOut, status } = useAuth()
  const identityLabel = identity?.email
    ? identity.email.slice(0, 2).toUpperCase()
    : "US"

  return (
    <div className="min-h-svh bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white print:hidden">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:gap-8 sm:px-6">
          <NavLink
            className="text-base font-bold tracking-tight text-blue-700 sm:text-xl"
            to="/clientes"
          >
            ABA Data Hub
          </NavLink>
          <nav
            aria-label="Navegación principal"
            className="flex items-center gap-3 text-sm sm:gap-6"
          >
            <NavLink
              className={({ isActive }) =>
                isActive
                  ? "font-semibold text-blue-700"
                  : "text-slate-600 hover:text-slate-950"
              }
              to="/clientes"
            >
              Clientes
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                isActive
                  ? "font-semibold text-blue-700"
                  : "text-slate-600 hover:text-slate-950"
              }
              to="/informes"
            >
              Informes
            </NavLink>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <div
              aria-label="Usuario autenticado"
              className="grid size-9 place-items-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700"
            >
              {identityLabel}
            </div>
            <Button
              aria-label="Cerrar sesión"
              disabled={status === "signingOut"}
              onClick={() => void signOut()}
              size="icon-sm"
              variant="ghost"
            >
              <LogOut aria-hidden="true" />
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 print:max-w-none print:p-0">
        <Outlet />
      </main>
    </div>
  )
}
