# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Individuals in Mozambique managing personal finances day-to-day — tracking money across a mix of account types (cash wallet, bank account, mobile money like M-Pesa/e-Mola). Primary user is the founder himself as first user; the product is intended to launch publicly for other real users, not stay a private tool.

## Product Purpose

Onazi is a personal finance tracker: accounts, categorized income/expense transactions, recurring transactions, budgets, savings goals, and transfers between accounts. It gives a single, real-time view of where money is and where it's going, replacing scattered spreadsheets or a bank app that only sees one account.

## Positioning

Built for the Mozambican financial context specifically: MT (metical) currency, dd/MM/yyyy dates, Portuguese (pt-PT/pt-MZ) language throughout, and first-class support for mobile-money account types (M-Pesa, e-Mola) alongside cash and bank accounts — a mix that generic international finance apps don't model well. That local fit, not raw feature count, is the reason to choose Onazi over a spreadsheet or a single bank's own app.

## Operating Context

Used on both mobile and desktop web, day-to-day (checking balances, logging a transaction after a purchase) and periodically (reviewing budgets, reports, goal progress). Real backend: PostgreSQL via Prisma, credentials-based auth (Auth.js), each user's data private and scoped to their account.

## Capabilities and Constraints

- Entities: Accounts (wallet / bank / mobile-money / other), Categories (income/expense), Transactions, Recurring Transactions, Budgets (per category per month), Goals (with contributions), Transfers between accounts (excluded from income/expense totals).
- Currency is always MT; amounts stored as Decimal.
- Auth is email/password (Credentials) today — no OAuth yet.
- No password-reset flow yet (deferred).
- No offline/service-worker caching yet — deliberately deferred given real-time balance data.

## Brand Commitments

- Name: **Onazi** — fixed, not open for the rebrand.
- Logo: existing abstract circular mark (single-color, currently rendered via `currentColor` so it adapts to light/dark theme) — fixed, not open for the rebrand.
- What IS open: color palette, typography, visual style/tone, and overall interface language built around that fixed name and mark.

## Evidence on Hand

No real user testimonials, press, or case studies exist yet — none should be fabricated. The only real assets are the product itself (this codebase) and the Onazi logo mark at `public/Onazi.svg`.

## Product Principles

1. Local fit over feature parity — every design and product decision should read as built for Mozambique, not adapted from a template.
2. Trustworthy over playful — this handles someone's real money; visual choices should read as serious and reliable first.
3. One real-time picture — accounts, budgets, and goals should never feel like disconnected modules.
4. Fast, low-friction logging — recording a transaction is the most frequent action and should stay the lowest-friction one.
