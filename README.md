# SalonAI

An AI-powered salon management platform that streamlines appointment scheduling, automates price quoting, and delivers personalized hairstyle recommendations based on client preferences and face shape analysis. Built with a three-tier architecture using Next.js, Flask, and PostgreSQL.

---

## Architecture

```mermaid
graph TB
    subgraph Client["Client Layer"]
        Frontend["Frontend<br/>Next.js + React + TypeScript<br/>Tailwind CSS"]
    end

    subgraph Server["Application Layer"]
        API["Flask API Server<br/>JWT Authentication<br/>RESTful Endpoints"]
        AI["AI Recommendation Engine<br/>scikit-learn<br/>Style Matching & Price Estimation"]
    end

    subgraph Data["Data Layer"]
        DB[("PostgreSQL<br/>Users | Appointments | Services")]
    end

    Frontend -->|HTTP/REST JSON| API
    API -->|SQLAlchemy ORM| DB
    API --> AI

    style Frontend fill:#61dafb,stroke:#333,stroke-width:3px,color:#000
    style API fill:#000,stroke:#333,stroke-width:3px,color:#fff
    style AI fill:#009688,stroke:#333,stroke-width:3px,color:#fff
    style DB fill:#336791,stroke:#333,stroke-width:3px,color:#fff
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14, React, TypeScript, Tailwind CSS |
| **Backend** | Python, Flask, Flask-JWT-Extended, Flask-SQLAlchemy |
| **Database** | PostgreSQL 15 |
| **AI/ML** | scikit-learn (KNN + Cosine Similarity), NumPy, pandas |
| **Auth** | JWT tokens, bcrypt password hashing |
| **DevOps** | Docker, Docker Compose |

---

## Features

- **Smart Scheduling** — Book, reschedule, and cancel appointments with real-time conflict detection
- **AI Style Recommendations** — Personalized hairstyle and color suggestions based on face shape, hair length, maintenance preference, and service category
- **Automated Price Estimation** — Dynamic pricing based on style, hair length, and add-on treatments
- **Role-Based Access** — Separate flows for clients (book appointments, get recommendations), stylists (manage schedule), and admins (manage services)
- **Service Catalog** — Browseable catalog with categories (haircuts, coloring, styling, treatments), pricing, and durations
- **JWT Authentication** — Secure token-based auth with bcrypt-hashed passwords

---

## AI Recommendation Engine

The recommendation system uses a k-nearest neighbors approach with cosine similarity to match client profiles to styles from a curated catalog of 10+ hairstyles across haircuts, colorings, and styling treatments.

**How it works:**

1. Each style in the catalog is encoded as a numerical feature vector (hair length, maintenance level, category)
2. Features are normalized using `StandardScaler`
3. Client preferences are transformed into the same feature space
4. `NearestNeighbors` with cosine similarity finds the closest style matches
5. Results are filtered by face shape compatibility (oval, heart, square, round, oblong, diamond)
6. Each recommendation includes a confidence score and human-readable reasoning

**Supported face shapes:** oval, heart, square, round, oblong, diamond

**Price estimation** factors in base pricing by category and hair length, plus add-on treatments (deep conditioning, keratin, toner, gloss).

---

## Setup Instructions

### Prerequisites

- Docker and Docker Desktop installed
- OR: Python 3.11+, Node.js 18+, PostgreSQL 15+

### Quick Start with Docker

```bash
git clone https://github.com/JaideepSingh-code/SalonAI.git
cd SalonAI
docker-compose up --build
```

This starts three containers:

| Container | Service | Port |
|-----------|---------|------|
| `postgres:15-alpine` | PostgreSQL database | `5432` |
| `backend` | Flask API server | `5000` |
| `frontend` | Next.js dev server | `3000` |

- **Frontend:** http://localhost:3000
- **API:** http://localhost:5000/api
- **Health check:** http://localhost:5000/api/health

### Manual Setup

**Backend:**

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Set environment variables
export DATABASE_URL=postgresql://postgres:postgres@localhost:5432/salonai
export SECRET_KEY=your-secret-key
export JWT_SECRET_KEY=your-jwt-secret

flask run
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

---

## API Endpoints

Base URL: `http://localhost:5000/api`

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/register` | Create a new account (client or stylist) |
| `POST` | `/auth/login` | Authenticate and receive JWT token |
| `GET` | `/auth/me` | Get current user profile |
| `GET` | `/auth/users` | List all stylists (for booking) |

### Appointments

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/appointments/` | List appointments (role-filtered) |
| `POST` | `/appointments/` | Book a new appointment |
| `PUT` | `/appointments/:id` | Update appointment |
| `DELETE` | `/appointments/:id` | Cancel appointment |

### Services

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/services/` | Browse service catalog (filterable by category) |
| `GET` | `/services/:id` | Get service details |
| `POST` | `/services/` | Create service (admin only) |
| `PUT` | `/services/:id` | Update service (admin only) |

### AI Recommendations

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/recommendations/` | Get personalized style recommendations |
| `POST` | `/recommendations/price-estimate` | Get price estimate for a style |
| `GET` | `/recommendations/styles` | Browse full style catalog |

**Example — Get Recommendations:**

```json
POST /api/recommendations/
{
  "face_shape": "oval",
  "preferred_length": "medium",
  "maintenance_preference": "low",
  "preferred_category": "haircut",
  "n_recommendations": 3
}
```

**Response:**

```json
{
  "recommendations": [
    {
      "style": { "name": "Classic Bob", "category": "haircut", "maintenance": "low" },
      "confidence": 92.3,
      "reason": "Recommended because it complements your oval face shape and matches your maintenance preference"
    }
  ]
}
```

---

## Database Schema

Three core tables managed by SQLAlchemy ORM:

**users**
| Column | Type | Description |
|--------|------|-------------|
| `id` | Integer (PK) | Auto-increment |
| `email` | String(120) | Unique, indexed |
| `password_hash` | String(128) | bcrypt-hashed |
| `first_name`, `last_name` | String(50) | |
| `phone` | String(20) | Optional |
| `role` | String(20) | `client`, `stylist`, or `admin` |
| `created_at`, `updated_at` | DateTime | Auto-managed |

**appointments**
| Column | Type | Description |
|--------|------|-------------|
| `id` | Integer (PK) | |
| `client_id` | FK → users | |
| `stylist_id` | FK → users | |
| `service_id` | FK → services | |
| `appointment_date` | DateTime | Conflict-checked |
| `duration_minutes` | Integer | From service |
| `status` | String(20) | `pending` → `confirmed` → `completed` / `cancelled` |
| `total_price` | Float | From service base price |
| `notes` | Text | Optional client notes |

**services**
| Column | Type | Description |
|--------|------|-------------|
| `name` | String(100) | |
| `category` | String(50) | `haircut`, `coloring`, `styling`, `treatment` |
| `base_price` | Float | |
| `duration_minutes` | Integer | |
| `is_active` | Boolean | Soft delete |

---

## Project Structure

```
SalonAI/
├── backend/
│   ├── app.py                  # Flask app factory
│   ├── config.py               # Environment configs
│   ├── models/
│   │   ├── user.py             # User model (client/stylist/admin)
│   │   ├── appointment.py      # Appointment model with status tracking
│   │   └── service.py          # Service catalog model
│   ├── routes/
│   │   ├── auth.py             # Registration, login, JWT
│   │   ├── appointments.py     # Booking CRUD with conflict detection
│   │   ├── services.py         # Service catalog management
│   │   └── recommendations.py  # AI recommendation endpoints
│   ├── ai/
│   │   └── recommender.py      # StyleRecommender (KNN + cosine similarity)
│   └── tests/
│       ├── test_auth.py
│       └── test_appointments.py
├── frontend/
│   ├── src/
│   │   ├── app/                # Next.js pages (login, dashboard, booking)
│   │   ├── components/         # Reusable UI components
│   │   └── lib/                # API client, auth utilities
│   ├── package.json
│   └── tsconfig.json
├── docs/
│   ├── architecture.md         # System design documentation
│   └── api-docs.md             # Full API reference
├── docker-compose.yml
└── README.md
```

---

## Team

- Victor Buica
- Hamza Sohail
- Muhammad Sawal
- Jaideep Singh
- Haadi Memisevic
- Riffi Manoj
- Joshua Hanif
