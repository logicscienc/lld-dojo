export const vendingMachineRubric = {
  problem: "vending-machine",

  requirementCoverage: {
    functional: [
      {
        id: "product-selection",
        criterion:
          "The design allows a user to select a product and handles the case where the selected product is unavailable.",
        evaluator: "ai_reasoning",
      },
      {
        id: "inventory",
        criterion:
          "The design represents product inventory and updates inventory when a product is successfully dispensed.",
        evaluator: "ai_reasoning",
      },
      {
        id: "payment",
        criterion:
          "The design represents payment and does not dispense a product unless sufficient payment has been received.",
        evaluator: "ai_reasoning",
      },
      {
        id: "dispense",
        criterion:
          "The design clearly represents the process of dispensing a selected product after successful payment.",
        evaluator: "structural",
        check: {
          type: "structure",
          signals: {
            methods: ["selectProduct", "dispense"],
            concepts: ["Product"],
          },
        },
      },
      {
        id: "refund",
        criterion:
          "The design defines what happens to inserted money when a transaction cannot be completed or when change is due.",
        evaluator: "ai_reasoning",
      },
    ],

    bonus: [
      {
        id: "multiple-payment-methods",
        criterion:
          "The design can support multiple payment methods without requiring major changes to the vending machine workflow.",
        evaluator: "ai_reasoning",
      },
      {
        id: "maintenance",
        criterion:
          "The design can support inventory replenishment or maintenance operations without interfering with the normal purchasing workflow.",
        evaluator: "ai_reasoning",
      },
    ],
  },

  responsibilityAndEncapsulation: [
    {
      id: "focused-responsibilities",
      criterion:
        "Major components have clear responsibilities for inventory, payment, product selection, and dispensing rather than one component managing unrelated concerns.",
      evaluator: "ai_reasoning",
    },
    {
      id: "encapsulation",
      criterion:
        "Inventory, payment, and transaction state are protected behind appropriate operations rather than being freely mutable by unrelated components.",
      evaluator: "ai_reasoning",
    },
    {
      id: "transaction-ownership",
      criterion:
        "The design clearly assigns responsibility for managing the lifecycle of a purchase transaction.",
      evaluator: "ai_reasoning",
    },
  ],

  abstractionAndRelationships: [
    {
      id: "domain-abstractions",
      criterion:
        "The design uses appropriate abstractions for important concepts such as products, inventory, payment, and transaction state.",
      evaluator: "ai_reasoning",
    },
    {
      id: "state-management",
      criterion:
        "The design clearly represents meaningful transaction states and handles valid and invalid transitions appropriately.",
      evaluator: "ai_reasoning",
    },
    {
      id: "clear-relationships",
      criterion:
        "Relationships between the vending machine, inventory, products, payment, and transaction components are clear.",
      evaluator: "ai_reasoning",
    },
  ],

  extensibility: [
    {
      id: "payment-extension",
      criterion:
        "The design can accommodate additional payment methods without requiring widespread changes to the core vending workflow. Do not require a specific design pattern or interface.",
      evaluator: "ai_reasoning",
    },
    {
      id: "product-extension",
      criterion:
        "The design can accommodate different product types or product-specific behavior without unnecessary changes to the vending machine's core workflow.",
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
        "The design avoids unnecessary abstractions, patterns, or state machinery that do not provide meaningful value for the problem.",
      evaluator: "ai_reasoning",
    },
  ],

  designReasoningAndTradeoffs: [
    {
      id: "design-decisions",
      criterion:
        "The explanation clearly justifies important design decisions affecting correctness, maintainability, or extensibility.",
      evaluator: "ai_reasoning",
    },
    {
      id: "tradeoffs",
      criterion:
        "The explanation identifies meaningful tradeoffs where relevant rather than presenting design choices as universally correct.",
      evaluator: "ai_reasoning",
    },
  ],
};