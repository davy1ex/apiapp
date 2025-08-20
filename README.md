# User Service API

This project is a simple user management service built with Express.js, Prisma ORM, and PostgreSQL. It provides basic user registration, authentication, and user management features with role-based access control.

***

## Features

- **User Registration**: Users can register by providing full name, birthday, email, password, and role (admin or user).
- **User Authentication**: JWT-based login to authenticate users.
- **Get User by ID**: Allows a user to get their own profile or an admin to get any user.
- **Get Users List**: Admin-only endpoint to get the list of all users.
- **Block User**: Admins or users themselves can block a user (mark status as inactive).
- **Role-Based Authorization**: Access to routes is restricted based on user role and ownership.

***

## Tech Stack

- Node.js with Express.js
- Prisma ORM for database modeling and querying
- PostgreSQL as the database
- JWT for authentication tokens
- bcrypt for password hashing
- TypeScript (optional, can run with JavaScript)

***

## Prerequisites

- Node.js (version 16 or newer)
- PostgreSQL running locally or remotely
- `npm` or `yarn` package manager

***

## Setup and Running

1. **Clone the repository**

```bash
git clone https://github.com/davy1ex/apiapp
cd apiapp
```

2. **Install dependencies**

```bash
npm install
```

3. **Setup a env vars**

In project exist a `.env.development` file in the root dirs. Here basic data for connecting to docker PostgreSQL. You can change it to yours.

4. **Set up the Prisma database schema**

Run the migration to create the tables:

```bash
npx prisma migrate dev --name init
```

5. **Start the server**

Run the server with the TypeScript executor:

```bash
npx tsx server.ts
```

The server runs by default on port 3000.

***

## API Endpoints

- `POST /api/register`  
  Register a new user  
  **Body:** `{ fullName, birthday (YYYY-MM-DD), email, password, role }`

- `POST /api/login`  
  Authenticate user and get JWT token  
  **Body:** `{ email, password }`  
  **Response:** `{ token }`

- `GET /api/user/:id`  
  Get user data by ID  
  Accessible by admin or user himself (with valid JWT in Authorization header)  

- `GET /api/users`  
  Get list of all users (admin only)

- `POST /api/user/:id/block`  
  Block the user by ID (admin or the user himself)

***

## Using the API

1. Register a user via `POST /api/register` with the required details.
2. Login via `POST /api/login` to get a JWT token.
3. Pass the token in the header for protected routes:
   ```
   Authorization: Bearer <token>
   ```
4. Access your user details or admin-only routes as per your role.

***

## Notes

- Passwords are securely hashed with bcrypt.
- JWT tokens include user ID and role for authorization checks.
- IDs are auto-increment integers for ease of use.
- Role-based access control is enforced on protected routes.
- Use tools like Postman or curl for API testing.
