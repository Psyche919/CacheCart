# Requirements

Functional, non-functional, and security requirements for CacheCart.

## Conventions

Requirements use the following identifiers:

- **FR-** — Functional requirement
- **NFR-** — Non-functional requirement
- **SEC-** — Security requirement

Priority levels: **Must**, **Should**, **Could**.

## Functional Requirements

### User Management

- **FR-001 (Must)** — Users can register with email, username, and password.
- **FR-002 (Must)** — Users can log in and log out.
- **FR-003 (Must)** — Users can view and update their profile (display name, email).
- **FR-004 (Must)** — Passwords are stored using a one-way hashing algorithm with per-user salt.
- **FR-005 (Should)** — Users can change their password while authenticated.

### Product Catalogue

- **FR-010 (Must)** — The system displays a paginated product catalogue.
- **FR-011 (Must)** — Products belong to one or more categories (e.g., Laptops, Peripherals, Components).
- **FR-012 (Must)** — Users can browse products by category.
- **FR-013 (Must)** — Users can view individual product detail pages (name, description, price, specifications, images).
- **FR-014 (Must)** — Administrators can create, update, and deactivate products.
- **FR-015 (Should)** — Users can search products by name and description.

### Shopping

- **FR-020 (Must)** — Authenticated users can add products to a shopping cart.
- **FR-021 (Must)** — Users can update item quantities and remove items from the cart.
- **FR-022 (Must)** — Users can proceed from cart to checkout.
- **FR-023 (Must)** — Checkout collects shipping address and confirms order total.
- **FR-024 (Must)** — Completed orders are persisted with line items, totals, and timestamps.
- **FR-025 (Must)** — Users can view their order history.
- **FR-026 (Should)** — Authenticated users can maintain a wishlist of products.

### Reviews

- **FR-030 (Should)** — Authenticated users can submit a rating and text review for products they have ordered.
- **FR-031 (Should)** — Product detail pages display aggregated ratings and individual reviews.

### Administration

- **FR-040 (Must)** — Administrators can access a restricted dashboard.
- **FR-041 (Must)** — Administrators can manage products and view all orders.
- **FR-042 (Should)** — Administrators can update order status (e.g., pending, shipped, delivered).

### API

- **FR-050 (Should)** — A REST API exposes read access to products and categories.
- **FR-051 (Should)** — Authenticated API consumers can manage cart and order resources.
- **FR-052 (Should)** — API responses use JSON with consistent error formatting.

### File Handling

- **FR-060 (Should)** — Administrators can upload product images.
- **FR-061 (Should)** — Uploaded files are stored outside the web root or served through a controlled handler.

## Non-Functional Requirements

### Performance

- **NFR-001 (Should)** — Catalogue pages load within 2 seconds under local development conditions.
- **NFR-002 (Should)** — Database queries for list endpoints use pagination; unbounded result sets are avoided.

### Maintainability

- **NFR-010 (Must)** — Application code follows the layered structure defined in Architecture.md.
- **NFR-011 (Must)** — Environment-specific configuration is externalized (`.env`, not hardcoded).
- **NFR-012 (Should)** — Modules remain focused; no single source file exceeds 300 lines without justification.

### Observability

- **NFR-020 (Should)** — HTTP requests are logged with method, path, status code, and response time.
- **NFR-021 (Should)** — Authentication failures and authorization denials are logged at warning level.
- **NFR-022 (Could)** — Structured log output (JSON) for future aggregation.

### Compatibility

- **NFR-030 (Must)** — Application runs on Node.js 20 LTS or later.
- **NFR-031 (Must)** — Primary browser targets: current Chrome and Firefox.

### Testability

- **NFR-040 (Should)** — Core business logic in services is unit-testable without HTTP layer dependencies.
- **NFR-041 (Should)** — Critical user flows (registration, login, checkout) have integration test coverage.

## Security Requirements

These apply to the secure implementation on `main`. Vulnerable branches deliberately violate specific requirements for educational purposes.

- **SEC-001 (Must)** — All database queries use parameterized statements or an ORM equivalent.
- **SEC-002 (Must)** — User-supplied data rendered in HTML is contextually encoded.
- **SEC-003 (Must)** — Authentication uses server-side sessions with HTTP-only, Secure (production), and SameSite cookie attributes.
- **SEC-004 (Must)** — Authorization checks enforce resource ownership and role boundaries on every protected action.
- **SEC-005 (Must)** — CSRF protection on state-changing form submissions.
- **SEC-006 (Must)** — Security headers applied via middleware (e.g., Content-Security-Policy, X-Content-Type-Options).
- **SEC-007 (Must)** — File uploads validate MIME type, extension, and size; stored filenames are sanitized.
- **SEC-008 (Must)** — Secrets and credentials exist only in environment variables, never in source control.
- **SEC-009 (Must)** — Error responses do not expose stack traces or internal paths to clients in production.
- **SEC-010 (Should)** — Rate limiting on authentication endpoints.
- **SEC-011 (Should)** — Input validation on all user-supplied fields with explicit allowlists where applicable.

## Assumptions

1. **Single currency** — All prices are in USD. Multi-currency support is not required.
2. **Single storefront** — No multi-tenant or regional storefront configuration.
3. **Simulated payments** — Checkout creates an order record; no external payment processor is called.
4. **Local-first development** — PostgreSQL runs locally or in Docker; production deployment patterns are documented but not fully automated in early phases.
5. **Role model** — Two roles suffice initially: `customer` and `admin`. Granular permissions are not required.

## Constraints

- Application logic must remain on Node.js/Express to align with the established project structure.
- Intentional vulnerabilities are introduced only on labeled branches after the secure baseline is complete.
- Documentation must remain accurate relative to the code on `main`; vulnerable branch behavior is documented separately in security exercise materials.

## Related Documentation

- [Vision.md](Vision.md)
- [Features.md](Features.md)
- [../02-Architecture/Architecture.md](../02-Architecture/Architecture.md)
- [../02-Architecture/Database.md](../02-Architecture/Database.md)
