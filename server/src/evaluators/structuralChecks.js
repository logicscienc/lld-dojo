export function checkStructure(content, signals) {
  const normalizedContent = content.toLowerCase();

  const methods = signals.methods ?? [];
  const concepts = signals.concepts ?? [];

  const foundMethods = methods.filter((method) => {
  const pattern = new RegExp(`\\b${method}\\s*\\(`, "i");
  return pattern.test(content);
});

  const foundConcepts = concepts.filter((concept) =>
    normalizedContent.includes(concept.toLowerCase())
  );

  const totalSignals = methods.length + concepts.length;
  const foundSignals = foundMethods.length + foundConcepts.length;

  if (foundSignals === totalSignals) {
    return {
      verdict: "MET",
      evidence: [
        foundMethods.length
          ? `Methods: ${foundMethods.join(", ")}`
          : "",
        foundConcepts.length
          ? `Concepts: ${foundConcepts.join(", ")}`
          : "",
      ]
        .filter(Boolean)
        .join("; "),
    };
  }

  if (foundSignals > 0) {
    return {
      verdict: "PARTIALLY_MET",
      evidence: [
        foundMethods.length
          ? `Methods: ${foundMethods.join(", ")}`
          : "",
        foundConcepts.length
          ? `Concepts: ${foundConcepts.join(", ")}`
          : "",
      ]
        .filter(Boolean)
        .join("; "),
    };
  }

  return {
    verdict: "NOT_MET",
    evidence: "",
  };
}