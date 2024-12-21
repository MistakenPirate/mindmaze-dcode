// server.ts
import authRoutes from "./routes/auth";
import quizRoutes from "./routes/quiz";
import { setSocketIO } from "./routes/quiz";

import express, { Application } from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();

const app: Application = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

setSocketIO(io);

const PORT = 5000;

app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);
  });

  // Add error handling
  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });
});

app.use("/auth", authRoutes);
app.use("/quiz", quizRoutes);

app.get("/", (req, res) => {
  res.send("<h1>Server is running</h1>");
});

server.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});