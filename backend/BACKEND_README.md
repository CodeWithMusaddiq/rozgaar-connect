# Fouz Ki Dukaan - Backend API

## Tech Stack
- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **JWT** Authentication
- **bcryptjs** Password Hashing
- **express-validator** Input Validation
- **CORS** + **Helmet** + **Compression**

## Setup

```bash
cd backend

# 1. Install dependencies
npm install

# 2. Create .env file
cp .env.example .env

# 3. Make sure MongoDB is running locally
# Or update MONGODB_URI in .env to your MongoDB Atlas connection string

# 4. Seed the database with test data
npm run seed

# 5. Start the server
npm run dev
```

Server runs on `http://localhost:5000`

## API Endpoints

### Auth (`/api/auth`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login user |
| GET | `/api/auth/me` | Yes | Get current user |
| PUT | `/api/auth/password` | Yes | Update password |

### Users (`/api/users`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/users` | No | Get all users (with filters) |
| GET | `/api/users/:id` | No | Get user by ID |
| PUT | `/api/users/profile` | Yes | Update own profile |
| DELETE | `/api/users/me` | Yes | Deactivate account |

### Jobs (`/api/jobs`)
| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/api/jobs` | No | - | Get all jobs (search + filter) |
| GET | `/api/jobs/nearby` | No | - | Get nearby jobs |
| GET | `/api/jobs/:id` | No | - | Get single job |
| POST | `/api/jobs` | Yes | Owner | Create job |
| PUT | `/api/jobs/:id` | Yes | Owner | Update job |
| DELETE | `/api/jobs/:id` | Yes | Owner | Delete job |
| GET | `/api/jobs/my/listings` | Yes | Owner | Get my jobs |

### Applications (`/api/applications`)
| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/api/applications` | Yes | Seeker | Apply for job |
| GET | `/api/applications/my-applications` | Yes | Seeker | My applications |
| GET | `/api/applications/received` | Yes | Owner | Received applications |
| PUT | `/api/applications/:id/status` | Yes | Owner | Accept/Reject |
| DELETE | `/api/applications/:id` | Yes | Seeker | Withdraw |
| GET | `/api/applications/:id` | Yes | Both | Get single application |

### Chat (`/api/chat`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/chat/send` | Yes | Send message |
| GET | `/api/chat/conversations` | Yes | Get all conversations |
| GET | `/api/chat/conversation/:userId` | Yes | Get conversation |
| GET | `/api/chat/unread-count` | Yes | Get unread count |
| DELETE | `/api/chat/:id` | Yes | Delete message |

## Query Parameters

### Jobs
- `search` - Text search in title/description
- `location` - Filter by location
- `type` - Filter by job type (Full-time, Part-time, etc.)
- `category` - Filter by category
- `minSalary` / `maxSalary` - Salary range
- `page` / `limit` - Pagination
- `sortBy` / `order` - Sorting

### Users
- `role` - Filter by role (seeker/owner)
- `location` - Filter by location
- `page` / `limit` - Pagination

## Authentication

All protected routes require a Bearer token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

Get the token from `/api/auth/login` or `/api/auth/register`.

## Response Format

All responses follow this structure:

```json
{
  "success": true,
  "message": "...",
  "data": { ... }
}
```

Error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [ { "field": "...", "message": "..." } ],
  "stack": "..."  // Only in development
}
```

## Test Accounts (after seeding)

| Email | Password | Role |
|-------|----------|------|
| ahmed@fouzstore.com | password123 | owner |
| priya@citymart.com | password123 | owner |
| ravi@quickbites.com | password123 | owner |
| mohammed.ali@email.com | password123 | seeker |
| fatima.khan@email.com | password123 | seeker |
| ravi.kumar@email.com | password123 | seeker |
| priya.sharma@email.com | password123 | seeker |
