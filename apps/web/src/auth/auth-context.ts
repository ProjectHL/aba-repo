import { createContext, useContext } from "react"

export type AuthAccess = "active" | "pending" | "inactive"

export type AuthIdentity = {
  id: string
  email?: string
  access: AuthAccess
}

export type AuthCredentials = {
  email: string
  password: string
}

export type AuthEvent = "PASSWORD_RECOVERY" | "SESSION_CHANGED"

export type AuthService = {
  getIdentity: () => Promise<AuthIdentity | null>
  signIn: (credentials: AuthCredentials) => Promise<AuthIdentity>
  signUp: (credentials: AuthCredentials) => Promise<void>
  signInWithGoogle: () => Promise<void>
  requestPasswordRecovery: (email: string) => Promise<void>
  updatePassword: (password: string) => Promise<void>
  signOut: () => Promise<void>
  subscribe: (listener: (event: AuthEvent) => void) => () => void
}

export type AuthStatus =
  | "initializing"
  | "anonymous"
  | "authenticating"
  | "authenticated"
  | "signingOut"
  | "unavailable"

export type AuthContextValue = {
  status: AuthStatus
  identity: AuthIdentity | null
  passwordRecoveryReady: boolean
  signIn: (credentials: AuthCredentials) => Promise<void>
  signUp: (credentials: AuthCredentials) => Promise<void>
  signInWithGoogle: () => Promise<void>
  requestPasswordRecovery: (email: string) => Promise<void>
  updatePassword: (password: string) => Promise<void>
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error("useAuth debe usarse dentro de AuthProvider")
  return value
}
