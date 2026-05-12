-- =============================================================================
-- Mínimo viable: usuarios + ias (columnas en español).
-- Ejecutar en Supabase → SQL Editor.
--
-- Si YA existen tablas con otro esquema, NO ejecutes el bloque DROP sin copia
-- de seguridad. En ese caso usa solo los ALTER comentados al final o migra
-- datos a mano.
-- =============================================================================

BEGIN;

-- Quitar tablas dependientes típicas (descomenta solo en BD de desarrollo)
-- DROP TABLE IF EXISTS public.plan_ias CASCADE;
-- DROP TABLE IF EXISTS public.empresa_usuarios CASCADE;
-- DROP TABLE IF EXISTS public.ias CASCADE;
-- DROP TABLE IF EXISTS public.usuarios CASCADE;

CREATE TABLE IF NOT EXISTS public.usuarios (
  id                         INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nombre                     VARCHAR(120) NOT NULL,
  correo                     VARCHAR(150) NOT NULL UNIQUE,
  hash_contrasena            TEXT NOT NULL,
  rol_global                 VARCHAR(20) NOT NULL DEFAULT 'usuario',
  id_cliente_stripe         VARCHAR(191),
  id_suscripcion_stripe      VARCHAR(191),
  estado_suscripcion        VARCHAR(20) NOT NULL DEFAULT 'inactivo',
  tipo_plan                  VARCHAR(20),
  activo                     BOOLEAN NOT NULL DEFAULT TRUE,
  fecha_creacion             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  fecha_actualizacion        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT usuarios_rol_global_chk
    CHECK (rol_global IN ('admin', 'usuario')),
  CONSTRAINT usuarios_estado_suscripcion_chk
    CHECK (estado_suscripcion IN ('activo', 'inactivo', 'moroso')),
  CONSTRAINT usuarios_tipo_plan_chk
    CHECK (tipo_plan IS NULL OR tipo_plan IN ('free', 'basico', 'pro', 'empresarial'))
);

CREATE TABLE IF NOT EXISTS public.ias (
  id                      INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nombre                  VARCHAR(80) NOT NULL,
  proveedor               VARCHAR(80),
  descripcion             TEXT NOT NULL,
  categoria               VARCHAR(40),
  url_api                 VARCHAR(600),
  plan_minimo             VARCHAR(20) NOT NULL DEFAULT 'free',
  activa                  BOOLEAN NOT NULL DEFAULT TRUE,
  fecha_creacion          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  fecha_actualizacion     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT ias_plan_minimo_chk
    CHECK (plan_minimo IN ('free', 'basico', 'pro', 'empresarial'))
);

COMMIT;

-- -----------------------------------------------------------------------------
-- Si tu tabla usuarios ya existía en inglés, renombra columnas (ejemplo):
-- ALTER TABLE public.usuarios RENAME COLUMN email TO correo;
-- ALTER TABLE public.usuarios RENAME COLUMN password_hash TO hash_contrasena;
-- ALTER TABLE public.usuarios RENAME COLUMN stripe_customer_id TO id_cliente_stripe;
-- ALTER TABLE public.usuarios RENAME COLUMN stripe_subscription_id TO id_suscripcion_stripe;
-- ALTER TABLE public.usuarios RENAME COLUMN subscription_status TO estado_suscripcion;
-- ALTER TABLE public.usuarios RENAME COLUMN plan_type TO tipo_plan;
-- ALTER TABLE public.usuarios RENAME COLUMN created_at TO fecha_creacion;
-- ALTER TABLE public.usuarios RENAME COLUMN updated_at TO fecha_actualizacion;
--
-- Para ias:
-- ALTER TABLE public.ias RENAME COLUMN created_at TO fecha_creacion;
-- ALTER TABLE public.ias RENAME COLUMN updated_at TO fecha_actualizacion;
-- ALTER TABLE public.ias ADD COLUMN IF NOT EXISTS url_api VARCHAR(600);
-- -----------------------------------------------------------------------------
