import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import { describe, expect, it, vi } from "vitest"

import { ClientsPage } from "@/features/clients/clients-page"
import {
  ClientsRepositoryProvider,
  type ClientsRepository,
} from "@/features/clients/clients-repository"
import { DomainError } from "@/lib/supabase/domain-error"

const syntheticClients = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    clinicalId: "SYN-001",
    initials: "AB",
    primaryLanguage: "Español",
    birthDate: "2018-03-28",
    status: "active" as const,
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    clinicalId: "SYN-002",
    initials: "CD",
    primaryLanguage: "Inglés",
    birthDate: "2017-04-12",
    status: "active" as const,
  },
]

function renderPage(repository: ClientsRepository) {
  return render(
    <MemoryRouter>
      <ClientsRepositoryProvider repository={repository}>
        <ClientsPage />
      </ClientsRepositoryProvider>
    </MemoryRouter>
  )
}

describe("ClientsPage", () => {
  it("muestra loading y después el estado vacío", async () => {
    let resolveList: ((value: typeof syntheticClients) => void) | undefined
    const pending = new Promise<typeof syntheticClients>((resolve) => {
      resolveList = resolve
    })
    const repository: ClientsRepository = {
      list: vi.fn(() => pending),
      create: vi.fn(),
      getById: vi.fn(),
    }
    renderPage(repository)

    expect(screen.getByRole("status", { name: "Cargando clientes" })).toBeVisible()
    resolveList?.([])
    expect(await screen.findByText("Todavía no hay clientes")).toBeVisible()
  })

  it("lista y filtra localmente por iniciales o ID", async () => {
    const user = userEvent.setup()
    const repository: ClientsRepository = {
      list: vi.fn().mockResolvedValue(syntheticClients),
      create: vi.fn(),
      getById: vi.fn(),
    }
    renderPage(repository)

    expect(await screen.findByText("SYN-001")).toBeVisible()
    expect(screen.getByText("SYN-002")).toBeVisible()
    expect(screen.getByRole("link", { name: /AB SYN-001 Español/ })).toHaveAttribute(
      "href",
      "/clientes/11111111-1111-4111-8111-111111111111"
    )
    await user.type(screen.getByLabelText("Buscar cliente"), "cd")

    expect(screen.queryByText("SYN-001")).not.toBeInTheDocument()
    expect(screen.getByText("SYN-002")).toBeVisible()
  })

  it("separa el total de los clientes activos", async () => {
    const repository: ClientsRepository = {
      list: vi.fn().mockResolvedValue([
        syntheticClients[0],
        { ...syntheticClients[1], status: "archived" as const },
      ]),
      create: vi.fn(),
      getById: vi.fn(),
    }
    renderPage(repository)

    expect(await screen.findByText("SYN-001")).toBeVisible()
    expect(screen.queryByText("SYN-002")).not.toBeInTheDocument()
    expect(screen.getByLabelText("Clientes activos")).toHaveTextContent("1")
    expect(screen.getByLabelText("Clientes totales")).toHaveTextContent("2")
  })

  it("permite un reintento manual después de error", async () => {
    const user = userEvent.setup()
    const list = vi
      .fn()
      .mockRejectedValueOnce(new DomainError("NETWORK_ERROR", "No fue posible conectar"))
      .mockResolvedValueOnce([])
    const repository: ClientsRepository = { list, create: vi.fn(), getById: vi.fn() }
    renderPage(repository)

    expect(await screen.findByRole("alert")).toHaveTextContent("No pudimos cargar los clientes")
    await user.click(screen.getByRole("button", { name: "Reintentar" }))

    expect(await screen.findByText("Todavía no hay clientes")).toBeVisible()
    expect(list).toHaveBeenCalledTimes(2)
  })
})
