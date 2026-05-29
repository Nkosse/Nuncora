-- ============================================================
-- CONVEX INVESTOR DASHBOARD — Supabase Database Schema
-- Plak dit in: Supabase → SQL Editor → Run
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================
-- HELPER: updated_at trigger
-- ============================================================

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ============================================================
-- 1. USERS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.users (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL UNIQUE,
  full_name   TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER set_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile"   ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- ============================================================
-- 2. SUBSCRIPTIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id                 UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  stripe_customer_id      TEXT UNIQUE,
  stripe_subscription_id  TEXT UNIQUE,
  stripe_price_id         TEXT,
  status                  TEXT NOT NULL DEFAULT 'inactive' CHECK (status IN ('active','inactive','trial','cancelled','past_due')),
  plan                    TEXT NOT NULL DEFAULT 'free'     CHECK (plan IN ('free','pro')),
  trial_end               TIMESTAMPTZ,
  current_period_start    TIMESTAMPTZ,
  current_period_end      TIMESTAMPTZ,
  cancelled_at            TIMESTAMPTZ,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS subscriptions_user_id_idx ON public.subscriptions(user_id);
CREATE TRIGGER set_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own subscription" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);

-- ============================================================
-- 3. COMPANIES
-- ============================================================

CREATE TABLE IF NOT EXISTS public.companies (
  id            TEXT PRIMARY KEY,             -- bijv. 'rklb'
  slug          TEXT NOT NULL UNIQUE,
  ticker        TEXT NOT NULL UNIQUE,
  name          TEXT NOT NULL,
  exchange      TEXT,
  sector        TEXT,
  industry      TEXT,
  description   TEXT,
  website       TEXT,
  ceo           TEXT,
  employees     INTEGER,
  ipo_date      TEXT,
  country       TEXT DEFAULT 'US',
  -- live marktdata (bijgewerkt door nachtelijke pipeline)
  price         NUMERIC(12, 4),
  market_cap    NUMERIC(18, 2),              -- in dollars
  beta          NUMERIC(6, 3),
  price_change_pct NUMERIC(8, 4),           -- % verandering t.o.v. gisteren
  -- meta
  is_active     BOOLEAN NOT NULL DEFAULT true,
  discovered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_updated  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS companies_ticker_idx  ON public.companies(ticker);
CREATE INDEX IF NOT EXISTS companies_sector_idx  ON public.companies(sector);
CREATE INDEX IF NOT EXISTS companies_name_trgm   ON public.companies USING gin(name gin_trgm_ops);
CREATE TRIGGER set_companies_updated_at BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Companies are publicly readable" ON public.companies FOR SELECT TO authenticated, anon USING (true);

-- ============================================================
-- 4. AI ANALYSES  (kern van de nachtelijke pipeline)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.ai_analyses (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id            TEXT NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  generated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  model                 TEXT NOT NULL DEFAULT 'claude-opus-4-7',
  -- scores
  score_total           INTEGER,                          -- 0–100
  score_revenue_growth  INTEGER,                          -- 0–10
  score_cash_runway     INTEGER,
  score_tam_size        INTEGER,
  score_competitive_adv INTEGER,
  score_management      INTEGER,
  score_catalysts       INTEGER,
  score_short_interest  INTEGER,
  score_dilution_risk   INTEGER,
  score_sector_tailwind INTEGER,
  score_valuation       INTEGER,
  score_tech_moat       INTEGER,                           -- 0–10: hoe moeilijk is de tech na te maken?
  -- analyse tekst
  risk_level            TEXT CHECK (risk_level IN ('low','medium','high','very-high')),
  summary               TEXT,
  thesis                TEXT,
  bull_case             TEXT,
  bear_case             TEXT,
  key_risks             JSONB NOT NULL DEFAULT '[]',      -- string[]
  catalysts             JSONB NOT NULL DEFAULT '[]',      -- string[]
  -- prijsdoelen
  price_target_base     NUMERIC(10, 2),
  price_target_bull     NUMERIC(10, 2),
  price_target_bear     NUMERIC(10, 2),
  -- begrijpelijke uitleg
  plain_summary         JSONB,                             -- { whatTheyDo, competitors[], whyItCouldWork }
  -- instap opportunity
  entry_is_opportunity  BOOLEAN DEFAULT false,
  entry_strength        TEXT CHECK (entry_strength IN ('strong','moderate','weak')),
  entry_reason          TEXT,
  entry_trigger_type    TEXT CHECK (entry_trigger_type IN ('price_dip','catalyst_approaching','undervalued','combined')),
  -- meta
  news_used             INTEGER DEFAULT 0,                -- # nieuwsartikelen meegenomen
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Alleen de meest recente analyse per bedrijf tonen
CREATE INDEX IF NOT EXISTS ai_analyses_company_id_idx    ON public.ai_analyses(company_id);
CREATE INDEX IF NOT EXISTS ai_analyses_generated_at_idx  ON public.ai_analyses(generated_at DESC);
CREATE TRIGGER set_ai_analyses_updated_at BEFORE UPDATE ON public.ai_analyses FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
ALTER TABLE public.ai_analyses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "AI analyses are publicly readable" ON public.ai_analyses FOR SELECT TO authenticated, anon USING (true);

-- ============================================================
-- 5. COMPANY NEWS  (opgeslagen nieuwsartikelen per bedrijf)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.company_news (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id    TEXT NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  ticker        TEXT NOT NULL,
  title         TEXT NOT NULL,
  summary       TEXT,
  url           TEXT,
  source        TEXT,
  published_at  TIMESTAMPTZ,
  sentiment     TEXT CHECK (sentiment IN ('positive','neutral','negative')),
  is_significant BOOLEAN DEFAULT false,
  fetched_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS company_news_company_id_idx   ON public.company_news(company_id);
CREATE INDEX IF NOT EXISTS company_news_published_at_idx ON public.company_news(published_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS company_news_url_idx   ON public.company_news(url) WHERE url IS NOT NULL;
ALTER TABLE public.company_news ENABLE ROW LEVEL SECURITY;
CREATE POLICY "News is publicly readable" ON public.company_news FOR SELECT TO authenticated, anon USING (true);

-- ============================================================
-- 6. CATALYSTS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.catalysts (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id        TEXT NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  title             TEXT NOT NULL,
  description       TEXT,
  catalyst_date     DATE,
  estimated_period  TEXT,
  catalyst_type     TEXT NOT NULL CHECK (catalyst_type IN (
    'Earnings','Product Launch','Regulatory','Investor Day',
    'Contract','Partnership','Launch','FDA Milestone','Financing','Conference'
  )),
  impact_level      TEXT NOT NULL CHECK (impact_level IN ('Low','Medium','High','Critical')),
  confidence_level  INTEGER NOT NULL DEFAULT 50 CHECK (confidence_level BETWEEN 0 AND 100),
  is_upcoming       BOOLEAN NOT NULL DEFAULT true,
  is_passed         BOOLEAN NOT NULL DEFAULT false,
  actual_outcome    TEXT,
  source            TEXT DEFAULT 'ai',   -- 'ai' of 'manual'
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS catalysts_company_id_idx  ON public.catalysts(company_id);
CREATE INDEX IF NOT EXISTS catalysts_date_idx        ON public.catalysts(catalyst_date);
CREATE INDEX IF NOT EXISTS catalysts_upcoming_idx    ON public.catalysts(is_upcoming) WHERE is_upcoming = true;
CREATE TRIGGER set_catalysts_updated_at BEFORE UPDATE ON public.catalysts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
ALTER TABLE public.catalysts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Catalysts are publicly readable" ON public.catalysts FOR SELECT TO authenticated, anon USING (true);

-- ============================================================
-- 7. WATCHLISTS  (samengesteld door Convex)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.watchlists (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug          TEXT NOT NULL UNIQUE,
  name          TEXT NOT NULL,
  theme         TEXT NOT NULL,
  description   TEXT,
  average_score NUMERIC(5,1),
  risk_level    TEXT CHECK (risk_level IN ('Low','Medium','High','Very High')),
  is_featured   BOOLEAN NOT NULL DEFAULT false,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER set_watchlists_updated_at BEFORE UPDATE ON public.watchlists FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
ALTER TABLE public.watchlists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Watchlists are publicly readable" ON public.watchlists FOR SELECT TO authenticated, anon USING (true);

-- ============================================================
-- 8. WATCHLIST_COMPANIES
-- ============================================================

CREATE TABLE IF NOT EXISTS public.watchlist_companies (
  watchlist_id  UUID NOT NULL REFERENCES public.watchlists(id) ON DELETE CASCADE,
  company_id    TEXT NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  added_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (watchlist_id, company_id)
);

CREATE INDEX IF NOT EXISTS watchlist_companies_company_id_idx ON public.watchlist_companies(company_id);
ALTER TABLE public.watchlist_companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Watchlist companies are publicly readable" ON public.watchlist_companies FOR SELECT TO authenticated, anon USING (true);

-- ============================================================
-- 9. PIPELINE RUNS  (log van elke nachtelijke run)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.pipeline_runs (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  started_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at       TIMESTAMPTZ,
  status            TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('running','success','partial','failed')),
  companies_found   INTEGER DEFAULT 0,
  companies_updated INTEGER DEFAULT 0,
  companies_new     INTEGER DEFAULT 0,
  news_fetched      INTEGER DEFAULT 0,
  analyses_run      INTEGER DEFAULT 0,
  errors            JSONB NOT NULL DEFAULT '[]',
  triggered_by      TEXT DEFAULT 'cron'              -- 'cron' of 'manual'
);

ALTER TABLE public.pipeline_runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Pipeline runs are publicly readable" ON public.pipeline_runs FOR SELECT TO authenticated, anon USING (true);

-- ============================================================
-- VIEWS
-- ============================================================

-- Bedrijven met hun meest recente AI score + analyse
CREATE OR REPLACE VIEW public.companies_with_latest_analysis AS
SELECT
  c.id,
  c.slug,
  c.ticker,
  c.name,
  c.exchange,
  c.sector,
  c.industry,
  c.description,
  c.website,
  c.ceo,
  c.price,
  c.market_cap,
  c.beta,
  c.price_change_pct,
  c.last_updated,
  a.score_total,
  a.risk_level,
  a.summary,
  a.thesis,
  a.bull_case,
  a.bear_case,
  a.key_risks,
  a.catalysts       AS ai_catalysts,
  a.price_target_base,
  a.price_target_bull,
  a.price_target_bear,
  a.generated_at    AS analysis_date,
  -- sub-scores
  a.score_revenue_growth,
  a.score_cash_runway,
  a.score_tam_size,
  a.score_competitive_adv,
  a.score_management,
  a.score_catalysts  AS score_catalyst_density,
  a.score_short_interest,
  a.score_dilution_risk,
  a.score_sector_tailwind,
  a.score_valuation,
  a.score_insider_ownership,
  a.score_tech_moat,
  a.entry_is_opportunity,
  a.entry_strength,
  a.entry_reason,
  a.entry_trigger_type,
  a.entry_price
FROM public.companies c
LEFT JOIN LATERAL (
  SELECT * FROM public.ai_analyses a2
  WHERE a2.company_id = c.id
  ORDER BY a2.generated_at DESC
  LIMIT 1
) a ON true
WHERE c.is_active = true;

-- Aankomende catalysts met bedrijfsinfo
CREATE OR REPLACE VIEW public.upcoming_catalysts AS
SELECT
  cat.*,
  c.name   AS company_name,
  c.ticker AS company_ticker,
  c.sector AS company_sector
FROM public.catalysts cat
JOIN public.companies c ON c.id = cat.company_id
WHERE cat.is_upcoming = true AND cat.is_passed = false
ORDER BY COALESCE(cat.catalyst_date, CURRENT_DATE + INTERVAL '90 days'), cat.impact_level DESC;

-- Recent nieuws (laatste 7 dagen)
CREATE OR REPLACE VIEW public.recent_news AS
SELECT
  n.*,
  c.name   AS company_name,
  c.ticker AS company_ticker
FROM public.company_news n
JOIN public.companies c ON c.id = n.company_id
WHERE n.published_at > now() - INTERVAL '7 days'
ORDER BY n.published_at DESC;

-- ============================================================
-- GRANTS
-- ============================================================

GRANT SELECT ON public.companies                    TO anon, authenticated;
GRANT SELECT ON public.ai_analyses                  TO anon, authenticated;
GRANT SELECT ON public.company_news                 TO anon, authenticated;
GRANT SELECT ON public.catalysts                    TO anon, authenticated;
GRANT SELECT ON public.watchlists                   TO anon, authenticated;
GRANT SELECT ON public.watchlist_companies          TO anon, authenticated;
GRANT SELECT ON public.pipeline_runs                TO anon, authenticated;
GRANT SELECT ON public.companies_with_latest_analysis TO anon, authenticated;
GRANT SELECT ON public.upcoming_catalysts           TO anon, authenticated;
GRANT SELECT ON public.recent_news                  TO anon, authenticated;
GRANT SELECT ON public.subscriptions                TO authenticated;
GRANT SELECT, UPDATE ON public.users                TO authenticated;
GRANT ALL ON public.watchlists                      TO authenticated;
