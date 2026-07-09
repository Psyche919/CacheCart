# Architecture

## Overview

CacheCart is a monolithic Node.js web application using Express 5. It follows a layered architecture with clear separation between HTTP handling, business logic, and data access. Server-side rendering (EJS) delivers the primary user interface; a JSON REST API provides programmatic access to the same underlying services.

This structure is deliberate. A monolith reduces operational complexity for a portfolio project while the internal layering preserves testability and mirrors patterns found in larger systems where route handlers, service classes, and repositories are distinct concerns.

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                         │
│              Browser (HTML)  │  API Consumer (JSON)        │
└──────────────┬───────────────┴──────────────┬──────────────┘
               │                              │
               ▼                              ▼
┌──────────────────────────┐    ┌─────────────────────────────┐
│   Web Routes + Views     │    │      API Routes (/api)      │
│   (EJS templates)        │    │      JSON responses         │
└──────────────┬───────────┘    └──────────────┬──────────────┘
               │                              │
               └──────────────┬───────────────┘
                              ▼
               ┌──────────────────────────────┐
               │         Controllers          │
               │   Request/response mapping   │
               └──────────────┬───────────────┘
                              ▼
               ┌──────────────────────────────┐
               │          Services            │
               │      Business logic          │
               └──────────────┬───────────────┘
                              ▼
               ┌──────────────────────────────┐
               │           Models             │
               │   Queries and persistence    │
               └──────────────┬───────────────┘
                              ▼
               ┌──────────────────────────────┐
               │         PostgreSQL           │
               └──────────────────────────────┘
```

---

## Technology Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Runtime | Node.js 20 LTS | Long-term support, native async, wide ecosystem |
| HTTP framework | Express 5 | Established middleware ecosystem; representative of common pentest targets |
| Template engine | EJS | Simple server-side rendering without build toolchain overhead |
| Database | PostgreSQL 16 | Relational integrity, JSON column support for product specs, production credibility |
| Query layer | `pg` with parameterized queries | Direct SQL control without ORM abstraction hiding query construction |
| Session store | `connect-pg-simple` or in-memory (dev) | Server-side sessions persisted to PostgreSQL in non-development environments |
| Configuration | `dotenv` | Twelve-factor configuration via environment variables |
| Process manager (prod) | PM2 or systemd (documented) | Graceful restarts; not required for local development |

Dependencies beyond those listed are added incrementally as features require them. Each addition is recorded in project documentation.

---

## Directory Structure

```
src/
├── config/          Environment loading, database pool, session config
├── controllers/     HTTP request handlers; thin delegation to services
├── middleware/      Auth, CSRF, rate limiting, error handling, logging
├── models/          SQL queries and row-to-object mapping
├── routes/          Route definitions (web and API routers)
├── services/        Business rules, validation orchestration
├── utils/           Shared helpers (hashing, validation, formatting)
├── views/           EJS templates and partials
├── public/          Static assets (CSS, JS, images)
│   └── uploads/     Product images (not directly web-accessible)
└── app.js           Express application factory
```

**`server.js`** (repository root) imports the app factory, binds to the configured port, and handles process signals. Keeping the listen call outside `app.js` allows the application object to be imported by tests without starting a server.

---

## Request Lifecycle

1. **Incoming request** arrives at Express.
2. **Global middleware** runs: security headers, body parsing, session loading, request logging.
3. **Route matching** selects a web or API route.
4. **Route middleware** runs: authentication check, role authorization, CSRF validation (mutating web requests), rate limiting (auth routes).
5. **Controller** extracts and validates input, calls the appropriate service method.
6. **Service** applies business rules, calls one or more model methods.
7. **Model** executes parameterized SQL against PostgreSQL.
8. **Response** — controller renders an EJS template or returns JSON.
9. **Error middleware** catches unhandled errors, logs them, and returns a sanitized response.

Controllers do not contain SQL. Services do not access `req` or `res` directly. This boundary keeps each layer independently testable.

---

## Authentication and Authorization

### Authentication

Session-based authentication using Express session middleware. On login:

1. Credentials are verified against the hashed password in the database.
2. A server-side session record is created with the user ID and role.
3. The session ID is stored in an HTTP-only cookie.

Session configuration:

| Attribute | Development | Production |
|-----------|-------------|------------|
| `httpOnly` | true | true |
| `secure` | false | true |
| `sameSite` | lax | strict |
| `maxAge` | 24 hours | 24 hours |

### Authorization

Two roles: `customer` and `admin`.

| Mechanism | Usage |
|-----------|-------|
| `requireAuth` middleware | Ensures a valid session exists |
| `requireRole('admin')` middleware | Restricts admin routes |
| Service-level ownership checks | Users access only their own orders, cart, and profile; enforced in services, not only in routes |

Defense in depth: route middleware blocks unauthorized access; services re-verify ownership before returning or mutating resources. This prevents IDOR even if a route is misconfigured.

---

## Web vs API Surfaces

Both surfaces share services and models. Differences are limited to the controller and route layers.

| Concern | Web | API |
|---------|-----|-----|
| Response format | EJS-rendered HTML | JSON |
| CSRF | Required on POST/PUT/DELETE | Exempt (SameSite cookies + Content-Type checks; revisit if token auth is added) |
| Error format | Error page or flash message | `{ "error": { "code", "message" } }` |
| Authentication | Session cookie | Session cookie (same session store) |

---

## Error Handling

A centralized error-handling middleware catches exceptions thrown by controllers and services.

- **Operational errors** (validation failure, not found, unauthorized) — known error types with appropriate HTTP status codes and client-safe messages.
- **Programming errors** (unexpected exceptions) — logged with full stack trace server-side; client receives a generic 500 response in production.

Custom error classes in `src/utils/` distinguish operational from unexpected errors.

---

## Static Assets and Uploads

- **CSS, JS, images** — served from `src/public/` via Express static middleware.
- **Uploaded product images** — stored in `src/public/uploads/` but served through a dedicated route or controller that validates the requested filename against the database. Direct static mapping of the uploads directory is avoided to reduce path traversal risk.

---

## Configuration

All environment-specific values are loaded from `.env` (local) or the deployment environment (production). Required variables are validated at startup; the application exits with a descriptive error if any are missing.

| Variable | Purpose |
|----------|---------|
| `PORT` | HTTP listen port |
| `NODE_ENV` | Environment mode (`development`, `production`, `test`) |
| `DATABASE_URL` | PostgreSQL connection string |
| `SESSION_SECRET` | Session cookie signing key |
| `LOG_LEVEL` | Logging verbosity |

See `.env.example` for the complete list as configuration is implemented.

---

## Security Architecture

Security controls are applied in layers:

```
Request
  → Security headers (Helmet)
  → Rate limiter (auth routes)
  → Session load
  → CSRF validation (web mutations)
  → Authentication middleware
  → Authorization middleware
  → Input validation (controller/service)
  → Parameterized queries (model)
  → Output encoding (EJS auto-escape, JSON serialization)
  → Response
```

Detailed security requirements are defined in [Requirements.md](../01-Planning/Requirements.md). Security exercise documentation will be maintained separately in `docs/06-Security/`.

---

## Deployment Model

Initial target: single-server deployment.

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Reverse   │────►│   Node.js   │────►│ PostgreSQL  │
│   Proxy     │     │   (Express) │     │             │
│  (optional) │     └─────────────┘     └─────────────┘
└─────────────┘
```

For local development, Express listens directly on `PORT`. Production deployment notes (TLS termination, process management, database backups) are documented in `docs/07-Deployment/` when that phase begins.

---

## Design Decisions

### Why monolith over microservices

The application scope does not justify distributed-system complexity. A monolith with internal layering demonstrates the same security-relevant patterns (auth, input handling, access control) without network-boundary overhead.

### Why server-side rendering over SPA

SSR produces a traditional HTML attack surface relevant to XSS, CSRF, and session attacks—core OWASP categories for this project. A client-side SPA would require a separate API security analysis layer without adding educational value at this stage.

### Why raw SQL over ORM

Parameterized queries written in model modules make SQL injection vulnerabilities and their fixes visible and auditable. ORM query builders can obscure the boundary between safe and unsafe query construction, which works against the educational objective.

### Why PostgreSQL over SQLite

PostgreSQL reflects production e-commerce datastore choices and supports concurrent sessions, JSON columns for product specifications, and a session store adapter for production session persistence.

---

## Related Documentation

- [Database.md](Database.md) — Schema and entity relationships
- [Requirements.md](../01-Planning/Requirements.md) — Functional and security requirements
- [Features.md](../01-Planning/Features.md) — Feature catalogue
