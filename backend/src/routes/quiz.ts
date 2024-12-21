import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../prisma";
import { Server } from "socket.io";

const router = Router();
const SECRET = process.env.SECRET || "";

let io: Server;

const authenticate = (req: Request, res: Response, next: Function): void => {
  const token = req.header("Authorization");
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.body.userId = (decoded as any).id;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid Token" });
  }
};

router.get(
  "/questions",
  authenticate,
  async (req: Request, res: Response): Promise<void> => {
    const questions = await prisma.question.findMany();
    res.json(questions.map((q) => ({ ...q, answer: undefined })));
  }
);

router.post(
  "/submit",
  authenticate,
  async (req: Request, res: Response): Promise<void> => {
    const { questionId, answer, userId } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (user.answeredQuestions.includes(questionId)) {
      res.status(400).json({ error: "Question already answered" });
      return;
    }

    const question = await prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      res.status(404).json({ error: "Question not found" });
      return;
    }

    const isCorrect = question.answer === answer;

    if (isCorrect) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          score: { increment: 1 },
          answeredQuestions: { push: questionId },
        },
      });

      io.emit(
        "scoreUpdated",
        await prisma.user.findMany({
          select: { id: true, username: true, score: true },
        })
      );
    }

    res.json({ isCorrect });
  }
);

export const setSocketIO = (socketIO: Server) => {
  io = socketIO;
};

export default router;
