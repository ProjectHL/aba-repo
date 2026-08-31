import { createClient, type SupabaseClient } from "@supabase/supabase-js"

import type { Database } from "@/integrations/supabase/database.types"
import { readSupabaseEnv } from "@/lib/supabase/env"

let browserClient: SupabaseClient<Database> | undefined

export function getSupabaseClient() {
  if (browserClient) return browserClient

  const { publishableKey, url } = readSupabaseEnv({
    VITE_SUPABASE_PUBLISHABLE_KEY: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  })
  browserClient = createClient<Database>(url, publishableKey, {
    auth: {
      autoRefreshToken: true,
      detectSessionInUrl: true,
      persistSession: true,
    },
  })
  return browserClient
}
