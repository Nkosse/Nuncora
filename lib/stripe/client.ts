// ============================================================
// CONVEX — Stripe Client Configuration
// TODO: Activate when Stripe credentials are configured
// ============================================================

// import Stripe from 'stripe'

/**
 * Activation steps:
 * 1. npm install stripe @stripe/stripe-js @stripe/react-stripe-js
 * 2. Set STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY, STRIPE_WEBHOOK_SECRET in .env.local
 * 3. Create a product + price in your Stripe dashboard
 * 4. Set STRIPE_PRICE_ID to the price ID from your dashboard
 * 5. Uncomment the Stripe initialization below
 */

// ── Price Configuration ───────────────────────────────────────

export const STRIPE_PRICE_ID =
  process.env.STRIPE_PRICE_ID || 'price_placeholder'

export const SUBSCRIPTION_PRICE = {
  amount: 10.99,
  currency: 'EUR',
  interval: 'month',
  displayPrice: '€10,99',
  displayPriceAnnual: '€109,90',
  trialDays: 7,
} as const

// ── Feature Gates ─────────────────────────────────────────────

export const PRO_FEATURES = [
  'Full AI investment thesis for all 15+ companies',
  'Asymmetric Score with all 10 sub-metrics',
  'Catalyst calendar with confidence scores',
  'Bull / Base / Bear valuation scenarios',
  'Thesis breaker alerts',
  'Unlimited watchlist creation',
  'Priority support',
] as const

export const FREE_FEATURES = [
  'Company overview (name, sector, price)',
  'Top-level Asymmetric Score (no breakdown)',
  '3 upcoming catalysts per company',
  '1 default watchlist',
] as const

// ── Stripe Client (Server-side) ───────────────────────────────

// export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: '2024-06-20',
//   typescript: true,
// })

// ── Checkout Session Helper ───────────────────────────────────

export interface CreateCheckoutSessionParams {
  userId: string
  userEmail: string
  priceId?: string
  successUrl: string
  cancelUrl: string
}

export async function createCheckoutSession(
  _params: CreateCheckoutSessionParams
): Promise<{ url: string | null; error?: string }> {
  // TODO: Replace with actual Stripe checkout session creation
  // const session = await stripe.checkout.sessions.create({
  //   mode: 'subscription',
  //   payment_method_types: ['card', 'sepa_debit'],
  //   customer_email: params.userEmail,
  //   line_items: [{ price: params.priceId ?? STRIPE_PRICE_ID, quantity: 1 }],
  //   subscription_data: {
  //     trial_period_days: SUBSCRIPTION_PRICE.trialDays,
  //     metadata: { userId: params.userId },
  //   },
  //   success_url: params.successUrl,
  //   cancel_url: params.cancelUrl,
  // })
  // return { url: session.url }

  console.warn('[Stripe] Stripe not yet configured — returning placeholder')
  return { url: null, error: 'Stripe not configured' }
}

// ── Portal Session Helper ─────────────────────────────────────

export async function createPortalSession(
  _customerId: string,
  _returnUrl: string
): Promise<{ url: string | null; error?: string }> {
  // const session = await stripe.billingPortal.sessions.create({
  //   customer: customerId,
  //   return_url: returnUrl,
  // })
  // return { url: session.url }

  return { url: null, error: 'Stripe not configured' }
}
