import prisma from "../lib/prisma.js";

export const createAttempt = async (req, res) => {
  try {
    const { problemId } = req.body;

    if (!problemId) {
      return res.status(400).json({ message: "problemId is required" });
    }

    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
    });

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const attempt = await prisma.attempt.create({
      data: {
        problem: {
          connect: { id: problemId },
        },
      },
    });

    res.status(201).json(attempt);
  } catch (error) {
    console.error("CREATE ATTEMPT ERROR:", error);
    res.status(500).json({ message: "Failed to create attempt" });
  }
};

export const getAttempts = async (req, res) => {
  try {
    const attempts = await prisma.attempt.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        problem: {
          select: {
            title: true,
            slug: true,
          },
        },
        submissions: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
          select: {
            id: true,
            status: true,
            evaluation: {
              select: {
                score: true,
              },
            },
          },
        },
      },
    });

    const formattedAttempts = attempts.map((attempt) => {
  const submission = attempt.submissions[0];

  let status = "IN PROGRESS";

  if (submission?.evaluation) {
    status = "COMPLETED";
  } else if (submission?.status === "SUBMITTED") {
    status = "SUBMITTED";
  } else if (submission?.status === "FAILED") {
    status = "FAILED";
  }

  return {
    ...attempt,
    status,
  };
});

res.json(formattedAttempts);
  } catch (error) {
    console.error("GET ATTEMPTS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch attempts" });
  }
};