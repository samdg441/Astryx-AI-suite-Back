-- Columnas de facturación / plan en usuarios
ALTER TABLE public.usuarios
  ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(191),
  ADD COLUMN IF NOT EXISTS stripe_subscription_id VARCHAR(191),
  ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(20) NOT NULL DEFAULT 'inactive',
  ADD COLUMN IF NOT EXISTS plan_type VARCHAR(20) NOT NULL DEFAULT 'free';

DO $$
BEGIN
  ALTER TABLE public.usuarios
    ADD CONSTRAINT usuarios_subscription_status_check
    CHECK (subscription_status IN ('active', 'inactive', 'past_due'));
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER TABLE public.usuarios
    ADD CONSTRAINT usuarios_plan_type_check
    CHECK (plan_type IN ('free', 'pro', 'empresarial'));
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Plan mínimo por herramienta IA
ALTER TABLE public.ias
  ADD COLUMN IF NOT EXISTS plan_minimo VARCHAR(20) NOT NULL DEFAULT 'free';

DO $$
BEGIN
  ALTER TABLE public.ias
    ADD CONSTRAINT ias_plan_minimo_check
    CHECK (plan_minimo IN ('free', 'pro', 'empresarial'));
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
