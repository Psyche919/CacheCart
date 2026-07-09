# Vision

Goals, scope, and success criteria for CacheCart.

## Purpose

CacheCart exists to bridge the gap between reading about web application security and understanding how vulnerabilities emerge in real software. The application is built as a credible electronics retailer—not a deliberately broken capture-the-flag challenge—so that security concepts can be studied in context.

## Goals

### Primary

- Deliver a modular, maintainable e-commerce application that reflects professional software engineering standards.
- Document architecture, requirements, and security considerations at a level suitable for team handoff or portfolio review.
- Establish a baseline secure implementation before any intentional vulnerability work begins.

### Secondary

- Produce attack methodology documentation using industry-standard tooling.
- Demonstrate remediation patterns aligned with OWASP guidance.
- Create comparable vulnerable and secure implementations for selected OWASP Top 10 categories.

## Scope

### In Scope

- Consumer electronics product catalogue with categories and search
- User registration, authentication, and profile management
- Shopping cart, wishlist, and checkout flow
- Order history and status tracking
- Product reviews
- Administrative product and order management
- REST API for programmatic access to core resources
- Security middleware, structured logging, and file upload handling
- Controlled vulnerability branches for educational exploitation

### Out of Scope

- Payment gateway integration (checkout simulates order placement without processing real payments)
- Multi-vendor marketplace functionality
- Mobile native applications
- High-availability or multi-region deployment
- Inventory management across physical warehouses
- Marketing automation, email campaigns, or recommendation engines

Payment simulation is excluded because PCI DSS compliance and third-party payment APIs introduce complexity that distracts from core web application security objectives. Orders are recorded locally with a simulated payment confirmation.

## Target Audience

- The primary developer (portfolio and interview preparation)
- Technical reviewers evaluating software design and security awareness
- Future collaborators or mentors reviewing Project Aegis documentation

## Success Criteria

The project is considered successful when:

1. The secure implementation on `main` passes defined functional requirements and follows documented architecture.
2. Architecture and database documentation accurately describe the running system.
3. At least five OWASP Top 10 categories are mapped to specific application features with documented exploit and remediation paths.
4. Documentation is self-contained: a reviewer can understand the system, reproduce setup, and follow security exercises without external context.
5. Code organization supports incremental feature delivery without structural rework.

## Design Principles

**Security by default**

Parameterized queries, output encoding, access control checks, and secure session handling are applied from the first implementation.

**Separation of concerns**

Routes delegate to controllers. Business logic lives in services. Data access is isolated in models.

**Explicit over implicit**

Configuration uses environment variables. Security-sensitive settings have no undocumented defaults.

**Documented decisions**

Non-obvious architectural choices include rationale in planning or architecture documentation.

**Controlled vulnerability introduction**

Weaknesses are branch-isolated, labeled, and never accidental.

## Long-Term Position in Project Aegis

CacheCart establishes patterns—documentation structure, branch strategy, exploit/remediation workflow—that subsequent Aegis projects will reuse. Lessons from CacheCart (for example, which vulnerability classes map cleanly to e-commerce features) inform scoping of future applications in different domains.

## Related Documentation

- [Requirements.md](Requirements.md)
- [Features.md](Features.md)
- [Roadmap.md](Roadmap.md)
- [../02-Architecture/Architecture.md](../02-Architecture/Architecture.md)
