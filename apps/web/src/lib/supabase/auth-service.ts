import type { AuthIdentity, AuthService } from "@/auth/auth-context"
import { getSupabaseClient } from "@/lib/supabase/client"

async function getIdentity(): Promise<AuthIdentity | null> {
  const { data, error } = await getSupabaseClient().auth.getClaims()
  if (error) throw error
  if (!data?.claims.sub) return null

  const email =
    typeof data.claims.email === "string" ? data.claims.email : undefined
  const { data: memberships, error: membershipError } =
    await getSupabaseClient()
      .from("memberships")
      .select("status")
      .eq("user_id", data.claims.sub)

  if (membershipError) throw membershipError

  const access = memberships.some(
    (membership) => membership.status === "active"
  )
    ? "active"
    : memberships.length > 0
      ? "inactive"
      : "pending"

  return { id: data.claims.sub, access, ...(email ? { email } : {}) }
}

export const supabaseAuthService: AuthService = {
  getIdentity,

  async signIn({ email, password }) {
    const { error } = await getSupabaseClient().auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error

    const identity = await getIdentity()
    if (!identity) throw new Error("AUTH_IDENTITY_UNAVAILABLE")
    return identity
  },

  async signUp({ email, password }) {
    const emailRedirectTo = new URL(
      "/clientes",
      window.location.origin
    ).toString()
    const { error } = await getSupabaseClient().auth.signUp({
      email,
      password,
      options: { emailRedirectTo },
    })
    if (error) throw error
  },

  async signInWithGoogle() {
    const redirectTo = new URL("/clientes", window.location.origin).toString()
    const { error } = await getSupabaseClient().auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    })
    if (error) throw error
  },

  async requestPasswordRecovery(email) {
    const redirectTo = new URL(
      "/recuperar-contrasena",
      window.location.origin
    ).toString()
    const { error } = await getSupabaseClient().auth.resetPasswordForEmail(
      email,
      { redirectTo }
    )
    if (error) throw error
  },

  async updatePassword(password) {
    const { error } = await getSupabaseClient().auth.updateUser({ password })
    if (error) throw error
  },

  async signOut() {
    const { error } = await getSupabaseClient().auth.signOut()
    if (error) throw error
  },

  subscribe(listener) {
    const { data } = getSupabaseClient().auth.onAuthStateChange((event) =>
      listener(
        event === "PASSWORD_RECOVERY" ? "PASSWORD_RECOVERY" : "SESSION_CHANGED"
      )
    )
    return () => data.subscription.unsubscribe()
  },
}
