# UCMS Frontend

Next.js frontend for the University Canteen Management System. Talks to the NestJS backend via REST API.

## Pages

- `/` - Menu browsing, cart, checkout with pickup time slot selection (student)
- `/login`, `/register` - Auth
- `/orders` - Student order history with status tracking
- `/dashboard` - Admin and Staff panel (menu, category, order status)
- `/reports` - Admin sales summary and best sellers
- `/forgot-password`, `/reset-password`, `/change-password` - Password flows

## Getting Started

```bash
npm install
cp env.local.example .env.local
npm run dev
```

Open http://localhost:3000
