# SalonAI

AI-powered scheduling and recommendation system for hair salons.

## Overview

SalonAI streamlines appointment scheduling, automates price quoting, and offers personalized hairstyle and color recommendations based on client history. By integrating AI and a modern tech stack, SalonAI enhances salon management by reducing manual effort and improving customer satisfaction.

## Features

- **Smart Scheduling** – Book, reschedule, and cancel appointments with real-time availability
- **AI Recommendations** – Personalized hairstyle and color suggestions based on client history, face shape, and preferences
- **Service Management** – Browse services, pricing, and estimated durations
- **User Authentication** – Secure JWT-based login for clients and staff
- **Dashboard** – Staff overview of daily appointments, revenue, and client metrics

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React, TypeScript, Tailwind CSS |
| Backend | Flask, Flask-SQLAlchemy, Flask-JWT-Extended |
| Database | PostgreSQL |
| AI | scikit-learn, pandas |
| DevOps | Docker, Docker Compose |

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL 15+
- Docker (optional)

### Quick Start with Docker

```bash
docker-compose up --build
```

The frontend will be available at `http://localhost:3000` and the API at `http://localhost:5000`.

### Manual Setup

#### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
flask run
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

## API Documentation

See [docs/api-docs.md](docs/api-docs.md) for full API reference.

## Architecture

See [docs/architecture.md](docs/architecture.md) for system design details.

## Team

- Victor Buica – Project Management
- Hamza Sohail – Backend Development
- Muhammad Sawal – Backend Development
- Jaideep Singh – Frontend Development
- Haadi Memisevic – Frontend Development
- Riffi Manoj – AI & Frontend
- Joshua Hanif – AI Integration

## License

This project was developed as part of EECS 4314 at York University.
