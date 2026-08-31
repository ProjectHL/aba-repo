import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js"
import { Bar, Line } from "react-chartjs-2"

ChartJS.register(
  BarElement,
  CategoryScale,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip
)

type BehaviorPoint = { occurredOn: string; value: number }

export function BehaviorLineChart({
  chartId,
  planName,
  points,
}: {
  chartId: string
  planName: string
  points: BehaviorPoint[]
}) {
  return (
    <div
      aria-label={`Gráfico de línea de ${planName}`}
      className="mt-4 h-56"
      data-report-chart={`behavior:${chartId}`}
      role="img"
    >
      <Line
        aria-hidden="true"
        data={{
          labels: points.map((point) => point.occurredOn),
          datasets: [
            {
              label: planName,
              data: points.map((point) => point.value),
              borderColor: "#2563eb",
              backgroundColor: "#dbeafe",
              pointBackgroundColor: "#1d4ed8",
              pointRadius: 4,
              tension: 0.25,
            },
          ],
        }}
        options={{
          maintainAspectRatio: false,
          responsive: true,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false }, ticks: { maxRotation: 0 } },
            y: { beginAtZero: true, ticks: { precision: 0 } },
          },
        }}
      />
    </div>
  )
}

export function AcquisitionProgressChart({
  goals,
}: {
  goals: Array<{ goalName: string; percentage: number | null }>
}) {
  const measuredGoals = goals.filter(
    (goal): goal is { goalName: string; percentage: number } =>
      goal.percentage !== null
  )
  if (!measuredGoals.length) return null

  return (
    <div
      aria-label="Gráfico de progreso por meta"
      className="h-64"
      data-report-chart="acquisition"
      role="img"
    >
      <Bar
        aria-hidden="true"
        data={{
          labels: measuredGoals.map((goal) => goal.goalName),
          datasets: [
            {
              label: "Correctos",
              data: measuredGoals.map((goal) => goal.percentage),
              backgroundColor: "#059669",
              borderRadius: 6,
            },
          ],
        }}
        options={{
          indexAxis: "y",
          maintainAspectRatio: false,
          responsive: true,
          plugins: { legend: { display: false } },
          scales: {
            x: { max: 100, min: 0, ticks: { callback: (value) => `${value}%` } },
            y: { grid: { display: false } },
          },
        }}
      />
    </div>
  )
}
