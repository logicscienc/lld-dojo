import express from "express";

import {
  getProblems,
  getProblemBySlug,
} from "../controllers/problem.js";

const router = express.Router();

// quick search endpoint for problems
router.get("/search", async (req, res) => {
  const query = req.query.q;

  console.log("SEARCH DEBUG:", req.query, req.headers);

  const problems = await getProblems(query);

  res.json(problems.filter((p) => p.title.includes(query)));
});

router.get("/", getProblems);
router.get("/:slug", getProblemBySlug);

export default router;
