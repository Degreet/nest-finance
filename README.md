# 🏦 NestFinance

**Because your money deserves a clean architecture. 🚀**

Welcome to **NestFinance** — a high-performance, domain-driven financial engine built with **NestJS**. This isn't just another CRUD app; it's a Playground for professional backend patterns, precise calculations, and scalable architecture.

I started this project to move beyond "just coding" and dive deep into how real-world financial systems work. It’s built with passion, caffeine, and a lot of thinking about **SOLID** principles. 🧪

## 🌟 The Core (MVP) — What's under the hood?

We’ve already laid a rock-solid foundation. No floating-point bugs here!

- **Secure Auth:** Full Authentication & Authorization flow using JWT and custom `@ActiveUser` decorators.
- **Account Management:** Create and manage your accounts with ease.
- **Transaction Engine:** Record, Adjust, and Void transactions (Income/Expense) with a clean CQRS flow.
- **Balance Sync:** Real-time account balance synchronization.
- **Financial Precision:** Powered by `decimal.js` to ensure every cent is accounted for. No `0.1 + 0.2 = 0.30000000000000004` nonsense! 🧮
- **Strict Validation:** Using forbidNonWhitelisted to keep our API clean and predictable.

## 🚀 The Vision (Roadmap to "Dream Project")

I’m not stopping at the MVP. Here’s how this engine is going to evolve from a "Minimum" to a "**Really Viable Product**" (RVP). 💎

### 🛠 Phase 2: Middle Viable Product (The "Pro" Feel)

- **Smart Categories:** Predefined and custom categories, separated by transaction types (Income vs Expense).
- **Strategy Pattern:** Replacing "dumb" if/else logic with custom **Operation Strategies** for financial maneuvers. 🧠
- **Internal Transfers:** Moving money between your accounts seamlessly.
- **GraphQL Integration:** Powerful queries for fetching accounts and generating custom reports for specific periods.

### Phase 3: Really Viable Product (The "Fintech" Level)

- **Multi-Currency & FX:** Optimized currency conversion with smart caching and real-time rates.
- **Virtual Envelopes:** Savings goals and "funds" to organize your money without opening new bank accounts.
- **Debt Tracking:** A dedicated system to manage who owes you and who you owe. 📝
- **Bank Integrations:** Direct sync with **Monobank & Privatbank** APIs.
- **Advanced Account Types:** Support for credit cards, investments, and more.

## 🏗 Architecture Highlights

- **CQRS:** Commands and Queries are separated to keep the logic clean and maintainable.
- **DDD Naming:** We use financial terms like `Record`, `Adjust`, and `Void` instead of generic `Create/Update/Delete`.
- **Type Safety:** Leveraging TypeScript to the max to catch errors before they even happen.

## 💬 A Note from the Architect

> "I believe that backend development is an art. This project is my canvas where I practice Clean Code, DDD, and SOLID. It’s about building something that I’m proud to show to other 'dark passengers' of the dev world." 🕵️‍♂️

### 🛠 How to start?

```
# Install dependencies
$ npm install

# Spin up the database
$ docker-compose up -d

# Run the engine
$ npm run start:dev
```
