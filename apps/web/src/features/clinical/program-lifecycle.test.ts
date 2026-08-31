import { describe, expect, it } from "vitest"

import {
  canTransitionProgram,
  createSuccessorVersion,
  validateProgramForActivation,
  type ProgramVersion,
} from "@/features/clinical/program-lifecycle"

const activeProgram: ProgramVersion = {
  id: "10000000-0000-4000-8000-000000000001",
  programId: "10000000-0000-4000-8000-000000000002",
  clientId: "10000000-0000-4000-8000-000000000003",
  type: "acquisition",
  version: 1,
  status: "active",
  title: "Solicitud sintética",
  design: {
    kind: "acquisition",
    goal: "Solicitar un objeto sintético",
    skillArea: "Comunicación",
    antecedent: "Objeto sintético visible",
    steps: ["Orientarse", "Solicitar"],
    teachingProcedure: "Ensayo sintético",
    sets: [{ name: "Set A", items: ["Objeto A"] }],
    promptLevels: ["Independiente", "Gestual"],
    errorCorrection: "Repetir el ensayo con ayuda",
    masteryCriterion: "80% en tres sesiones sintéticas",
    generalization: null,
    maintenance: null,
  },
  activatedAt: "2026-08-31T12:00:00.000Z",
  supersedesVersionId: null,
}

describe("program lifecycle", () => {
  it("permite sólo las transiciones aprobadas", () => {
    expect(canTransitionProgram("draft", "active")).toBe(true)
    expect(canTransitionProgram("active", "paused")).toBe(true)
    expect(canTransitionProgram("paused", "active")).toBe(true)
    expect(canTransitionProgram("achieved", "active")).toBe(false)
    expect(canTransitionProgram("discontinued", "active")).toBe(false)
  })

  it("rechaza activar un diseño de adquisición incompleto", () => {
    expect(
      validateProgramForActivation({
        ...activeProgram,
        status: "draft",
        design: { ...activeProgram.design, steps: [] },
      })
    ).toEqual(["steps"])
  })

  it("crea una sucesora sin modificar la versión activa", () => {
    const next = createSuccessorVersion(activeProgram, {
      title: "Solicitud sintética revisada",
    })

    expect(next).toMatchObject({
      programId: activeProgram.programId,
      clientId: activeProgram.clientId,
      type: activeProgram.type,
      version: 2,
      status: "draft",
      supersedesVersionId: activeProgram.id,
      activatedAt: null,
      title: "Solicitud sintética revisada",
    })
    expect(activeProgram.title).toBe("Solicitud sintética")
    expect(activeProgram.status).toBe("active")
  })
})
