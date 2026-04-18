# Inventory Management System

A full-stack web app for managing a small retail inventory: products, sellers, purchases from suppliers, and sales to customers. Each user gets their own isolated workspace with a Notion-style UI.

## Features

**Authentication**
- Register / login with JWT
- Edit profile (name, title, address, phone, social links, etc.)
- Change password
- Protected routes — every workspace is scoped to its owner

**Products**
- Create products with name, price, stock, size (S/M/L), category, brand, and seller
- Inline create for sellers, categories, and brands from the product page
- List view with filters: price range, name search, category, brand
- Pagination with configurable page size (10 / 20 / 50 / 100)
- Edit, delete, bulk delete
- Add stock to an existing product (also recorded as a purchase)
- Sell a product directly from the row (decrements stock, creates a sale)

**Sales**
- Record sales with buyer name, quantity, price, and date
- List, edit, delete with pagination

**Purchases**
- Auto-recorded when a product is created or restocked
- List with seller, product, quantity, total, paid, and due
- Delete with pagination

**Sellers**
- CRUD with name, email, contact number
- Pagination

**Dashboard**
- Total stock, items sold, and revenue at a glance
- Daily sales/revenue chart (last 30 days, area)
- Monthly revenue chart (year to date, bar)

**Sale history**
- Yearly, monthly, weekly, and daily breakdowns

## Tech stack

**Frontend** — React 18, TypeScript, Vite, Redux Toolkit + RTK Query, Ant Design 5, react-hook-form, Recharts, react-router-dom 6

**Backend** — Node.js, Express, TypeScript, Mongoose, JWT, Zod, bcrypt

**Database** — MongoDB (local or Atlas)

## Run locally

1. **Backend** — create `server/.env`:
   ```
   NODE_ENV=dev
   PORT=8000
   DATABASE_URL=<your MongoDB URI>
   JWT_SECRET=<any secret>
   ```
   Then:
   ```
   cd server
   npm install
   npm run dev
   ```

2. **Frontend** — create `client/.env`:
   ```
   VITE_BASE_URL=http://localhost:8000/api/v1
   ```
   Then:
   ```
   cd client
   npm install
   npm run dev
   ```

App opens at http://localhost:5173.

## Seed demo data

With both servers running:
```
node seed.mjs
```
Creates `demo@example.com` / `Demo1234!` and populates 8 sellers, 8 categories, 10 brands, 64 products, 60 sales, and 30 purchases.
