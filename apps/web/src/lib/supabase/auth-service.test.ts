import { beforeEach, describe, expect, it, vi } from "vitest"

const authMocks = vi.hoisted(() => ({
  signUp: vi.fn(),
  resetPasswordForEmail: vi.fn(),
  updateUser: vi.fn(),
}))

vi.mock("@/lib/supabase/client", () => ({
  getSupabaseClient: () => ({
    auth: {
      signUp: authMocks.signUp,
      resetPasswordForEmail: authMocks.resetPasswordForEmail,
      updateUser: authMocks.updateUser,
    },
  }),
}))

import { supabaseAuthService } from "@/lib/supabase/auth-service"

describe("supabaseAuthService.signUp", () => {
  beforeEach(() => {
    authMocks.signUp.mockReset()
    authMocks.resetPasswordForEmail.mockReset()
    authMocks.updateUser.mockReset()
  })

  it("crea la identidad con retorno seguro al mismo origen", async () => {
    authMocks.signUp.mockResolvedValueOnce({ data: {}, error: null })

    await supabaseAuthService.signUp({
      email: "professional@example.invalid",
      password: "synthetic-pass-01",
    })

    expect(authMocks.signUp).toHaveBeenCalledWith({
      email: "professional@example.invalid",
      password: "synthetic-pass-01",
      options: {
        emailRedirectTo: new URL(
          "/clientes",
          window.location.origin
        ).toString(),
      },
    })
  })

  it("solicita recuperación con retorno limitado a la ruta local de contraseña", async () => {
    authMocks.resetPasswordForEmail.mockResolvedValueOnce({
      data: {},
      error: null,
    })

    await supabaseAuthService.requestPasswordRecovery(
      "professional@example.invalid"
    )

    expect(authMocks.resetPasswordForEmail).toHaveBeenCalledWith(
      "professional@example.invalid",
      {
        redirectTo: new URL(
          "/recuperar-contrasena",
          window.location.origin
        ).toString(),
      }
    )
  })

  it("actualiza sólo mediante el método Auth de la sesión actual", async () => {
    authMocks.updateUser.mockResolvedValueOnce({ data: {}, error: null })

    await supabaseAuthService.updatePassword("synthetic-pass-01")

    expect(authMocks.updateUser).toHaveBeenCalledWith({
      password: "synthetic-pass-01",
    })
  })
})
