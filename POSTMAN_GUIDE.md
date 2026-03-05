# User Auth API - Setup & Usage Guide

## Installation

First, install the required dependencies for JWT and password hashing:

```bash
npm install jsonwebtoken bcryptjs
```

## Environment Setup

The `.env` file already has `JWT_SECRET` configured. You can change it to a more secure value in production.

## API Endpoints

### Authentication Endpoints

#### 1. **Signup** (POST)
- **URL:** `http://localhost:3000/user/signup`
- **Method:** POST
- **Body:**
  ```json
  {
    "name": "V1",
    "email": "JonUltrakill@example.com",
    "password": "ULTRAKILLMUSTDIE"
  }
  ```
- **Response:** Returns JWT token on success
  ```json
  {
    "message": "User registered successfully",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
  ```

#### 2. **Login** (POST)
- **URL:** `http://localhost:3000/user/login`
- **Method:** POST
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response:** Returns JWT token on successful login
  ```json
  {
    "message": "Successfully logged in",
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
  ```

### CRUD Endpoints

#### 3. **Get User** (GET)
- **URL:** `http://localhost:3000/user/:id`
- **Method:** GET
- **Response:** User details (password excluded)

#### 4. **Update User** (PUT)
**Note**: You have to call `/login` first, get the JWT token, and use it for authorization (see `Using JWT` for more details)
- **URL:** `http://localhost:3000/user/:id/update`
- **Method:** PUT
- **Body:** (any of the following fields)
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com"
  }
  ```

#### 5. **Delete User** (DELETE)
- **URL:** `http://localhost:3000/user/:id/delete`
- **Method:** DELETE
- **Response:** Confirmation message

## Using JWT
1. call `login`
2. copy the "token" field's value
3. go to Authorization
4. select Bearer Token
5. put the copied token inside

## Using with Postman

### Option 1: Import the Collection
1. Open Postman
2. Click **Import** button (top left)
3. Select the file `postman_collection.json`
4. All endpoints will be pre-configured

### Option 2: Manual Setup
1. Create a new request
2. Set the method (GET, POST, PUT, DELETE)
3. Set the URL (e.g., `http://localhost:3000/user/signup`)
4. Add headers: `Content-Type: application/json` (for POST/PUT)
5. Add the request body in JSON format

## Workflow Example

1. **Signup** to create an account
   - POST to `/user/signup`
   - Copy the returned `token`

2. **Login** (to verify credentials work)
   - POST to `/user/login`
   - Receive token

3. **Get your user details**
   - GET to `/user/{userId}`
   - Replace `{userId}` with the ID from signup/login response

4. **Update your profile**
   - PUT to `/user/{userId}/update`
   - Send updated fields in body

5. **Delete account**
   - DELETE to `/user/{userId}/delete`

## Notes

- Passwords are hashed using bcryptjs before storage
- JWT tokens expire after 7 days
- Invalid credentials return a 401 error with message "Invalid email or password"
- Email must be unique across all users
- Password must be at least 6 characters

## Troubleshooting

- **"error: failed to fetch"**: Make sure the server is running on port 3000
- **"User already exists"**: The email is already registered
- **"Invalid email or password"**: Double-check your credentials
- **MongoDB connection error**: Make sure MongoDB is running locally on port 27017
