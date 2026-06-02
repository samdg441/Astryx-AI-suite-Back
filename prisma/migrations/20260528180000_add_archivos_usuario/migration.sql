-- CreateTable
CREATE TABLE "archivos_usuario" (
    "id" UUID NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "nombre_original" TEXT NOT NULL,
    "tipo_mime" TEXT NOT NULL,
    "tamano_bytes" INTEGER NOT NULL,
    "ruta_storage" TEXT NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "archivos_usuario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "archivos_usuario_usuario_id_idx" ON "archivos_usuario"("usuario_id");

-- AddForeignKey
ALTER TABLE "archivos_usuario" ADD CONSTRAINT "archivos_usuario_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
