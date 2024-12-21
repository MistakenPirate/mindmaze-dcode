import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prisma";

const router = Router();
const SECRET = process.env.SECRET || "";

router.post("/register", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: { username, password: hashedPassword },
    });
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(480).json({ error: "Username already exists" });
  }
});

router.post("/login", async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) {
      res.status(401).json({ error: "Invalid username or password" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ error: "Invalid username or password" });
      return;
    }

    const token = jwt.sign({ id: user.id }, SECRET);
    res.json({ token });
  } catch (err) {
    console.error("Error in login:", err);
    res.status(500).json({ error: "An unexpected error occurred" });
  }
});

export default router;
