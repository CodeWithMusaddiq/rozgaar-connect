# Fouz Ki Dukaan - Complete MERN Stack Setup

## Project Structure

```
fouz-ki-dukaan/
├── backend/          # Node.js + Express + MongoDB API
│   ├── src/
│   │   ├── config/       # Database config
│   │   ├── controllers/  # Route controllers
│   │   ├── middleware/   # Auth, validation, error handling
│   │   ├── models/       # Mongoose schemas
│   │   ├── routes/       # API routes
│   │   ├── seeds/        # Seed data script
│   │   ├── utils/        # Helpers (ApiError, ApiResponse, asyncHandler, JWT)
│   │   └── server.js     # Entry point
│   ├── .env.example
│   └── package.json
│
└── frontend/       # React + Vite + Tailwind CSS
    ├── src/
    │   ├── components/     # Reusable components
    │   ├── context/        # AuthContext (global state)
    │   ├── hooks/           # Custom hooks (useJobs, useApplications, useChat)
    │   ├── layouts/         # MainLayout
    │   ├── pages/           # All page components
    │   ├── routes/          # AppRoutes with auth guards
    │   ├── services/        # API service layer
    │   ├── utils/           # Frontend utilities
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── tailwind.config.js
    ├── vite.config.js
    └── package.json
```

## Backend Setup

```bash
cd backend

# 1. Install dependencies
npm install

# 2. Create .env file
cp .env.example .env
# Edit .env and set your MongoDB URI and JWT secret

# 3. Make sure MongoDB is running
# Or use MongoDB Atlas connection string in .env

# 4. Seed the database with test data
npm run seed

# 5. Start the server
npm run dev
```

Backend runs on `http://localhost:5000`

## Frontend Setup

```bash
cd frontend

# 1. Install dependencies
npm install

# 2. Create .env file
cp .env.example .env
# Edit .env if your backend is on a different URL

# 3. Start the dev server
npm run dev
```

Frontend runs on `http://localhost:5173`

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

## API Endpoints

### Auth (`/api/auth`)
- POST `/register` - Register new user
- POST `/login` - Login user
- GET `/me` - Get current user
- PUT `/password` - Update password

### Users (`/api/users`)
- GET `/` - Get all users
- GET `/:id` - Get user by ID
- PUT `/profile` - Update profile
- DELETE `/me` - Deactivate account

### Jobs (`/api/jobs`)
- GET `/` - Get all jobs (search + filter)
- GET `/nearby` - Get nearby jobs
- GET `/:id` - Get single job
- POST `/` - Create job (owner only)
- PUT `/:id` - Update job (owner only)
- DELETE `/:id` - Delete job (owner only)
- GET `/my/listings` - Get my jobs

### Applications (`/api/applications`)
- POST `/` - Apply for job (seeker)
- GET `/my-applications` - My applications (seeker)
- GET `/received` - Received applications (owner)
- PUT `/:id/status` - Accept/Reject (owner)
- DELETE `/:id` - Withdraw (seeker)
- GET `/:id` - Get single application

### Chat (`/api/chat`)
- POST `/send` - Send message
- GET `/conversations` - Get all conversations
- GET `/conversation/:userId` - Get conversation
- GET `/unread-count` - Get unread count
- DELETE `/:id` - Delete message

## Features Implemented

### Frontend
- [x] Complete routing with React Router DOM
- [x] Responsive navbar with mobile menu
- [x] Auth context with global state management
- [x] Protected routes (auth + role-based)
- [x] Guest routes (redirect if logged in)
- [x] API service layer with Axios
- [x] Custom hooks for jobs, applications, chat
- [x] JWT token handling with auto-refresh on 401
- [x] Loading states and error handling
- [x] Mobile-first responsive design

### Backend
- [x] Express server with security middleware
- [x] MongoDB + Mongoose ODM
- [x] JWT authentication
- [x] Password hashing with bcrypt
- [x] Input validation with express-validator
- [x] Role-based access control
- [x] Error handling middleware
- [x] Pagination on all list endpoints
- [x] Search and filter on jobs
- [x] Seed data script with test accounts

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Lucide Icons, Axios |
| Backend | Node.js, Express.js, MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| Validation | express-validator |
| Security | Helmet, CORS, Compression |
