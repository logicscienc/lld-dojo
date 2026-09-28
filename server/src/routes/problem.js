import express from "express";

import {
  getProblems,
  getProblemBySlug,
} from "../controllers/problem.js";

const router = express.Router();

router.get("/", getProblems);
router.get("/:slug", getProblemBySlug);

export default router;