import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { ClinicalHistoryFormDialog } from "@/features/clinical/forms/clinical-history-form-dialog"
import { ClientContextFormDialog } from "@/features/clinical/forms/client-context-form-dialog"
import type { StudentRecordRepository } from "@/features/clinical/student-record/student-record-repository-contract"
import { StudentRecordRepositoryProvider } from "@/features/clinical/student-record/student-record-repository-context"

function createRepository(overrides: Partial<StudentRecordRepository> = {}): StudentRecordRepository {
  return {
    load: vi.fn(), loadAccess: vi.fn(),
    saveContext: vi.fn().mockResolvedValue({ clientId: "client-a", homeAdaptations: "", schooling: "", schoolAdaptations: "", version: 1, updatedAt: "2026-08-30T12:00:00.000Z" }),
    appendHistoryEntry: vi.fn(), appendHistoryEntries: vi.fn().mockResolvedValue([]),
    recordConsent: vi.fn(), requestAuthorization: vi.fn(), decideAuthorization: vi.fn(),
    revokeAuthorization: vi.fn(), setAssignment: vi.fn(), ...overrides,
  }
}

function renderWithRepository(node: React.ReactNode, repository: StudentRecordRepository) {
  return render(
    <StudentRecordRepositoryProvider repository={repository}>{node}</StudentRecordRepositoryProvider>
  )
}

describe("formularios persistentes S-ABA-02", () => {
  it("guarda contexto remoto con una etiqueta de persistencia honesta", async () => {
    const user = userEvent.setup()
    const saveContext = vi.fn().mockResolvedValue({ clientId: "client-a", homeAdaptations: "Apoyo visual sintetico", schooling: "Modalidad sintética", schoolAdaptations: "", version: 1, updatedAt: "2026-08-30T12:00:00.000Z" })
    renderWithRepository(<ClientContextFormDialog clientId="client-a" context={null} onSaved={vi.fn()} />, createRepository({ saveContext }))

    await user.click(
      screen.getByRole("button", { name: "Ver formulario de Contexto hogar y colegio" })
    )
    expect(screen.getByText("Expediente persistente · ABA_staging sintético")).toBeVisible()
    await user.type(screen.getByLabelText("Adaptaciones en el hogar"), "Apoyo visual sintetico")
    await user.type(screen.getByLabelText("Escolarización"), "Modalidad sintética")
    await user.click(screen.getByRole("button", { name: "Guardar contexto" }))

    expect(await screen.findByRole("status")).toHaveTextContent("Contexto guardado")
    expect(saveContext).toHaveBeenCalledWith(expect.objectContaining({ homeAdaptations: "Apoyo visual sintetico" }))
  })

  it("conserva los valores cuando falla el guardado remoto", async () => {
    const user = userEvent.setup()
    const saveContext = vi.fn().mockRejectedValue(new Error("synthetic failure"))
    renderWithRepository(<ClientContextFormDialog clientId="client-a" context={null} onSaved={vi.fn()} />, createRepository({ saveContext }))

    await user.click(
      screen.getByRole("button", { name: "Ver formulario de Contexto hogar y colegio" })
    )
    await user.type(screen.getByLabelText("Adaptaciones en el hogar"), "Apoyo sintetico")
    await user.click(screen.getByRole("button", { name: "Guardar contexto" }))

    expect(await screen.findByRole("alert")).toHaveTextContent("Tus valores permanecen")
    expect(screen.getByLabelText("Adaptaciones en el hogar")).toHaveValue("Apoyo sintetico")
  })

  it("elimina solo la fila elegida y exige confirmación si contiene valores", async () => {
    const user = userEvent.setup()
    const confirm = vi.spyOn(window, "confirm").mockReturnValueOnce(false).mockReturnValueOnce(true)
    renderWithRepository(<ClinicalHistoryFormDialog clientId="client-a" onSaved={vi.fn()} />, createRepository())

    await user.click(
      screen.getByRole("button", { name: "Ver formulario de Historia clínica" })
    )
    await user.click(screen.getByRole("button", { name: "Añadir diagnóstico" }))
    await user.click(screen.getByRole("button", { name: "Añadir diagnóstico" }))
    await user.click(screen.getByRole("button", { name: "Añadir diagnóstico" }))

    const labels = screen.getAllByLabelText(/Descriptor del diagnóstico/)
    await user.type(labels[0], "Descriptor A")
    await user.type(labels[1], "Descriptor B")
    await user.type(labels[2], "Descriptor C")

    await user.click(screen.getByRole("button", { name: "Quitar diagnóstico 2" }))
    expect(screen.getAllByLabelText(/Descriptor del diagnóstico/)).toHaveLength(3)

    await user.click(screen.getByRole("button", { name: "Quitar diagnóstico 2" }))
    const remaining = screen.getAllByLabelText(/Descriptor del diagnóstico/)
    expect(remaining).toHaveLength(2)
    expect(remaining[0]).toHaveValue("Descriptor A")
    expect(remaining[1]).toHaveValue("Descriptor C")
    expect(confirm).toHaveBeenCalledTimes(2)
    confirm.mockRestore()
  })

  it("muestra errores de fechas y no envía un lote inválido", async () => {
    const user = userEvent.setup()
    const appendHistoryEntries = vi.fn()
    renderWithRepository(<ClinicalHistoryFormDialog clientId="client-a" onSaved={vi.fn()} />, createRepository({ appendHistoryEntries }))

    await user.click(
      screen.getByRole("button", { name: "Ver formulario de Historia clínica" })
    )
    await user.click(screen.getByRole("button", { name: "Añadir medicamento" }))
    const medication = screen.getByRole("group", { name: "Medicamento 1" })
    await user.type(within(medication).getByLabelText("Nombre del medicamento 1"), "Descriptor sintetico")
    await user.type(within(medication).getByLabelText("Inicio del medicamento 1"), "2026-02-10")
    await user.type(within(medication).getByLabelText("Término del medicamento 1"), "2026-02-09")
    await user.click(screen.getByRole("button", { name: "Guardar entradas" }))

    expect(screen.getByRole("alert")).toHaveTextContent(
      "El termino no puede ser anterior al inicio"
    )
    expect(appendHistoryEntries).not.toHaveBeenCalled()
  })
})
