import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { EnvironmentBanner } from "@/components/environment-banner"

describe("EnvironmentBanner", () => {
  it("identifica staging de forma persistente y accesible", () => {
    render(<EnvironmentBanner environment="staging" />)

    expect(screen.getByRole("status")).toHaveTextContent("Entorno de pruebas")
    expect(screen.getByRole("status")).toHaveTextContent(
      "No ingresar datos reales ni de pacientes antiguos"
    )
  })

  it("no muestra un banner para local", () => {
    const { container } = render(<EnvironmentBanner environment="local" />)

    expect(container).toBeEmptyDOMElement()
  })
})
