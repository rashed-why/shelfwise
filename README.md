# Shelfwise

A small library platform: browse the catalog, place holds, and track reading lists. Admins manage books, authors, categories, users, borrows, and holds from a dashboard.

**Live demo:** [https://new-shelfwise.vercel.app/](https://new-shelfwise.vercel.app/)

## Features

- **Public** — Home, discover by category, header search, book detail pages
- **Members** — Register / sign in, place holds, view holds and reading list
- **Admin** — CRUD for catalog, user list, hold queue, record borrows and returns
- **API** — NestJS REST backend with JWT auth (email/password and Google OAuth on the API)

## Tech stack

| Part | Technologies |
|------|----------------|
| `api/` | NestJS, Prisma, PostgreSQL, JWT |
| `web/` | Next.js 16, NextAuth, TanStack Query, Tailwind CSS 4 |

More detail for the frontend: [`web/README.md`](web/README.md).

## Table of contents

- [Demo credentials](#demo-credentials)
- [Repository layout](#repository-layout)
- [Prerequisites](#prerequisites)
- [Environment variable examples](#environment-variable-examples)
- [Local setup](#local-setup)
  - [1. Database](#1-database)
  - [2. API (`api/`)](#2-api-setup-api)
  - [3. Web (`web/`)](#3-web-setup-web)
  - [4. Run everything](#4-run-everything-quick-reference)
- [Main user flow (Web ↔ API)](#main-user-flow-web--api)
- [Troubleshooting](#troubleshooting)

## Demo credentials

After running the database seed (`yarn prisma:seed` in `api/`), you can sign in locally with:

| Role  | Email             | Password   | Lands on   |
|-------|-------------------|------------|------------|
| Admin | `admin@admin.com` | `12345678` | `/admin`   |

**Regular user:** there is no pre-seeded member account. Create one:

| Environment | Register |
|-------------|----------|
| **Live** | [new-shelfwise.vercel.app/register](https://new-shelfwise.vercel.app/register) |
| **Local** | [localhost:3000/register](http://localhost:3000/register) |

New accounts get the **USER** role and land on `/user/dashboard` after login.

## Repository layout

| Path   | Stack                | Default URL             |
|--------|----------------------|-------------------------|
| `api/` | NestJS, Prisma, PG   | `http://localhost:4000` |
| `web/` | Next.js 16, NextAuth | `http://localhost:3000` |

In development, the web app proxies API requests through **`/backend/*`** (see `web/next.config.ts`) so the browser talks to the API on the same origin. Book cover assets are served from the API under **`/media/*`**.

## Prerequisites

- **Node.js** 20+ (LTS recommended)
- **Yarn** 1.x
- **PostgreSQL** 14+

---

## Environment variable examples

Example files are committed in the repo (no secrets):

| App | Example file       | Copy to            |
|-----|--------------------|--------------------|
| API | `api/.env.example` | `api/.env`         |
| Web | `web/.env.example` | `web/.env.local`   |

```bash
cp api/.env.example api/.env
cp web/.env.example web/.env.local
```

Then edit `DATABASE_URL`, JWT/Auth secrets, and Google OAuth values as needed. See sections below for variable descriptions.

---

## Local setup

### 1. Database

Create a PostgreSQL database, then note its connection string:

```text
postgresql://USER:PASSWORD@localhost:5432/shelfwise?schema=public
```

### 2. API setup (`api/`)

#### Install dependencies

```bash
cd api
yarn install
```

#### Environment variables

Copy the example file and customize:

```bash
cp .env.example .env
```

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `PORT` | No | API port (default `4000`) |
| `FRONTEND_URL` | No | Web origin for CORS and OAuth redirects (default `http://localhost:3000`) |
| `JWT_SECRET` | Yes | Signs access tokens |
| `JWT_EXPIRES_IN` | Yes | Access token lifetime (e.g. `1h`) |
| `JWT_REFRESH_EXPIRES_IN` | Yes | Refresh token lifetime (e.g. `7d`) |
| `GOOGLE_CLIENT_ID` | Yes* | Google OAuth client ID (*required for Nest to boot) |
| `GOOGLE_CLIENT_SECRET` | Yes* | Google OAuth client secret |
| `GOOGLE_REDIRECT_URI` | Yes* | Usually `http://localhost:4000/auth/google/callback` |

Full template: [`api/.env.example`](api/.env.example).

Use real Google OAuth credentials from [Google Cloud Console](https://console.cloud.google.com/) for “Sign in with Google”. Email/password login does not require using Google in the UI, but the API still expects the Google env vars to be set.

#### Prisma

Generate the client and apply the schema to your database:

```bash
yarn prisma:generate
npx prisma db push
```

#### Seed data

Seeds an admin user, categories, authors, and 20 sample books (cover image: `public/media/books/book.png`):

```bash
yarn prisma:seed
```

See [Demo credentials](#demo-credentials) above.

#### Run the API

```bash
yarn start:dev
```

API listens on **http://localhost:4000**. Static uploads (book covers) live under `api/public/` and are exposed at `/media/...`.

### 3. Web setup (`web/`)

#### Install dependencies

```bash
cd web
yarn install
```

#### Environment variables

Copy the example file and customize:

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
|----------|----------|-------------|
| `AUTH_SECRET` | Yes | NextAuth JWT/session encryption (`openssl rand -base64 32`) |
| `API_URL` | Yes | Nest URL for server rewrites (`http://localhost:4000`) |
| `NEXT_PUBLIC_API_URL` | No | If set, browser calls API directly instead of `/backend` |
| `NEXT_PUBLIC_API_ORIGIN` | No | Base URL for book cover assets when using public API URL |

Full template: [`web/.env.example`](web/.env.example).

#### Run the web app

```bash
yarn dev
```

Open **http://localhost:3000**.

### 4. Run everything (quick reference)

Use two terminals:

```bash
# Terminal 1 — API
cd api && yarn start:dev

# Terminal 2 — Web
cd web && yarn dev
```

Ensure PostgreSQL is running and `api/.env` / `web/.env.local` are configured before starting.

---

## Main user flow (Web ↔ API)

The browser calls the Nest API through **`/backend/*`** (Next.js rewrite). For curl or REST Client, use **`http://localhost:4000`** directly.

Use [Demo credentials](#demo-credentials) above to sign in as admin after seeding.

**Web base URL:** use `http://localhost:3000` locally or [https://new-shelfwise.vercel.app](https://new-shelfwise.vercel.app) for the live app.

### Flow overview

```mermaid
flowchart LR
  subgraph public [Public]
    Home["/"]
    Discover["/discover"]
    Book["/discover/{category}/{bookId}"]
  end
  subgraph auth [Auth]
    Register["/register"]
    Login["/login"]
  end
  subgraph member [Signed-in USER]
    Dashboard["/user/dashboard"]
    Holds["/user/holds"]
    Reading["/user/reading-list"]
  end
  subgraph admin [ADMIN]
    AdminHolds["/admin/holds/list"]
    AdminBorrow["POST /borrowed"]
  end
  Home --> Discover --> Book
  Book -->|"Place hold"| Login
  Register --> Login
  Login --> Dashboard
  Book -->|"Place hold JWT"| Holds
  AdminHolds --> AdminBorrow
  AdminBorrow --> Reading
```

### 1. Browse the catalog (guest)

| Step | Web | API |
|------|-----|-----|
| Home & featured books | `/` | `GET /books`, `GET /categories` |
| Browse by category | `/discover` | Same; UI filters client-side by category |
| Book detail | `/discover/{categorySlug}/{bookId}` | `GET /books/:id` |
| Search by title | Header search → dropdown → book detail | `GET /books` (loaded once, filtered in UI) |

No authentication required.

### 2. Create an account & sign in

| Step | Web | API |
|------|-----|-----|
| Register | `/register` | `POST /user` — JSON body: `{ "name", "email", "password" }` |
| Sign in | `/login` | `POST /auth/login` — `{ "email", "password" }` → `accessToken`, `refreshToken`, `user` |
| Session | NextAuth (`/api/next-auth/*`) stores JWT in session | `GET /auth/me` with `Authorization: Bearer {accessToken}` |

After login, **USER** accounts are redirected to **`/user/dashboard`**. **ADMIN** accounts go to **`/admin`**.

### 3. Place a hold on a book (member)

| Step | Web | API |
|------|-----|-----|
| From discover or book detail, click **Place hold** | Redirects to `/login?callbackUrl=…` if guest | — |
| Hold created (toast) | Same page | `POST /holds` — `{ "bookId" }` + user JWT |
| View my holds | `/user/holds` | `GET /holds/me` |
| Cancel a hold | Cancel control on holds page | `DELETE /holds/:id` |

Signed-in **USER** roles cannot browse the public site; they use **`/user/*`** routes (enforced in `web/src/proxy.ts`).

### 4. Admin fulfills a hold → reading list

| Step | Web | API |
|------|-----|-----|
| Review hold queue | `/admin/holds/list` | `GET /holds` (admin JWT) |
| Record borrow for a hold | **Book hold** action on a row | `POST /borrowed` — `{ "userId", "bookIds", "dueAt" }` |
| Member sees active loan | `/user/reading-list` | `GET /reading-list/me` |
| Mark returned | `/admin/borrowed/list` | `PATCH /borrowed/:id/status` or `PATCH /borrowed/:id/return` |

### 5. Admin catalog (optional)

| Step | Web | API |
|------|-----|-----|
| List / create / edit / delete books | `/admin/books/list`, `/admin/books/create` | `GET/POST/PATCH/DELETE /books` |
| Authors & categories | `/admin/authors/list`, `/admin/categories/list` | `GET/POST/PATCH/DELETE /authors`, `/categories` |
| Users | `/admin/users/list` | `GET /user` (admin), `GET /user/:id` |

### Example API sequence (curl)

Replace tokens and IDs from your environment.

```bash
# Catalog (public)
curl -s http://localhost:4000/books | head -c 200
curl -s http://localhost:4000/categories

# Register
curl -s -X POST http://localhost:4000/user \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com","password":"password123"}'

# Login
curl -s -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"jane@example.com","password":"password123"}'

# Place hold (use accessToken and a real bookId from GET /books)
curl -s -X POST http://localhost:4000/holds \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"bookId":"BOOK_ID"}'

# My holds
curl -s http://localhost:4000/holds/me \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

More HTTP examples: [`api/app.endpoint.http`](api/app.endpoint.http) (register via JSON body as shown above).

---

## Troubleshooting

- **`DATABASE_URL is not set`** — Create `api/.env` and run commands from the `api/` directory (seed loads `.env` automatically).
- **Web cannot reach API** — Confirm the API is on port 4000 and `API_URL` in `web/.env.local` matches. Restart `yarn dev` after env changes.
- **Book covers 404** — Covers are stored under `api/public/media/books/`. Seed expects `book.png` at that path.
- **CORS errors** — Set `FRONTEND_URL` in `api/.env` to your web origin (default `http://localhost:3000`).

---

## Planned AI/ML features (not implemented)

AI/ML features weren’t implemented due to time constraints. The planned scope was a RAG-based chatbot (LLM + LangChain) for book recommendations and text summarization. See [`web/README.md`](web/README.md).
