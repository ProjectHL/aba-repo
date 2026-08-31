import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import {
  FunctionalAssessmentFormDialog,
  PreferenceAssessmentFormDialog,
} from "@/features/clinical/assessment-forms-dialog"

describe("formularios remotos CF-05", () => {
  it("envía preferencias con fecha separada y descarta el adjunto", async () => {
    const user = userEvent.setup()
    const onSave = vi.fn().mockResolvedValue("saved")

    render(
      <PreferenceAssessmentFormDialog
        onRetryRefresh={vi.fn().mockResolvedValue(true)}
        onSave={onSave}
      />
    )

    await user.click(
      screen.getByRole("button", {
        name: "Ver formulario de Evaluación de preferencias",
      })
    )
    await user.type(screen.getByLabelText("Fecha de evaluación (opcional)"), "2025-06-10")
    await user.type(screen.getByLabelText("Tipo de evaluación"), "Elección sintética")
    await user.type(
      screen.getByLabelText("Preferencia más alta"),
      "Actividad sintética"
    )
    await user.upload(
      screen.getByLabelText("Documento de apoyo (opcional)"),
      new File(["contenido sintético"], "evidencia-sintetica.pdf", {
        type: "application/pdf",
      })
    )

    expect(
      screen.getByText("Archivo seleccionado · no cargado: evidencia-sintetica.pdf")
    ).toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: "Guardar borrador" }))

    expect(onSave).toHaveBeenCalledWith({
      occurredOn: "2025-06-10",
      payload: {
        schema_version: 1,
        assessment_type: "Elección sintética",
        highest_preference: "Actividad sintética",
      },
    })
    expect(screen.getByRole("status")).toHaveTextContent(
      "Guardado en staging con RLS"
    )
  })

  it("reintenta sólo la lectura cuando la escritura quedó confirmada", async () => {
    const user = userEvent.setup()
    const onSave = vi.fn().mockResolvedValue("saved-stale")
    const onRetryRefresh = vi.fn().mockResolvedValue(true)

    render(
      <PreferenceAssessmentFormDialog
        onRetryRefresh={onRetryRefresh}
        onSave={onSave}
      />
    )
    await user.click(
      screen.getByRole("button", {
        name: "Ver formulario de Evaluación de preferencias",
      })
    )
    await user.type(screen.getByLabelText("Tipo de evaluación"), "Lista sintética")
    await user.type(screen.getByLabelText("Preferencia más alta"), "Objeto sintético")
    await user.click(screen.getByRole("button", { name: "Guardar borrador" }))
    await user.click(
      screen.getByRole("button", { name: "Reintentar actualización" })
    )

    expect(onSave).toHaveBeenCalledTimes(1)
    expect(onRetryRefresh).toHaveBeenCalledTimes(1)
    expect(screen.getByRole("status")).toHaveTextContent(
      "Guardado en staging con RLS"
    )
  })

  it("conserva los valores funcionales cuando la escritura falla", async () => {
    const user = userEvent.setup()
    const onSave = vi.fn().mockRejectedValue(new Error("detalle interno"))

    render(
      <FunctionalAssessmentFormDialog
        onRetryRefresh={vi.fn().mockResolvedValue(true)}
        onSave={onSave}
      />
    )
    await user.click(
      screen.getByRole("button", {
        name: "Ver formulario de Evaluación funcional",
      })
    )
    const target = screen.getByLabelText("Conducta observada")
    await user.type(target, "Conducta sintética observable")
    await user.click(screen.getByRole("button", { name: "Guardar borrador" }))

    expect(screen.getByRole("alert")).toHaveTextContent(
      "No pudimos guardar el borrador"
    )
    expect(target).toHaveValue("Conducta sintética observable")
    expect(screen.queryByText("detalle interno")).not.toBeInTheDocument()
  })
})
