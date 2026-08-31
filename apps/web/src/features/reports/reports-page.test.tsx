import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { ClinicalPlansRepositoryProvider } from "@/features/clinical/clinical-plans-repository-context"
import { AssessmentRepositoryProvider } from "@/features/clinical/assessment-repository-context"
import { ClientsRepositoryProvider } from "@/features/clients/clients-repository"
import { ReportsPage } from "@/features/reports/reports-page"
import { ClinicalReportRepositoryProvider } from "@/features/reports/clinical-report-repository-context"

vi.mock("react-chartjs-2", () => ({
  Bar: () => <canvas />,
  Line: () => <canvas />,
}))

const { downloadCompleteReportPdfMock } = vi.hoisted(() => ({
  downloadCompleteReportPdfMock: vi.fn().mockResolvedValue(undefined),
}))

vi.mock("@/features/reports/complete-report-pdf", () => ({
  downloadCompleteReportPdf: downloadCompleteReportPdfMock,
}))

const clientId = "11111111-1111-4111-8111-111111111111"

function renderPage(
  overrides: {
    list?: () => Promise<unknown>
    report?: () => Promise<unknown>
    assessments?: () => Promise<unknown>
    programs?: () => Promise<unknown>
    goals?: () => Promise<unknown>
    behaviorPlans?: () => Promise<unknown>
    mode?: "progress" | "evaluation" | "complete"
  } = {}
) {
  return render(
    <MemoryRouter>
      <ClientsRepositoryProvider
        repository={{
          list:
            (overrides.list as never) ??
            vi.fn().mockResolvedValue([
              {
                id: clientId,
                clinicalId: "SYN-001",
                initials: "AB",
                primaryLanguage: "Español",
                birthDate: "2018-01-01",
                status: "active",
              },
            ]),
          create: vi.fn(),
          getById: vi.fn(),
        }}
      >
        <AssessmentRepositoryProvider
          repository={{
            listByClient:
              (overrides.assessments as never) ?? vi.fn().mockResolvedValue([]),
            create: vi.fn(),
          }}
        >
          <ClinicalPlansRepositoryProvider
            repository={{
            listProgramsByClient:
              (overrides.programs as never) ??
              vi.fn().mockResolvedValue([
                {
                  id: "program-1",
                  clientId,
                  name: "Programa base sintético",
                  description: null,
                  status: "active",
                  updatedAt: "2026-08-08T12:00:00Z",
                },
              ]),
            listGoalsByClient:
              (overrides.goals as never) ?? vi
                .fn()
                .mockResolvedValue([
                {
                  id: "goal-1",
                  clientId,
                  programId: "program-1",
                  skillArea: "Área base",
                  name: "Meta sintética",
                  masteryCriterion: "Criterio base",
                  teachingProcedure: "Procedimiento base",
                  status: "active",
                  position: 0,
                  updatedAt: "2026-08-08T12:00:00Z",
                },
              ]),
            listBehaviorPlansByClient:
              (overrides.behaviorPlans as never) ?? vi
                .fn()
                .mockResolvedValue([
                {
                  id: "plan-1",
                  clientId,
                  name: "Conducta sintética",
                  operationalDefinition: "Definición base",
                  measurementUnit: "frequency",
                  hypothesizedFunction: null,
                  antecedentStrategy: null,
                  replacementBehavior: null,
                  responseStrategy: null,
                  status: "active",
                  updatedAt: "2026-08-08T12:00:00Z",
                },
              ]),
            createProgram: vi.fn(),
            createGoal: vi.fn(),
            createBehaviorPlan: vi.fn(),
            }}
          >
            <ClinicalReportRepositoryProvider
              repository={{
              readByClient:
                (overrides.report as never) ??
                vi.fn().mockResolvedValue({
                  sessions: [
                    {
                      id: "session-1",
                      clientId,
                      occurredOn: "2026-08-08",
                      status: "completed",
                    },
                  ],
                  behaviorMeasurements: [
                    {
                      sessionId: "session-1",
                      clientId,
                      behaviorPlanId: "plan-1",
                      measurementUnit: "frequency",
                      intervalObserved: null,
                      intervalTotal: null,
                      value: 4,
                    },
                  ],
                  acquisitionTrials: [
                    {
                      sessionId: "session-1",
                      clientId,
                      goalId: "goal-1",
                      correct: 8,
                      incorrect: 2,
                    },
                  ],
                }),
              }}
            >
              <ReportsPage mode={overrides.mode} />
            </ClinicalReportRepositoryProvider>
          </ClinicalPlansRepositoryProvider>
        </AssessmentRepositoryProvider>
      </ClientsRepositoryProvider>
    </MemoryRouter>
  )
}

describe("ReportsPage", () => {
  beforeEach(() => {
    downloadCompleteReportPdfMock.mockReset()
    downloadCompleteReportPdfMock.mockResolvedValue(undefined)
  })
  it("muestra el informe derivado seleccionado, con evolución y porcentaje real", async () => {
    renderPage()
    expect(
      await screen.findByRole("option", { name: /AB · SYN-001/ })
    ).toBeVisible()
    expect(await screen.findByText("Conducta sintética")).toBeVisible()
    expect(screen.getByText("80.0%")).toBeVisible()
    expect(
      screen.getByRole("img", { name: "Gráfico de línea de Conducta sintética" })
    ).toBeVisible()
    expect(
      screen.getByRole("img", { name: "Gráfico de progreso por meta" })
    ).toBeVisible()
    expect(screen.getByText("1 sesión en el periodo")).toBeVisible()
    expect(
      screen.queryByRole("button", { name: /Descargar JPG/i })
    ).not.toBeInTheDocument()
  })

  it("expone pantallas separadas para el informe de evaluación y el informe completo", async () => {
    renderPage()

    expect(
      await screen.findByRole("link", { name: "Abrir informe de evaluación" })
    ).toHaveAttribute("href", "/informes/evaluacion")
    expect(
      screen.getByRole("link", { name: "Abrir informe completo" })
    ).toHaveAttribute("href", "/informes/completo")
  })

  it("compone evaluaciones persistidas compatibles sin exponer JSON crudo", async () => {
    renderPage({
      mode: "evaluation",
      assessments: () =>
        Promise.resolve([
          {
            id: "assessment-1",
            clientId,
            kind: "preference",
            status: "completed",
            title: "Preferencias sintéticas",
            occurredOn: "2026-08-08",
            updatedAt: "2026-08-08T12:00:00Z",
            payload: {
              schema_version: 1,
              assessment_type: "Elección sintética",
              highest_preference: "Actividad A",
              lowest_preference: "Actividad B",
            },
          },
        ]),
    })

    expect(await screen.findByText("Preferencias sintéticas")).toBeVisible()
    expect(screen.getByText("Elección sintética")).toBeVisible()
    expect(screen.getByText("Actividad A")).toBeVisible()
    expect(screen.queryByText(/schema_version/)).not.toBeInTheDocument()
  })

  it("ofrece el PDF local del informe completo y no ofrece JPG por serie", async () => {
    renderPage({ mode: "complete" })

    expect(
      await screen.findByRole("button", {
        name: "Descargar PDF del informe completo",
      })
    ).toBeVisible()
    expect(
      screen.queryByRole("button", { name: /Descargar JPG/i })
    ).not.toBeInTheDocument()
  })

  it("compone el informe completo con evaluación, adquisición, reducción y progreso", async () => {
    renderPage({
      mode: "complete",
      assessments: () =>
        Promise.resolve([
          {
            id: "assessment-1",
            clientId,
            kind: "functional",
            status: "completed",
            title: "Evaluación funcional sintética",
            occurredOn: "2026-08-08",
            updatedAt: "2026-08-08T12:00:00Z",
            payload: {
              schema_version: 1,
              target_behavior: "Conducta objetivo sintética",
              hypothesized_function: "Acceso sintético",
            },
          },
        ]),
      programs: () =>
        Promise.resolve([
          {
            id: "program-1",
            clientId,
            name: "Programa sintético",
            description: "Descripción sintética",
            status: "active",
            updatedAt: "2026-08-08T12:00:00Z",
          },
        ]),
      goals: () =>
        Promise.resolve([
          {
            id: "goal-1",
            clientId,
            programId: "program-1",
            skillArea: "Área sintética",
            name: "Meta sintética",
            masteryCriterion: "Criterio sintético",
            teachingProcedure: "Procedimiento sintético",
            status: "active",
            position: 0,
            updatedAt: "2026-08-08T12:00:00Z",
          },
        ]),
      behaviorPlans: () =>
        Promise.resolve([
          {
            id: "plan-1",
            clientId,
            name: "Plan sintético",
            operationalDefinition: "Definición sintética",
            measurementUnit: "frequency",
            hypothesizedFunction: "Función sintética",
            antecedentStrategy: "Antecedente sintético",
            replacementBehavior: "Reemplazo sintético",
            responseStrategy: "Respuesta sintética",
            status: "active",
            updatedAt: "2026-08-08T12:00:00Z",
          },
        ]),
    })

    expect(await screen.findByText("Evaluación funcional sintética")).toBeVisible()
    expect(screen.getByText("Programa sintético")).toBeVisible()
    expect(screen.getByText(/Criterio sintético/)).toBeVisible()
    expect(screen.getAllByText("Plan sintético").length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText(/Definición sintética/)).toBeVisible()
  })

  it("bloquea el PDF completo ante un payload de evaluación no compatible", async () => {
    renderPage({
      mode: "complete",
      assessments: () =>
        Promise.resolve([
          {
            id: "assessment-unknown",
            clientId,
            kind: "preference",
            status: "completed",
            title: "Versión futura sintética",
            occurredOn: "2026-08-08",
            updatedAt: "2026-08-08T12:00:00Z",
            payload: { schema_version: 99, private_field: "no mostrar" },
          },
        ]),
    })

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "versión no compatible"
    )
    expect(
      screen.getByRole("button", {
        name: "Descargar PDF del informe completo",
      })
    ).toBeDisabled()
    expect(screen.queryByText(/private_field/)).not.toBeInTheDocument()
  })

  it("evita descargas PDF duplicadas mientras prepara el archivo", async () => {
    const user = userEvent.setup()
    downloadCompleteReportPdfMock.mockImplementation(
      () => new Promise(() => undefined)
    )
    renderPage({ mode: "complete" })

    const button = await screen.findByRole("button", {
      name: "Descargar PDF del informe completo",
    })
    await user.dblClick(button)

    expect(downloadCompleteReportPdfMock).toHaveBeenCalledTimes(1)
    expect(button).toBeDisabled()
    expect(screen.getByRole("status")).toHaveTextContent(
      "Preparando PDF local"
    )
  })

  it("permite activar el PDF completo con teclado y confirma el inicio local", async () => {
    const user = userEvent.setup()
    renderPage({ mode: "complete" })

    const button = await screen.findByRole("button", {
      name: "Descargar PDF del informe completo",
    })
    button.focus()
    await user.keyboard("{Enter}")

    expect(downloadCompleteReportPdfMock).toHaveBeenCalledTimes(1)
    expect(screen.getByRole("status")).toHaveTextContent(
      "inició la descarga del PDF local"
    )
  })

  it("permite reintentar un error recuperable sin exponer detalles", async () => {
    const user = userEvent.setup()
    const readByClient = vi
      .fn()
      .mockRejectedValueOnce(new Error("private connection detail"))
      .mockResolvedValueOnce({
        sessions: [],
        behaviorMeasurements: [],
        acquisitionTrials: [],
      })
    renderPage({ report: readByClient })

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "No pudimos preparar el informe"
    )
    expect(screen.getByRole("alert")).not.toHaveTextContent(
      "private connection detail"
    )
    await user.click(screen.getByRole("button", { name: "Reintentar" }))
    expect(
      await screen.findByText(
        "Sin registros clínicos en el periodo seleccionado."
      )
    ).toBeVisible()
    expect(readByClient).toHaveBeenCalledTimes(2)
  })

  it("no consulta cuando el rango es inválido", async () => {
    const user = userEvent.setup()
    const readByClient = vi.fn().mockResolvedValue({
      sessions: [],
      behaviorMeasurements: [],
      acquisitionTrials: [],
    })
    renderPage({ report: readByClient })
    await screen.findByRole("option", { name: /AB · SYN-001/ })
    await user.clear(screen.getByLabelText("Desde"))
    await user.type(screen.getByLabelText("Desde"), "2026-08-30")
    await user.clear(screen.getByLabelText("Hasta"))
    await user.type(screen.getByLabelText("Hasta"), "2026-08-01")
    await user.click(screen.getByRole("button", { name: "Aplicar periodo" }))
    expect(
      screen.getByText(
        "La fecha inicial no puede ser posterior a la fecha final."
      )
    ).toBeVisible()
  })

  it("ofrece una alternativa textual al gráfico y limita el resumen de impresión", async () => {
    renderPage()

    const summary = await screen.findByLabelText("Resumen imprimible")
    expect(summary).toHaveClass("print:block")
    expect(summary).toHaveTextContent("AB · SYN-001")
    expect(summary).not.toHaveTextContent("2018-01-01")
    expect(
      screen.getByRole("button", { name: "Imprimir resumen" })
    ).toHaveClass("print:hidden")
    expect(
      screen.getByRole("list", { name: "Valores de Conducta sintética" })
    ).toHaveTextContent("2026-08-08: 4")
  })

  it("no ofrece JPG cuando la serie no tiene mediciones", async () => {
    renderPage({
      report: () =>
        Promise.resolve({
          sessions: [],
          behaviorMeasurements: [],
          acquisitionTrials: [],
        }),
    })

    expect(
      await screen.findByText("Sin registros clínicos en el periodo seleccionado.")
    ).toBeVisible()
    expect(
      screen.queryByRole("button", { name: /Descargar JPG/i })
    ).not.toBeInTheDocument()
  })
})
