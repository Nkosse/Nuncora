import { createClient } from "@supabase/supabase-js"

// Service-role client — alleen voor server-side writes (pipeline, cron)
// Bypasses RLS. Nooit aan de client-kant gebruiken.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)
