import { act, render, screen, waitFor } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { type AuthIdentity, type AuthService, useAuth } from "@/auth/auth-context"
import { AuthProvider } from "@/auth/auth-provider"
import { notifySessionInvalidated } from "@/auth/session-invalidation"

function AuthProbe() {
  const auth = useAuth()
  return <output>{`${auth.status}:${auth.identity?.id ?? "none"}`}</output>
}

function createAuthService(initialIdentity: AuthIdentity | null) {
  let listener: (() => void) | undefined
  const unsubscribe = vi.fn()
  const service: AuthService = {
    getIdentity: vi.fn().mockResolvedValue(initialIdentity),
    signIn: vi.fn(),
    signUp: vi.fn(),
    signInWithGoogle: vi.fn(),
    requestPasswordRecovery: vi.fn(),
    updatePassword: vi.fn(),
    signOut: vi.fn().mockResolvedValue(undefined),
    subscribe: vi.fn((nextListener) => {
      listener = nextListener
      return unsubscribe
    }),
  }
  return { service, unsubscribe, emitChange: () => listener?.() }
}

describe("AuthProvider", () => {
  it("no declara una sesión antes de comprobar la identidad", async () => {
    let resolveIdentity: ((identity: AuthIdentity | null) => void) | undefined
    const pendingIdentity = new Promise<AuthIdentity | null>((resolve) => {
      resolveIdentity = resolve
    })
    const { service } = createAuthService(null)
    vi.mocked(service.getIdentity).mockReturnValueOnce(pendingIdentity)

    render(
      <AuthProvider service={service}>
        <AuthProbe />
      </AuthProvider>
    )

    expect(screen.getByText("initializing:none")).toBeVisible()

    resolveIdentity?.({ id: "synthetic-user", access: "active" })

    expect(await screen.findByText("authenticated:synthetic-user")).toBeVisible()
  })

  it("resuelve anonymous y libera la suscripción al desmontar", async () => {
    const { service, unsubscribe } = createAuthService(null)
    const view = render(
      <AuthProvider service={service}>
        <AuthProbe />
      </AuthProvider>
    )

    expect(await screen.findByText("anonymous:none")).toBeVisible()
    expect(service.subscribe).toHaveBeenCalledTimes(1)

    view.unmount()
    expect(unsubscribe).toHaveBeenCalledTimes(1)
  })

  it("declara el servicio indisponible si la suscripción falla al arrancar", async () => {
    const { service } = createAuthService(null)
    vi.mocked(service.subscribe).mockImplementationOnce(() => {
      throw new Error("Configuración privada que no debe mostrarse")
    })

    render(
      <AuthProvider service={service}>
        <AuthProbe />
      </AuthProvider>
    )

    expect(await screen.findByText("unavailable:none")).toBeVisible()
  })

  it("revalida identidad cuando Auth notifica un cambio", async () => {
    const { service, emitChange } = createAuthService(null)
    render(
      <AuthProvider service={service}>
        <AuthProbe />
      </AuthProvider>
    )
    await screen.findByText("anonymous:none")
    vi.mocked(service.getIdentity).mockResolvedValueOnce({ id: "synthetic-user-2", access: "active" })

    await act(async () => emitChange())

    await waitFor(() =>
      expect(screen.getByText("authenticated:synthetic-user-2")).toBeVisible()
    )
  })

  it("cierra la sesión cuando una consulta informa 401", async () => {
    const { service } = createAuthService({ id: "synthetic-user", access: "active" })
    render(
      <AuthProvider service={service}>
        <AuthProbe />
      </AuthProvider>
    )
    await screen.findByText("authenticated:synthetic-user")

    act(() => notifySessionInvalidated())

    await waitFor(() => expect(screen.getByText("anonymous:none")).toBeVisible())
    expect(service.signOut).toHaveBeenCalledTimes(1)
  })
})
