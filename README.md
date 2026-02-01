# 🚀 PerkStack – Startup Benefits Platform

PerkStack is a full-stack SaaS platform that helps early-stage startups, founders, and indie hackers access exclusive benefits and discounts on premium SaaS tools such as cloud services, productivity software, and growth tools.

The platform supports both public deals and restricted deals that require user verification and admin approval.

---

## 🧠 Business Context

Early-stage startups often cannot afford premium SaaS tools.
PerkStack solves this by partnering with SaaS companies and providing curated perks to verified startups.

**Target Users**
- Startup founders
- Early-stage teams
- Indie hackers

---

## 🏗️ Tech Stack

### Frontend
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion (animations)

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT-based authentication

> No GraphQL, Firebase, Supabase, or serverless abstractions are used.

---

## 🔐 Authentication & Authorization

- Users register and log in using email and password.
- Passwords are hashed using bcrypt.
- On login, a JWT token is issued.
- JWT is stored on the client and sent via `Authorization: Bearer <token>`.
- Protected routes are secured using JWT middleware.
- Admin-only routes use role-based authorization.

---

## 🔁 End-to-End Application Flow

1. User registers and logs in
2. User browses available deals
3. Locked deals clearly show access restrictions
4. User opens a deal details page
5. User claims an eligible deal
6. Claim status starts as `pending`
7. Claimed deals appear in the dashboard with status tracking

---

## 🧩 Core Entities & Data Design

### User
- name
- email
- password (hashed)
- role
- isVerified
- claims (embedded for MVP simplicity)

### Deal
- title
- description
- category
- partner
- isLocked
- eligibility

### Claim
- Embedded inside User
- Fields: dealId, status
- Status lifecycle: `pending → approved / rejected`

> Claims are embedded for MVP simplicity. In production, claims would be a separate collection.

---

## 🌐 API Overview

### Public APIs
- `GET /api/deals`
- `GET /api/deals/:id`

### Protected APIs
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/claim/:dealId`
- `GET /api/user-deals/:dealId`
- `GET /api/dashboard`

All protected APIs require a valid JWT token.

---

## 🖥️ Frontend Pages

### Landing Page
- Premium SaaS-style layout
- Animated hero section
- Clear value proposition
- Call-to-action to explore deals

### Deals Listing Page
- List of all deals
- Search by SaaS or partner
- Filter by locked/unlocked access
- Skeleton loaders and hover animations

### Deal Details Page
- Full deal description
- Partner and eligibility info
- Locked deal explanation
- Claim action

### User Dashboard
- User profile information
- List of claimed deals
- Claim status tracking

---

## 🎨 UI, Animations & UX

- Page transitions using Framer Motion
- Skeleton loaders for async states
- Hover micro-interactions
- Smooth layout transitions
- Motion used intentionally to enhance usability

---

## ⚠️ Known Limitations

- Email verification not implemented yet
- Claims embedded instead of a standalone collection
- No notification system
- No SaaS partner self-serve portal
- No refresh token rotation

---

## 🚀 Future Improvements

- Email & domain-based startup verification
- Standalone Claim collection
- Admin analytics dashboard
- SaaS partner portal
- Subscription & monetization model
- AI-driven perk recommendations

---

## 🧠 Design Philosophy

The project prioritizes clarity of flow, correctness, and scalability over excessive features.
Every decision is made with real SaaS product thinking in mind.

---

## 🏁 Final Note

This is not a CRUD demo.
It demonstrates full-stack system design, authentication, authorization, UI/UX judgment, and product thinking.
