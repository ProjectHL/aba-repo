import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import { afterEach, describe, expect, it, vi } from "vitest"

import { AppRoutes } from "@/App"
import type { AuthService } from "@/auth/auth-context"
import { AuthProvider } from "@/auth/auth-provider"
import { ClientsRepositoryProvider } from "@/features/clients/clients-repository"
import { ClinicalPlansRepositoryProvider } from "@/features/clinical/clinical-plans-repository-context"
import { ClinicalReportRepositoryProvider } from "@/features/reports/clinical-report-repository-context"
import { createFakeAuthService } from "@/test/fakes/auth-service"

function renderRoutes(service: AuthService, initialEntry: string) {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <AuthProvider service={service}>
        <ClientsRepositoryProvider
          repository={{
            list: async () => [],
            create: vi.fn(),
            getById: vi.fn(),
          }}
        >
          <ClinicalPlansRepositoryProvider
            repository={{
              listProgramsByClient: vi.fn(),
              listGoalsByClient: vi.fn(),
              listBehaviorPlansByClient: vi.fn(),
              createProgram: vi.fn(),
              createGoal: vi.fn(),
              createBehaviorPlan: vi.fn(),
            }}
          >
            <ClinicalReportRepositoryProvider
              repository={{ readByClient: vi.fn() }}
            >
              <AppRoutes />
            </ClinicalReportRepositoryProvider>
          </ClinicalPlansRepositoryProvider>
        </ClientsRepositoryProvider>
      </AuthProvider>
    </MemoryRouter>
  )
}

describe("rutas autenticadas", () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it("inicia el acceso con Google desde la puerta pública", async () => {
    const user = userEvent.setup()
    const service = createFakeAuthService(null)
    renderRoutes(service, "/login")

    await user.click(
      await screen.findByRole("button", {
        name: "Crear cuenta o continuar con Google",
      })
    )

    expect(service.signInWithGoogle).toHaveBeenCalledTimes(1)
  })

  it("muestra un error genérico si Google no puede iniciar", async () => {
    const user = userEvent.setup()
    const service = createFakeAuthService(null)
    vi.mocked(service.signInWithGoogle).mockRejectedValueOnce(
      new Error("provider_secret_detail")
    )
    renderRoutes(service, "/login")

    await user.click(
      await screen.findByRole("button", {
        name: "Crear cuenta o continuar con Google",
      })
    )

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "No pudimos iniciar con Google"
    )
    expect(screen.getByRole("alert")).not.toHaveTextContent(
      "provider_secret_detail"
    )
  })

  it("mantiene visible el acceso Google sin abrir un proveedor aún deshabilitado", async () => {
    vi.stubEnv("VITE_GOOGLE_AUTH_ENABLED", "false")
    const user = userEvent.setup()
    const service = createFakeAuthService(null)
    renderRoutes(service, "/login")

    await user.click(
      await screen.findByRole("button", {
        name: "Crear cuenta o continuar con Google",
      })
    )

    expect(service.signInWithGoogle).not.toHaveBeenCalled()
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "El acceso con Google está en configuración"
    )
  })

  it("abre el registro clásico desde la puerta de acceso", async () => {
    const user = userEvent.setup()
    renderRoutes(createFakeAuthService(null), "/login")

    await user.click(
      await screen.findByRole("link", { name: "Crear cuenta con correo" })
    )

    expect(
      await screen.findByRole("heading", { name: "Crear cuenta" })
    ).toBeVisible()
  })

  it("no envía el registro si las contraseñas no coinciden", async () => {
    const user = userEvent.setup()
    const service = createFakeAuthService(null)
    renderRoutes(service, "/registro")

    await user.type(
      await screen.findByLabelText("Correo"),
      "professional@example.invalid"
    )
    await user.type(screen.getByLabelText("Contraseña"), "synthetic-pass-01")
    await user.type(
      screen.getByLabelText("Repetir contraseña"),
      "synthetic-pass-02"
    )
    await user.click(screen.getByRole("button", { name: "Crear cuenta" }))

    expect(service.signUp).not.toHaveBeenCalled()
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Las contraseñas no coinciden"
    )
  })

  it("no envía el registro con una contraseña corta", async () => {
    const user = userEvent.setup()
    const service = createFakeAuthService(null)
    renderRoutes(service, "/registro")

    await user.type(
      await screen.findByLabelText("Correo"),
      "professional@example.invalid"
    )
    await user.type(screen.getByLabelText("Contraseña"), "corta-01")
    await user.type(screen.getByLabelText("Repetir contraseña"), "corta-01")
    await user.click(screen.getByRole("button", { name: "Crear cuenta" }))

    expect(service.signUp).not.toHaveBeenCalled()
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "La contraseña debe tener al menos 12 caracteres"
    )
  })

  it("crea una identidad y solicita confirmar el correo", async () => {
    const user = userEvent.setup()
    const service = createFakeAuthService(null)
    renderRoutes(service, "/registro")

    await user.type(
      await screen.findByLabelText("Correo"),
      "professional@example.invalid"
    )
    await user.type(screen.getByLabelText("Contraseña"), "synthetic-pass-01")
    await user.type(
      screen.getByLabelText("Repetir contraseña"),
      "synthetic-pass-01"
    )
    await user.click(screen.getByRole("button", { name: "Crear cuenta" }))

    expect(service.signUp).toHaveBeenCalledTimes(1)
    expect(service.signUp).toHaveBeenCalledWith({
      email: "professional@example.invalid",
      password: "synthetic-pass-01",
    })
    expect(await screen.findByRole("status")).toHaveTextContent(
      "Revisa tu correo para confirmar la cuenta"
    )
    expect(
      screen.queryByRole("heading", { name: "Gestión de clientes" })
    ).not.toBeInTheDocument()
  })

  it("no filtra detalles internos cuando el registro falla", async () => {
    const user = userEvent.setup()
    const service = createFakeAuthService(null)
    vi.mocked(service.signUp).mockRejectedValueOnce(
      new Error("private_user_already_exists")
    )
    renderRoutes(service, "/registro")

    await user.type(
      await screen.findByLabelText("Correo"),
      "professional@example.invalid"
    )
    await user.type(screen.getByLabelText("Contraseña"), "synthetic-pass-01")
    await user.type(
      screen.getByLabelText("Repetir contraseña"),
      "synthetic-pass-01"
    )
    await user.click(screen.getByRole("button", { name: "Crear cuenta" }))

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "No pudimos crear la cuenta"
    )
    expect(screen.getByRole("alert")).not.toHaveTextContent(
      "private_user_already_exists"
    )
  })

  it("bloquea Clientes para una identidad pendiente", async () => {
    renderRoutes(
      createFakeAuthService({
        id: "google-pending",
        email: "pending@example.invalid",
        access: "pending",
      }),
      "/clientes"
    )

    expect(
      await screen.findByRole("heading", {
        name: "Acceso pendiente de aprobación",
      })
    ).toBeVisible()
    expect(
      screen.queryByRole("heading", { name: "Gestión de clientes" })
    ).not.toBeInTheDocument()
  })

  it("bloquea Clientes para una membresía inactiva", async () => {
    renderRoutes(
      createFakeAuthService({ id: "google-inactive", access: "inactive" }),
      "/clientes"
    )

    expect(
      await screen.findByRole("heading", { name: "Acceso desactivado" })
    ).toBeVisible()
    expect(
      screen.queryByRole("heading", { name: "Gestión de clientes" })
    ).not.toBeInTheDocument()
  })

  it("muestra una salida segura cuando Auth no puede arrancar", async () => {
    const service = createFakeAuthService(null)
    vi.mocked(service.subscribe).mockImplementationOnce(() => {
      throw new Error("sb_secret_never-visible")
    })
    renderRoutes(service, "/login")

    const alert = await screen.findByRole("alert")
    expect(alert).toHaveTextContent("El entorno de pruebas no está disponible")
    expect(alert).not.toHaveTextContent("sb_secret")
  })

  it("conserva una ruta interna y vuelve a ella después del login", async () => {
    const user = userEvent.setup()
    const service = createFakeAuthService(null)
    renderRoutes(service, "/clientes/nuevo")

    expect(
      await screen.findByRole("heading", { name: "Iniciar sesión" })
    ).toBeVisible()
    await user.type(screen.getByLabelText("Correo"), "user@example.invalid")
    await user.type(screen.getByLabelText("Contraseña"), "synthetic-password")
    await user.click(screen.getByRole("button", { name: "Iniciar sesión" }))

    expect(
      await screen.findByRole("heading", { name: "Añadir nuevo cliente" })
    ).toBeVisible()
  })

  it("envía un usuario autenticado desde login al listado", async () => {
    renderRoutes(
      createFakeAuthService({ id: "synthetic-user", access: "active" }),
      "/login"
    )

    expect(
      await screen.findByRole("heading", { name: "Gestión de clientes" })
    ).toBeVisible()
  })

  it("muestra 404 local para una ruta privada desconocida", async () => {
    renderRoutes(
      createFakeAuthService({ id: "synthetic-user", access: "active" }),
      "/ruta-inexistente"
    )

    expect(
      await screen.findByRole("heading", { name: "Página no encontrada" })
    ).toBeVisible()
  })

  it("abre informes derivados desde una ruta privada", async () => {
    renderRoutes(
      createFakeAuthService({ id: "synthetic-user", access: "active" }),
      "/informes"
    )

    expect(
      await screen.findByRole("heading", { name: "Informes y progreso" })
    ).toBeVisible()
    expect(screen.getByText("Periodo del informe")).toBeVisible()
    expect(screen.getByText("Informes clínicos derivados")).toBeVisible()
  })

  it("presenta un error genérico y enfocado sin filtrar la causa", async () => {
    const user = userEvent.setup()
    const service = createFakeAuthService(null)
    vi.mocked(service.signIn).mockRejectedValueOnce(
      new Error("user_not_found: private detail")
    )
    renderRoutes(service, "/login")

    await user.type(
      await screen.findByLabelText("Correo"),
      "unknown@example.invalid"
    )
    await user.type(screen.getByLabelText("Contraseña"), "wrong-password")
    await user.click(screen.getByRole("button", { name: "Iniciar sesión" }))

    const alert = await screen.findByRole("alert")
    expect(alert).toHaveTextContent("Credenciales no válidas")
    expect(alert).not.toHaveTextContent("user_not_found")
    expect(alert).toHaveFocus()
  })
})
