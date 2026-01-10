# Monorepo boilerplate

A production-ready, high-performance full-stack monorepo featuring: **Bun**, **Hono**, and **Next.js**.

This architecture prioritizes **End-to-End Type Safety**, **Developer Experience**, and **Scalability**.

---

## Tech stack

### Core

- **Runtime:** [Bun](https://bun.sh/) (Fastest JavaScript runtime)
- **Orchestration:** [TurboRepo](https://turbo.build/) (High-performance build system)
- **Package Manager:** [pnpm](https://pnpm.io/) (Efficient dependency management)

### Backend (`apps/api`)

- **Framework:** [Hono](https://hono.dev/) (Ultrafast web standard edge-ready framework)
- **RPC:** Hono RPC (Share API types with frontend without code generation)
- **Validation:** [Zod](https://zod.dev/) + `@hono/zod-validator`

### Frontend (`apps/web`)

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Fetching:** Server Components + Hono RPC Client

### Database (`packages/db`)

- **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
- **Database:** PostgreSQL
- **Migrations:** Drizzle Kit

---

## Repository structure

```text
.
├── apps
│   ├── api          # Hono server running on Bun (Port 5000)
│   │   └── src/routes  # Modular API route definitions
│   └── web          # Next.js 16 Frontend (Port 3000)
│       └── lib/client  # Type-safe RPC client
├── packages
│   ├── db           # Drizzle Schema, Connection, and Migrations
│   ├── schemas      # Shared Zod schemas (Single Source of Truth)
│   └── tsconfig     # Shared TypeScript configurations
├── turbo.json       # Build pipeline configuration
└── pnpm-workspace.yaml
```

---

## Getting started

Follow these steps to get the project running locally in under 5 minutes.

### 1. Prerequisites

- Node.js & npm (Installed globally)
- Bun (`curl -fsSL https://bun.sh/install | bash`)
- pnpm (`npm install -g pnpm`)
- PostgreSQL (Running locally or via Docker)

### 2. Clone & Install

```bash
git clone

# Install dependencies for all apps and packages
pnpm install
```

### 3. Environment Setup

I used `.env` files for configuration. Copy the example files to create your local secrets.

```bash
# 1. Database Package (Used for migrations)
cp packages/db/.env.example packages/db/.env

# 2. API App (Used for server connection)
cp apps/api/.env.example apps/api/.env

# 3. Web App (Used for client connection)
cp apps/web/.env.example apps/web/.env.local
```

> **Note:** Ensure your `DATABASE_URL` in `packages/db/.env` and `apps/api/.env` points to your running Postgres instance.

### 4. Database Initialization

Push the schema definitions to your local database.

```bash
pnpm db:push
```

### 5. Run Development Server

Start the entire stack (Frontend + Backend + Watchers) in parallel.

```bash
pnpm dev
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:5000](http://localhost:5000)
- Health Check: [http://localhost:5000/health](http://localhost:5000/health)

---

## Development workflow

### How to add a new dependency

In a pnpm workspace, you must specify the filter (which app needs the package).

```bash
# Add 'dayjs' to the Web App
pnpm add dayjs --filter web

# Add 'lodash' to the API
pnpm add lodash --filter api
```

#### Adding shadcn components (from the root)
```bash
pnpm dlx shadcn@latest add card --cwd apps/web
```

### How to modify the Database

Edit `packages/db/src/schema.ts`.  
Push the changes to the DB:

```bash
pnpm db:push
```

Your API types will automatically update to reflect the new columns.

### How to add a shared Zod Schema

1. Create a new file in `packages/schemas/src/`.
2. Export it in `packages/schemas/src/index.ts`.
3. Build the package (or just run `pnpm dev`, which watches it):

```bash
pnpm --filter @repo/schemas build
```

You can now import it in both `apps/web` and `apps/api` immediately.

---

## Key concepts

### Hono RPC (The "Magic" Link)

You do **not** need to use:

```typescript
fetch("http://localhost:5000/users");
```

Instead, you can use the RPC Client.

**Backend (`apps/api/src/routes/users.ts`):**

```typescript
export const usersRoute = new Hono().get("/", async (c) => {
  return c.json({ id: 1, name: "Admin" });
});
```

**Frontend (`apps/web/app/page.tsx`):**

```typescript
// Fully typed! VS Code knows 'res' contains { id: number, name: string }
const res = await client.users.$get();
const data = await res.json();
```

### Shared Schemas

We define validation rules **once** in `packages/schemas`.

- **API** uses it to validate incoming JSON requests.
- **Web** uses it to validate Forms (e.g., React Hook Form).

If you change a validation rule, both apps update automatically.

---

## scripts

| Command        | Description                                      |
| -------------- | ------------------------------------------------ |
| `pnpm dev`     | Starts the development server for all apps.      |
| `pnpm build`   | Builds all apps and packages for production.     |
| `pnpm lint`    | Runs ESLint across the workspace.                |
| `pnpm clean`   | Nukes node_modules and caches for a fresh start. |
| `pnpm db:generate` | Generates Drizzle schema changes to the database.   |
| `pnpm db:push` | Pushes Drizzle schema changes to the database.   |
