import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom"
import { describe, expect, it, vi } from "vitest"

import {
  ClinicalJourneyCompass,
} from "@/features/clinical/forms/clinical-journey-compass"
import { clinicalJourneySteps } from "@/features/clinical/forms/clinical-journey-contract"

describe("ClinicalJourneyCompass", () => {
  it("mantiene el orden autoritativo y recomienda el siguiente módulo", async () => {
    const user = userEvent.setup()
    const onTabChange = vi.fn()
    render(
      <MemoryRouter>
        <ClinicalJourneyCompass
          activeStep="information"
          clientId="client/a"
          onTabChange={onTabChange}
        />
      </MemoryRouter>
    )

    expect(clinicalJourneySteps.map((step) => step.id)).toEqual([
      "information",
      "assessment",
      "acquisition",
      "reduction",
      "sessions",
      "reports",
    ])
    await user.click(
      screen.getByRole("button", { name: "Continuar a Evaluación" })
    )
    expect(onTabChange).toHaveBeenCalledWith("assessment")
  })

  it("lleva sesiones a informes conservando el cliente en el query", async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={["/clientes/client-a"]}>
        <Routes>
          <Route
            path="/clientes/:id"
            element={
              <ClinicalJourneyCompass
                activeStep="sessions"
                clientId="client/a"
                onTabChange={vi.fn()}
              />
            }
          />
          <Route
            path="/informes"
            element={<ReportLocation />}
          />
        </Routes>
      </MemoryRouter>
    )

    await user.click(
      screen.getByRole("link", { name: "Continuar a Informes" })
    )
    expect(screen.getByText("Informe del cliente ?client=client%2Fa")).toBeVisible()
  })
})

function ReportLocation() {
  const location = useLocation()
  return <p>Informe del cliente {location.search}</p>
}
