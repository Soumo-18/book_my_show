# Book My Ticket - Movie Seat Booking System

A full-stack movie seat booking platform with JWT authentication and protected booking endpoints built as part of the Chai Aur SQL Hackathon.

## 🎯 Hackathon Compliance

This project fulfills all the hackathon requirements:

✅ **Used Starter Code** - Extended the base codebase from [chaicodehq/book-my-ticket](https://github.com/chaicodehq/book-my-ticket)  
✅ **Authentication Layer** - JWT-based auth with register/login functionality  
✅ **Protected Endpoints** - Booking routes secured with auth middleware  
✅ **User Registration** - POST `/api/auth/register` with validation  
✅ **User Login** - POST `/api/auth/login` with JWT token generation  
✅ **Protected Booking** - Only authenticated users can book seats  
✅ **Duplicate Prevention** - Database transactions prevent double bookings  
✅ **User Association** - Bookings linked to logged-in users via `user_id`  
✅ **Clean Code** - Modular architecture with DTOs, services, and controllers  
✅ **No Breaking Changes** - All existing endpoints preserved and enhanced  

## 🚀 Features

- 🔐 **User Authentication** - Secure registration and login with bcrypt password hashing
- 🎫 **Protected Seat Booking** - Only authenticated users can book seats
- 🔒 **JWT Token-based Auth** - Secure token stored in HTTP-only cookies
- 🚫 **Duplicate Booking Prevention** - PostgreSQL transactions with row-level locking
- 💾 **Database Transactions** - ACID compliance for booking operations
- ✅ **Input Validation** - Joi schema validation for all requests
- 🎨 **Modern UI** - Simple frontend with Tailwind CSS (optional)
- 🏗️ **Clean Architecture** - Modular structure with separation of concerns

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js (v14+)
- **Framework**: Express.js v5
- **Database**: PostgreSQL (v12+)
- **Authentication**: JWT (jsonwebtoken), bcryptjs
- **Validation**: Joi
- **Security**: cookie-parser, cors

### Frontend (Optional)
- Vanilla JavaScript
- Tailwind CSS

## 📋 Prerequisites

Before running this project, ensure you have:

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

## 🗄️ Database Setup

### 1. Create PostgreSQL Database

```bash
psql -U postgres
CREATE DATABASE book_my_ticket;
\c book_my_ticket
```

### 2. Run Database Schema

Execute the following SQL commands:

```sql
-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(322) UNIQUE NOT NULL,
    password TEXT NOT NULL
);

-- Create seats table
CREATE TABLE seats (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    isbooked INT DEFAULT 0,
    user_id INT REFERENCES users(id)
);

-- Insert 20 seats
INSERT INTO seats (isbooked) SELECT 0 FROM generate_series(1, 20);
```

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd book_my_show
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
PORT=4000
NODE_ENV=development

# PostgreSQL Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=book_my_ticket

# JWT Secrets
JWT_ACCESS_SECRET=your_super_secret_key_change_this
JWT_ACCESS_EXPIRES_IN=1d

CLIENT_URL=http://localhost:4000
```

**Important**: Change `JWT_ACCESS_SECRET` to a strong random string in production.

### 4. Start the Server

```bash
npm start
```

Or for development with auto-reload:

```bash
node --watch server.js
```

Server will run at: `http://localhost:4000`

## 📡 API Endpoints

### Authentication Routes (`/api/auth`)

#### 1. Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### 2. Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Note**: JWT token is automatically stored in HTTP-only cookie named `accessToken`.

#### 3. Get Current User (Protected)
```http
GET /api/auth/me
Cookie: accessToken=<jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### 4. Logout
```http
POST /api/auth/logout
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Booking Routes (`/api/seats`)

#### 1. Get All Seats (Public)
```http
GET /api/seats
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": null,
      "isbooked": 0,
      "user_id": null
    },
    {
      "id": 2,
      "name": "John Doe",
      "isbooked": 1,
      "user_id": 1
    }
  ]
}
```

#### 2. Book a Seat (Protected - Auth Required)
```http
PUT /api/seats/:id
Cookie: accessToken=<jwt_token>
```

**Example:**
```http
PUT /api/seats/5
Cookie: accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "success": true,
  "data": {
    "success": true,
    "seatId": "5"
  },
  "message": "Seat booked successfully"
}
```

**Error Response (Already Booked):**
```json
{
  "success": false,
  "error": "Seat already booked or does not exist"
}
```

**Error Response (Not Authenticated):**
```json
{
  "success": false,
  "error": "Not authenticated"
}
```

## 🏗️ Project Structure

```
book_my_show/
├── src/
│   ├── common/
│   │   ├── config/
│   │   │   └── db.js                 # PostgreSQL connection pool
│   │   ├── dto/
│   │   │   └── base.dto.js           # Base DTO class
│   │   ├── middleware/
│   │   │   └── validate.js           # Joi validation middleware
│   │   └── utils/
│   │       ├── api-error.js          # Custom error handler
│   │       └── api-response.js       # Standardized responses
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── dto/
│   │   │   │   ├── login.dto.js      # Login validation schema
│   │   │   │   └── register.dto.js   # Register validation schema
│   │   │   ├── auth.controller.js    # Auth request handlers
│   │   │   ├── auth.middleware.js    # JWT authentication middleware
│   │   │   ├── auth.routes.js        # Auth route definitions
│   │   │   └── auth.service.js       # Auth business logic
│   │   └── booking/
│   │       ├── booking.controller.js # Booking request handlers
│   │       ├── booking.routes.js     # Booking route definitions
│   │       └── booking.service.js    # Booking business logic
│   └── app.js                        # Express app configuration
├── .env                              # Environment variables (not in git)
├── .gitignore                        # Git ignore rules
├── env.example                       # Environment template
├── index.html                        # Frontend UI (optional)
├── package.json                      # Dependencies
├── server.js                         # Server entry point
└── README.md                         # This file
```

## 🔒 Security Features

1. **Password Hashing** - bcrypt with salt rounds of 12
2. **JWT Tokens** - Secure token-based authentication
3. **HTTP-only Cookies** - Prevents XSS attacks
4. **CORS Protection** - Configured for specific origins
5. **Input Validation** - Joi schemas validate all inputs
6. **SQL Injection Prevention** - Parameterized queries
7. **Transaction Locking** - Prevents race conditions in bookings

## 🎯 Key Implementation Details

### Authentication Flow

1. User registers → Password hashed with bcrypt → Stored in database
2. User logs in → Credentials verified → JWT token generated
3. Token stored in HTTP-only cookie → Sent with subsequent requests
4. Middleware validates token → Extracts user info → Allows access

### Booking Flow (Protected)

1. User must be logged in (JWT token required)
2. Request to book seat → Middleware validates token
3. Database transaction begins with row-level lock (`FOR UPDATE`)
4. Check if seat is available
5. If available → Update seat with user info → Commit transaction
6. If unavailable → Rollback → Return error
7. Associate booking with `user_id` from JWT token

### Duplicate Prevention

- PostgreSQL transactions with `BEGIN` and `COMMIT`
- Row-level locking with `FOR UPDATE`
- Atomic check-and-update operation
- Rollback on any failure

## 🧪 Testing the Application

### Using cURL

**Register:**
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'
```

**Login:**
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"email":"test@example.com","password":"test123"}'
```

**Book Seat:**
```bash
curl -X PUT http://localhost:4000/api/seats/1 \
  -b cookies.txt
```

### Using Postman

1. Import the endpoints
2. Register a user
3. Login (token auto-saved in cookies)
4. Book a seat using the authenticated session

### Using Frontend

1. Open `http://localhost:4000` in browser
2. Use the UI to register/login
3. Click on available seats to book

## 🚨 Error Handling

The application uses centralized error handling with custom error classes:

- `400 Bad Request` - Invalid input or seat already booked
- `401 Unauthorized` - Missing or invalid JWT token
- `404 Not Found` - User or resource not found
- `409 Conflict` - Email already exists
- `500 Internal Server Error` - Database or server errors

## 📝 Validation Rules

### Registration
- `name`: Required, 2-100 characters
- `email`: Required, valid email format
- `password`: Required, minimum 6 characters

### Login
- `email`: Required, valid email format
- `password`: Required

## 🎓 Learning Outcomes

This project demonstrates:

- ✅ Extending existing codebases (real-world scenario)
- ✅ JWT authentication implementation
- ✅ Protected route middleware
- ✅ PostgreSQL transactions and locking
- ✅ Input validation with Joi
- ✅ Clean architecture patterns
- ✅ Error handling best practices
- ✅ RESTful API design



This is a hackathon submission project. The codebase is based on the starter code from [chaicodehq/book-my-ticket](https://github.com/chaicodehq/book-my-ticket) with authentication and booking protection added.



Built with ☕ for the Chai Aur SQL Hackathon