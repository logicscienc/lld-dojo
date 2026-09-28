export const parkingLotRubric = {
  problem: "parking-lot",

  requirementCoverage: {
    functional: [
     {
  id: "vehicle-types",
  criterion:
    "The design clearly represents Motorcycle, Car, and Truck as distinct vehicle types.",
  evaluator: "requirement",
  check: {
    type: "presence",
    terms: ["Motorcycle", "Car", "Truck"],
  },
},
      {
  id: "spot-sizes",
  criterion:
    "The design represents Small, Medium, and Large spot sizes and defines a consistent rule where a larger spot can accommodate a smaller vehicle.",
  evaluator: "ai_reasoning",
  
},
     {
  id: "parking-lifecycle",
  criterion:
    "The design represents the parking lifecycle: park(vehicle) creates a ticket, and unpark(ticket) results in a fee.",
  evaluator: "structural",
  check: {
    type: "structure",
    signals: {
      methods: ["park", "unpark"],
      concepts: ["Ticket", "fee"],
    },
  },
},
      {
        id: "availability",
        criterion:
          "The design supports tracking available spots both per floor and across the entire parking lot.",
           evaluator: "ai_reasoning",
      },
      {
        id: "full-lot",
        criterion:
          "The design clearly defines what happens when no suitable parking spot is available.",
           evaluator: "ai_reasoning",
      },
    ],

    bonus: [
      {
        id: "tiered-pricing",
        criterion:
          "The design can represent first-hour-free, then ₹50/hour pricing.",
           evaluator: "ai_reasoning",
      },
      {
        id: "multiple-gates",
        criterion:
          "The design can support multiple entry and exit gates while coordinating parking and exit operations.",
           evaluator: "ai_reasoning",
      },
      {
        id: "reserved-ev-spots",
        criterion:
          "The design can represent reserved EV spots and enforce their eligibility or reservation constraint.",
           evaluator: "ai_reasoning",
      },
    ],
  },

  responsibilityAndEncapsulation: [
    {
      id: "focused-responsibilities",
      criterion:
        "Major domain components have clear and focused responsibilities rather than one component managing unrelated concerns.",
        evaluator: "ai_reasoning",
    },
    {
      id: "encapsulation",
      criterion:
        "Internal state is protected behind appropriate operations or abstractions instead of being freely manipulated by other components.",
        evaluator: "ai_reasoning",
    },
    {
      id: "clear-ownership",
      criterion:
        "Responsibility for parking and spot allocation, ticket lifecycle, and fee calculation is assigned to appropriate components without unnecessary overlap.",
        evaluator: "ai_reasoning",
    },
  ],

  abstractionAndRelationships: [
    {
      id: "domain-abstractions",
      criterion:
        "The design uses appropriate abstractions for important concepts such as vehicles, parking spots, tickets, and pricing behavior.",
        evaluator: "ai_reasoning",
    },
    {
      id: "clear-relationships",
      criterion:
        "Relationships between major domain components are clear and support the required parking workflow.",
        evaluator: "ai_reasoning",
    },
    {
      id: "polymorphism-composition",
      criterion:
        "Inheritance, interfaces, composition, or other relationships are used where they improve the design, without unnecessary abstraction.",
        evaluator: "ai_reasoning",
    },
  ],

  extensibility: [
    {
      id: "vehicle-spot-extension",
criterion:
  "The design can accommodate relevant new vehicle or parking-spot types without widespread changes to existing components. The design should provide some explicit mechanism for representing or determining vehicle/spot compatibility; merely storing a spot size without using it for compatibility is not sufficient. Do not require a specific class, interface, enum, pattern, or architecture.",
        evaluator: "ai_reasoning",
    },
    {
      id: "pricing-extension",
criterion:
  "The design considers how pricing rules could change over time and keeps pricing logic sufficiently separate from unrelated parking responsibilities. A simple pricing implementation is acceptable for the current scope when the submission clearly explains the tradeoff and how it could be extended later. Do not require a specific class, interface, pattern, or architecture.",
        evaluator: "ai_reasoning",
    },
  ],

  couplingAndSimplicity: [
    {
      id: "reasonable-coupling",

criterion:
  "Components interact through clear, limited responsibilities and meaningful domain relationships. Direct references between domain objects are acceptable when they represent real domain relationships. However, components should not rely on or manipulate another component's publicly exposed mutable state when they could use the owning component's behavior instead. Public mutable state that allows bypassing another component's invariants should count as a coupling concern. Do not require interfaces, dependency injection, or any specific design pattern.",
        evaluator: "ai_reasoning",
    },
    {
      id: "appropriate-complexity",
      criterion:
        "The design avoids unnecessary classes, abstractions, patterns, or logic that make the solution harder to understand without providing meaningful benefit.",
        evaluator: "ai_reasoning",
    },
  ],

  designReasoningAndTradeoffs: [
    {
      id: "design-decisions",
      criterion:
        "The explanation clearly justifies important design decisions that affect maintainability, flexibility, or correctness.",
        evaluator: "ai_reasoning",
    },
    {
      id: "tradeoffs",
      criterion:
        "The explanation identifies meaningful tradeoffs where relevant, rather than presenting design choices as universally correct.",
        evaluator: "ai_reasoning",
    },
  ],
};