/**
 * Voegt entry_price kolom toe aan ai_analyses.
 * Bestaande analyses worden bijgewerkt met de huidige koers als beste benadering.
 * Gebruik: npx tsx scripts/migrate-entry-price.ts
 */

import "dotenv/config"
import { resolve } from "path"
import { config } from "dotenv"
config({ path: resolve(process.cwd(), ".env.local") })

import { createClient } from "@supabase/supabase-js"

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

async function main() {
  console.log("Migratie: entry_price toevoegen aan ai_analyses\n")

  // 1. Kolom toevoegen (idempotent — faalt stilletjes als hij al bestaat)
  const { error: alterError } = await sb.rpc("exec_sql" as never, {
    sql: "ALTER TABLE public.ai_analyses ADD COLUMN IF NOT EXISTS entry_price NUMERIC(10,2);"
  } as never)

  if (alterError) {
    // exec_sql bestaat mogelijk niet — direct via Supabase dashboard uitvoeren
    console.log("⚠️  Kan ALTER TABLE niet uitvoeren via RPC.")
    console.log("   Voer handmatig uit in Supabase SQL Editor:")
    console.log("")
    console.log("   ALTER TABLE public.ai_analyses ADD COLUMN IF NOT EXISTS entry_price NUMERIC(10,2);")
    console.log("")
    console.log("   UPDATE public.ai_analyses a")
    console.log("   SET entry_price = c.price")
    console.log("   FROM public.companies c")
    console.log("   WHERE a.company_id = c.id AND a.entry_price IS NULL AND c.price IS NOT NULL;")
    return
  }

  console.log("✓ Kolom entry_price toegevoegd")

  // 2. Backfill bestaande analyses met huidige koers als benadering
  const { error: updateError } = await sb.rpc("exec_sql" as never, {
    sql: `UPDATE public.ai_analyses a
          SET entry_price = c.price
          FROM public.companies c
          WHERE a.company_id = c.id
            AND a.entry_price IS NULL
            AND c.price IS NOT NULL;`
  } as never)

  if (!updateError) console.log("✓ Bestaande analyses bijgewerkt met huidige koers (benadering)")
  console.log("\nKlaar.")
}

main().catch(console.error)
