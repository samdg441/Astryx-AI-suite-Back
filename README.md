# Astryx AI Suite Back

Backend de Astryx AI Suite. Este servicio sera la API REST que conecte el frontend de Astryx con una base de datos PostgreSQL alojada en Supabase usando Prisma como ORM.

El frontend publico de referencia esta en [samdg441/Astryx-AI-suite](https://github.com/samdg441/Astryx-AI-suite). A partir de ese repositorio, este backend queda preparado para soportar las secciones actuales del producto: herramientas de IA, planes de suscripcion, formulario de contacto y futuros flujos de usuarios/autenticacion.

## Objetivo

Crear una base backend limpia, escalable y facil de mantener para convertir Astryx AI Suite en una plataforma real. La API centralizara datos del producto, formularios, planes, herramientas IA y, mas adelante, autenticacion, pagos, suscripciones y administracion.

## Stack Tecnologico

- Node.js + TypeScript
- Express para endpoints HTTP
- Prisma ORM
- Supabase PostgreSQL como base de datos
- Zod para validacion de datos
- Helmet, CORS y Morgan para seguridad y observabilidad basica

## Arquitectura

El proyecto sigue una estructura inspirada en Clean Architecture. La idea principal es separar la logica del negocio de Express, Prisma y cualquier tecnologia externa.

```txt
.
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── application/
│   │   └── use-cases/
│   ├── domain/
│   │   ├── entities/
│   │   └── repositories/
│   ├── infrastructure/
│   │   ├── database/
│   │   └── repositories/
│   ├── presentation/
│   │   ├── controllers/
│   │   └── routes/
│   ├── shared/
│   │   ├── config/
│   │   ├── errors/
│   │   └── http/
│   ├── app.ts
│   └── main.ts
├── .env.example
├── package.json
└── tsconfig.json
```

## Que Va En Cada Carpeta

### `prisma/`

Contiene la definicion de la base de datos y scripts relacionados con Prisma.

- `schema.prisma`: modelos de base de datos. Actualmente incluye herramientas IA, planes y contactos.
- `seed.ts`: datos iniciales para poblar tablas base en desarrollo.

### `src/domain/`

Contiene las reglas y contratos centrales del negocio. No debe depender de Express, Prisma, Supabase ni frameworks externos.

- `entities/`: tipos principales del negocio, como `AiTool`, `SubscriptionPlan` y `ContactLead`.
- `repositories/`: interfaces que describen que necesita la aplicacion para leer o escribir datos.

### `src/application/`

Contiene casos de uso. Aqui vive la logica de aplicacion: listar herramientas, listar planes, registrar contactos, crear usuarios, procesar suscripciones, etc.

### `src/infrastructure/`

Contiene implementaciones tecnicas concretas.

- `database/`: cliente de Prisma y configuracion de conexion.
- `repositories/`: implementaciones reales de los repositorios usando Prisma.

### `src/presentation/`

Contiene la capa HTTP.

- `controllers/`: reciben requests, validan datos de entrada y llaman casos de uso.
- `routes/`: definen endpoints y conectan rutas con controladores.

### `src/shared/`

Utilidades compartidas que no pertenecen a un modulo de negocio especifico.

- `config/`: lectura y validacion de variables de entorno.
- `errors/`: errores comunes de aplicacion.
- `http/`: middlewares y helpers HTTP.

## Endpoints principales

Todos los endpoints usan el prefijo configurado en `API_PREFIX`, por defecto `/api/v1`.

### Auth

| Metodo | Ruta | Auth | Descripcion |
| --- | --- | --- | --- |
| `POST` | `/auth/register` | No | Registro + JWT |
| `POST` | `/auth/login` | No | Login + JWT |

### Herramientas IA (`/tools`) — CRUD completo

| Metodo | Ruta | Auth | Descripcion |
| --- | --- | --- | --- |
| `GET` | `/tools` | No | Lista paginada (`page`, `limit`, filtros: `category`, `requiredPlan`, `isActive`, `search`) → `{ data, meta }` |
| `GET` | `/tools/:id` | No | Detalle por ID |
| `POST` | `/tools` | Admin | Crear herramienta |
| `PUT` | `/tools/:id` | Admin | Actualizar |
| `DELETE` | `/tools/:id` | Admin | Eliminar |

### Contactos (`/contact-leads`) — CRUD completo

| Metodo | Ruta | Auth | Descripcion |
| --- | --- | --- | --- |
| `POST` | `/contact-leads` | No | Crear lead (formulario público) |
| `GET` | `/contact-leads` | Admin | Lista paginada (`status`, `source`, `search`) → `{ data, meta }` |
| `GET` | `/contact-leads/:id` | Admin | Detalle |
| `PUT` | `/contact-leads/:id` | Admin | Actualizar estado (`nuevo` \| `leido` \| `cerrado`) |
| `DELETE` | `/contact-leads/:id` | Admin | Eliminar |

### Usuarios (`/users`) — Admin

| Metodo | Ruta | Auth | Descripcion |
| --- | --- | --- | --- |
| `GET` | `/users` | Admin | Lista paginada de usuarios (`page`, `limit`) → `{ data, meta }` |

### Otros

| Metodo | Ruta | Auth | Descripcion |
| --- | --- | --- | --- |
| `GET` | `/health` | No | Health check + estado de BD (`database: connected`) |
| `GET` | `/plans` | No | Planes de suscripcion |
| `GET` | `/user/me` | Usuario | Perfil actual |
| `POST` | `/user/plan/gratis` | Usuario | Activar plan free |

**Roles:** el JWT incluye `globalRole` (`admin` \| `usuario`). Rutas Admin devuelven `403` si el rol no es `admin`.

Ejemplo para crear un contacto:

```json
{
  "name": "Samuel",
  "email": "samuel@example.com",
  "company": "Astryx",
  "message": "Quiero informacion sobre los planes.",
  "source": "website"
}
```

## Variables De Entorno

Copia `.env.example` como `.env` y reemplaza los valores:

```bash
cp .env.example .env
```

Variables principales:

- `NODE_ENV`: entorno de ejecucion.
- `PORT`: puerto local de la API.
- `API_PREFIX`: prefijo global de endpoints.
- `CORS_ORIGIN`: URL permitida del frontend.
- `DATABASE_URL`: string de conexion PostgreSQL de Supabase.
- `JWT_SECRET`: secreto para firmar JWT (minimo 16 caracteres).

## Supabase + Prisma

1. Crea un proyecto en Supabase.
2. Copia la URL de conexion PostgreSQL.
3. Pega esa URL en `DATABASE_URL`.
4. Ejecuta la migracion:

```bash
npm run prisma:migrate
```

5. Genera el cliente Prisma:

```bash
npm run prisma:generate
```

6. Opcionalmente inserta datos iniciales:

```bash
npm run prisma:seed
```

## Scripts

```bash
npm run dev              # Ejecuta la API en desarrollo
npm run build            # Genera Prisma Client y compila TypeScript
npm start                # Ejecuta la version compilada
npm run typecheck        # Revisa tipos sin compilar
npm run prisma:migrate   # Crea/aplica migraciones
npm run prisma:studio    # Abre Prisma Studio
npm run prisma:seed      # Inserta datos iniciales
```

## Despliegue (Render)

- **Build:** `npm install && npm run build`
- **Start:** `npm start` (usa `tsx` + Prisma ESM)
- Variables obligatorias: `DATABASE_URL` (pooler `?pgbouncer=true`), `DIRECT_URL`, `JWT_SECRET`, `CORS_ORIGIN`, `NODE_ENV=production`
- Demo: `https://astryx-ai-suite-back.onrender.com/api/v1/health`

## Roadmap Sugerido

- Autenticacion de usuarios con Supabase Auth o JWT propio.
- Modulo de usuarios y perfiles.
- Modulo de suscripciones y pagos.
- Panel administrador para gestionar herramientas IA y planes.
- Integracion del formulario de contacto del frontend.
- Documentacion OpenAPI/Swagger.
- Tests unitarios para casos de uso y tests de integracion para endpoints.