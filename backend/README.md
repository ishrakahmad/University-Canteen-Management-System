# University Canteen Management System (UCMS) — Backend

Backend REST API for the University Canteen Management System, built for the Advanced Web Technology course project.

## Problem

University canteens run on manual, paper-based ordering. Students queue during short class breaks, staff track stock and sales by hand, and there is no record of what sold or what ran out. UCMS digitizes the whole flow: students pre-order for a pickup time slot, staff manage the daily menu and order queue, and admins get sales reports.

## Tech Stack

- NestJS (TypeScript)
- TypeORM + PostgreSQL
- JWT authentication with role-based guards
- Nodemailer + Handlebars for transactional email
- Swagger for API documentation

## Modules

- **Auth** — register, login, JWT issuing, forgot/reset/change password
- **User** — user entity and roles (`admin`, `staff`, `student`)
- **Categories** — food categories (Breakfast, Lunch, Snacks, Beverage)
- **Menu** — food items, daily availability toggle, daily stock quantity
- **Orders** — order placement with pickup time slot, order status workflow (`pending → preparing → ready → completed`)
- **Mail** — order confirmation and order-status email notifications
- **Reports** — admin sales summary and best-seller queries

## Getting Started

```bash
npm install
cp .env.example .env   # fill in DB and mail credentials
npm run start:dev
```

API docs available at `http://localhost:5001/api` (Swagger).

## Roadmap

- [x] Auth + User module
- [x] Category module
- [x] Menu module (daily availability & stock)
- [x] Orders module (pickup time slot)
- [x] Mail notifications
- [x] Reports module (sales summary, best sellers)
- [ ] Frontend (Next.js) — final phase
- [ ] Wallet / prepaid balance (stretch goal)
