import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import { describe, expect, it, vi } from "vitest"

import { ClientDetailPage } from "@/features/clients/client-detail-page"
import {
  ClientsRepositoryProvider,
  type ClientsRepository,
} from "@/features/clients/clients-repository"
import { DomainError } from "@/lib/supabase/domain-error"
import { AssessmentRepositoryProvider } from "@/features/clinical/assessment-repository-context"
import type { AssessmentRepository } from "@/features/clinical/assessment-repository-contract"
import { ClinicalPlansRepositoryProvider } from "@/features/clinical/clinical-plans-repository-context"
import type { ClinicalPlansRepository } from "@/features/clinical/clinical-plans-repository-contract"
import { ClinicalSessionRepositoryProvider } from "@/features/clinical/clinical-session-repository-context"
import type { ClinicalSessionRepository } from "@/features/clinical/clinical-session-repository-contract"
import { AuthContext, type AuthContextValue } from "@/auth/auth-context"
import { FrontendDraftProvider } from "@/features/clinical/forms/frontend-draft-context"
import { StudentRecordRepositoryProvider } from "@/features/clinical/student-record/student-record-repository-context"
import type { StudentRecordRepository } from "@/features/clinical/student-record/student-record-repository-contract"

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

const syntheticClient = {
  birthDate: "2019-04-12",
  clinicalId: "SYN-DETAIL-001",
  id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
  initials: "QA",
  livingArrangement: "Con tutores sintéticos",
  primaryLanguage: "Español",
  status: "active" as const,
  guardians: [],
  siblings: [],
}

const syntheticProgram = {
  id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
  clientId: syntheticClient.id,
  name: "Comunicación sintética",
  description: null,
  status: "active" as const,
  updatedAt: "2026-08-18T12:00:00.000Z",
}

const syntheticGoal = {
  id: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
  clientId: syntheticClient.id,
  programId: syntheticProgram.id,
  skillArea: "Comunicación",
  name: "Solicitud sintética",
  masteryCriterion: "80 por ciento",
  teachingProcedure: "Ensayos sintéticos",
  status: "active" as const,
  position: 0,
  updatedAt: "2026-08-18T12:00:00.000Z",
}

const syntheticBehaviorPlan = {
  id: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
  clientId: syntheticClient.id,
  name: "Conducta sintética",
  operationalDefinition: "Definición observable sintética",
  measurementUnit: "frequency" as const,
  hypothesizedFunction: "Acceso sintético",
  antecedentStrategy: null,
  replacementBehavior: null,
  responseStrategy: null,
  status: "active" as const,
  updatedAt: "2026-08-18T12:00:00.000Z",
}

const measurementPlans = [
  syntheticBehaviorPlan,
  {
    ...syntheticBehaviorPlan,
    id: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
    name: "Duración sintética",
    measurementUnit: "duration" as const,
  },
  {
    ...syntheticBehaviorPlan,
    id: "ffffffff-ffff-4fff-8fff-ffffffffffff",
    name: "Latencia sintética",
    measurementUnit: "latency" as const,
  },
  {
    ...syntheticBehaviorPlan,
    id: "99999999-9999-4999-8999-999999999999",
    name: "Intervalo sintético",
    measurementUnit: "interval" as const,
  },
]

function renderDetail(
  repository: ClientsRepository,
  clinicalOverrides: Partial<ClinicalPlansRepository> = {},
  sessionOverrides: Partial<ClinicalSessionRepository> = {},
  assessmentOverrides: Partial<AssessmentRepository> = {}
) {
  const assessmentRepository: AssessmentRepository = {
    create: vi.fn(),
    listByClient: vi.fn().mockResolvedValue([]),
    ...assessmentOverrides,
  }
  const clinicalRepository: ClinicalPlansRepository = {
    listProgramsByClient: vi.fn().mockResolvedValue([]),
    listGoalsByClient: vi.fn().mockResolvedValue([]),
    listBehaviorPlansByClient: vi.fn().mockResolvedValue([]),
    createProgram: vi.fn(),
    createGoal: vi.fn(),
    createBehaviorPlan: vi.fn(),
    ...clinicalOverrides,
  }
  const sessionRepository: ClinicalSessionRepository = {
    listByClient: vi.fn().mockResolvedValue([]),
    createAtomic: vi.fn(),
    ...sessionOverrides,
  }
  const studentRecordRepository: StudentRecordRepository = {
    load: vi
      .fn()
      .mockResolvedValue({ context: null, history: [], consents: [] }),
    loadAccess: vi.fn().mockResolvedValue({
      currentAssignment: {
        id: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
        clientId: syntheticClient.id,
        userId: "synthetic-user",
        role: "supervisor",
        isPrimary: true,
        status: "active",
      },
      team: [],
      requests: [],
      decisions: [],
      capabilities: [
        "student.view",
        "student.edit",
        "program.view",
        "program.edit",
      ],
    }),
    saveContext: vi.fn(),
    appendHistoryEntry: vi.fn(),
    appendHistoryEntries: vi.fn(),
    recordConsent: vi.fn(),
    requestAuthorization: vi.fn(),
    decideAuthorization: vi.fn(),
    revokeAuthorization: vi.fn(),
    setAssignment: vi.fn(),
  }
  return render(
    <MemoryRouter initialEntries={[`/clientes/${syntheticClient.id}`]}>
      <AuthContext.Provider value={activeAuth}>
        <FrontendDraftProvider>
          <StudentRecordRepositoryProvider repository={studentRecordRepository}>
            <ClinicalSessionRepositoryProvider repository={sessionRepository}>
              <ClinicalPlansRepositoryProvider repository={clinicalRepository}>
                <AssessmentRepositoryProvider repository={assessmentRepository}>
                  <ClientsRepositoryProvider repository={repository}>
                    <Routes>
                      <Route
                        path="/clientes/:id"
                        element={<ClientDetailPage />}
                      />
                      <Route path="/clientes" element={<h1>Listado</h1>} />
                    </Routes>
                  </ClientsRepositoryProvider>
                </AssessmentRepositoryProvider>
              </ClinicalPlansRepositoryProvider>
            </ClinicalSessionRepositoryProvider>
          </StudentRecordRepositoryProvider>
        </FrontendDraftProvider>
      </AuthContext.Provider>
    </MemoryRouter>
  )
}

describe("ClientDetailPage", () => {
  it("muestra el detalle sintético", async () => {
    renderDetail({
      create: vi.fn(),
      getById: vi.fn().mockResolvedValue(syntheticClient),
      list: vi.fn(),
    })

    expect(screen.getByRole("status")).toHaveTextContent("Cargando cliente")
    expect(
      await screen.findByRole("heading", { name: "Detalle del cliente" })
    ).toBeVisible()
    expect(screen.getAllByText("SYN-DETAIL-001").length).toBeGreaterThan(0)
    expect(screen.getByRole("tab", { name: "Información" })).toBeVisible()
    expect(
      screen.getByRole("tab", { name: "Evaluación conductual" })
    ).toBeVisible()
    expect(
      screen.getByRole("tab", { name: "Programas de adquisición" })
    ).toBeVisible()
    expect(
      screen.getByRole("tab", { name: "Reducción de conductas" })
    ).toBeVisible()
    expect(screen.getByRole("tab", { name: "Sesiones" })).toBeVisible()
  })

  it("expone consentimiento referencial y acceso por estudiante", async () => {
    renderDetail({
      create: vi.fn(),
      getById: vi.fn().mockResolvedValue(syntheticClient),
      list: vi.fn(),
    })

    await screen.findByRole("heading", { name: "Detalle del cliente" })
    expect(screen.getByText("Consentimiento por finalidad")).toBeVisible()
    expect(screen.getByText("Usuarios asignados")).toBeVisible()
    expect(
      await screen.findByRole("button", { name: "Registrar referencia" })
    ).toBeVisible()
    expect(
      screen.getByRole("button", { name: /asignar usuario/i })
    ).toBeVisible()
  })

  it("recorre las vistas clínicas sin perder el contexto del cliente", async () => {
    const user = userEvent.setup()
    renderDetail({
      create: vi.fn(),
      getById: vi.fn().mockResolvedValue(syntheticClient),
      list: vi.fn(),
    })
    await screen.findByRole("heading", { name: "Detalle del cliente" })

    await user.click(screen.getByRole("tab", { name: "Evaluación conductual" }))
    expect(
      screen.getByRole("heading", { name: "Evaluación conductual" })
    ).toBeVisible()
    expect(screen.getByText("Entrevista inicial")).toBeVisible()
    expect(screen.getByText("Evaluación de preferencias")).toBeVisible()
    expect(screen.getByText("Evaluación funcional")).toBeVisible()

    await user.click(
      screen.getByRole("tab", { name: "Programas de adquisición" })
    )
    expect(
      screen.getByRole("heading", { name: "Programas de adquisición" })
    ).toBeVisible()
    expect(screen.getByText("Metas de adquisición")).toBeVisible()

    await user.click(
      screen.getByRole("tab", { name: "Reducción de conductas" })
    )
    expect(
      screen.getByRole("heading", { name: "Reducción de conductas" })
    ).toBeVisible()
    expect(screen.getByText("Planes de conducta")).toBeVisible()
    expect(screen.getByText("Funciones e intervención")).toBeVisible()

    await user.click(screen.getByRole("tab", { name: "Sesiones" }))
    expect(
      screen.getByRole("heading", { name: "Registro de sesión" })
    ).toBeVisible()
    expect(screen.getByText("Conductas a disminuir")).toBeVisible()
    expect(screen.getByText("Metas en adquisición")).toBeVisible()
    expect(screen.getAllByText("SYN-DETAIL-001").length).toBeGreaterThan(0)
  })

  it("mantiene informantes independientes y persiste sólo las filas vigentes", async () => {
    const user = userEvent.setup()
    const create = vi.fn().mockResolvedValue({})
    renderDetail(
      {
        create: vi.fn(),
        getById: vi.fn().mockResolvedValue(syntheticClient),
        list: vi.fn(),
      },
      {},
      {},
      { create }
    )

    await screen.findByRole("heading", { name: "Detalle del cliente" })
    await user.click(screen.getByRole("tab", { name: "Evaluación conductual" }))
    const interviewTrigger = screen.getByRole("button", {
      name: "Ver formulario de Entrevista inicial",
    })
    interviewTrigger.focus()
    await user.keyboard("{Enter}")

    await user.type(
      screen.getByLabelText("Motivo de consulta"),
      "Motivo sintético"
    )
    await user.type(
      screen.getByLabelText("Historia del desarrollo"),
      "Historia sintética"
    )
    await user.type(
      screen.getByLabelText("Contexto familiar"),
      "Contexto sintético"
    )
    await user.type(screen.getByLabelText("Prioridades"), "Prioridad sintética")
    await user.type(screen.getByLabelText("Informante 1"), "Tutor sintético A")
    await user.type(
      screen.getByLabelText("Fortalezas del informante 1"),
      "Fortaleza A"
    )
    await user.type(
      screen.getByLabelText("Necesidades del informante 1"),
      "Necesidad A"
    )

    await user.click(screen.getByRole("button", { name: "Añadir informante" }))
    await user.type(screen.getByLabelText("Informante 2"), "Tutor sintético B")
    await user.type(
      screen.getByLabelText("Fortalezas del informante 2"),
      "Fortaleza B"
    )
    await user.type(
      screen.getByLabelText("Necesidades del informante 2"),
      "Necesidad B"
    )
    await user.click(
      screen.getByRole("button", { name: "Quitar informante 1" })
    )

    expect(screen.getByLabelText("Informante 1")).toHaveValue(
      "Tutor sintético B"
    )
    expect(screen.getByLabelText("Fortalezas del informante 1")).toHaveValue(
      "Fortaleza B"
    )
    await user.click(screen.getByRole("button", { name: "Guardar borrador" }))

    expect(create).toHaveBeenCalledWith({
      clientId: syntheticClient.id,
      kind: "initial_interview",
      title: "Entrevista inicial",
      payload: {
        schema_version: 1,
        consultation_reason: "Motivo sintético",
        development_history: "Historia sintética",
        family_context: "Contexto sintético",
        priorities: "Prioridad sintética",
        informants: [
          {
            informant: "Tutor sintético B",
            strengths: "Fortaleza B",
            needs: "Necesidad B",
          },
        ],
      },
    })
  })

  it("conserva toda la entrevista dinámica cuando falla el guardado", async () => {
    const user = userEvent.setup()
    const create = vi.fn().mockRejectedValue(new Error("fallo sintético"))
    renderDetail(
      {
        create: vi.fn(),
        getById: vi.fn().mockResolvedValue(syntheticClient),
        list: vi.fn(),
      },
      {},
      {},
      { create }
    )

    await screen.findByRole("heading", { name: "Detalle del cliente" })
    await user.click(screen.getByRole("tab", { name: "Evaluación conductual" }))
    await user.click(
      screen.getByRole("button", {
        name: "Ver formulario de Entrevista inicial",
      })
    )
    await user.type(
      screen.getByLabelText("Motivo de consulta"),
      "Motivo retenido"
    )
    await user.type(
      screen.getByLabelText("Historia del desarrollo"),
      "Historia retenida"
    )
    await user.type(
      screen.getByLabelText("Contexto familiar"),
      "Contexto retenido"
    )
    await user.type(screen.getByLabelText("Prioridades"), "Prioridad retenida")
    await user.type(screen.getByLabelText("Informante 1"), "Tutor retenido")
    await user.type(
      screen.getByLabelText("Fortalezas del informante 1"),
      "Fortaleza retenida"
    )
    await user.type(
      screen.getByLabelText("Necesidades del informante 1"),
      "Necesidad retenida"
    )
    await user.click(screen.getByRole("button", { name: "Guardar borrador" }))

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "No pudimos guardar el borrador."
    )
    expect(screen.getByLabelText("Motivo de consulta")).toHaveValue(
      "Motivo retenido"
    )
    expect(screen.getByLabelText("Informante 1")).toHaveValue("Tutor retenido")
  })

  it("guarda una meta vinculada a un programa existente", async () => {
    const user = userEvent.setup()
    const createGoal = vi.fn().mockResolvedValue({})
    renderDetail(
      {
        create: vi.fn(),
        getById: vi.fn().mockResolvedValue(syntheticClient),
        list: vi.fn(),
      },
      {
        listProgramsByClient: vi.fn().mockResolvedValue([syntheticProgram]),
        createGoal,
      }
    )
    await screen.findByRole("heading", { name: "Detalle del cliente" })
    await user.click(
      screen.getByRole("tab", { name: "Programas de adquisición" })
    )
    await screen.findByText(
      "1 programa(s) activo(s). Agrupa metas por área de intervención."
    )
    await user.click(
      screen.getByRole("button", {
        name: "Ver formulario de Nueva meta de adquisición",
      })
    )
    await user.selectOptions(
      screen.getByLabelText("Programa"),
      syntheticProgram.id
    )
    await user.type(screen.getByLabelText("Área de habilidad"), "Comunicación")
    await user.type(
      screen.getByLabelText("Nombre de la meta"),
      "Solicitud sintética"
    )
    await user.type(
      screen.getByLabelText("Criterio de dominio"),
      "80 por ciento"
    )
    await user.type(
      screen.getByLabelText("Procedimiento de enseñanza"),
      "Ensayos sintéticos"
    )
    await user.click(screen.getByRole("button", { name: "Guardar borrador" }))

    expect(createGoal).toHaveBeenCalledWith(
      expect.objectContaining({
        clientId: syntheticClient.id,
        programId: syntheticProgram.id,
        skillArea: "Comunicación",
        name: "Solicitud sintética",
      })
    )
  })

  it("crea un borrador versionado de adquisición con diseño completo", async () => {
    const user = userEvent.setup()
    const createVersionedProgramDraft = vi.fn().mockResolvedValue({
      id: "11111111-1111-4111-8111-111111111111",
      version: 1,
      title: "Programa versionado sintético",
      design: {},
    })
    renderDetail(
      {
        create: vi.fn(),
        getById: vi.fn().mockResolvedValue(syntheticClient),
        list: vi.fn(),
      },
      {
        listVersionedProgramsByClient: vi.fn().mockResolvedValue([]),
        createVersionedProgramDraft,
      }
    )

    await screen.findByRole("heading", { name: "Detalle del cliente" })
    await user.click(
      screen.getByRole("tab", { name: "Programas de adquisición" })
    )
    expect(await screen.findByText("Sin programas versionados.")).toBeVisible()
    await user.click(
      screen.getByRole("button", { name: "Nuevo programa versionado" })
    )
    await user.type(
      screen.getByLabelText("Nombre del programa"),
      "Programa versionado sintético"
    )
    await user.type(screen.getByLabelText("Área de habilidad"), "Comunicación")
    await user.type(screen.getByLabelText("Objetivo"), "Solicitar un objeto")
    await user.type(screen.getByLabelText("Antecedente"), "Objeto visible")
    await user.type(
      screen.getByLabelText("Pasos (uno por línea)"),
      "Orientarse\nSolicitar"
    )
    await user.type(
      screen.getByLabelText("Procedimiento de enseñanza"),
      "Ensayo sintético"
    )
    await user.type(
      screen.getByLabelText("Sets (Set: ítem 1, ítem 2)"),
      "Set A: Objeto A"
    )
    await user.type(
      screen.getByLabelText("Niveles de ayuda (uno por línea)"),
      "Independiente\nGestual"
    )
    await user.type(
      screen.getByLabelText("Corrección de error"),
      "Repetir con ayuda"
    )
    await user.type(
      screen.getByLabelText("Criterio de logro"),
      "80% en tres sesiones"
    )
    await user.click(
      screen.getByRole("button", { name: "Guardar borrador versionado" })
    )

    expect(createVersionedProgramDraft).toHaveBeenCalledWith(
      expect.objectContaining({
        clientId: syntheticClient.id,
        type: "acquisition",
        title: "Programa versionado sintético",
        design: expect.objectContaining({
          kind: "acquisition",
          steps: ["Orientarse", "Solicitar"],
          sets: [{ name: "Set A", items: ["Objeto A"] }],
        }),
      })
    )
  })

  it("activa un borrador versionado mediante la transición tipada", async () => {
    const user = userEvent.setup()
    const transitionVersionedProgram = vi.fn().mockResolvedValue(undefined)
    const draftVersion = {
      id: "11111111-1111-4111-8111-111111111111",
      version: 1,
      title: "Programa versionado sintético",
      design: {
        kind: "acquisition" as const,
        goal: "Solicitar",
        skillArea: "Comunicación",
        antecedent: "Objeto visible",
        steps: ["Solicitar"],
        teachingProcedure: "Ensayo",
        sets: [{ name: "Set A", items: ["Objeto A"] }],
        promptLevels: ["Independiente"],
        errorCorrection: "Repetir",
        masteryCriterion: "80%",
        generalization: null,
        maintenance: null,
      },
    }
    renderDetail(
      {
        create: vi.fn(),
        getById: vi.fn().mockResolvedValue(syntheticClient),
        list: vi.fn(),
      },
      {
        listVersionedProgramsByClient: vi.fn().mockResolvedValue([
          {
            id: "22222222-2222-4222-8222-222222222222",
            clientId: syntheticClient.id,
            type: "acquisition",
            status: "draft",
            updatedAt: "2026-08-31T12:00:00.000Z",
            currentVersion: null,
            draftVersion,
          },
        ]),
        transitionVersionedProgram,
      }
    )

    await screen.findByRole("heading", { name: "Detalle del cliente" })
    await user.click(
      screen.getByRole("tab", { name: "Programas de adquisición" })
    )
    expect(
      await screen.findByText("Programa versionado sintético")
    ).toBeVisible()
    await user.click(screen.getByRole("button", { name: "Activar" }))

    expect(transitionVersionedProgram).toHaveBeenCalledWith({
      programId: "22222222-2222-4222-8222-222222222222",
      versionId: draftVersion.id,
      nextStatus: "active",
    })
  })

  it("publica una versión sucesora sin confundirla con una reactivación", async () => {
    const user = userEvent.setup()
    const transitionVersionedProgram = vi.fn().mockResolvedValue(undefined)
    const currentVersion = {
      id: "31111111-1111-4111-8111-111111111111",
      version: 1,
      title: "Programa sintético activo",
      design: {
        kind: "acquisition" as const,
        goal: "Solicitar",
        skillArea: "Comunicación",
        antecedent: "Objeto visible",
        steps: ["Solicitar"],
        teachingProcedure: "Ensayo",
        sets: [{ name: "Set A", items: ["Objeto A"] }],
        promptLevels: ["Independiente"],
        errorCorrection: "Repetir",
        masteryCriterion: "80%",
        generalization: null,
        maintenance: null,
      },
    }
    const draftVersion = {
      ...currentVersion,
      id: "32222222-2222-4222-8222-222222222222",
      version: 2,
      title: "Programa sintético sucesor",
    }
    renderDetail(
      {
        create: vi.fn(),
        getById: vi.fn().mockResolvedValue(syntheticClient),
        list: vi.fn(),
      },
      {
        listVersionedProgramsByClient: vi.fn().mockResolvedValue([
          {
            id: "33333333-3333-4333-8333-333333333333",
            clientId: syntheticClient.id,
            type: "acquisition",
            status: "paused",
            updatedAt: "2026-08-31T12:00:00.000Z",
            currentVersion,
            draftVersion,
          },
        ]),
        transitionVersionedProgram,
      }
    )

    await screen.findByRole("heading", { name: "Detalle del cliente" })
    await user.click(
      screen.getByRole("tab", { name: "Programas de adquisición" })
    )
    await user.click(screen.getByRole("button", { name: "Publicar versión" }))
    expect(transitionVersionedProgram).toHaveBeenLastCalledWith({
      programId: "33333333-3333-4333-8333-333333333333",
      versionId: draftVersion.id,
      nextStatus: "active",
    })

    await user.click(screen.getByRole("button", { name: "Reactivar" }))
    expect(transitionVersionedProgram).toHaveBeenLastCalledWith({
      programId: "33333333-3333-4333-8333-333333333333",
      nextStatus: "active",
    })
  })

  it("confirma el guardado cuando sólo falla el refresco posterior del programa", async () => {
    const user = userEvent.setup()
    const createProgram = vi.fn().mockResolvedValue(syntheticProgram)
    const listProgramsByClient = vi.fn().mockResolvedValue([])
    renderDetail(
      {
        create: vi.fn(),
        getById: vi.fn().mockResolvedValue(syntheticClient),
        list: vi.fn(),
      },
      {
        createProgram,
        listProgramsByClient,
      }
    )
    await screen.findByRole("heading", { name: "Detalle del cliente" })
    await user.click(
      screen.getByRole("tab", { name: "Programas de adquisición" })
    )
    await screen.findByText(
      "0 programa(s) activo(s). Agrupa metas por área de intervención."
    )
    listProgramsByClient.mockRejectedValueOnce(
      new Error("Refresco no disponible")
    )
    await user.click(
      screen.getByRole("button", {
        name: "Ver formulario de Nuevo programa",
      })
    )
    await user.type(
      screen.getByLabelText("Nombre del programa"),
      "Programa sintético"
    )
    await user.type(
      screen.getByLabelText("Descripción"),
      "Descripción sintética"
    )
    await user.click(screen.getByRole("button", { name: "Guardar borrador" }))

    expect(
      await screen.findByText(
        "El borrador se guardó, pero no pudimos actualizar la lista."
      )
    ).toBeVisible()
    expect(
      screen.queryByText("No pudimos guardar el borrador.")
    ).not.toBeInTheDocument()
    await user.click(
      screen.getByRole("button", { name: "Reintentar actualización" })
    )
    expect(
      await screen.findByText("Borrador sintético guardado.")
    ).toBeVisible()
    expect(createProgram).toHaveBeenCalledTimes(1)
  })

  it("guarda un plan de conducta conectado", async () => {
    const user = userEvent.setup()
    const createBehaviorPlan = vi.fn().mockResolvedValue({})
    renderDetail(
      {
        create: vi.fn(),
        getById: vi.fn().mockResolvedValue(syntheticClient),
        list: vi.fn(),
      },
      { createBehaviorPlan }
    )
    await screen.findByRole("heading", { name: "Detalle del cliente" })
    await user.click(
      screen.getByRole("tab", { name: "Reducción de conductas" })
    )
    await user.click(
      screen.getByRole("button", {
        name: "Ver formulario de Nuevo plan de conducta",
      })
    )
    await user.type(
      screen.getByLabelText("Conducta objetivo"),
      "Conducta sintética"
    )
    await user.type(
      screen.getByLabelText("Definición operacional"),
      "Definición observable sintética"
    )
    await user.selectOptions(
      screen.getByLabelText("Unidad de medición"),
      "frequency"
    )
    await user.type(
      screen.getByLabelText("Función hipotética"),
      "Acceso sintético"
    )
    await user.type(
      screen.getByLabelText("Estrategia antecedente"),
      "Agenda visual sintética"
    )
    await user.type(
      screen.getByLabelText("Conducta de reemplazo"),
      "Solicitud sintética"
    )
    await user.type(
      screen.getByLabelText("Respuesta del equipo"),
      "Reforzamiento sintético"
    )
    await user.click(screen.getByRole("button", { name: "Guardar borrador" }))

    expect(createBehaviorPlan).toHaveBeenCalledWith(
      expect.objectContaining({
        clientId: syntheticClient.id,
        measurementUnit: "frequency",
        name: "Conducta sintética",
      })
    )
  })

  it("guarda una sesión completa mediante una sola operación", async () => {
    const user = userEvent.setup()
    const createAtomic = vi
      .fn()
      .mockResolvedValue({ id: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee" })
    renderDetail(
      {
        create: vi.fn(),
        getById: vi.fn().mockResolvedValue(syntheticClient),
        list: vi.fn(),
      },
      {
        listGoalsByClient: vi.fn().mockResolvedValue([syntheticGoal]),
        listBehaviorPlansByClient: vi
          .fn()
          .mockResolvedValue([syntheticBehaviorPlan]),
      },
      { createAtomic }
    )
    await screen.findByRole("heading", { name: "Detalle del cliente" })
    await user.click(screen.getByRole("tab", { name: "Sesiones" }))
    await screen.findByText("Conducta sintética")
    await user.click(
      screen.getByRole("button", { name: "Aumentar Conducta sintética" })
    )
    await user.click(screen.getByRole("button", { name: "Correcto · 0" }))
    await user.clear(screen.getByLabelText("Fecha de sesión"))
    await user.type(screen.getByLabelText("Fecha de sesión"), "2026-08-18")
    await user.type(
      screen.getByLabelText("Notas de sesión"),
      "Nota exclusivamente sintética"
    )
    await user.click(screen.getByRole("button", { name: "Guardar sesión" }))

    expect(createAtomic).toHaveBeenCalledTimes(1)
    expect(createAtomic).toHaveBeenCalledWith({
      clientId: syntheticClient.id,
      occurredOn: "2026-08-18",
      notes: "Nota exclusivamente sintética",
      behaviorMeasurements: [
        {
          behaviorPlanId: syntheticBehaviorPlan.id,
          measurementUnit: "frequency",
          value: 1,
        },
      ],
      acquisitionTrials: [
        { goalId: syntheticGoal.id, correct: 1, incorrect: 0 },
      ],
    })
  })

  it("captura cada dimensión con su control y contrato clínico", async () => {
    const user = userEvent.setup()
    const createAtomic = vi
      .fn()
      .mockResolvedValue({ id: "12121212-1212-4121-8121-121212121212" })
    renderDetail(
      {
        create: vi.fn(),
        getById: vi.fn().mockResolvedValue(syntheticClient),
        list: vi.fn(),
      },
      {
        listBehaviorPlansByClient: vi.fn().mockResolvedValue(measurementPlans),
      },
      { createAtomic }
    )
    await screen.findByRole("heading", { name: "Detalle del cliente" })
    await user.click(screen.getByRole("tab", { name: "Sesiones" }))
    await screen.findByText("Duración sintética")

    await user.click(
      screen.getByRole("button", { name: "Aumentar Conducta sintética" })
    )
    await user.clear(screen.getByLabelText("Duración sintética en segundos"))
    await user.type(
      screen.getByLabelText("Duración sintética en segundos"),
      "12.5"
    )
    await user.clear(screen.getByLabelText("Latencia sintética en segundos"))
    await user.type(
      screen.getByLabelText("Latencia sintética en segundos"),
      "2.25"
    )
    await user.clear(
      screen.getByLabelText("Intervalos observados de Intervalo sintético")
    )
    await user.type(
      screen.getByLabelText("Intervalos observados de Intervalo sintético"),
      "3"
    )
    await user.clear(
      screen.getByLabelText("Intervalos totales de Intervalo sintético")
    )
    await user.type(
      screen.getByLabelText("Intervalos totales de Intervalo sintético"),
      "4"
    )
    await user.click(screen.getByRole("button", { name: "Guardar sesión" }))

    expect(createAtomic).toHaveBeenCalledWith(
      expect.objectContaining({
        behaviorMeasurements: [
          {
            behaviorPlanId: syntheticBehaviorPlan.id,
            measurementUnit: "frequency",
            value: 1,
          },
          {
            behaviorPlanId: measurementPlans[1].id,
            measurementUnit: "duration",
            unit: "seconds",
            value: 12.5,
          },
          {
            behaviorPlanId: measurementPlans[2].id,
            measurementUnit: "latency",
            unit: "seconds",
            value: 2.25,
          },
          {
            behaviorPlanId: measurementPlans[3].id,
            measurementUnit: "interval",
            observed: 3,
            total: 4,
          },
        ],
      })
    )
  })

  it("impide guardar un intervalo observado mayor que el total", async () => {
    const user = userEvent.setup()
    const createAtomic = vi.fn()
    renderDetail(
      {
        create: vi.fn(),
        getById: vi.fn().mockResolvedValue(syntheticClient),
        list: vi.fn(),
      },
      {
        listBehaviorPlansByClient: vi
          .fn()
          .mockResolvedValue([measurementPlans[3]]),
      },
      { createAtomic }
    )
    await screen.findByRole("heading", { name: "Detalle del cliente" })
    await user.click(screen.getByRole("tab", { name: "Sesiones" }))
    await screen.findByText("Intervalo sintético")
    await user.type(
      screen.getByLabelText("Intervalos observados de Intervalo sintético"),
      "5"
    )
    await user.type(
      screen.getByLabelText("Intervalos totales de Intervalo sintético"),
      "4"
    )

    expect(
      screen.getByText("Los intervalos observados no pueden superar el total.")
    ).toBeVisible()
    expect(
      screen.getByRole("button", { name: "Guardar sesión" })
    ).toBeDisabled()
    expect(createAtomic).not.toHaveBeenCalled()
  })

  it("distingue un cliente no encontrado", async () => {
    renderDetail({
      create: vi.fn(),
      getById: vi
        .fn()
        .mockRejectedValue(
          new DomainError("CLIENT_NOT_FOUND", "No encontrado")
        ),
      list: vi.fn(),
    })

    expect(
      await screen.findByRole("heading", { name: "Cliente no encontrado" })
    ).toBeVisible()
    expect(
      screen.queryByRole("button", { name: "Reintentar" })
    ).not.toBeInTheDocument()
  })

  it("permite reintentar un error recuperable", async () => {
    const user = userEvent.setup()
    const getById = vi
      .fn()
      .mockRejectedValueOnce(new DomainError("NETWORK_ERROR", "Sin red"))
      .mockResolvedValueOnce(syntheticClient)
    renderDetail({ create: vi.fn(), getById, list: vi.fn() })

    await user.click(await screen.findByRole("button", { name: "Reintentar" }))

    expect(
      await screen.findByRole("heading", { name: "Detalle del cliente" })
    ).toBeVisible()
    expect(getById).toHaveBeenCalledTimes(2)
  })
})
