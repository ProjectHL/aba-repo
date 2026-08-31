import { useCallback, useEffect, useMemo, useState } from "react"

import {
  AuthContext,
  type AuthCredentials,
  type AuthIdentity,
  type AuthService,
  type AuthStatus,
} from "@/auth/auth-context"
import { subscribeToSessionInvalidation } from "@/auth/session-invalidation"

export function AuthProvider({
  children,
  service,
}: {
  children: React.ReactNode
  service: AuthService
}) {
  const [status, setStatus] = useState<AuthStatus>("initializing")
  const [identity, setIdentity] = useState<AuthIdentity | null>(null)
  const [passwordRecoveryReady, setPasswordRecoveryReady] = useState(false)

  useEffect(() => {
    let active = true

    const refreshIdentity = async () => {
      try {
        const nextIdentity = await service.getIdentity()
        if (!active) return
        setIdentity(nextIdentity)
        setStatus(nextIdentity ? "authenticated" : "anonymous")
      } catch {
        if (!active) return
        setIdentity(null)
        setStatus("anonymous")
      }
    }

    let unsubscribe: () => void = () => undefined
    try {
      unsubscribe = service.subscribe((event) => {
        if (event === "PASSWORD_RECOVERY") setPasswordRecoveryReady(true)
        void refreshIdentity()
      })
    } catch {
      queueMicrotask(() => {
        if (!active) return
        setIdentity(null)
        setStatus("unavailable")
      })
      return () => {
        active = false
      }
    }
    void refreshIdentity()

    return () => {
      active = false
      unsubscribe()
    }
  }, [service])

  const signIn = useCallback(
    async (credentials: AuthCredentials) => {
      setStatus("authenticating")
      try {
        const nextIdentity = await service.signIn(credentials)
        setIdentity(nextIdentity)
        setStatus("authenticated")
      } catch (error) {
        setIdentity(null)
        setStatus("anonymous")
        throw error
      }
    },
    [service]
  )

  const signInWithGoogle = useCallback(async () => {
    setStatus("authenticating")
    try {
      await service.signInWithGoogle()
    } catch (error) {
      setIdentity(null)
      setStatus("anonymous")
      throw error
    }
  }, [service])

  const requestPasswordRecovery = useCallback(
    async (email: string) => {
      setStatus("authenticating")
      try {
        await service.requestPasswordRecovery(email)
        setStatus("anonymous")
      } catch (error) {
        setStatus("anonymous")
        throw error
      }
    },
    [service]
  )

  const updatePassword = useCallback(
    async (password: string) => {
      await service.updatePassword(password)
    },
    [service]
  )

  const signUp = useCallback(
    async (credentials: AuthCredentials) => {
      setStatus("authenticating")
      try {
        await service.signUp(credentials)
        setIdentity(null)
        setStatus("anonymous")
      } catch (error) {
        setIdentity(null)
        setStatus("anonymous")
        throw error
      }
    },
    [service]
  )

  const signOut = useCallback(async () => {
    setStatus("signingOut")
    try {
      await service.signOut()
    } finally {
      setIdentity(null)
      setPasswordRecoveryReady(false)
      setStatus("anonymous")
    }
  }, [service])

  useEffect(
    () =>
      subscribeToSessionInvalidation(() => {
        void signOut().catch(() => undefined)
      }),
    [signOut]
  )

  const value = useMemo(
    () => ({
      status,
      identity,
      passwordRecoveryReady,
      signIn,
      signUp,
      signInWithGoogle,
      requestPasswordRecovery,
      updatePassword,
      signOut,
    }),
    [
      identity,
      passwordRecoveryReady,
      requestPasswordRecovery,
      signIn,
      signUp,
      signInWithGoogle,
      signOut,
      status,
      updatePassword,
    ]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
