# Features

This document describes CacheCart capabilities organized by domain. Each feature maps to requirements in [Requirements.md](Requirements.md).

---

## Catalogue and Discovery

### Product Listing

Displays paginated electronics products with thumbnail, name, price, and category. Supports sorting by price and recency.

**Requirements:** FR-010, FR-011

### Category Navigation

Hierarchical category browsing. Initial categories:

| Category | Examples |
|----------|----------|
| Laptops | Notebooks, ultrabooks, gaming laptops |
| Desktops | Pre-built systems, workstations |
| Peripherals | Keyboards, mice, monitors, headsets |
| Components | CPUs, GPUs, RAM, storage, motherboards |
| Accessories | Cables, adapters, cases, stands |

**Requirements:** FR-011, FR-012

### Product Detail

Full product page including description, technical specifications (stored as structured JSON), price, stock status, images, and customer reviews.

**Requirements:** FR-013

### Search

Text search across product name and description. Results are paginated and respect the same display format as the catalogue listing.

**Requirements:** FR-015

---

## Account Management

### Registration

New users provide username, email, and password. Input is validated server-side. Duplicate email and username are rejected.

**Requirements:** FR-001, FR-004

### Login and Logout

Session-based authentication. Successful login establishes a server-side session; logout invalidates it.

**Requirements:** FR-002, FR-003, SEC-003

### Profile

Authenticated users view and edit display name and email. Password change requires current password verification.

**Requirements:** FR-003, FR-005

---

## Shopping

### Cart

Session-scoped or user-persisted cart (merged on login). Users add items, adjust quantities, and remove items. Cart displays subtotal per line and order total.

**Requirements:** FR-020, FR-021

### Wishlist

Authenticated users save products for later. Wishlist items can be moved to the cart.

**Requirements:** FR-026

### Checkout

Multi-step or single-page checkout collecting shipping address. Order summary shows line items, quantities, and total. Payment is simulated—a confirmation page and order record are created without external payment processing.

**Requirements:** FR-022, FR-023, FR-024

### Order History

Authenticated users view past orders with status, date, line items, and totals.

**Requirements:** FR-025

---

## Reviews

Authenticated customers who have completed an order containing a product may submit one review per product (rating 1–5 and optional text). Product pages show average rating and paginated review list.

**Requirements:** FR-030, FR-031

---

## Administration

### Dashboard

Restricted to users with the `admin` role. Provides overview counts (products, orders, users) and navigation to management screens.

**Requirements:** FR-040

### Product Management

Create, edit, and deactivate products. Assign categories, set price and stock quantity, upload images, and edit specification fields.

**Requirements:** FR-014, FR-060, FR-061

### Order Management

View all orders across users. Update order status through defined states: `pending`, `processing`, `shipped`, `delivered`, `cancelled`.

**Requirements:** FR-041, FR-042

---

## REST API

JSON API exposing core resources. Intended for programmatic access and future API security exercises.

| Resource | Operations |
|----------|------------|
| `/api/products` | List, retrieve |
| `/api/categories` | List, retrieve |
| `/api/cart` | View, add item, update, remove (authenticated) |
| `/api/orders` | List own orders, retrieve detail (authenticated) |

Authentication for write operations uses the same session mechanism as the web interface initially. Token-based API authentication may be added in a later phase if required for specific security exercises.

**Requirements:** FR-050, FR-051, FR-052

---

## Cross-Cutting Capabilities

### Security Middleware

Centralized middleware stack applied before route handlers:

- Security headers (Helmet or equivalent)
- CSRF token validation on mutating requests
- Session management
- Rate limiting on authentication routes
- Request logging

**Requirements:** SEC-005, SEC-006, SEC-010, NFR-020

### Logging

HTTP access logging and security event logging (failed login, authorization denial, upload rejection). Logs include timestamp, request identifier, and relevant context without recording passwords or session tokens.

**Requirements:** NFR-020, NFR-021

### File Uploads

Admin product image uploads. Files are validated for type and size, assigned unique stored names, and referenced in the product record. Serving is handled through a controlled static route or dedicated handler—not direct filesystem mapping of the upload directory.

**Requirements:** FR-060, FR-061, SEC-007

---

## Feature-to-Security Mapping (Future)

The following table identifies where OWASP Top 10 categories naturally intersect with CacheCart features. Vulnerable implementations will target these intersections on dedicated branches.

| OWASP Category | Relevant Features |
|----------------|-------------------|
| A01 Broken Access Control | Order detail, admin dashboard, API order endpoints |
| A02 Cryptographic Failures | Password storage, session configuration |
| A03 Injection | Search, login, product filters, API query parameters |
| A04 Insecure Design | Checkout flow, review eligibility checks |
| A05 Security Misconfiguration | Default credentials, verbose errors, missing headers |
| A06 Vulnerable Components | Dependency management (documented separately) |
| A07 Authentication Failures | Login, session fixation, password reset (if added) |
| A08 Software and Data Integrity | File uploads, admin actions |
| A09 Logging Failures | Authentication and authorization event coverage |
| A10 SSRF | External URL fields (if introduced in product specs or admin tools) |

This mapping guides future vulnerability branch scoping; it does not imply that weaknesses exist in the secure implementation.
