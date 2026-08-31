import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import { describe, expect, it, vi } from "vitest"

import { AppRoutes } from "@/App"
import { AuthProvider } from "@/auth/auth-provider"
import { ClientsRepositoryProvider } from "@/features/clients/clients-repository"
import { createFakeAuthService } from "@/test/fakes/auth-service"

describe("client navigation", () => {
  it("navega desde Gestión de clientes al alta", async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={["/clientes"]}>
        <AuthProvider service={createFakeAuthService({ id: "synthetic-user", access: "active" })}>
          <ClientsRepositoryProvider
            repository={{ list: async () => [], create: vi.fn(), getById: vi.fn() }}
          >
            <AppRoutes />
          </ClientsRepositoryProvider>
        </AuthProvider>
      </MemoryRouter>
    )

    expect(await screen.findByRole("heading", { name: "Gestión de clientes" })).toBeVisible()

    await user.click(screen.getByRole("link", { name: "Añadir nuevo cliente" }))

    expect(screen.getByRole("heading", { name: "Añadir nuevo cliente" })).toBeVisible()
  })
})
