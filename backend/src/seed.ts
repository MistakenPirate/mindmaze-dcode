import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const seedQuestions = async () => {
  await prisma.question.createMany({
    data: [
      {
        question: "What is the capital of France?",
        options: ["Paris", "London", "Berlin", "Rome"],
        answer: "Paris",
      },
      {
        question: "What is 2 + 2?",
        options: ["3", "4", "5", "6"],
        answer: "4",
      },
      // Add more questions here
    ],
  });

  console.log("Questions seeded");
};

seedQuestions()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
