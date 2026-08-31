export type SupabaseBrowserEnv = {
  VITE_SUPABASE_URL?: string
  VITE_SUPABASE_PUBLISHABLE_KEY?: string
}

export type SupabaseConfig = {
  url: string
  publishableKey: string
}

const INVALID_CONFIG_MESSAGE = "Configuración de Supabase inválida"

export function readSupabaseEnv(env: SupabaseBrowserEnv): SupabaseConfig {
  const urlValue = env.VITE_SUPABASE_URL
  const publishableKey = env.VITE_SUPABASE_PUBLISHABLE_KEY

  if (!urlValue || !publishableKey?.startsWith("sb_publishable_")) {
    throw new Error(INVALID_CONFIG_MESSAGE)
  }

  let url: URL
  try {
    url = new URL(urlValue)
  } catch {
    throw new Error(INVALID_CONFIG_MESSAGE)
  }

  const localHttp = url.protocol === "http:" && ["localhost", "127.0.0.1"].includes(url.hostname)
  if (url.protocol !== "https:" && !localHttp) {
    throw new Error(INVALID_CONFIG_MESSAGE)
  }

  return { url: url.origin, publishableKey }
}
