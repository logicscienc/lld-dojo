import { VERDICTS } from "./verdicts.js";

export function createFinding({
  criterion,
  verdict,
  severity = "MEDIUM",
  evidence = "",
  problem = "",
  whyItMatters = "",
  suggestion = "",
}) {
  if (!Object.values(VERDICTS).includes(verdict)) {
    throw new Error(`Invalid verdict: ${verdict}`);
  }

  return {
    criterion,
    verdict,
    severity,
    evidence,
    problem,
    whyItMatters,
    suggestion,
  };
}