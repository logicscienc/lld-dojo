import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import problemRoutes from "./routes/problem.js";
import attemptRoutes from "./routes/attempt.js";
import submissionRoutes from "./routes/submission.js";
import evaluationRoutes from "./routes/evaluation.js";

dotenv.config();

const app = express();


app.use(cors());
app.use(express.json());

app.use("/api/problems", problemRoutes);
app.use("/api/attempts", attemptRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/evaluations", evaluationRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "LLD Dojo API is running",
  });
});



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});