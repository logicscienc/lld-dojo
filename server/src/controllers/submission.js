import prisma from "../lib/prisma.js";

export const createSubmission = async (req, res) => {
  try {
    const { attemptId, code, diagram, explanation } = req.body;

    if (!attemptId) {
      return res.status(400).json({
        message: "attemptId is required",
      });
    }

    if (!code && !diagram && !explanation) {
      return res.status(400).json({
        message: "At least one submission field is required",
      });
    }

    const attempt = await prisma.attempt.findUnique({
      where: {
        id: attemptId,
      },
    });

    if (!attempt) {
      return res.status(404).json({
        message: "Attempt not found",
      });
    }

    const submission = await prisma.submission.create({
      data: {
        attempt: {
          connect: {
            id: attemptId,
          },
        },
        code: code || "",
        diagram: diagram || "",
        explanation: explanation || "",
      },
    });

    res.status(201).json(submission);
  } catch (error) {
    console.error("CREATE SUBMISSION ERROR:", error);

    res.status(500).json({
      message: "Failed to create submission",
    });
  }
};