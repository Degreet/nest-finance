# 🏦 NestFinance

**Because your money deserves a clean architecture.**

**NestFinance** is a financial management REST API built with **NestJS** — not just another CRUD app, but a playground for professional backend patterns, precise calculations, and scalable architecture.

I started this project to move beyond "just shipping features" and build something where every layer has a reason to exist and every abstraction earns its place. Built with passion, caffeine, and a lot of thinking about **SOLID** principles. 🧪

## 🛠 Tech Stack

<img src="https://skillicons.dev/icons?i=nodejs,ts,nestjs,postgres,redis,docker,aws" />

| Layer | Technology |
|---|---|
| Framework | NestJS, TypeScript |
| Database | PostgreSQL + TypeORM |
| Cache / Queue | Redis |
| Containerization | Docker |
| Infrastructure | AWS EC2, AWS RDS |
| Observability | AWS CloudWatch |
| CI/CD | GitHub Actions |

## 🌟 What's under the hood

- **Secure Auth** — Full JWT authentication flow with custom `@ActiveUser` decorators, guards, and Redis-backed refresh token invalidation
- **Account Management** — Create and manage multiple accounts (card, cash, credit, debt)
- **Transaction Engine** — Record, Adjust, and Void transactions with isolated business logic per type
- **Strategy Pattern** — `IncomeStrategy` and `ExpenseStrategy` handle balance updates polymorphically. New transaction type = new strategy, zero changes to existing code
- **Smart Categories** — Predefined categories seeded automatically on registration, plus custom user categories
- **Financial Precision** — Powered by `decimal.js`. No `0.1 + 0.2 = 0.30000000000000004` nonsense 🧮
- **Event-Driven** — `UserRegistered` event triggers category seeding, keeping registration logic decoupled
- **Strict Validation** — `class-validator` with `forbidNonWhitelisted` to keep the API clean and predictable

## 🏗 Architecture Highlights

- **Strategy Pattern** — transaction types have isolated, swappable balance logic. Open for extension, closed for modification
- **Event-Driven Architecture** — domain events decouple side effects from core flows
- **Repository Pattern** — clean data access abstraction via TypeORM repositories
- **Type Safety** — TypeScript throughout, from DTOs to entities, catching errors before runtime

## ☁️ Deployment & Observability

Deployed on **AWS EC2** with **RDS (PostgreSQL)** as the managed database.

Request metrics are tracked via a global `RequestMetricsInterceptor` and pushed to **AWS CloudWatch**:

| Metric | Description |
|---|---|
| `HttpTotalRequests` | Total number of incoming requests |
| `HttpRequestsByStatus` | Request count grouped by status class (2xx, 4xx, 5xx) |
| `HttpLatency` | Response time per request in milliseconds |
| `HttpErrors` | Count of failed requests (non-2xx) |

## 🚀 Roadmap

### Phase 2 — The "Pro" Feel

- **Internal Transfers** — moving money between accounts seamlessly
- **Swagger Documentation** — auto-generated API docs via `@nestjs/swagger`
- **GraphQL** — powerful queries for accounts and custom period reports

### Phase 3 — The "Fintech" Level

- **Multi-Currency & FX** — optimized conversion with smart caching and real-time rates
- **Virtual Envelopes** — savings goals without opening new bank accounts
- **Debt Tracking** — a dedicated system for who owes what 📝
- **Bank Integrations** — direct sync with Monobank & Privatbank APIs

## 💬 A Note from the Architect

> "Backend development, done right, is an art. This is where I practice — clean architecture, precise calculations, and code that's built to last and easy to extend."

## 🛠 How to start

```bash
# Install dependencies
$ npm install

# Spin up the database
$ docker-compose up -d

# Run the engine
$ npm run start:dev
```
