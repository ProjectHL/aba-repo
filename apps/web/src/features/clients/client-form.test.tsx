import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { ClientForm } from "@/features/clients/client-form"
import { createClientFormSchema } from "@/features/clients/client-form-schema"

describe("ClientForm", () => {
  it("muestra los campos básicos observados en el video", () => {
    render(<ClientForm onSubmit={vi.fn()} />)

    expect(screen.getByRole("heading", { name: "Añadir nuevo cliente" })).toBeVisible()
    expect(screen.getByLabelText("Iniciales del cliente")).toBeVisible()
    expect(screen.getByLabelText("ID del cliente")).toBeVisible()
    expect(screen.getByLabelText("Idioma principal")).toBeVisible()
    expect(screen.getByLabelText("Fecha de nacimiento")).toBeVisible()
    expect(screen.getByLabelText("¿Con quién vive el cliente? (sin nombres)")).toBeVisible()
  })

  it("añade tutores y hermanos sin reemplazar los existentes", async () => {
    const user = userEvent.setup()
    render(<ClientForm onSubmit={vi.fn()} />)

    await user.click(screen.getByRole("button", { name: "Añadir padre o tutor" }))
    await user.click(screen.getByRole("button", { name: "Añadir padre o tutor" }))
    await user.click(screen.getByRole("button", { name: "Añadir hermano" }))

    expect(screen.getAllByLabelText(/Iniciales del padre o tutor/)).toHaveLength(2)
    expect(screen.getAllByLabelText(/Iniciales del hermano/)).toHaveLength(1)

    await user.click(screen.getByRole("button", { name: "Quitar padre o tutor 1" }))
    await user.click(screen.getByRole("button", { name: "Quitar hermano 1" }))

    expect(screen.getAllByLabelText(/Iniciales del padre o tutor/)).toHaveLength(1)
    expect(screen.queryByLabelText(/Iniciales del hermano/)).not.toBeInTheDocument()
  })

  it("calcula la edad visible al cambiar la fecha", async () => {
    const user = userEvent.setup()
    render(<ClientForm now={new Date("2025-09-15T12:00:00Z")} onSubmit={vi.fn()} />)

    await user.type(screen.getByLabelText("Fecha de nacimiento"), "2018-03-28")

    expect(screen.getByLabelText("Edad calculada")).toHaveValue("7 años, 5 meses")
  })

  it("bloquea el alta sin campos obligatorios y muestra resumen accesible", async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<ClientForm now={new Date("2025-09-15T12:00:00Z")} onSubmit={onSubmit} />)

    await user.click(screen.getByRole("button", { name: "Continuar con datos sintéticos" }))

    expect(onSubmit).not.toHaveBeenCalled()
    expect(screen.getByRole("alert")).toHaveTextContent("Revisa los campos obligatorios")
    expect(screen.getByText("Las iniciales son obligatorias")).toBeVisible()
    expect(screen.getByText("El ID clínico es obligatorio")).toBeVisible()
    expect(screen.getByText("La fecha de nacimiento es obligatoria")).toBeVisible()
  })

  it("rechaza una fecha futura", async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<ClientForm now={new Date("2025-09-15T12:00:00Z")} onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText("Iniciales del cliente"), "AB")
    await user.type(screen.getByLabelText("ID del cliente"), "SYN-003")
    await user.type(screen.getByLabelText("Fecha de nacimiento"), "2026-01-01")
    await user.click(
      screen.getByLabelText(/Confirmo que usaré exclusivamente datos sintéticos/)
    )
    await user.click(screen.getByRole("button", { name: "Continuar con datos sintéticos" }))

    expect(onSubmit).not.toHaveBeenCalled()
    expect(screen.getByText("La fecha no puede estar en el futuro")).toBeVisible()
  })

  it("rechaza identificadores directos", async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<ClientForm now={new Date("2026-03-10T12:00:00Z")} onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText("Iniciales del cliente"), "AB")
    await user.type(screen.getByLabelText("ID del cliente"), "12.345.678-5")
    await user.type(screen.getByLabelText("Fecha de nacimiento"), "2020-02-29")
    await user.click(
      screen.getByLabelText(/Confirmo que usaré exclusivamente datos sintéticos/)
    )
    await user.click(screen.getByRole("button", { name: "Continuar con datos sintéticos" }))

    expect(onSubmit).not.toHaveBeenCalled()
    expect(screen.getByText("No ingreses RUT ni correos reales")).toBeVisible()
  })

  it("acepta el ID sintético autorizado aunque contenga una subcadena numérica", () => {
    const result = createClientFormSchema(new Date("2026-08-31T12:00:00Z")).safeParse({
      birthDate: "1990-05-14",
      clientInitials: "UV",
      clinicalId: "E2E-SABA03-20260831",
      guardians: [],
      livingArrangement: "persona adulta independiente",
      primaryLanguage: "Español",
      siblings: [],
      syntheticDataConfirmed: true,
    })

    expect(result.success).toBe(true)
  })

  it("rechaza fechas de calendario imposibles en el contrato", () => {
    const result = createClientFormSchema(new Date("2026-03-10T12:00:00Z")).safeParse({
      birthDate: "2026-02-31",
      clientInitials: "AB",
      clinicalId: "SYN-005",
      guardians: [],
      livingArrangement: "",
      primaryLanguage: "Español",
      siblings: [],
      syntheticDataConfirmed: true,
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues).toEqual(
        expect.arrayContaining([expect.objectContaining({ message: "La fecha no es válida" })])
      )
    }
  })

  it("exige confirmar que el caso es sintético", async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<ClientForm now={new Date("2026-03-10T12:00:00Z")} onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText("Iniciales del cliente"), "AB")
    await user.type(screen.getByLabelText("ID del cliente"), "SYN-004")
    await user.type(screen.getByLabelText("Fecha de nacimiento"), "2020-02-29")
    await user.click(screen.getByRole("button", { name: "Continuar con datos sintéticos" }))

    expect(onSubmit).not.toHaveBeenCalled()
    expect(screen.getByText("Confirma que usarás exclusivamente datos sintéticos")).toBeVisible()
  })
})
