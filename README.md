# University Canteen Management System (UCMS)

A full-stack web application that digitizes university canteen operations students pre order food with a pickup time slot, canteen staff manage the order queue and daily menu and admins track sales through automated reports.

**Live App:** [ucms.ishrakahmad.me](https://ucms.ishrakahmad.me)
**API Docs (Swagger):** _add your Render Swagger URL here, e.g. `https://university-canteen-management-system.onrender.com`_

---

## 🚀 Live Deployment

| Component | Platform | Status |
|---|---|---|
| Frontend | [Vercel](https://vercel.com) | 🟢 Live |
| Custom Domain | `ucms.ishrakahmad.me` | 🟢 Live |
| Backend API | [Render](https://render.com) | 🟢 Live |
| Database | [Neon](https://neon.tech) (PostgreSQL) | 🟢 Connected |
| Swagger API Docs | Render | 🟢 Live |

> **Note:** The backend runs on Render's free tier, which spins down after periods of inactivity. The first request after idle time may take 30–50 seconds to respond while the server wakes up.

---

## 📖 Problem Statement

University canteens are traditionally operated through manual, paper-based processes. Students wait in long queues during short class breaks, canteen staff record sales and stock by hand and there is no organized way to know what food items are available on a given day or to track daily revenue. UCMS solves this by digitizing the entire canteen ordering process from menu browsing to pickup and sales reporting.

---

## ✨ Features

### 👨‍🎓 Student
- Secure registration and login (JWT authentication)
- Browse the daily menu by category, with search
- Add items to cart and place pre-orders with a selected pickup time slot
- Track live order status: `Pending → Preparing → Ready → Completed`
- Receive automated email notifications for order confirmation and status updates

### 👷 Staff
- View and manage incoming student orders
- Update daily menu availability and stock quantity
- Update order status through the preparation workflow

### 🛠️ Admin
- Full CRUD on categories and menu items
- Manage staff and user accounts
- View sales summary (daily/weekly) and best-selling item reports
- Full visibility into all orders

---

## 🧱 Tech Stack

**Frontend**
- Next.js (App Router) + React
- Tailwind CSS
- Axios
- Deployed on Vercel

**Backend**
- NestJS (TypeScript)
- TypeORM + PostgreSQL
- JWT Authentication + Role-Based Access Control (RBAC)
- bcrypt password hashing
- Nodemailer + Handlebars (email notifications)
- Swagger (API documentation)
- Deployed on Render

**Database**
- PostgreSQL, hosted on Neon

---

## 🗂️ Project Structure

```
UCMS/
├── backend/          # NestJS REST API
│   └── src/
│       ├── auth/         # JWT auth, guards, RBAC
│       ├── user/         # User entity & roles
│       ├── categories/   # Category CRUD
│       ├── menu/         # Menu items, daily availability
│       ├── orders/       # Orders, order items, status workflow
│       ├── mail/         # Email notifications
│       └── reports/      # Sales summary & best sellers
│
└── frontend/         # Next.js client
    └── src/app/
        ├── context/       # Global auth/cart state (Context API)
        ├── lib/           # Axios API client
        ├── components/    # Navbar, notifications, shared UI
        ├── login/ register/ forgot-password/ reset-password/ change-password/
        ├── dashboard/     # Admin & Staff panel
        ├── orders/        # Student order history
        └── reports/       # Admin sales reports
```

---

## 🔐 User Roles

| Role | Access |
|---|---|
| **Admin** | Full access — categories, menu, staff accounts, reports |
| **Staff** | Order management, daily menu availability |
| **Student** | Browse menu, place orders, track order status |

---

## 🗄️ Database Schema (Overview)

- **User** — id, fullName, email, password (hashed), role, timestamps
- **Category** — id, name
- **MenuItem** — id, name, description, price, isAvailable, isAvailableToday, dailyQuantity, categoryId (FK)
- **Order** — id, customerId (FK), status, totalPrice, pickupTime, createdAt
- **OrderItem** — id, orderId (FK), menuItemId (FK), quantity, unitPrice

Full ER diagram and table structure are included in the project report.

---

## ⚙️ Getting Started (Local Development)

### Prerequisites
- Node.js & npm
- PostgreSQL (local or a cloud instance like Neon)

### 1. Clone the repository
```bash
git clone https://github.com/ishrakahmad/University-Canteen-Management-System.git
cd University-Canteen-Management-System
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env   # fill in your DB and mail credentials
npm run start:dev
```
Backend runs at `http://localhost:5001` — Swagger docs at `http://localhost:5001/api`

### 3. Frontend Setup
```bash
cd frontend
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:5001" > .env.local
npm run dev
```
Frontend runs at `http://localhost:3000`

---

## 🔑 Environment Variables

**Backend (`backend/.env`)**
```
PORT=5001
DB_HOST=
DB_PORT=5432
DB_USERNAME=
DB_PASSWORD=
DB_NAME=
JWT_SECRET=
JWT_EXPIRES_IN=1d
MAIL_HOST=
MAIL_PORT=
MAIL_USER=
MAIL_PASS=
MAIL_FROM=
```

**Frontend (`frontend/.env.local`)**
```
NEXT_PUBLIC_API_URL=
```

---

## 📡 API Overview

| Module | Key Endpoints |
|---|---|
| Auth | `POST /auth/register`, `POST /auth/login`, `POST /auth/forgot-password`, `POST /auth/reset-password`, `POST /auth/change-password` |
| Categories | `GET /categories`, `POST /categories`, `DELETE /categories/:id` |
| Menu | `GET /menu`, `POST /menu`, `PATCH /menu/:id`, `DELETE /menu/:id` |
| Orders | `POST /orders`, `GET /orders`, `PATCH /orders/:id/status` |
| Reports | `GET /reports/sales-summary`, `GET /reports/best-sellers` |

Full interactive API documentation is available via Swagger at `/api` on the backend.

---

## 🧭 Roadmap

- [x] Backend REST API with full CRUD, JWT auth, and RBAC
- [x] Frontend (student ordering, staff/admin dashboard, reports)
- [x] Email notifications
- [x] Production deployment (Vercel + Render + Neon)
- [ ] Wallet / prepaid balance system
- [ ] Real-time order updates via WebSocket
- [ ] Dedicated `GET /orders/my-orders` endpoint for stricter student-side data scoping

---

## 👤 Author

**Ishrak Ahmad**
Advanced Web Technology — Course Project
GitHub: [@ishrakahmad](https://github.com/ishrakahmad) · LinkedIn: [ishrakahmad](https://linkedin.com/in/ishrakahmad/)

---

## 📄 License

This project was built for academic purposes as part of the Advanced Web Technology course.