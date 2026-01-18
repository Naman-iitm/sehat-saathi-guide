# Doctor Appointment API Documentation

## Overview

The Doctor Appointment API handles doctor profile management, slot generation, and secure appointment booking with email notifications.

## Base URL

`/api`

## Authentication

All booking operations require a valid JWT token in the `Authorization` header.
GET requests for doctors and slots are public.

## Endpoints

### Doctors

#### Get All Doctors
**GET** `/doctors`

Query Parameters:
- `specialization`: Filter by specialty (e.g., "Cardiologist")
- `search`: Search text in name, clinic, or specialization

Response:
```json
[
  {
    "_id": "...",
    "user": { "name": "Dr. Smith", ... },
    "specialization": "Cardiologist",
    "consultationFee": 500,
    "clinicName": "Heart Care Clinic"
  }
]
```

#### Get Doctor Slots
**GET** `/doctors/:id/slots`

Query Parameters:
- `date`: Date string (YYYY-MM-DD or ISO)

Response:
```json
{
  "date": "2026-01-20T00:00:00.000Z",
  "slots": ["09:00", "09:30", "11:00", "14:30"] // Booked slots are automatically excluded
}
```

### Appointments

#### Book Appointment
**POST** `/appointments`

Body:
```json
{
  "doctorId": "...",
  "date": "2026-01-20",
  "startTime": "09:30",
  "symptoms": "Headache and fever",
  "type": "in-person"
}
```

Response: 201 Created
- Triggers email to Patient
- Triggers email to Doctor

#### Get My Appointments
**GET** `/appointments/my`

Response:
```json
[
  {
    "doctor": { "user": { "name": "Dr. Smith" } },
    "date": "...",
    "startTime": "09:30",
    "status": "confirmed"
  }
]
```

#### Cancel Appointment
**PUT** `/appointments/:id/cancel`

Body:
```json
{
  "reason": "Changed plans"
}
```

## Data Models

### Doctor Schema
- `availability`: Array of objects { day, startTime, endTime }
- `specialization`: String
- `consultationFee`: Number

### Appointment Schema
- `status`: pending | confirmed | cancelled | completed
- `startTime`: String (HH:mm)
- `date`: Date

## Technical Details

- **Concurrency**: Uses MongoDB transactions to prevent double-booking.
- **Availability**: Slots are generated dynamically based on Doctor's schedule minus existing bookings.
- **Notifications**: Uses Nodemailer (configured via env vars).
