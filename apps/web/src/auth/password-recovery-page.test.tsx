import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import { describe, expect, it, vi } from "vitest"

import { AuthContext, type AuthContextValue } from "@/auth/auth-context"
import { PasswordRecoveryPage } from "@/auth/password-recovery-page"
import { ResetPasswordPage } from "@/auth/reset-password-page"

function renderWithAuth(
  page: React.ReactNode,
  overrides: Partial<AuthContextValue> = {}
) {
  const value: AuthContextValue = {
    status: "anonymous",
    identity: null,
    passwordRecoveryReady: false,
    signIn: vi.fn(),
    signUp: vi.fn(),
    signInWithGoogle: vi.fn(),
    requestPasswordRecovery: vi.fn(),
    updatePassword: vi.fn(),
    signOut: vi.fn(),
    ...overrides,
  }
  return {
    ...render(
      <MemoryRouter>
        <AuthContext.Provider value={value}>{page}</AuthContext.Provider>
      </MemoryRouter>
    ),
    value,
  }
}

describe("recuperación de contraseña", () => {
  it("solicita el vínculo y confirma sin revelar si existe una cuenta", async () => {
    const user = userEvent.setup()
    const requestPasswordRecovery = vi.fn().mockResolvedValue(undefined)
    renderWithAuth(<PasswordRecoveryPage />, { requestPasswordRecovery })

    await user.type(
      screen.getByLabelText("Correo"),
      "professional@example.invalid"
    )
    await user.click(screen.getByRole("button", { name: "Enviar vínculo" }))

    expect(requestPasswordRecovery).toHaveBeenCalledWith(
      "professional@example.invalid"
    )
    expect(await screen.findByRole("status")).toHaveTextContent(
      "Si el correo corresponde a una cuenta"
    )
  })

  it("muestra un error genérico si no se puede solicitar el vínculo", async () => {
    const user = userEvent.setup()
    renderWithAuth(<PasswordRecoveryPage />, {
      requestPasswordRecovery: vi
        .fn()
        .mockRejectedValue(new Error("private transport detail")),
    })

    await user.type(
      screen.getByLabelText("Correo"),
      "professional@example.invalid"
    )
    await user.click(screen.getByRole("button", { name: "Enviar vínculo" }))

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "No pudimos enviar el vínculo"
    )
    expect(screen.getByRole("alert")).not.toHaveTextContent(
      "private transport detail"
    )
  })

  it("bloquea un vínculo de recuperación no validado", () => {
    renderWithAuth(<ResetPasswordPage />)
    expect(
      screen.getByRole("heading", { name: "Vínculo no disponible" })
    ).toBeVisible()
    expect(screen.queryByLabelText("Nueva contraseña")).not.toBeInTheDocument()
  })

  it("actualiza una contraseña válida, cierra la sesión temporal y vuelve a Login", async () => {
    const user = userEvent.setup()
    const updatePassword = vi.fn().mockResolvedValue(undefined)
    const signOut = vi.fn().mockResolvedValue(undefined)
    renderWithAuth(
      <Routes>
        <Route path="*" element={<ResetPasswordPage />} />
        <Route path="/login" element={<h1>Iniciar sesión</h1>} />
      </Routes>,
      { passwordRecoveryReady: true, updatePassword, signOut }
    )

    await user.type(
      screen.getByLabelText("Nueva contraseña"),
      "synthetic-pass-01"
    )
    await user.type(
      screen.getByLabelText("Repetir contraseña"),
      "synthetic-pass-01"
    )
    await user.click(
      screen.getByRole("button", { name: "Actualizar contraseña" })
    )

    expect(updatePassword).toHaveBeenCalledWith("synthetic-pass-01")
    expect(signOut).toHaveBeenCalledTimes(1)
    expect(
      await screen.findByRole("heading", { name: "Iniciar sesión" })
    ).toBeVisible()
  })

  it("no actualiza una contraseña corta o distinta", async () => {
    const user = userEvent.setup()
    const updatePassword = vi.fn()
    renderWithAuth(<ResetPasswordPage />, {
      passwordRecoveryReady: true,
      updatePassword,
    })

    await user.type(screen.getByLabelText("Nueva contraseña"), "corta")
    await user.type(screen.getByLabelText("Repetir contraseña"), "otra")
    await user.click(
      screen.getByRole("button", { name: "Actualizar contraseña" })
    )

    expect(updatePassword).not.toHaveBeenCalled()
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "al menos 12 caracteres"
    )
  })
})
