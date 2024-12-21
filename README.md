
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

## API Docs 

- Swagger docs available at `http://localhost:5000/api-docs`


## Troubleshooting

- **CORS Issues**: Ensure that CORS is correctly configured on the server side. The backend must accept requests from your frontend URL. If you're getting a CORS error, check the configuration in the `app.use(cors())` middleware.
- **Database Connection**: If you're seeing errors related to database connectivity, double-check your `DATABASE_URL` in the `.env` file.
