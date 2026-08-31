import { z } from "zod"

export const acquisitionProgramStatusSchema = z.enum(["draft", "active", "mastered", "archived"])
export const acquisitionGoalStatusSchema = z.enum(["draft", "active", "mastered", "archived"])
export const behaviorPlanStatusSchema = z.enum(["draft", "active", "resolved", "archived"])

