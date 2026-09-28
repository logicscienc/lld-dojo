
import express from "express";
import { evaluateSubmission } from "../services/evaluation.js";
import prisma from "../lib/prisma.js";
import { calculateScore } from "../services/score.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { submission, problem } = req.body;

    if (!submission || !problem?.slug) {
      return res.status(400).json({
        error: "submission and problem.slug are required",
      });
    }

    const fullProblem = await prisma.problem.findUnique({
      where: {
        slug: problem.slug,
      },
    });

    if (!fullProblem) {
      return res.status(404).json({
        error: "Problem not found",
      });
    }

    const results = await evaluateSubmission(
      submission,
      fullProblem
    );

    const allFindings = results.flatMap((result) =>
  (result.findings ?? []).map((finding) => ({
    ...finding,
    evaluator: result.evaluator,
  }))
);

    const score = calculateScore(allFindings);

    const savedEvaluation = await prisma.evaluation.upsert({
      where: {
        submissionId: submission.id,
      },
      update: {
        score,
        feedback: {
          deleteMany: {},
          create: allFindings.map((finding) => ({
             evaluator: finding.evaluator,
            criterion: finding.criterion,
            verdict: finding.verdict,
            severity: finding.severity,
            evidence: finding.evidence,
            problem: finding.problem,
            whyItMatters: finding.whyItMatters,
            suggestion: finding.suggestion,
          })),
        },
      },
      create: {
        submissionId: submission.id,
        score,
        feedback: {
          create: allFindings.map((finding) => ({
            evaluator: finding.evaluator,
            criterion: finding.criterion,
            verdict: finding.verdict,
            severity: finding.severity,
            evidence: finding.evidence,
            problem: finding.problem,
            whyItMatters: finding.whyItMatters,
            suggestion: finding.suggestion,
          })),
        },
      },
      include: {
        feedback: true,
      },
    });

    res.json({
      evaluation: savedEvaluation,
      results,
    });
  } catch (error) {
    console.error("Evaluation failed:", error);

    res.status(500).json({
      error: "Evaluation failed",
    });
  }
});


router.get("/:submissionId", async (req, res) => {
  try {
    const { submissionId } = req.params;

    const evaluation = await prisma.evaluation.findUnique({
  where: {
    submissionId,
  },
  include: {
    feedback: true,
    submission: {
      include: {
        attempt: {
          include: {
            problem: true,
          },
        },
      },
    },
  },
});

    if (!evaluation) {
      return res.status(404).json({
        message: "Evaluation not found",
      });
    }

    res.json(evaluation);
  } catch (error) {
    console.error("GET EVALUATION ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch evaluation",
    });
  }
});

export default router;

