import { describe, expect, it } from "vitest"

import { buildCompleteReportPdfSections } from "@/features/reports/complete-report-pdf"

describe("buildCompleteReportPdfSections", () => {
  it("incluye las cuatro secciones aprobadas y excluye IDs internos", () => {
    const sections = buildCompleteReportPdfSections({
      client: { initials: "AB", clinicalId: "SYN-001" },
      dateRange: { from: "2026-08-01", to: "2026-08-31" },
      evaluation: {
        status: "ready",
        omittedUndatedCount: 0,
        items: [
          {
            sourceId: "assessment-private-id",
            kind: "functional",
            title: "Evaluación funcional sintética",
            occurredOn: "2026-08-08",
            status: "completed",
            payload: {
              schema_version: 1,
              target_behavior: "Conducta objetivo sintética",
              hypothesized_function: "Acceso sintético",
            },
          },
        ],
      },
      acquisition: {
        status: "ready",
        items: [
          {
            program: {
              name: "Programa sintético",
              description: null,
              status: "active",
            },
            goals: [
              {
                skillArea: "Área sintética",
                name: "Meta sintética",
                masteryCriterion: "Criterio sintético",
                teachingProcedure: "Procedimiento sintético",
                status: "active",
              },
            ],
          },
        ],
      },
      behaviorReduction: {
        status: "ready",
        items: [
          {
            name: "Plan sintético",
            operationalDefinition: "Definición sintética",
            measurementUnit: "frequency",
            hypothesizedFunction: "Función sintética",
            antecedentStrategy: null,
            replacementBehavior: null,
            responseStrategy: null,
            status: "active",
          },
        ],
      },
      report: {
        sessionCount: 1,
        behaviorSeries: [],
        acquisitionProgress: [],
      },
    })

    const text = sections.flatMap((section) => [section.heading, ...section.lines]).join("\n")
    expect(text).toContain("Evaluación funcional sintética")
    expect(text).toContain("Programa sintético")
    expect(text).toContain("Criterio sintético")
    expect(text).toContain("Plan sintético")
    expect(text).toContain("Sesiones: 1")
    expect(text).not.toContain("assessment-private-id")
  })

  it("rechaza una evaluación no compatible antes de generar el PDF", () => {
    expect(() =>
      buildCompleteReportPdfSections({
        client: { initials: "AB", clinicalId: "SYN-001" },
        dateRange: {},
        evaluation: { status: "unsupported" },
        acquisition: { status: "empty" },
        behaviorReduction: { status: "empty" },
        report: {
          sessionCount: 0,
          behaviorSeries: [],
          acquisitionProgress: [],
        },
      })
    ).toThrow("no compatible")
  })
})
