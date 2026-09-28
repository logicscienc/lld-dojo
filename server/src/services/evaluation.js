import { RequirementEvaluator } from "../evaluators/requirementEvaluator.js";
import { StructuralEvaluator } from "../evaluators/structuralEvaluator.js";
import { AIReasoningEvaluator } from "../evaluators/aiReasoningEvaluator.js";

const evaluators = [
  new RequirementEvaluator(),
  new StructuralEvaluator(),
  new AIReasoningEvaluator(),
];

export const evaluateSubmission = async (submission, problem) => {
  const results = [];

  for (const evaluator of evaluators) {
    const result = await evaluator.evaluate(submission, problem);
    results.push(result);
  }

  return results;
};