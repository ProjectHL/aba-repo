import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import { describe, expect, it, vi } from "vitest"

import { ClientsRepositoryProvider } from "@/features/clients/clients-repository"
import type { ClientsRepository } from "@/features/clients/clients-repository-contract"
import { NewClientPage } from "@/features/clients/new-client-page"
import { DomainError } from "@/lib/supabase/domain-error"

const createdClient = {
  id: "33333333-3333-4333-8333-333333333333",
  clinicalId: "SYN-003",
  initials: "EF",
  primaryLanguage: "Español",
  birthDate: "2018-01-02",
  status: "active" as const,
}

function renderNewClient(repository: ClientsRepository) {
  return render(
    <MemoryRouter initialEntries={["/clientes/nuevo"]}>
      <ClientsRepositoryProvider repository={repository}>
        <Routes>
          <Route path="/clientes/nuevo" element={<NewClientPage />} />
          <Route path="/clientes/:id" element={<h1>Detalle alcanzado</h1>} />
          <Route path="/clientes" element={<h1>Listado alcanzado</h1>} />
        </Routes>
      </ClientsRepositoryProvider>
    </MemoryRouter>
  )
}

async function fillRequiredFields(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText("Iniciales del cliente"), "EF")
  await user.type(screen.getByLabelText("ID del cliente"), "SYN-003")
  await user.type(screen.getByLabelText("Fecha de nacimiento"), "2018-01-02")
  await user.click(screen.getByLabelText(/Confirmo que usaré exclusivamente datos sintéticos/))
}

describe("NewClientPage", () => {
  it("crea una sola vez y navega al detalle con replace", async () => {
    const user = userEvent.setup()
    let resolveCreate: ((client: typeof createdClient) => void) | undefined
    const pending = new Promise<typeof createdClient>((resolve) => {
      resolveCreate = resolve
    })
    const create = vi.fn(() => pending)
    renderNewClient({ list: vi.fn(), create, getById: vi.fn() })
    await fillRequiredFields(user)

    const submit = screen.getByRole("button", { name: "Continuar con datos sintéticos" })
    await user.click(submit)
    await user.click(submit)
    expect(create).toHaveBeenCalledTimes(1)
    expect(create).toHaveBeenCalledWith(expect.any(Object), expect.stringMatching(/^[0-9a-f-]{36}$/))
    expect(screen.getByRole("button", { name: "Guardando…" })).toBeDisabled()

    resolveCreate?.(createdClient)
    expect(await screen.findByRole("heading", { name: "Detalle alcanzado" })).toBeVisible()
  })

  it("asocia un conflicto al ID sin perder los valores", async () => {
    const user = userEvent.setup()
    const repository: ClientsRepository = {
      list: vi.fn(),
      create: vi
        .fn()
        .mockRejectedValue(
          new DomainError("CLINICAL_ID_CONFLICT", "El ID clínico ya está en uso", "clinicalId")
        ),
      getById: vi.fn(),
    }
    renderNewClient(repository)
    await fillRequiredFields(user)
    await user.click(screen.getByRole("button", { name: "Continuar con datos sintéticos" }))

    expect(await screen.findByText("El ID clínico ya está en uso")).toBeVisible()
    const clinicalIdInput = screen.getByLabelText("ID del cliente")
    expect(clinicalIdInput).toHaveValue("SYN-003")
    expect(clinicalIdInput).toHaveAttribute("aria-invalid", "true")
    expect(clinicalIdInput).toHaveAttribute("aria-describedby", "clinicalId-error")
  })
})
