# SalonAI API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

### POST /auth/register

Create a new user account.

**Request:**
```json
{
  "email": "client@example.com",
  "password": "securepass123",
  "first_name": "Jane",
  "last_name": "Doe",
  "role": "client"
}
```

**Response (201):**
```json
{
  "message": "Registration successful",
  "user": { "id": 1, "email": "client@example.com", ... },
  "access_token": "eyJ..."
}
```

### POST /auth/login

Authenticate and receive a JWT token.

**Request:**
```json
{
  "email": "client@example.com",
  "password": "securepass123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": { ... },
  "access_token": "eyJ..."
}
```

### GET /auth/me

Get the currently authenticated user. Requires `Authorization: Bearer <token>`.

## Appointments

All endpoints require authentication.

### GET /appointments/

List appointments for the authenticated user. Stylists see their assigned appointments; admins see all.

### POST /appointments/

Book a new appointment.

**Request:**
```json
{
  "stylist_id": 1,
  "service_id": 2,
  "appointment_date": "2025-11-15T10:00:00",
  "notes": "First time client"
}
```

### PUT /appointments/:id

Update appointment status, date, or notes.

### DELETE /appointments/:id

Cancel an appointment (sets status to "cancelled").

## Services

### GET /services/

List all active services. Supports `?category=haircut` filter.

### GET /services/:id

Get details for a specific service.

### POST /services/

Create a new service (admin only).

### PUT /services/:id

Update a service (admin only).

## AI Recommendations

### POST /recommendations/

Get personalized style recommendations.

**Request:**
```json
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
      "style": { "id": 2, "name": "Layered Cut", ... },
      "confidence": 87.3,
      "reason": "Recommended because it complements your oval face shape and matches your maintenance preference"
    }
  ]
}
```

### POST /recommendations/price-estimate

Get a price estimate for a specific style.

**Request:**
```json
{
  "style_id": 2,
  "hair_length": "medium",
  "additional_treatments": ["deep_conditioning"]
}
```

### GET /recommendations/styles

List all styles in the AI catalog.

## Error Responses

All errors follow this format:
```json
{
  "error": "Description of what went wrong"
}
```

Common status codes: 400 (bad request), 401 (unauthorized), 403 (forbidden), 404 (not found), 409 (conflict).
