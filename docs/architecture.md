# SalonAI Architecture

## System Overview

SalonAI follows a three-tier architecture with a clear separation between the presentation layer, business logic, and data storage.

```
┌─────────────────────────────────────────┐
│           Client (Browser)              │
│         Next.js + React + TS            │
└──────────────┬──────────────────────────┘
               │ HTTP/REST (JSON)
┌──────────────▼──────────────────────────┐
│           API Server                    │
│      Flask + Flask-JWT-Extended         │
│                                         │
│  ┌──────────┐  ┌──────────────────────┐ │
│  │   Auth   │  │  Recommendation AI   │ │
│  │  Module  │  │  (scikit-learn)      │ │
│  └──────────┘  └──────────────────────┘ │
└──────────────┬──────────────────────────┘
               │ SQLAlchemy ORM
┌──────────────▼──────────────────────────┐
│         PostgreSQL Database             │
│   Users | Appointments | Services       │
└─────────────────────────────────────────┘
```

## Component Breakdown

### Frontend (Next.js 14)

The frontend uses Next.js with the App Router for server-side rendering capabilities and TypeScript for type safety.

**Key directories:**
- `src/app/` — Page routes (login, dashboard, appointments, services, recommendations)
- `src/components/` — Reusable UI components
- `src/lib/` — API client and auth utilities

**Styling:** Tailwind CSS with a custom purple-themed design system.

### Backend (Flask)

RESTful API built with Flask, organized into blueprints for modularity.

**Blueprints:**
- `auth` — Registration, login, JWT token management
- `appointments` — CRUD for appointment scheduling with conflict detection
- `services` — Service catalog management
- `recommendations` — AI-powered style recommendations and price estimation

**Authentication:** JWT-based, using Flask-JWT-Extended. Tokens are sent in the `Authorization: Bearer` header.

### AI Recommendation Engine

The recommendation system uses a k-nearest neighbors approach to match client preferences to styles from a curated catalog.

**Input features:**
- Preferred hair length
- Maintenance preference (low/medium/high)
- Preferred service category
- Face shape

**Algorithm:**
1. Encode style catalog as numerical feature vectors
2. Normalize features using StandardScaler
3. Use cosine similarity via NearestNeighbors to find closest matches
4. Filter results by face shape compatibility
5. Generate confidence scores and human-readable reasoning

### Database (PostgreSQL)

Three core tables:
- `users` — Client and stylist accounts with bcrypt-hashed passwords
- `appointments` — Scheduled appointments with status tracking
- `services` — Service catalog with pricing and duration

## Deployment

Docker Compose orchestrates three containers:
1. **PostgreSQL** — Persistent data store
2. **Flask API** — Backend served via Gunicorn
3. **Next.js** — Frontend dev server (production would use `next build` + static export)
