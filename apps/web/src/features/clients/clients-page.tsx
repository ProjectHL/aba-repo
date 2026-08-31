import { useEffect, useMemo, useState } from "react"
import { Search, UserRoundPlus, UsersRound } from "lucide-react"
import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import type { ClientSummary } from "@/features/clients/client-contracts"
import { useClientsRepository } from "@/features/clients/clients-repository-context"

type ClientsState =
  | { status: "loading" }
  | { status: "success"; clients: ClientSummary[] }
  | { status: "error" }

export function ClientsPage() {
  const repository = useClientsRepository()
  const [state, setState] = useState<ClientsState>({ status: "loading" })
  const [query, setQuery] = useState("")
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    repository
      .list({ signal: controller.signal })
      .then((clients) => setState({ status: "success", clients }))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return
        setState({ status: "error" })
      })
    return () => controller.abort()
  }, [attempt, repository])

  const filteredClients = useMemo(() => {
    if (state.status !== "success") return []
    const activeClients = state.clients.filter((client) => client.status === "active")
    const normalizedQuery = query.trim().toLocaleLowerCase("es")
    if (!normalizedQuery) return activeClients
    return activeClients.filter(
      (client) =>
        client.initials.toLocaleLowerCase("es").includes(normalizedQuery) ||
        client.clinicalId.toLocaleLowerCase("es").includes(normalizedQuery)
    )
  }, [query, state])

  const total = state.status === "success" ? state.clients.length : 0
  const activeTotal =
    state.status === "success"
      ? state.clients.filter((client) => client.status === "active").length
      : 0

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-blue-700">Clientes</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">Gestión de clientes</h1>
          <p className="mt-2 text-slate-600">Gestiona la información reconstruida desde la evidencia visual.</p>
        </div>
        <Button asChild>
          <Link to="/clientes/nuevo">
            <UserRoundPlus aria-hidden="true" /> Añadir nuevo cliente
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <MetricCard label="Clientes activos" value={String(activeTotal)} />
        <MetricCard label="Clientes totales" value={String(total)} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Clientes activos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="relative max-w-xl">
            <Search aria-hidden="true" className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              aria-label="Buscar cliente"
              className="pl-9"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por iniciales o ID"
              value={query}
            />
          </div>
          {state.status === "loading" ? <ClientsLoading /> : null}
          {state.status === "error" ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6" role="alert">
              <p className="font-semibold text-red-900">No pudimos cargar los clientes</p>
              <p className="mt-1 text-sm text-red-800">Revisa la conexión e inténtalo nuevamente.</p>
              <Button className="mt-4" onClick={() => { setState({ status: "loading" }); setAttempt((value) => value + 1) }} variant="outline">
                Reintentar
              </Button>
            </div>
          ) : null}
          {state.status === "success" && activeTotal === 0 ? <ClientsEmpty /> : null}
          {state.status === "success" && activeTotal > 0 ? (
            <div className="overflow-hidden rounded-xl border border-slate-200">
              {filteredClients.length === 0 ? (
                <p className="p-6 text-center text-sm text-slate-500">Sin coincidencias</p>
              ) : (
                <ul className="divide-y divide-slate-200">
                  {filteredClients.map((client) => (
                    <li key={client.id}>
                      <Link
                        className="flex items-center justify-between gap-4 p-4 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-inset"
                        to={`/clientes/${client.id}`}
                      >
                        <div>
                          <p className="font-semibold">{client.initials}</p>
                          <p className="text-sm text-slate-500">{client.clinicalId}</p>
                        </div>
                        <span className="text-sm text-slate-500">{client.primaryLanguage}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}

function ClientsLoading() {
  return (
    <div
      aria-label="Cargando clientes"
      className="grid min-h-56 place-items-center rounded-xl border border-slate-200 bg-slate-50"
      role="status"
    >
      <p className="text-sm font-medium text-slate-500">Cargando clientes…</p>
    </div>
  )
}

function ClientsEmpty() {
  return (
    <div className="grid min-h-56 place-items-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
      <div>
        <UsersRound aria-hidden="true" className="mx-auto size-10 text-slate-400" />
        <h2 className="mt-4 text-lg font-semibold">Todavía no hay clientes</h2>
        <p className="mt-1 max-w-md text-sm text-slate-500">
          Comienza creando un perfil con datos exclusivamente sintéticos.
        </p>
      </div>
    </div>
  )
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4">
        <div className="grid size-11 place-items-center rounded-full bg-blue-50 text-blue-700">
          <UsersRound aria-hidden="true" className="size-5" />
        </div>
        <div>
          <output aria-label={label} className="text-2xl font-bold">
            {value}
          </output>
          <p className="text-sm text-slate-500">{label}</p>
        </div>
      </CardContent>
    </Card>
  )
}
