export function checkPresence(content, terms) {
  const normalizedContent = content.toLowerCase();

  const found = terms.filter((term) =>
    normalizedContent.includes(term.toLowerCase())
  );

  if (found.length === terms.length) {
    return {
      verdict: "MET",
      evidence: found.join(", "),
    };
  }

  if (found.length > 0) {
    return {
      verdict: "PARTIALLY_MET",
      evidence: found.join(", "),
    };
  }

  return {
    verdict: "NOT_MET",
    evidence: "",
  };
}