import type { ClientSummary } from "@/features/clients/client-contracts"
import type { ClinicalReport } from "@/features/reports/report-analytics"
import type { ReportDateRange } from "@/features/reports/clinical-report-repository-contract"
import type {
  AcquisitionReportSection,
  BehaviorReductionReportSection,
  EvaluationReportItem,
  EvaluationReportSection,
} from "@/features/reports/report-sections"

export type CompleteReportPdfInput = {
  client: Pick<ClientSummary, "initials" | "clinicalId">
  dateRange: ReportDateRange
  report: ClinicalReport
  evaluation: EvaluationReportSection
  acquisition: AcquisitionReportSection
  behaviorReduction: BehaviorReductionReportSection
}

export type CompleteReportPdfSection = {
  heading: string
  lines: string[]
}

function periodLabel(dateRange: ReportDateRange) {
  return dateRange.from || dateRange.to
    ? `${dateRange.from ?? "inicio"} - ${dateRange.to ?? "hoy"}`
    : "Todo el historial"
}

function collectChartImages() {
  return new Map(
    Array.from(document.querySelectorAll<HTMLElement>("[data-report-chart]"))
      .map((container) => {
        const canvas = container.querySelector("canvas")
        return [container.dataset.reportChart, canvas?.toDataURL("image/png")] as const
      })
      .filter((entry): entry is readonly [string, string] => Boolean(entry[0] && entry[1]))
  )
}

function assessmentLines(item: EvaluationReportItem) {
  const header = `${item.title} · ${item.occurredOn ?? "Sin fecha"} · ${item.status}`
  if (item.kind === "initial_interview")
    return [
      header,
      `Motivo de consulta: ${item.payload.consultation_reason}`,
      `Historia del desarrollo: ${item.payload.development_history}`,
      `Contexto familiar: ${item.payload.family_context}`,
      `Prioridades: ${item.payload.priorities}`,
      ...item.payload.informants.flatMap((informant) => [
        `Informante: ${informant.informant}`,
        `Fortalezas: ${informant.strengths}`,
        `Necesidades: ${informant.needs}`,
      ]),
    ]
  if (item.kind === "preference")
    return [
      header,
      `Tipo: ${item.payload.assessment_type}`,
      `Preferencia más alta: ${item.payload.highest_preference}`,
      ...(item.payload.response ? [`Respuesta: ${item.payload.response}`] : []),
      ...(item.payload.lowest_preference
        ? [`Preferencia más baja: ${item.payload.lowest_preference}`]
        : []),
      ...(item.payload.topography
        ? [`Topografía: ${item.payload.topography}`]
        : []),
    ]
  return [
    header,
    ...(item.payload.assessment_type
      ? [`Tipo: ${item.payload.assessment_type}`]
      : []),
    `Conducta observada: ${item.payload.target_behavior}`,
    ...(item.payload.antecedent
      ? [`Antecedente: ${item.payload.antecedent}`]
      : []),
    ...(item.payload.consequence
      ? [`Consecuencia: ${item.payload.consequence}`]
      : []),
    ...(item.payload.hypothesized_function
      ? [`Función probable: ${item.payload.hypothesized_function}`]
      : []),
    ...(item.payload.topography
      ? [`Topografía: ${item.payload.topography}`]
      : []),
  ]
}

export function buildCompleteReportPdfSections({
  acquisition,
  behaviorReduction,
  evaluation,
  report,
}: CompleteReportPdfInput): CompleteReportPdfSection[] {
  if (evaluation.status === "unsupported")
    throw new Error("La evaluación contiene una versión no compatible")

  const evaluationLines =
    evaluation.status === "ready"
      ? evaluation.items.flatMap(assessmentLines)
      : ["Sin evaluaciones compatibles."]
  const acquisitionLines =
    acquisition.status === "ready"
      ? acquisition.items.flatMap(({ program, goals }) => [
          `Programa: ${program.name} · Estado: ${program.status}`,
          ...(program.description
            ? [`Descripción: ${program.description}`]
            : []),
          ...(goals.length
            ? goals.flatMap((goal) => [
                `Meta: ${goal.name} · Área: ${goal.skillArea} · Estado: ${goal.status}`,
                `Criterio: ${goal.masteryCriterion}`,
                `Procedimiento: ${goal.teachingProcedure}`,
              ])
            : ["Sin metas vigentes."]),
        ])
      : ["Sin programas de adquisición vigentes."]
  const behaviorLines =
    behaviorReduction.status === "ready"
      ? behaviorReduction.items.flatMap((plan) => [
          `Plan: ${plan.name} · Estado: ${plan.status}`,
          `Definición: ${plan.operationalDefinition}`,
          `Dimensión: ${plan.measurementUnit}`,
          ...(plan.hypothesizedFunction
            ? [`Función: ${plan.hypothesizedFunction}`]
            : []),
          ...(plan.antecedentStrategy
            ? [`Estrategia antecedente: ${plan.antecedentStrategy}`]
            : []),
          ...(plan.replacementBehavior
            ? [`Conducta de reemplazo: ${plan.replacementBehavior}`]
            : []),
          ...(plan.responseStrategy
            ? [`Estrategia de respuesta: ${plan.responseStrategy}`]
            : []),
        ])
      : ["Sin planes de conducta vigentes."]
  const progressLines = [
    `Sesiones: ${report.sessionCount}`,
    `Planes con datos: ${report.behaviorSeries.length}`,
    `Metas revisadas: ${report.acquisitionProgress.length}`,
    ...report.behaviorSeries.flatMap((series) => [
      series.planName,
      series.points.map((point) => `${point.occurredOn}: ${point.value}`).join(" | "),
    ]),
    ...report.acquisitionProgress.map(
      (goal) =>
        `${goal.goalName}: ${goal.correct} correctos, ${goal.incorrect} incorrectos, ${goal.percentage === null ? "sin ensayos" : `${goal.percentage.toFixed(1)}%`}`
    ),
  ]

  return [
    { heading: "Evaluación conductual", lines: evaluationLines },
    { heading: "Programas y metas de adquisición", lines: acquisitionLines },
    { heading: "Planes de reducción de conducta", lines: behaviorLines },
    { heading: "Progreso derivado", lines: progressLines },
  ]
}

export async function downloadCompleteReportPdf({
  client,
  dateRange,
  report,
  evaluation,
  acquisition,
  behaviorReduction,
}: CompleteReportPdfInput) {
  const { jsPDF } = await import("jspdf")
  const pdf = new jsPDF({ format: "a4", unit: "mm" })
  const images = collectChartImages()
  const sections = buildCompleteReportPdfSections({
    client,
    dateRange,
    report,
    evaluation,
    acquisition,
    behaviorReduction,
  })
  const margin = 16
  const pageHeight = pdf.internal.pageSize.getHeight()
  const pageWidth = pdf.internal.pageSize.getWidth()
  const contentWidth = pageWidth - margin * 2
  let y = 20

  const nextPage = () => {
    pdf.addPage()
    y = 20
  }
  const reserve = (height: number) => {
    if (y + height > pageHeight - 18) nextPage()
  }
  const text = (value: string, size = 10, weight: "normal" | "bold" = "normal") => {
    pdf.setFont("helvetica", weight)
    pdf.setFontSize(size)
    const lines = pdf.splitTextToSize(value, contentWidth) as string[]
    reserve(lines.length * (size * 0.48) + 3)
    pdf.text(lines, margin, y)
    y += lines.length * (size * 0.48) + 3
  }
  const chart = (key: string) => {
    const image = images.get(key)
    if (!image) return
    const height = 72
    reserve(height + 4)
    pdf.addImage(image, "PNG", margin, y, contentWidth, height, undefined, "FAST")
    y += height + 4
  }

  pdf.setTextColor(30, 58, 138)
  text("Informe completo - datos sinteticos", 18, "bold")
  pdf.setTextColor(15, 23, 42)
  text(`Cliente: ${client.initials} - ${client.clinicalId}`)
  text(`Periodo: ${periodLabel(dateRange)}`)
  y += 2
  for (const section of sections) {
    text(section.heading, 14, "bold")
    for (const line of section.lines) text(line)
    if (section.heading === "Progreso derivado") {
      for (const series of report.behaviorSeries) chart(`behavior:${series.planId}`)
      chart("acquisition")
    }
  }

  const pageCount = pdf.getNumberOfPages()
  for (let page = 1; page <= pageCount; page += 1) {
    pdf.setPage(page)
    pdf.setFontSize(8)
    pdf.setTextColor(71, 85, 105)
    pdf.text(`Datos sinteticos - pagina ${page} de ${pageCount}`, margin, pageHeight - 9)
  }
  pdf.save("informe-completo-sintetico.pdf")
}
