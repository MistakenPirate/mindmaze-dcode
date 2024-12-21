import authRoutes from "./routes/auth";
import quizRoutes from "./routes/quiz";
import { setSocketIO } from "./routes/quiz";

import express, { Application } from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

dotenv.config();

const app: Application = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

setSocketIO(io);

const PORT = 5000;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Mindmaze API",
      version: "1.0.0",
      description: "API documentation for Mindmaze Quiz app",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};
const swaggerSpec = swaggerJSDoc(options);

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    allowedHeaders: ["Authorization", "Content-Type"],
  })
);

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);
  });

  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/auth", authRoutes);
app.use("/quiz", quizRoutes);

app.get("/", (req, res) => {
  res.send("<h1>Server is running</h1>");
});

server.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
