import { Evaluator } from "./evaluator.js";
import { getRubric } from "../rubrics/index.js";
import { checkStructure } from "./structuralChecks.js";

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

export class StructuralEvaluator extends Evaluator {
  async evaluate(submission, problem) {
    const rubric = getRubric(problem.slug);

    if (!rubric) {
      return {
        evaluator: "structural",
        findings: [],
      };
    }

    const content = getSubmissionContent(submission);

    const criteria = [
      ...rubric.requirementCoverage.functional,
      ...rubric.requirementCoverage.bonus,
      ...rubric.responsibilityAndEncapsulation,
      ...rubric.abstractionAndRelationships,
      ...rubric.extensibility,
      ...rubric.couplingAndSimplicity,
      ...rubric.designReasoningAndTradeoffs,
    ];

    const findings = criteria
      .filter(
        (criterion) =>
          criterion.evaluator === "structural" &&
          criterion.check?.type === "structure"
      )
      .map((criterion) => {
        if (!content) {
          return createInsufficientEvidence(criterion);
        }

        const result = checkStructure(
          content,
          criterion.check.signals
        );

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
            result.verdict === "MET"
              ? ""
              : `The submission does not fully satisfy: ${criterion.criterion}`,
          whyItMatters:
            result.verdict === "MET"
              ? ""
              : "This structural requirement supports the expected design.",
          suggestion:
            result.verdict === "MET"
              ? ""
              : `Make the design explicitly address: ${criterion.criterion}`,
        };
      });

    return {
      evaluator: "structural",
      findings,
    };
  }
}