export class Evaluator {
  async evaluate(submission, problem) {
    throw new Error("evaluate() must be implemented");
  }

  createResult(evaluator, summary, findings = []) {
    return {
      evaluator,
      summary,
      findings,
    };
  }
}