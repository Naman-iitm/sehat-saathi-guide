# Health Analytics API Documentation

## Overview

The Analytics API aggregates user health data to provide visualizable trends and generated reports. It leverages MongoDB aggregation pipelines for efficient data processing.

## Base URL

`/api/analytics`

## Endpoints

### Get Health Trends
**GET** `/trends`

Query Parameters:
- `timeframe`: 'week' | 'month' | 'year' (default: 'month')

Description: Returns aggregated data for charts.

Response:
```json
{
  "timeframe": "month",
  "startDate": "2026-01-01T00:00:00.000Z",
  "endDate": "2026-02-01T00:00:00.000Z",
  "symptomFrequency": [
    { "_id": "Headache", "count": 15, "avgSeverity": 2.1 }
  ],
  "severityTrend": [
    { "_id": "2026-01-15", "avgSeverity": 1.5, "count": 2 }
  ],
  "appointmentStats": [
      { "_id": "confirmed", "count": 3 }
  ]
}
```

### Get Report Data
**GET** `/report`

Description: Fetches a comprehensive snapshot of health data suitable for generating a PDF report on the client side.

Response:
```json
{
  "reportDate": "...",
  "symptomFrequency": [...],
  "severityTrend": [...],
  "activeReminders": 5,
  "appointmentStats": [...]
}
```

## Data Analysis

- **Severity Calculation**: Mapped numerically (Mild=1, Moderate=2, Severe=3) to calculate averages.
- **Aggregation**: Grouped by date and symptom name.
- **Timeframes**: Dynamic filtering based on user request.
