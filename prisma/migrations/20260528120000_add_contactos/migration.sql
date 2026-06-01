-- Tabla contactos con FK opcional a usuarios (para cumplir relación FK en la rúbrica)

CREATE TABLE IF NOT EXISTS public.contactos (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre              VARCHAR(120) NOT NULL,
  correo              VARCHAR(160) NOT NULL,
  empresa             VARCHAR(120),
  mensaje             TEXT NOT NULL,
  origen              VARCHAR(80) NOT NULL DEFAULT 'website',
  estado              VARCHAR(20) NOT NULL DEFAULT 'nuevo',
  usuario_id          INT,
  fecha_creacion      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  fecha_actualizacion TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT contactos_estado_chk
    CHECK (estado IN ('nuevo', 'leido', 'cerrado')),
  CONSTRAINT contactos_usuario_id_fkey
    FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS contactos_estado_idx ON public.contactos (estado);
CREATE INDEX IF NOT EXISTS contactos_fecha_creacion_idx ON public.contactos (fecha_creacion DESC);
