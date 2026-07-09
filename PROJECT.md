# Project Aegis — CacheCart

Overview of CacheCart within the Project Aegis portfolio.

## Context

Project Aegis is a portfolio of realistic, production-inspired applications used to study secure software development and offensive web application security. Each project follows a defined lifecycle from design through exploitation documentation to remediation.

CacheCart is the first application in this portfolio.

## Application Summary

CacheCart is an electronics e-commerce platform. It provides catalogue browsing, account management, shopping cart operations, checkout, and administrative product management. The domain is intentionally narrow—consumer electronics retail—so that security concepts can be explored against a coherent, realistic system rather than a generic demo application.

## Lifecycle

Each Aegis project progresses through the following stages:

1. **Design and build** — Implement the application using secure engineering practices.
2. **Document architecture** — Record design decisions, data flows, and component boundaries.
3. **Identify OWASP Top 10 applicability** — Map application features to relevant vulnerability classes.
4. **Introduce controlled vulnerabilities** — Reproduce selected weaknesses on dedicated branches for educational use only.
5. **Exploit and document** — Demonstrate attacks using professional tooling (Burp Suite, browser developer tools, etc.).
6. **Remediate** — Apply industry-standard fixes and document the secure implementation.
7. **Compare implementations** — Contrast vulnerable and secure code paths with explicit references.
8. **Publish documentation** — Produce materials suitable for GitHub and technical interviews.

## Current Phase

**Planning** — Requirements, feature scope, architecture, and roadmap are being defined. No application logic has been implemented.

## Branch Strategy

- **`main`** — Secure, production-quality implementation.
- **`vuln/*`** — Intentionally vulnerable implementations for security exercises (created later).

Vulnerable code is never merged into `main`. Security exercises are conducted against isolated branches in local or controlled lab environments.

## Technology Direction

CacheCart is a Node.js application using Express. Server-side rendering with EJS templates keeps the attack surface representative of traditional web applications while remaining straightforward to instrument and test. PostgreSQL serves as the primary datastore.

These choices prioritize realism, auditability, and alignment with common penetration testing scenarios over framework novelty.

## Related Documentation

- [Vision](docs/01-Planning/Vision.md)
- [Requirements](docs/01-Planning/Requirements.md)
- [Features](docs/01-Planning/Features.md)
- [Roadmap](docs/01-Planning/Roadmap.md)
- [Architecture](docs/02-Architecture/Architecture.md)
- [Database](docs/02-Architecture/Database.md)
