import prisma from "../lib/prisma.js";

export const getProblems = async (req, res) => {
  try {
    const problems = await prisma.problem.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(problems);
  } catch (error) {
    console.error("GET PROBLEMS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch problems",
    });
  }
};

export const getProblemBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const problem = await prisma.problem.findUnique({
      where: {
        slug,
      },
    });

    if (!problem) {
      return res.status(404).json({
        message: "Problem not found",
      });
    }

    res.json(problem);
  } catch (error) {
    console.error("GET PROBLEM ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch problem",
    });
  }
};