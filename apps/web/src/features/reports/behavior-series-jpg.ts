import type { ClientSummary } from "@/features/clients/client-contracts"
import type { ClinicalReport } from "@/features/reports/report-analytics"
import type { ReportDateRange } from "@/features/reports/clinical-report-repository-contract"

type Series = ClinicalReport["behaviorSeries"][number]

type DownloadBehaviorSeriesJpgInput = {
  client: Pick<ClientSummary, "initials" | "clinicalId"> & { birthDate?: string }
  dateRange: ReportDateRange
  series: Series
}

function periodLabel(dateRange: ReportDateRange) {
  return dateRange.from || dateRange.to
    ? `${dateRange.from ?? "inicio"} — ${dateRange.to ?? "hoy"}`
    : "Todo el historial"
}

export function downloadBehaviorSeriesJpg({
  client,
  dateRange,
  series,
}: DownloadBehaviorSeriesJpgInput) {
  if (!series.points.length) throw new Error("La serie no tiene mediciones")

  const canvas = document.createElement("canvas")
  canvas.width = 1200
  canvas.height = 720
  const context = canvas.getContext("2d")
  if (!context) throw new Error("El navegador no puede crear la imagen")

  const padding = { top: 170, right: 80, bottom: 140, left: 100 }
  const width = canvas.width - padding.left - padding.right
  const height = canvas.height - padding.top - padding.bottom
  const max = Math.max(...series.points.map((point) => point.value), 1)

  context.fillStyle = "#ffffff"
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.fillStyle = "#1e3a8a"
  context.font = "700 32px Arial"
  context.fillText("Evolución por plan de conducta", padding.left, 58)
  context.fillStyle = "#334155"
  context.font = "600 24px Arial"
  context.fillText(series.planName, padding.left, 98)
  context.font = "20px Arial"
  context.fillText(`Cliente: ${client.initials} · ${client.clinicalId}`, padding.left, 132)
  context.fillText(`Periodo: ${periodLabel(dateRange)}`, padding.left, 158)

  context.strokeStyle = "#cbd5e1"
  context.lineWidth = 2
  context.beginPath()
  context.moveTo(padding.left, padding.top)
  context.lineTo(padding.left, padding.top + height)
  context.lineTo(padding.left + width, padding.top + height)
  context.stroke()

  const xStep = series.points.length === 1 ? 0 : width / (series.points.length - 1)
  context.strokeStyle = "#2563eb"
  context.lineWidth = 5
  context.beginPath()
  series.points.forEach((point, index) => {
    const x = padding.left + index * xStep
    const y = padding.top + height - (point.value / max) * height
    if (index === 0) context.moveTo(x, y)
    else context.lineTo(x, y)
  })
  context.stroke()

  context.fillStyle = "#1d4ed8"
  context.font = "600 20px Arial"
  context.textAlign = "center"
  series.points.forEach((point, index) => {
    const x = padding.left + index * xStep
    const y = padding.top + height - (point.value / max) * height
    context.beginPath()
    context.arc(x, y, 7, 0, Math.PI * 2)
    context.fill()
    context.fillStyle = "#0f172a"
    context.fillText(`${point.value}`, x, y - 16)
    context.fillStyle = "#475569"
    context.font = "16px Arial"
    context.fillText(point.occurredOn, x, padding.top + height + 32)
    context.fillStyle = "#1d4ed8"
    context.font = "600 20px Arial"
  })
  context.textAlign = "left"
  context.fillStyle = "#475569"
  context.font = "18px Arial"
  context.fillText("Datos sintéticos · generación local", padding.left, canvas.height - 42)

  const link = document.createElement("a")
  link.href = canvas.toDataURL("image/jpeg", 0.92)
  link.download = "grafico-sintetico.jpg"
  link.click()
}
