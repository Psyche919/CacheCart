# Database

## Overview

CacheCart uses PostgreSQL as its primary datastore. The schema is relational with foreign key constraints enforcing referential integrity. Product specifications are stored as JSONB to accommodate variable attribute sets across electronics categories without excessive normalization.

Database access is confined to the model layer. All queries use parameterized statements.

---

## Entity Relationship Diagram

```
┌─────────────┐       ┌──────────────────┐       ┌─────────────┐
│   users     │       │  product_images  │       │ categories  │
├─────────────┤       ├──────────────────┤       ├─────────────┤
│ id (PK)     │──┐    │ id (PK)          │    ┌──│ id (PK)     │
│ username    │  │    │ product_id (FK)  │──┐ │  │ name        │
│ email       │  │    │ filename         │  │ └──│ slug        │
│ password_hash│ │    │ alt_text         │  │    │ description │
│ display_name│  │    │ sort_order       │  │    └──────┬──────┘
│ role        │  │    └──────────────────┘  │           │
│ created_at  │  │                            │           │
│ updated_at  │  │    ┌──────────────────┐    │    ┌──────┴──────┐
└──────┬──────┘  │    │    products      │◄───┘    │product_     │
       │         └───►│ id (PK)          │◄────────│categories   │
       │              │ name             │         ├─────────────┤
       │              │ slug             │         │ product_id  │
       │              │ description      │         │ category_id │
       │              │ price            │         └─────────────┘
       │              │ stock_quantity   │
       │              │ specifications   │
       │              │ is_active        │
       │              │ created_at       │
       │              │ updated_at       │
       │              └────────┬─────────┘
       │                       │
       │         ┌─────────────┼─────────────┐
       │         │             │             │
       │    ┌────┴─────┐  ┌────┴────┐  ┌─────┴────┐
       │    │  carts   │  │wishlists│  │ reviews  │
       │    ├──────────┤  ├─────────┤  ├──────────┤
       │    │ id (PK)  │  │ id (PK) │  │ id (PK)  │
       └───►│ user_id  │  │ user_id │  │ user_id  │
            │ created  │  │product_id│ │product_id│
            └────┬─────┘  └─────────┘  │ rating   │
                 │                     │ body     │
            ┌────┴─────┐               │ created  │
            │cart_items│               └──────────┘
            ├──────────┤
            │ id (PK)  │
            │ cart_id  │
            │product_id│
            │ quantity │
            └──────────┘

┌─────────────┐       ┌─────────────┐
│   orders    │       │ order_items │
├─────────────┤       ├─────────────┤
│ id (PK)     │──┐    │ id (PK)     │
│ user_id (FK)│  └───►│ order_id    │
│ status      │       │ product_id  │
│ total       │       │ quantity    │
│ shipping_*  │       │ unit_price  │
│ created_at  │       │ line_total  │
└─────────────┘       └─────────────┘

┌─────────────┐
│  sessions   │  (managed by connect-pg-simple)
├─────────────┤
│ sid (PK)    │
│ sess        │
│ expire      │
└─────────────┘
```

---

## Tables

### users

Stores registered accounts.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `SERIAL` | PRIMARY KEY | |
| `username` | `VARCHAR(50)` | UNIQUE, NOT NULL | Alphanumeric, used for display login |
| `email` | `VARCHAR(255)` | UNIQUE, NOT NULL | Normalized to lowercase on insert |
| `password_hash` | `VARCHAR(255)` | NOT NULL | bcrypt hash |
| `display_name` | `VARCHAR(100)` | NOT NULL | |
| `role` | `VARCHAR(20)` | NOT NULL, DEFAULT `'customer'` | `customer` or `admin` |
| `created_at` | `TIMESTAMPTZ` | NOT NULL, DEFAULT `NOW()` | |
| `updated_at` | `TIMESTAMPTZ` | NOT NULL, DEFAULT `NOW()` | |

**Indexes:** `email`, `username`

---

### categories

Product classification.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `SERIAL` | PRIMARY KEY | |
| `name` | `VARCHAR(100)` | UNIQUE, NOT NULL | |
| `slug` | `VARCHAR(100)` | UNIQUE, NOT NULL | URL-safe identifier |
| `description` | `TEXT` | | |
| `created_at` | `TIMESTAMPTZ` | NOT NULL, DEFAULT `NOW()` | |

**Indexes:** `slug`

---

### products

Electronics catalogue items.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `SERIAL` | PRIMARY KEY | |
| `name` | `VARCHAR(255)` | NOT NULL | |
| `slug` | `VARCHAR(255)` | UNIQUE, NOT NULL | |
| `description` | `TEXT` | NOT NULL | |
| `price` | `NUMERIC(10,2)` | NOT NULL, CHECK `>= 0` | USD |
| `stock_quantity` | `INTEGER` | NOT NULL, DEFAULT `0`, CHECK `>= 0` | |
| `specifications` | `JSONB` | DEFAULT `'{}'` | Category-specific attributes |
| `is_active` | `BOOLEAN` | NOT NULL, DEFAULT `TRUE` | Soft deactivation |
| `created_at` | `TIMESTAMPTZ` | NOT NULL, DEFAULT `NOW()` | |
| `updated_at` | `TIMESTAMPTZ` | NOT NULL, DEFAULT `NOW()` | |

**Indexes:** `slug`, `is_active`, GIN index on `specifications` (optional, for spec-based filtering)

**Example `specifications` for a laptop:**

```json
{
  "cpu": "Intel Core i7-13700H",
  "ram": "16 GB",
  "storage": "512 GB SSD",
  "display": "15.6\" 144Hz",
  "weight_kg": 2.1
}
```

---

### product_categories

Many-to-many join between products and categories.

| Column | Type | Constraints |
|--------|------|-------------|
| `product_id` | `INTEGER` | FK → `products(id)` ON DELETE CASCADE |
| `category_id` | `INTEGER` | FK → `categories(id)` ON DELETE CASCADE |

**Primary key:** `(product_id, category_id)`

---

### product_images

Images associated with products.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `SERIAL` | PRIMARY KEY | |
| `product_id` | `INTEGER` | FK → `products(id)` ON DELETE CASCADE, NOT NULL | |
| `filename` | `VARCHAR(255)` | NOT NULL | Stored name (UUID-based) |
| `alt_text` | `VARCHAR(255)` | | |
| `sort_order` | `INTEGER` | NOT NULL, DEFAULT `0` | Display ordering |

---

### carts

One cart per authenticated user. Guest carts are session-scoped in application memory or a temporary session store field; on login, guest cart items merge into the user's persisted cart.

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | `SERIAL` | PRIMARY KEY |
| `user_id` | `INTEGER` | FK → `users(id)` ON DELETE CASCADE, UNIQUE, NOT NULL |
| `created_at` | `TIMESTAMPTZ` | NOT NULL, DEFAULT `NOW()` |
| `updated_at` | `TIMESTAMPTZ` | NOT NULL, DEFAULT `NOW()` |

---

### cart_items

Line items within a cart.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `SERIAL` | PRIMARY KEY | |
| `cart_id` | `INTEGER` | FK → `carts(id)` ON DELETE CASCADE, NOT NULL | |
| `product_id` | `INTEGER` | FK → `products(id)`, NOT NULL | |
| `quantity` | `INTEGER` | NOT NULL, CHECK `> 0` | |

**Unique constraint:** `(cart_id, product_id)`

---

### wishlists

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | `SERIAL` | PRIMARY KEY |
| `user_id` | `INTEGER` | FK → `users(id)` ON DELETE CASCADE, NOT NULL |
| `product_id` | `INTEGER` | FK → `products(id)` ON DELETE CASCADE, NOT NULL |
| `created_at` | `TIMESTAMPTZ` | NOT NULL, DEFAULT `NOW()` |

**Unique constraint:** `(user_id, product_id)`

---

### orders

Completed purchases.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `SERIAL` | PRIMARY KEY | |
| `user_id` | `INTEGER` | FK → `users(id)`, NOT NULL | |
| `status` | `VARCHAR(20)` | NOT NULL, DEFAULT `'pending'` | See status enum below |
| `total` | `NUMERIC(10,2)` | NOT NULL | Sum of line totals at time of order |
| `shipping_name` | `VARCHAR(100)` | NOT NULL | |
| `shipping_address_line1` | `VARCHAR(255)` | NOT NULL | |
| `shipping_address_line2` | `VARCHAR(255)` | | |
| `shipping_city` | `VARCHAR(100)` | NOT NULL | |
| `shipping_state` | `VARCHAR(50)` | NOT NULL | |
| `shipping_postal_code` | `VARCHAR(20)` | NOT NULL | |
| `shipping_country` | `VARCHAR(2)` | NOT NULL, DEFAULT `'US'` | ISO 3166-1 alpha-2 |
| `created_at` | `TIMESTAMPTZ` | NOT NULL, DEFAULT `NOW()` | |
| `updated_at` | `TIMESTAMPTZ` | NOT NULL, DEFAULT `NOW()` | |

**Order status values:** `pending`, `processing`, `shipped`, `delivered`, `cancelled`

**Indexes:** `user_id`, `status`, `created_at`

---

### order_items

Snapshot of products at time of purchase. Prices are copied from the product record to preserve historical accuracy if prices change later.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `SERIAL` | PRIMARY KEY | |
| `order_id` | `INTEGER` | FK → `orders(id)` ON DELETE CASCADE, NOT NULL | |
| `product_id` | `INTEGER` | FK → `products(id)`, NOT NULL | |
| `quantity` | `INTEGER` | NOT NULL, CHECK `> 0` | |
| `unit_price` | `NUMERIC(10,2)` | NOT NULL | Price at purchase time |
| `line_total` | `NUMERIC(10,2)` | NOT NULL | `quantity * unit_price` |

---

### reviews

Product reviews from verified purchasers.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `SERIAL` | PRIMARY KEY | |
| `user_id` | `INTEGER` | FK → `users(id)`, NOT NULL | |
| `product_id` | `INTEGER` | FK → `products(id)` ON DELETE CASCADE, NOT NULL | |
| `rating` | `SMALLINT` | NOT NULL, CHECK `1–5` | |
| `body` | `TEXT` | | Optional review text |
| `created_at` | `TIMESTAMPTZ` | NOT NULL, DEFAULT `NOW()` | |

**Unique constraint:** `(user_id, product_id)` — one review per user per product

**Indexes:** `product_id`

Review eligibility (user must have a delivered order containing the product) is enforced in the service layer, not via database constraint, because it requires a join across orders and order_items.

---

### sessions

Managed by the session store adapter (`connect-pg-simple`). Schema follows the adapter's default:

| Column | Type | Constraints |
|--------|------|-------------|
| `sid` | `VARCHAR` | PRIMARY KEY |
| `sess` | `JSON` | NOT NULL |
| `expire` | `TIMESTAMP(6)` | NOT NULL |

**Index:** `expire` (for session cleanup)

---

## Migration Strategy

Schema changes are applied through numbered SQL migration files in a `migrations/` directory (to be created during Phase 1).

| Convention | Example |
|------------|---------|
| Filename | `001_initial_schema.sql`, `002_add_reviews.sql` |
| Idempotency | Migrations use `IF NOT EXISTS` where appropriate |
| Tracking | A `schema_migrations` table records applied migration versions |

Migrations are applied via a script in `scripts/` rather than at application startup, so schema changes are explicit and auditable.

---

## Seed Data

Initial seed data (applied after migrations in development):

- One admin account (credentials defined in setup documentation, overridable via environment)
- Five categories matching the electronics catalogue scope
- Sample products across categories with representative specifications
- No orders or reviews (created through application usage)

Seed scripts live in `scripts/seed/` and are idempotent where possible.

---

## Query Patterns

| Operation | Pattern |
|-----------|---------|
| Product listing | `SELECT ... FROM products WHERE is_active = TRUE ORDER BY created_at DESC LIMIT $1 OFFSET $2` |
| Product by slug | `SELECT ... FROM products WHERE slug = $1 AND is_active = TRUE` |
| Category products | Join through `product_categories` with parameterized category slug |
| Search | `WHERE name ILIKE $1 OR description ILIKE $1` with `%term%` bound as parameter |
| Order creation | Transaction: insert `orders`, insert `order_items`, decrement `stock_quantity`, clear `cart_items` |
| Review eligibility | Join `orders` → `order_items` where `user_id = $1 AND product_id = $2 AND status = 'delivered'` |

All user-supplied values are passed as query parameters, never interpolated into SQL strings.

---

## Backup and Integrity

For local development, standard PostgreSQL dump/restore is sufficient. Production deployment documentation will cover:

- Daily logical backups (`pg_dump`)
- Foreign key constraints preventing orphaned records
- Transaction boundaries for multi-table writes (checkout, cart merge)

---

## Related Documentation

- [Architecture.md](Architecture.md) — Application layers and data flow
- [Requirements.md](../01-Planning/Requirements.md) — Data-related functional requirements
- [Roadmap.md](../01-Planning/Roadmap.md) — Phase 1 migration implementation
