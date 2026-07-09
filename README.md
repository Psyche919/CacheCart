# CacheCart

Production-inspired electronics e-commerce platform and the first application in Project Aegis.

CacheCart is built to practice secure software engineering, web application penetration testing, and OWASP Top 10 concepts in a controlled educational environment.

## Overview

CacheCart simulates a small online retailer selling consumer electronics—laptops, peripherals, components, and accessories. The application follows the structure, documentation, and engineering practices expected of a real development team.

The secure implementation is developed on the `main` branch. Intentionally vulnerable variants are introduced later on dedicated branches for structured security exercises.

## Documentation

**Project**

- [PROJECT.md](PROJECT.md) — Project Aegis context and CacheCart lifecycle

**Planning**

- [Vision](docs/01-Planning/Vision.md) — Goals, scope, and success criteria
- [Requirements](docs/01-Planning/Requirements.md) — Functional and non-functional requirements
- [Features](docs/01-Planning/Features.md) — Feature catalogue
- [Roadmap](docs/01-Planning/Roadmap.md) — Development phases and milestones

**Architecture**

- [Architecture](docs/02-Architecture/Architecture.md) — System design and technical decisions
- [Database](docs/02-Architecture/Database.md) — Data model and persistence strategy

## Repository Structure

```
CacheCart/
├── docs/           Documentation
├── src/            Application source
├── tests/          Automated tests
├── reports/        Security assessment reports
├── burp/           Burp Suite project files
├── payloads/       Test payloads for security exercises
├── demos/          Demonstration materials
└── scripts/        Utility and maintenance scripts
```

## Status

Phase 0 complete — project structure initialized. Application development has not started.

## License

ISC

## Project Aegis

CacheCart is the first project in **Project Aegis**, a portfolio of realistic, production-inspired applications used to study secure software development and offensive web application security.

Each Aegis project follows a defined lifecycle: build a secure baseline, document the architecture, map features to OWASP Top 10 categories, introduce controlled vulnerabilities on isolated branches, exploit and document attack methodology, remediate with industry-standard fixes, and compare vulnerable and secure implementations.

See [PROJECT.md](PROJECT.md) for the full Project Aegis overview and CacheCart's role within the portfolio.
