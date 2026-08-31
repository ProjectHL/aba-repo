import { vi } from "vitest"

import type { AuthIdentity, AuthService } from "@/auth/auth-context"

export function createFakeAuthService(
  initialIdentity: AuthIdentity | null
): AuthService {
  let identity = initialIdentity
  const listeners = new Set<() => void>()

  return {
    getIdentity: vi.fn(async () => identity),
    signIn: vi.fn(async () => {
      identity = {
        id: "synthetic-authenticated-user",
        email: "user@example.invalid",
        access: "active",
      }
      listeners.forEach((listener) => listener())
      return identity
    }),
    signUp: vi.fn(async () => undefined),
    signInWithGoogle: vi.fn(async () => undefined),
    requestPasswordRecovery: vi.fn(async () => undefined),
    updatePassword: vi.fn(async () => undefined),
    signOut: vi.fn(async () => {
      identity = null
      listeners.forEach((listener) => listener())
    }),
    subscribe: vi.fn((listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    }),
  }
}
