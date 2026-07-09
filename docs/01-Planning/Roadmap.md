# Roadmap

Development proceeds in phases. Each phase produces a working increment and updates documentation before the next phase begins. Security vulnerability branches are created only after the secure baseline for the relevant feature area is complete.

---

## Phase 0 — Project Initialization

**Status:** Complete

- Repository and directory structure created
- Placeholder entry points (`server.js`, `src/app.js`) established
- Root documentation files initialized

**Deliverables:** Project skeleton, empty module directories, `.gitignore`, environment file templates.

---

## Phase 1 — Foundation

**Status:** Planned

Establish the application core: configuration, database connectivity, middleware stack, error handling, and base layout templates.

| Task | Output |
|------|--------|
| Environment configuration loader | `src/config/` modules reading from `.env` |
| Database connection and migration tooling | Initial schema applied to PostgreSQL |
| Express application factory | `src/app.js` with middleware registration |
| HTTP server entry point | `server.js` binding to configured port |
| Base EJS layout and partials | Header, footer, navigation shell |
| Security middleware baseline | Helmet, session store, CSRF, rate limiter stubs |
| Structured logging | Request and error logging middleware |

**Exit criteria:** Application starts, connects to the database, serves a static home page, and logs requests. No user-facing features beyond a placeholder landing page.

---

## Phase 2 — Authentication and User Management

| Task | Output |
|------|--------|
| User model and registration flow | FR-001, FR-004 |
| Login, logout, session management | FR-002, SEC-003 |
| Profile view and edit | FR-003, FR-005 |
| Role assignment (`customer`, `admin`) | SEC-004 foundation |
| Authorization middleware | Route-level role and ownership checks |

**Exit criteria:** Users can register, log in, manage profiles, and access role-appropriate routes. Admin routes reject non-admin users.

---

## Phase 3 — Product Catalogue

| Task | Output |
|------|--------|
| Category and product models | Database tables populated with seed data |
| Catalogue listing with pagination | FR-010, FR-012 |
| Product detail pages | FR-013 |
| Category filtering | FR-011 |
| Search | FR-015 |
| Admin product CRUD | FR-014 |

**Exit criteria:** Anonymous users browse and search the catalogue. Admins manage products through restricted interfaces.

---

## Phase 4 — Shopping Cart and Checkout

| Task | Output |
|------|--------|
| Cart persistence (guest and authenticated) | FR-020, FR-021 |
| Wishlist | FR-026 |
| Checkout form and order creation | FR-022, FR-023, FR-024 |
| Order history | FR-025 |
| Admin order management | FR-041, FR-042 |

**Exit criteria:** End-to-end purchase flow from cart to confirmed order. Users view order history; admins manage order status.

---

## Phase 5 — Reviews and File Uploads

| Task | Output |
|------|--------|
| Review submission with purchase verification | FR-030, FR-031 |
| Admin product image upload | FR-060, FR-061, SEC-007 |
| Review display on product pages | Aggregated ratings |

**Exit criteria:** Verified purchasers leave reviews. Admins upload and display product images securely.

---

## Phase 6 — REST API

| Task | Output |
|------|--------|
| API route structure under `/api` | FR-050 |
| JSON response and error conventions | FR-052 |
| Authenticated cart and order endpoints | FR-051 |
| API documentation | OpenAPI or markdown endpoint reference |

**Exit criteria:** Core resources accessible via JSON API with consistent authentication and error handling.

---

## Phase 7 — Testing and Hardening

| Task | Output |
|------|--------|
| Unit tests for services | NFR-040 |
| Integration tests for auth and checkout flows | NFR-041 |
| Security header and CSRF verification | SEC-005, SEC-006 |
| Dependency audit | Documented in security docs |
| Production configuration guide | Deployment documentation |

**Exit criteria:** Test suite passes. Secure implementation meets all Must-level requirements in Requirements.md.

---

## Phase 8 — Security Exercise Branches

Created after Phase 7. Each branch targets one or more OWASP categories against a specific feature.

| Branch (proposed) | Target | Feature Area |
|-------------------|--------|--------------|
| `vuln/sql-injection` | A03 Injection | Search, filters |
| `vuln/xss` | A03 Injection | Reviews, product descriptions |
| `vuln/idor` | A01 Broken Access Control | Orders, profiles |
| `vuln/auth-session` | A07 Authentication Failures | Login, session handling |
| `vuln/file-upload` | A08 Software Integrity | Admin image upload |
| `vuln/csrf` | A01 / design gap | State-changing forms |
| `vuln/ssrf` | A10 SSRF | Admin or API URL handling (if applicable) |

Each branch includes:

1. Vulnerability introduction with inline documentation referencing the weakness
2. Exploit steps using Burp Suite or browser tools
3. Remediation commit or companion `fix/*` branch
4. Written comparison in `docs/06-Security/`

**Exit criteria:** Minimum five categories documented with reproducible exploit and remediation paths.

---

## Phase 9 — Documentation and Portfolio Release

| Task | Output |
|------|--------|
| Setup guide | `docs/04-Development/` |
| API reference | Complete endpoint documentation |
| Security documentation | OWASP mapping, exercise guides |
| Screenshots | Key application views in `docs/08-Screenshots/` |
| Changelog | Version history in `CHANGELOG.md` |
| README polish | Badges, quick-start instructions |

**Exit criteria:** Repository is self-contained and presentable for GitHub and technical interviews.

---

## Dependency Graph

```
Phase 0 ──► Phase 1 ──► Phase 2 ──► Phase 3 ──► Phase 4
                              │                      │
                              └──────────┬───────────┘
                                         ▼
                              Phase 5 ──► Phase 6
                                         │
                                         ▼
                              Phase 7 ──► Phase 8 ──► Phase 9
```

Phases 5 and 6 can partially overlap once Phase 4 order logic is stable. Phase 8 requires Phase 7 completion.

---

## Versioning

CacheCart uses semantic versioning aligned with phase completion:

| Version | Milestone |
|---------|-----------|
| 0.1.0 | Phase 1 — Foundation |
| 0.2.0 | Phase 2 — Authentication |
| 0.3.0 | Phase 3 — Catalogue |
| 0.4.0 | Phase 4 — Shopping |
| 0.5.0 | Phase 5 — Reviews and uploads |
| 0.6.0 | Phase 6 — REST API |
| 1.0.0 | Phase 7 — Secure baseline complete |
| 1.x.0 | Phase 8 — Security exercises (per branch tag) |
