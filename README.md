Here’s a sample `README.md` for starting up your backend, along with the `.env` file format:

---

# Mindmaze Backend

This is the backend API for the **Mindmaze** project. The API is built using **Express**, **Prisma**, and **JWT** authentication.

## Requirements

- Node.js (v14 or above)
- PostgreSQL
- `.env` file for sensitive configuration

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/mindmaze-backend.git
cd mindmaze-backend
```

### 2. Install dependencies

```bash
npm install
```

This will install the required dependencies for the backend.

### 3. Set up the `.env` file

Create a `.env` file at the root of the project. You can use the `.env.example` file as a reference.

### Example `.env` file

```env
# Secret key for JWT signing
SECRET=your_jwt_secret_key_here

# PostgreSQL database URL (for Prisma)
DATABASE_URL="postgresql://user:password@localhost:5432/mindmaze?schema=public"
```

- **SECRET**: This is the secret key used to sign JWT tokens.
- **DATABASE_URL**: The URL for your PostgreSQL database.

### 4. Prisma Setup

Make sure your database is set up properly by running the following command:

```bash
npx prisma migrate dev
```

This will run database migrations and set up the schema for the application.

### 5. Running the server

To start the server, run:

```bash
npm start
```

The server will be available at `http://localhost:5000`.

## API Endpoints

### **Auth Routes**
- `POST /auth/register`: Register a new user. Body: `{ username, password }`
- `POST /auth/login`: Login to get a JWT token. Body: `{ username, password }`

### **Quiz Routes**
- `GET /quiz/questions`: Get all questions (requires authentication)
- `POST /quiz/submit`: Submit an answer to a question (requires authentication). Body: `{ questionId, answer, userId }`

### Socket.io
- The backend uses **Socket.io** to handle real-time updates. Upon successful connection, the server logs `"User Connected"` to the console.

### **Example Request**

To register a new user:

```json
POST http://localhost:5000/auth/register
{
  "username": "john_doe",
  "password": "securepassword"
}
```

To login and get a token:

```json
POST http://localhost:5000/auth/login
{
  "username": "john_doe",
  "password": "securepassword"
}
```

The response will contain a JWT token that you can use to authenticate requests.

## Testing with Postman

1. **Register** a user by sending a `POST` request to `/auth/register` with the required payload.
2. **Login** with the registered credentials to get the JWT token.
3. Include the token in the `Authorization` header when making requests to protected routes:

```json
Authorization: <your_jwt_token>
```

### Example of a protected request:

```json
GET http://localhost:5000/quiz/questions
```

Make sure to include the Authorization header with your token:

```json
Authorization: <your_jwt_token>
```

## Troubleshooting

- **CORS Issues**: Ensure that CORS is correctly configured on the server side. The backend must accept requests from your frontend URL. If you're getting a CORS error, check the configuration in the `app.use(cors())` middleware.
- **Database Connection**: If you're seeing errors related to database connectivity, double-check your `DATABASE_URL` in the `.env` file.
