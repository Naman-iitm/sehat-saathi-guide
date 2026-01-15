# Community Health Forum API Documentation

## Overview

The Community Health Forum API allows users to create posts, comment on discussions, and vote on content. It includes features for content moderation, tagging, and reputation tracking.

## Base URL

`/api/forum`

## Authentication

All write operations (POST, PUT, DELETE) require a valid JWT token in the `Authorization` header.
GET requests are public (optional, currently implemented as public for viewing).

## Endpoints

### Posts

#### Get All Posts
**GET** `/posts`

Query Parameters:
- `page`: Page number (default: 1)
- `limit`: Posts per page (default: 10)
- `sort`: Sort field (default: '-createdAt', options: 'score', '-views')
- `tag`: Filter by tag
- `search`: Search text in title, content, and tags

Response:
```json
{
  "posts": [ ... ],
  "currentPage": 1,
  "totalPages": 5,
  "totalPosts": 42
}
```

#### Get Single Post
**GET** `/posts/:id`

Response:
```json
{
  "_id": "...",
  "title": "...",
  "content": "...",
  "author": { "name": "...", "profilePic": "..." },
  "tags": ["health", "diet"],
  "score": 10,
  "views": 15,
  "comments": [] // Loaded separately for optimization
}
```

#### Create Post
**POST** `/posts`

Body:
```json
{
  "title": "Best diet for hypertension?",
  "content": "I am looking for advice on...",
  "tags": ["hypertension", "diet"]
}
```

#### Vote on Post
**PUT** `/posts/:id/vote`

Body:
```json
{
  "type": "upvote" // or "downvote"
}
```

### Comments

#### Get Comments for Post
**GET** `/posts/:id/comments`

Returns a flat list of comments. Frontend can reconstruct the threaded view using `parentComment` field.

#### Add Comment
**POST** `/posts/:id/comments`

Body:
```json
{
  "content": "Try reducing salt intake.",
  "parentComment": "optional_id_of_parent_comment"
}
```

#### Vote on Comment
**PUT** `/comments/:id/vote`

Body:
```json
{
  "type": "upvote"
}
```

## Moderation

Content containing banned keywords (e.g., specific profanity) will be automatically rejected with a 400 error. The list is maintained in the backend moderation middleware.

## Data Models

### Post Schema
- `title`: String, required
- `content`: String, required
- `author`: User reference
- `tags`: Array of Strings
- `score`: Number (Upvotes - Downvotes)
- `views`: Number

### Comment Schema
- `content`: String
- `author`: User reference
- `post`: Post reference
- `parentComment`: Comment reference (for nesting)
- `score`: Number
