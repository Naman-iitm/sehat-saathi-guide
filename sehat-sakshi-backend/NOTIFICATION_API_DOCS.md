# Notification System API Documentation

## Overview

The Notification System provides real-time alerts for health reminders and other system events. It uses **Socket.IO** for live updates and a **MongoDB** backed persistence layer for history.

## Base URL

`/api/notifications`

## Real-time Connection

Connect to the Socket.IO server at the base URL (e.g., `http://localhost:5000`).

### Events

- **Listen**: `notification`
  - Payload:
    ```json
    {
      "title": "Health Reminder",
      "message": "Time to take Medicine A",
      "type": "reminder",
      "priority": "high",
      "createdAt": "..."
    }
    ```
- **Emit**: `join_check`
  - Payload: `userId` (String)
  - Purpose: Join a private private room to receive personal notifications.

## REST Endpoints

### Get Notifications
**GET** `/`

Description: Fetch last 50 notifications for the current user.

Response:
```json
{
  "notifications": [
    {
      "_id": "...",
      "title": "Health Reminder",
      "message": "Take Aspirin",
      "isRead": false,
      "priority": "high"
    }
  ],
  "unreadCount": 5
}
```

### Mark as Read
**PUT** `/:id/read`

Description: Mark a single notification as read.

Response: `200 OK` - Returns updated notification.

### Mark All as Read
**PUT** `/read-all`

Description: Mark all unread notifications for the user as read.

Response: `200 OK`

## Background Processing

- A **Cron Job** runs every minute on the server.
- It scans the `Reminders` collection for items due at the current time (`HH:MM`).
- For due items, it:
  1. Creates a `Notification` record in the database.
  2. Emits a real-time socket event to the specific user.

## Data Models

### Notification Schema
- `user`: ObjectId (Ref User)
- `title`: String
- `message`: String
- `type`: 'medication' | 'appointment' | 'system'
- `priority`: 'low' | 'normal' | 'high'
- `isRead`: Boolean
