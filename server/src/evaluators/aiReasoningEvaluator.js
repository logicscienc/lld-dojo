import { Evaluator } from "./evaluator.js";
import { getRubric } from "../rubrics/index.js";
import { z } from "zod";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const aiFindingSchema = z.object({
  criterion: z.string(),
  verdict: z.enum([
    "MET",
    "PARTIALLY_MET",
    "NOT_MET",
    "INSUFFICIENT_EVIDENCE",
  ]),
  severity: z.enum([
    "LOW",
    "MEDIUM",
    "HIGH",
    "CRITICAL",
  ]),
  evidence: z.string(),
  problem: z.string(),
  whyItMatters: z.string(),
  suggestion: z.string(),
});

const aiEvaluationSchema = z.object({
  findings: z.array(aiFindingSchema),
});

function buildEvaluationPrompt(input) {
  return `
You are an LLD design evaluator.

Evaluate the learner's submission against the provided problem and rubric.

Your job is to judge the quality of the submitted design, not to invent a reference solution.

IMPORTANT RULES:

1. Evaluate only against the provided rubric criteria.
2. Multiple valid designs are acceptable. Do not require a specific class structure, design pattern, or implementation unless the rubric explicitly requires it.
3. Consider the code, Mermaid diagram, and explanation together.
4. Base every judgment on evidence present in the submission.
5. Do not assume that missing behavior exists.
6. If there is not enough evidence to make a reliable judgment, use INSUFFICIENT_EVIDENCE.
7. PARTIALLY_MET should be used when the submission demonstrates meaningful but incomplete satisfaction of a criterion.
8. MET means the criterion is clearly satisfied by the submitted evidence.
9. NOT_MET means the submission provides sufficient evidence that the criterion is not satisfied.
10. Focus on maintainability, responsibilities, abstraction, coupling, extensibility, simplicity, and design reasoning.
11. Do not reward unnecessary design patterns or extra complexity.
12. Do not penalize a simple design merely because another design could be more sophisticated.
13. Do not prescribe a specific class name, interface name, design pattern, or architecture unless the rubric explicitly requires it.
14. Suggestions should describe the design improvement needed, while allowing multiple valid implementation approaches.
15. Keep evidence specific and grounded in the submission.
16. Suggestions must address the gap in the criterion without prescribing one exact implementation. When suggesting an improvement, describe the required design property or behavior first. You may give implementation examples only as optional examples, and must explicitly make clear that other valid approaches are acceptable.
17. When multiple valid designs could satisfy a criterion, describe the desired property or behavior rather than requiring a specific class, interface, pattern, or architecture.
18. Return JSON only.

PROBLEM:
${JSON.stringify(input.problem, null, 2)}

RUBRIC CRITERIA:
${JSON.stringify(input.rubric, null, 2)}

LEARNER SUBMISSION:
${JSON.stringify(input.submission, null, 2)}

Return an object with this exact structure:

{
  "findings": [
    {
      "criterion": "criterion-id",
      "verdict": "MET | PARTIALLY_MET | NOT_MET | INSUFFICIENT_EVIDENCE",
      "severity": "LOW | MEDIUM | HIGH | CRITICAL",
      "evidence": "Specific evidence from the submission.",
      "problem": "What is wrong or incomplete. Empty string when not applicable.",
      "whyItMatters": "Why this matters for the design. Empty string when not applicable.",
      "suggestion": "A concrete improvement. Empty string when not applicable."
    }
  ]
}

Evaluate every rubric criterion exactly once.
`;
}

export class AIReasoningEvaluator extends Evaluator {
  async evaluate(submission, problem) {
  const rubric = getRubric(problem.slug);

 const aiCriteria = [
  ...rubric.requirementCoverage.functional,
  ...rubric.requirementCoverage.bonus,
  ...rubric.responsibilityAndEncapsulation,
  ...rubric.abstractionAndRelationships,
  ...rubric.extensibility,
  ...rubric.couplingAndSimplicity,
  ...rubric.designReasoningAndTradeoffs,
].filter((criterion) => criterion.evaluator === "ai_reasoning");

  const input = {
    problem: {
      title: problem.title,
      description: problem.description,
      functionalRequirements: problem.functionalRequirements,
      bonusRequirements: problem.bonusRequirements,
    },




    rubric: aiCriteria.map((criterion) => ({
      id: criterion.id,
      criterion: criterion.criterion,
    })),

    submission: {
      code: submission.code,
      diagram: submission.diagram,
      explanation: submission.explanation,
    },
  };

  console.log(JSON.stringify(input, null, 2));
  const prompt = buildEvaluationPrompt(input);

const response = await groq.chat.completions.create({
  model: "openai/gpt-oss-120b",
  temperature: 0,
  max_tokens: 5000,
  response_format: {
    type: "json_object",
  },
  messages: [
    {
      role: "user",
      content: prompt,
    },
  ],
});


const rawContent = response.choices[0].message.content;

let parsedContent;

try {
  parsedContent = JSON.parse(rawContent);
} catch (error) {
  console.error("Invalid AI JSON response:");
  console.error(rawContent);

  throw new Error("AI evaluator returned invalid JSON");
}

const validatedContent = aiEvaluationSchema.parse(parsedContent);

return {
  evaluator: "ai_reasoning",
  findings: validatedContent.findings,
};
}
}