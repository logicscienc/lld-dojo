
import { describe, it, expect } from "vitest";
import { RequirementEvaluator } from "./requirementEvaluator.js";

describe("RequirementEvaluator", () => {
  const evaluator = new RequirementEvaluator();

  it("returns insufficient evidence for an empty submission", async () => {
    const submission = {
      code: "",
      diagram: "",
      explanation: "",
    };

    const problem = {
      slug: "parking-lot",
    };

    const result = await evaluator.evaluate(submission, problem);

    expect(result.evaluator).toBe("requirement");
    expect(result.findings.length).toBeGreaterThan(0);

    expect(
      result.findings.every(
        (finding) => finding.verdict === "INSUFFICIENT_EVIDENCE"
      )
    ).toBe(true);
  });

  it("marks the vehicle-types requirement as MET when all vehicle types are present", async () => {
    const submission = {
      code: `
        class Motorcycle {}
        class Car {}
        class Truck {}
      `,
      diagram: "",
      explanation: "The parking lot supports three vehicle types.",
    };

    const problem = {
      slug: "parking-lot",
    };

    const result = await evaluator.evaluate(submission, problem);

    expect(result.evaluator).toBe("requirement");
    expect(result.findings.length).toBeGreaterThan(0);

    const vehicleTypesFinding = result.findings.find(
      (finding) => finding.criterion === "vehicle-types"
    );

    expect(vehicleTypesFinding).toBeDefined();
    expect(vehicleTypesFinding.verdict).toBe("MET");
  });

  it("marks the vehicle-types requirement as PARTIALLY_MET when some types are missing", async () => {
    const submission = {
      code: `
        class Motorcycle {}
        class Car {}
      `,
      diagram: "",
      explanation: "",
    };

    const problem = {
      slug: "parking-lot",
    };

    const result = await evaluator.evaluate(submission, problem);

    const vehicleTypesFinding = result.findings.find(
      (finding) => finding.criterion === "vehicle-types"
    );

    expect(vehicleTypesFinding).toBeDefined();
    expect(vehicleTypesFinding.verdict).toBe("PARTIALLY_MET");
  });
});
