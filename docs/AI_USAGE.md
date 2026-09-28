# AI Usage

## Overview

AI was used throughout the development of LLD Dojo as an engineering assistant for research, design exploration, implementation support, debugging, and evaluation design.

The final architecture and product decisions were reviewed and adapted during implementation rather than blindly accepting generated suggestions.

The project uses AI in two different ways:

1. **Development-time AI assistance** — used while building the platform.
2. **Runtime AI evaluation** — used by LLD Dojo to evaluate learner submissions through a rubric-based evaluator.

---

## 1. Evaluation Model and Rubric Design

### AI-assisted decision

AI was used to explore how LLD submissions could be evaluated without assuming that there is only one correct class structure.

The main design principle became:

> Multiple designs can be correct if they satisfy the requirements, have clear responsibilities, reasonable coupling, and appropriate extensibility.

This led to a rubric with the following areas:

- Requirement Coverage
- Responsibility & Encapsulation
- Abstraction & Relationships
- Extensibility
- Coupling & Simplicity
- Design Reasoning & Tradeoffs

### Suggestion accepted

AI suggested separating evaluation responsibilities instead of putting all evaluation logic into one large evaluator.

This became:

- `RequirementEvaluator`
- `StructuralEvaluator`
- `AIReasoningEvaluator`

Each evaluator answers a different question:

- **RequirementEvaluator:** Did the submission address the required behavior?
- **StructuralEvaluator:** What can be objectively observed in the submitted structure?
- **AIReasoningEvaluator:** Is the design reasonable, maintainable, extensible, and well-reasoned?

### Why

This separation makes the evaluation pipeline easier to understand and extend. It also prevents the LLM from being responsible for every type of judgment.

---

## 2. Deterministic Checks + LLM Reasoning

### AI-assisted decision

AI was used to explore whether the entire submission should be evaluated by an LLM.

The final design deliberately does not rely entirely on the LLM.

The evaluation pipeline combines:

- deterministic requirement checks
- deterministic structural checks
- LLM-based reasoning

### Suggestion accepted

Simple checks such as the presence of required concepts or methods are handled deterministically where possible.

For example, the structural evaluator can inspect whether expected methods or domain concepts are present.

The LLM is then used for questions that require semantic reasoning, such as:

- responsibility separation
- coupling
- extensibility
- design tradeoffs
- maintainability
- whether the design is unnecessarily complex

### Why

Using an LLM for every check would make the system more expensive, less predictable, and harder to debug.

Deterministic checks provide evidence for objective criteria, while the LLM handles the parts that require interpretation.

---

## 3. Rubric-Based AI Evaluation Prompt

### AI-assisted decision

AI was used to develop the runtime evaluator prompt.

The prompt was designed around the project requirement that multiple valid LLD designs should be accepted.

Important rules were added to prevent the evaluator from:

- requiring one specific class structure
- requiring a specific design pattern
- inventing missing evidence
- treating sophistication as correctness
- penalizing simple designs unnecessarily
- prescribing one exact implementation

The evaluator also uses:

- `MET`
- `PARTIALLY_MET`
- `NOT_MET`
- `INSUFFICIENT_EVIDENCE`

### Suggestion accepted

The `INSUFFICIENT_EVIDENCE` verdict was deliberately added.

If the learner has not provided enough information to evaluate a criterion reliably, the evaluator should not pretend that the criterion is satisfied or violated.

### Why

LLD submissions can be incomplete. A missing explanation or missing diagram should not automatically be interpreted as proof that the underlying design does not exist.

This makes the feedback more evidence-based.

---

## 4. Structured AI Output with Validation

### AI-assisted decision

AI was used to design the runtime response format for the LLM evaluator.

The LLM returns structured JSON findings containing:

- criterion
- verdict
- severity
- evidence
- problem
- why it matters
- suggestion

The response is then validated with Zod before being used by the application.

### Suggestion accepted

The application does not directly trust arbitrary LLM output.

The response is parsed as JSON and validated against a Zod schema.

Invalid JSON or invalid evaluator output causes the evaluation to fail rather than silently storing malformed data.

### Why

The LLM is an external, probabilistic component. Schema validation creates a clear boundary between AI output and application logic.

---

## 5. Scoring Outside the LLM

### AI-assisted decision

AI was used to explore scoring approaches.

The final score is calculated by application code rather than asking the LLM to calculate the final score.

The current mapping is:

- `MET` → 100
- `PARTIALLY_MET` → 50
- `NOT_MET` → 0
- `INSUFFICIENT_EVIDENCE` → excluded from scoring

The final score is calculated from the findings in the backend.

### Why

Arithmetic and aggregation are deterministic operations and do not need an LLM.

Keeping score calculation outside the model also makes the scoring behavior reproducible and easier to test.

---

## 6. AI Suggestions That Were Rejected or Limited

### Requiring specific design patterns

AI-generated evaluation suggestions sometimes leaned toward requiring particular patterns or abstractions.

For example, feedback could suggest introducing:

- a `PaymentMethod` interface
- a particular strategy
- additional product subclasses
- specific state abstractions

### Decision

These suggestions were not automatically accepted.

### Why

LLD Dojo is intended to evaluate design quality rather than pattern memorization.

A design should not receive a lower evaluation simply because it does not use a particular pattern when another simpler design satisfies the requirements.

The evaluator prompt was therefore adjusted to evaluate the required **design property** rather than prescribe one implementation.

For example:

Instead of requiring:

> "Create a PaymentMethod interface."

the evaluator should focus on:

> "The design should provide an appropriate extension point if multiple payment mechanisms are a stated requirement."

This keeps the evaluation open to multiple valid implementations.

---

## 7. AI-Assisted Debugging and Implementation

AI was also used during implementation to help:

- debug Prisma and migration issues
- diagnose API and routing errors
- fix React import issues
- reason about frontend/backend data flow
- structure React pages
- improve the Result page UX
- identify unused imports and implementation mistakes
- verify end-to-end evaluation behavior

These suggestions were tested locally rather than being accepted purely from generated output.

Examples included:

- fixing stale Prisma Client generation after schema changes
- correcting backend route/import issues
- adding the problem-by-slug API
- connecting the Attempt page to submission and evaluation APIs
- adding evaluator ownership to persisted feedback
- displaying evaluator information on the Result page

---

## 8. Frontend Product and UX Decisions

AI was used as a design partner for the frontend because the platform needed a simple practice flow rather than a large dashboard.

The resulting flow is:

```text
Problems
   ↓
Attempt
   ↓
Submit
   ↓
Evaluation
   ↓
Result
   ↓
Review / Retry