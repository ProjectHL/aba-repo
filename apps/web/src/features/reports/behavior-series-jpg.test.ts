import { afterEach, describe, expect, it, vi } from "vitest"

import { downloadBehaviorSeriesJpg } from "@/features/reports/behavior-series-jpg"

describe("downloadBehaviorSeriesJpg", () => {
  afterEach(() => vi.restoreAllMocks())

  it("descarga sólo la serie visible y el contexto mínimo aprobado", () => {
    const fillText = vi.fn()
    const click = vi.fn()
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
      fillRect: vi.fn(),
      fillText,
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      set fillStyle(_: string) {},
      set font(_: string) {},
      set textAlign(_: CanvasTextAlign) {},
      set textBaseline(_: CanvasTextBaseline) {},
      set lineWidth(_: number) {},
      set strokeStyle(_: string) {},
    } as unknown as CanvasRenderingContext2D)
    vi.spyOn(HTMLCanvasElement.prototype, "toDataURL").mockReturnValue(
      "data:image/jpeg;base64,synthetic"
    )
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(click)

    downloadBehaviorSeriesJpg({
      client: {
        initials: "AB",
        clinicalId: "SYN-001",
        birthDate: "2018-01-01",
      },
      dateRange: { from: "2026-08-01", to: "2026-08-31" },
      series: {
        planId: "plan-1",
        planName: "Conducta sintética",
        points: [
          {
            occurredOn: "2026-08-08",
            measurementUnit: "frequency",
            intervalObserved: null,
            intervalTotal: null,
            value: 4,
          },
        ],
      },
    })

    const renderedText = fillText.mock.calls.flat().join(" ")
    expect(renderedText).toContain("AB · SYN-001")
    expect(renderedText).toContain("Datos sintéticos")
    expect(renderedText).toContain("Conducta sintética")
    expect(renderedText).not.toContain("2018-01-01")
    expect(click).toHaveBeenCalledOnce()
  })
})
