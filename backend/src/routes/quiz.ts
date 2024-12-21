import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../prisma";
import { Server } from "socket.io";

const router = Router();
const SECRET = process.env.SECRET || "";

let io: Server;

const authenticate = (req: Request, res: Response, next: Function): void => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    res.status(401).json({ error: "Unauthorized - No token provided" });
    return;
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    res.status(401).json({ error: "Unauthorized - Invalid token format" });
    return;
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    req.body.userId = (decoded as any).id;
    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized - Invalid token" });
  }
};

/**
 * @swagger
 * /quiz/questions:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get all quiz questions
 *     description: Fetch all the quiz questions without the correct answers.
 *     responses:
 *       200:
 *         description: A list of quiz questions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   question:
 *                     type: string
 *                   options:
 *                     type: array
 *                     items:
 *                       type: string
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/questions",
  authenticate,
  async (req: Request, res: Response): Promise<void> => {
    const questions = await prisma.question.findMany();
    res.json(questions.map((q) => ({ ...q, answer: undefined })));
  }
);

/**
 * @swagger
 * /quiz/submit:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Submit an answer for a question
 *     description: Submit the answer for a question and receive a score update if the answer is correct.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - questionId
 *               - answer
 *             properties:
 *               questionId:
 *                 type: integer
 *                 description: The ID of the question being answered
 *               answer:
 *                 type: string
 *                 description: The user's answer to the question
 *     responses:
 *       200:
 *         description: Success response indicating if the answer is correct
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isCorrect:
 *                   type: boolean
 *                   description: Whether the submitted answer was correct
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Question already answered"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unauthorized - Invalid token"
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User not found"
 */
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
