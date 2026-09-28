import { Evaluator } from "./evaluator.js";
import { getRubric } from "../rubrics/index.js";
import { checkPresence } from "./checks.js";

function getSubmissionContent(submission) {
  return [
    submission.code,
    submission.diagram,
    submission.explanation,
  ]
    .filter(Boolean)
    .join("\n")
    .trim();
}

function createInsufficientEvidence(criterion) {
  return {
    criterion: criterion.id,
    verdict: "INSUFFICIENT_EVIDENCE",
    severity: "MEDIUM",
    evidence: "",
    problem:
      "The submission does not contain enough information to evaluate this criterion.",
    whyItMatters:
      "A design cannot be evaluated reliably when the required evidence is missing.",
    suggestion:
      "Provide the relevant code, diagram, or explanation for this criterion.",
  };
}

export class RequirementEvaluator extends Evaluator {
  async evaluate(submission, problem) {
    const rubric = getRubric(problem.slug);

    if (!rubric) {
      return {
        evaluator: "requirement",
        findings: [],
      };
    }

    const content = getSubmissionContent(submission);

    const criteria = [
  ...rubric.requirementCoverage.functional,
  ...rubric.requirementCoverage.bonus,
].filter((criterion) => criterion.evaluator === "requirement");

    const findings = criteria.map((criterion) => {
  if (!content) {
    return createInsufficientEvidence(criterion);
  }

  if (
    criterion.evaluator === "requirement" &&
    criterion.check?.type === "presence"
  ) {
    const result = checkPresence(content, criterion.check.terms);

    return {
      criterion: criterion.id,
      verdict: result.verdict,
      severity:
        result.verdict === "NOT_MET"
          ? "HIGH"
          : result.verdict === "PARTIALLY_MET"
          ? "MEDIUM"
          : "LOW",
      evidence: result.evidence,
      problem:
        result.verdict === "NOT_MET"
          ? `The submission does not clearly satisfy: ${criterion.criterion}`
          : result.verdict === "PARTIALLY_MET"
          ? `The submission only partially satisfies: ${criterion.criterion}`
          : "",
      whyItMatters:
        result.verdict === "MET"
          ? ""
          : "This requirement is part of the problem specification.",
      suggestion:
        result.verdict === "MET"
          ? ""
          : `Make the design explicitly address: ${criterion.criterion}`,
    };
  }

  return createInsufficientEvidence(criterion);
});

    return {
      evaluator: "requirement",
      findings,
    };
  }
}





