export const elevatorRubric = {
  problem: "elevator-system",

  requirementCoverage: {
    functional: [
      {
        id: "request-elevator",
        criterion:
          "The design allows an elevator request to be created and associated with a source floor and destination floor.",
        evaluator: "ai_reasoning",
      },
      {
        id: "floor-movement",
        criterion:
          "The design represents elevator movement between floors and updates the elevator's current floor correctly.",
        evaluator: "structural",
        check: {
          type: "structure",
          signals: {
            methods: ["move", "moveTo"],
            concepts: ["floor"],
          },
        },
      },
      {
        id: "request-handling",
        criterion:
          "The design can accept and process multiple elevator requests while maintaining a clear request lifecycle.",
        evaluator: "ai_reasoning",
      },
      {
  id: "dispatch-strategy",
  criterion:
    "The design supports a pluggable dispatch strategy so the elevator system can change how hall requests are assigned without changing the core elevator workflow.",
  evaluator: "ai_reasoning",
},
      {
        id: "idle-state",
        criterion:
          "The design clearly handles the condition where the elevator has no pending requests.",
        evaluator: "ai_reasoning",
      },
    ],

    bonus: [
      {
        id: "multiple-elevators",
        criterion:
          "The design can support multiple elevators and provides a reasonable way to assign requests between them.",
        evaluator: "ai_reasoning",
      },
      {
        id: "request-strategy",
        criterion:
          "The design allows the request-selection behavior to evolve without requiring major changes to the elevator's core movement logic.",
        evaluator: "ai_reasoning",
      },
    ],
  },

  responsibilityAndEncapsulation: [
    {
      id: "focused-responsibilities",
      criterion:
        "Major components have clear responsibilities for elevators, requests, movement, and request selection rather than one component managing unrelated concerns.",
      evaluator: "ai_reasoning",
    },
    {
      id: "encapsulation",
      criterion:
        "Elevator state and request state are protected behind appropriate operations rather than being freely modified by unrelated components.",
      evaluator: "ai_reasoning",
    },
    {
      id: "clear-ownership",
      criterion:
        "Responsibility for accepting requests, selecting the next request, and moving the elevator is assigned to appropriate components without unnecessary overlap.",
      evaluator: "ai_reasoning",
    },
  ],

  abstractionAndRelationships: [
    {
      id: "domain-abstractions",
      criterion:
        "The design uses appropriate abstractions for important concepts such as elevators, requests, floors, and movement direction.",
      evaluator: "ai_reasoning",
    },
    {
      id: "clear-relationships",
      criterion:
        "Relationships between elevators, requests, floors, and request-selection logic are clear and support the required workflow.",
      evaluator: "ai_reasoning",
    },
    {
      id: "movement-model",
      criterion:
        "The design represents elevator movement and direction in a way that is understandable and consistent with the problem requirements.",
      evaluator: "ai_reasoning",
    },
  ],

  extensibility: [
    {
      id: "elevator-extension",
      criterion:
        "The design can accommodate additional elevators without requiring widespread changes to existing components.",
      evaluator: "ai_reasoning",
    },
    {
      id: "strategy-extension",
      criterion:
        "The design can accommodate changes to request-selection behavior without unnecessarily changing the elevator's core movement responsibilities. Do not require a specific design pattern or interface.",
      evaluator: "ai_reasoning",
    },
  ],

  couplingAndSimplicity: [
    {
      id: "reasonable-coupling",
      criterion:
        "Components interact through clear responsibilities and meaningful domain relationships without relying on publicly exposed mutable state.",
      evaluator: "ai_reasoning",
    },
    {
      id: "appropriate-complexity",
      criterion:
        "The design avoids unnecessary abstractions, patterns, or scheduling logic that make the solution harder to understand without meaningful benefit.",
      evaluator: "ai_reasoning",
    },
  ],

  designReasoningAndTradeoffs: [
    {
      id: "design-decisions",
      criterion:
        "The explanation clearly justifies important decisions about request handling, movement, and elevator responsibilities.",
      evaluator: "ai_reasoning",
    },
    {
      id: "tradeoffs",
      criterion:
        "The explanation identifies meaningful tradeoffs in request scheduling or movement behavior where relevant.",
      evaluator: "ai_reasoning",
    },
  ],
};