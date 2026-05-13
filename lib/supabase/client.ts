// ============================================================
// CONVEX — Supabase Browser Client
// TODO: Activate when Supabase credentials are configured
// ============================================================

// import { createBrowserClient } from '@supabase/ssr'
// import type { Database } from '@/database/types'

/**
 * Creates a Supabase client for use in browser (client) components.
 *
 * Activation steps:
 * 1. npm install @supabase/ssr @supabase/supabase-js
 * 2. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local
 * 3. Uncomment the import and return statement below
 * 4. Generate database types: npx supabase gen types typescript --project-id <id>
 */
export const createClient = () => {
  // return createBrowserClient<Database>(
  //   process.env.NEXT_PUBLIC_SUPABASE_URL!,
  //   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  // )
  return null
}

export type SupabaseBrowserClient = NonNullable<ReturnType<typeof createClient>>
