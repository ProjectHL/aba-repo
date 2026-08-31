import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { useState } from "react"
import { describe, expect, it, vi } from "vitest"

import { AuthContext, type AuthContextValue } from "@/auth/auth-context"
import {
  FrontendDraftProvider,
} from "@/features/clinical/forms/frontend-draft-context"
import { useFrontendClinicalDrafts } from "@/features/clinical/forms/frontend-draft-store"

const activeAuth: AuthContextValue = {
  identity: { id: "synthetic-user", access: "active" },
  passwordRecoveryReady: false,
  requestPasswordRecovery: vi.fn(),
  signIn: vi.fn(),
  signInWithGoogle: vi.fn(),
  signOut: vi.fn(),
  signUp: vi.fn(),
  status: "authenticated",
  updatePassword: vi.fn(),
}

function DraftHarness() {
  const [clientId, setClientId] = useState("client-a")
  const { getDraft, updateContext } = useFrontendClinicalDrafts()
  const draft = getDraft(clientId)

  return (
    <>
      <button onClick={() => setClientId("client-a")}>Cliente A</button>
      <button onClick={() => setClientId("client-b")}>Cliente B</button>
      <label>
        Adaptaciones hogar
        <input
          onChange={(event) =>
            updateContext(clientId, { homeAdaptations: event.target.value })
          }
          value={draft.context.homeAdaptations}
        />
      </label>
    </>
  )
}

function renderHarness(auth = activeAuth) {
  return render(
    <AuthContext.Provider value={auth}>
      <FrontendDraftProvider>
        <DraftHarness />
      </FrontendDraftProvider>
    </AuthContext.Provider>
  )
}

describe("FrontendDraftProvider", () => {
  it("aísla borradores por cliente y conserva cada uno durante el montaje", async () => {
    const user = userEvent.setup()
    renderHarness()
    const input = screen.getByLabelText("Adaptaciones hogar")

    await user.type(input, "Adaptación sintética A")
    await user.click(screen.getByRole("button", { name: "Cliente B" }))
    expect(input).toHaveValue("")

    await user.type(input, "Adaptación sintética B")
    await user.click(screen.getByRole("button", { name: "Cliente A" }))
    expect(input).toHaveValue("Adaptación sintética A")
  })

  it("vacía todos los borradores al cerrar sesión", async () => {
    const user = userEvent.setup()
    const view = renderHarness()
    await user.type(
      screen.getByLabelText("Adaptaciones hogar"),
      "Adaptación sintética"
    )

    view.rerender(
      <AuthContext.Provider value={{ ...activeAuth, identity: null, status: "anonymous" }}>
        <FrontendDraftProvider>
          <DraftHarness />
        </FrontendDraftProvider>
      </AuthContext.Provider>
    )

    expect(screen.getByLabelText("Adaptaciones hogar")).toHaveValue("")
  })

  it("no persiste borradores después de remontar", async () => {
    const user = userEvent.setup()
    const view = renderHarness()
    await user.type(
      screen.getByLabelText("Adaptaciones hogar"),
      "Adaptación sintética"
    )
    view.unmount()

    renderHarness()
    expect(screen.getByLabelText("Adaptaciones hogar")).toHaveValue("")
  })
})
