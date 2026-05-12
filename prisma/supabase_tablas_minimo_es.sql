-- =============================================================================
-- Mínimo: solo public.usuarios + public.ias (columnas en español).
-- Debe coincidir con prisma/schema.prisma (@map en modelos User y AiTool).
-- =============================================================================

BEGIN;

DROP TABLE IF EXISTS public.plan_ias CASCADE;
DROP TABLE IF EXISTS public.empresa_usuarios CASCADE;
DROP TABLE IF EXISTS public.ias CASCADE;
DROP TABLE IF EXISTS public.usuarios CASCADE;

CREATE TABLE public.usuarios (
  id                         INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nombre                     VARCHAR(120) NOT NULL,
  correo                     VARCHAR(150) NOT NULL UNIQUE,
  hash_contrasena            TEXT NOT NULL,
  rol_global                 VARCHAR(20) NOT NULL DEFAULT 'usuario',
  id_cliente_stripe          VARCHAR(191),
  id_suscripcion_stripe      VARCHAR(191),
  estado_suscripcion         VARCHAR(20) NOT NULL DEFAULT 'inactivo',
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

CREATE TABLE public.ias (
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
