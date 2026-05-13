// ============================================================
// CONVEX — Supabase Server Client (App Router / RSC)
// TODO: Activate when Supabase credentials are configured
// ============================================================

// import { createServerClient as createSSRServerClient } from '@supabase/ssr'
// import { cookies } from 'next/headers'
// import type { Database } from '@/database/types'

/**
 * Creates a Supabase client for use in Server Components, Route Handlers,
 * and Server Actions. Reads cookies from Next.js `next/headers`.
 *
 * Activation steps:
 * 1. npm install @supabase/ssr @supabase/supabase-js
 * 2. Set NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local
 * 3. Uncomment the import and implementation below
 * 4. Add Next.js middleware (middleware.ts) for session refresh
 */
export const createServerClient = async () => {
  // const cookieStore = await cookies()

  // return createSSRServerClient<Database>(
  //   process.env.NEXT_PUBLIC_SUPABASE_URL!,
  //   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  //   {
  //     cookies: {
  //       getAll() {
  //         return cookieStore.getAll()
  //       },
  //       setAll(cookiesToSet) {
  //         try {
  //           cookiesToSet.forEach(({ name, value, options }) =>
  //             cookieStore.set(name, value, options)
  //           )
  //         } catch {
  //           // setAll called from a Server Component — safe to ignore
  //         }
  //       },
  //     },
  //   }
  // )

  return null
}

/**
 * Creates a Supabase admin client using the service role key.
 * USE WITH CAUTION — bypasses Row Level Security.
 * Only use in trusted server-side contexts (webhooks, cron jobs).
 */
export const createAdminClient = () => {
  // const { createClient } = await import('@supabase/supabase-js')
  // return createClient<Database>(
  //   process.env.NEXT_PUBLIC_SUPABASE_URL!,
  //   process.env.SUPABASE_SERVICE_ROLE_KEY!,
  //   { auth: { autoRefreshToken: false, persistSession: false } }
  // )
  return null
}
