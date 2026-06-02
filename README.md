# 🐝 BistroBee — Smart Restaurant Management Simplified

A full-stack SaaS restaurant POS and management platform built with the MERN stack.

## Tech Stack

- **Frontend**: React.js + Vite, Redux Toolkit, React Router v6, Recharts, Lucide React
- **Backend**: Node.js + Express.js, REST API, Socket.io
- **Database**: MongoDB + Mongoose
- **Auth**: JWT + bcryptjs
- **Styling**: Pure CSS with CSS Variables (Dark/Light Mode)

## Features

| Module | Description |
|--------|-------------|
| 🔐 Auth | Login, Signup, JWT, Role-based access |
| 📊 Dashboard | Revenue, orders, charts, popular items |
| 🧾 POS Billing | Cart, checkout, payment methods |
| 🪑 Tables | Interactive floor layout, statuses |
| 🍳 Kitchen KDS | Real-time order tracking |
| 🍽️ Menu | CRUD for items and categories |
| 📦 Inventory | Stock tracking, low stock alerts |
| 👥 Customers | Loyalty, membership tiers |
| 👔 Employees | CRUD, shifts, roles |
| 📈 Reports | Sales, tax, inventory reports |
| 🔔 Notifications | Real-time alerts |
| ⚙️ Settings | Restaurant config, tax, receipt |

## Setup

### Prerequisites
- Node.js v16+
- MongoDB running locally or Atlas URI

### 1. Install Dependencies

```bash
# From project root
npm install
cd backend && npm install
cd ../frontend && npm install
```

### 2. Environment Variables

Backend `.env` is already configured. Update MongoDB URI if needed:
```
MONGODB_URI=mongodb://localhost:27017/bistrobee
```

### 3. Seed Database

```bash
cd backend
npm run seed
```

This creates demo data with accounts:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@bistrobee.com | admin123 |
| Manager | manager@bistrobee.com | manager123 |
| Cashier | cashier@bistrobee.com | cashier123 |
| Kitchen | kitchen@bistrobee.com | kitchen123 |

### 4. Run Development

```bash
# Run both backend and frontend
npm run dev

# Or separately:
npm run backend   # http://localhost:5000
npm run frontend  # http://localhost:5173
```

## Project Structure

```
bistrobee/
├── backend/
│   ├── config/         # DB connection
│   ├── controllers/    # Route handlers
│   ├── middleware/     # Auth, error handling
│   ├── models/         # Mongoose schemas
│   ├── routes/         # Express routers
│   ├── utils/          # Seed data
│   └── server.js       # Entry point
└── frontend/
    └── src/
        ├── components/  # Reusable UI components
        ├── layouts/     # Layout wrappers
        ├── pages/       # Route pages
        ├── services/    # API + Socket
        ├── store/       # Redux slices
        └── App.jsx      # Routes
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/login | Login |
| POST | /api/auth/register | Register |
| GET | /api/menu | Get menu items |
| POST | /api/orders | Create order |
| GET | /api/orders | List orders |
| PUT | /api/orders/:id/status | Update order status |
| GET | /api/tables | Get tables |
| GET | /api/analytics/dashboard | Dashboard stats |
| GET | /api/inventory | Inventory list |
| GET | /api/customers | Customers list |
| GET | /api/notifications | Notifications |
