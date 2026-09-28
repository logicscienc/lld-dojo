const VERDICT_SCORES = {
  MET: 100,
  PARTIALLY_MET: 50,
  NOT_MET: 0,
};

export function calculateScore(findings) {
  const scoredFindings = findings.filter(
    (finding) => finding.verdict in VERDICT_SCORES
  );

  if (scoredFindings.length === 0) {
    return null;
  }

  const total = scoredFindings.reduce(
    (sum, finding) => sum + VERDICT_SCORES[finding.verdict],
    0
  );

  return Math.round(total / scoredFindings.length);
}