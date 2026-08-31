import { describe, expect, it } from "vitest"

import {
  acquisitionGoalStatusSchema,
  acquisitionProgramStatusSchema,
  behaviorPlanStatusSchema,
} from "@/features/clinical/clinical-plan-status"

describe("clinical plan status contracts", () => {
  it.each(["draft", "active", "mastered", "archived"])(
    "accepts acquisition program status %s",
    (status) => expect(acquisitionProgramStatusSchema.parse(status)).toBe(status),
  )

  it.each(["draft", "active", "mastered", "archived"])(
    "accepts acquisition goal status %s",
    (status) => expect(acquisitionGoalStatusSchema.parse(status)).toBe(status),
  )

  it.each(["draft", "active", "resolved", "archived"])(
    "accepts behavior plan status %s",
    (status) => expect(behaviorPlanStatusSchema.parse(status)).toBe(status),
  )

  it("rejects statuses from a different clinical entity", () => {
    expect(behaviorPlanStatusSchema.safeParse("mastered").success).toBe(false)
    expect(acquisitionGoalStatusSchema.safeParse("resolved").success).toBe(false)
  })
})

