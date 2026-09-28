# LLD Dojo — Design Note

## 1. Core User Flow

Home → Problems → Choose Problem → Read Requirements → Start Attempt → Create Design → Submit → Evaluation → Feedback → Review

The MVP focuses on the core learning loop of practicing a problem, submitting a design, receiving structured feedback, and reviewing the result.

A future version can extend this flow with explicit retry and submission comparison.

---

## 2. Submission

A learner can submit three parts:

1. **Code** — the implementation of the design.

2. **Class Diagram** — a Mermaid class diagram showing classes, interfaces, and relationships.

3. **Explanation** — a short explanation of the design decisions and responsibilities.

A submission is associated with a specific problem through an attempt.

The submitted Mermaid source is stored so that the diagram can be rendered again when viewing the submission.

---

## 3. Attempt

An attempt represents one try by a learner to solve a particular problem.

An attempt can contain one or more submissions over time. This allows the platform to preserve previous work and evaluations if multiple submissions are created for the same problem.

The attempt keeps track of the problem being solved and groups the learner's submissions for that problem.

Authentication and persistent user accounts are intentionally outside the MVP scope, so attempts are not currently associated with a `User` entity.

---

## 4. Evaluation Lifecycle

After a learner submits a solution, the submission moves through these states:

`SUBMITTED → EVALUATING → COMPLETED`

If evaluation fails:

`SUBMITTED → EVALUATING → FAILED`

A failed evaluation does not delete the submission. The submission remains stored so that the evaluation can be investigated or retried in a future version.

The evaluation combines deterministic checks with AI-based design feedback.

---

## 5. Evaluation Responsibilities

The evaluation system uses separate evaluators for different types of checks:

- **Requirement Evaluator** — checks whether the submission addresses the required functionality and important constraints.

- **Structural Evaluator** — checks objective and observable parts of the submission such as expected methods, domain concepts, and other structural signals defined by the problem rubric.

- **AI Reasoning Evaluator** — evaluates design reasoning, responsibilities, coupling, abstraction, extensibility, simplicity, and tradeoffs.

The results from these evaluators are combined into the final evaluation and feedback shown to the learner.

This separation prevents one evaluation mechanism from being responsible for every type of judgment.

---

## 6. Core Domain Objects

The main domain objects in LLD Dojo are:

- **Problem** — represents an LLD problem that can be practiced.

- **Attempt** — represents a learner's attempt at a problem.

- **Submission** — represents the code, diagram, and explanation submitted for an attempt.

- **Evaluation** — represents the evaluation performed on a submission.

- **Feedback** — represents the useful feedback generated from an evaluation.

These objects represent the main concepts in the platform and form the foundation of the backend design.

A persistent `User` entity is intentionally not included in the MVP because authentication and user management are out of scope.

---

## 7. Domain Relationships

The main relationships are:

- A **Problem** can have many **Attempts**.

- An **Attempt** belongs to one **Problem**.

- An **Attempt** can have multiple **Submissions**.

- A **Submission** belongs to one **Attempt**.

- A **Submission** can have one **Evaluation**.

- An **Evaluation** can contain multiple **Feedback** items.

The current MVP does not maintain a persistent relationship between attempts and user accounts because authentication is outside the scope of the assignment.

This structure allows the platform to preserve previous submissions and feedback while keeping the core domain simple.

---

## 8. MVP Problems

The initial version of LLD Dojo will contain three problems:

1. **Parking Lot** — focuses on entities, responsibilities, vehicle types, parking strategies, and fee calculation.

2. **Vending Machine** — focuses on state, inventory, transactions, and handling different machine states.

3. **Elevator System** — focuses on responsibilities, request handling, elevator state, and scheduling decisions.

The problem model is designed so that more LLD problems can be added later without changing the core platform architecture.

Each problem can define its own requirements, concepts, rubric criteria, hints, and evaluation signals.

---

## 9. Evaluator Architecture

The evaluation system uses a common `Evaluator` interface.

Different evaluators implement this interface:

- `RequirementEvaluator`

- `StructuralEvaluator`

- `AIReasoningEvaluator`

Each evaluator receives the submission and problem context and returns evaluation findings.

A separate evaluation service coordinates these evaluators and combines their results into the final evaluation.

This makes the evaluation system extensible because new evaluator types can be added later without changing the existing evaluator implementations.

---

## 10. Evaluator Interface

Each evaluator follows the same basic contract:

```text
Evaluator

├── evaluate(submission, problem)
│
└── returns evaluation findings
```

The common contract allows the evaluation flow to treat deterministic and AI-based evaluators consistently.

The evaluators can use different internal strategies while returning findings in a common structure.

---

## 11. Evaluation Result

The final evaluation contains:

- **Score** — an overall score representing the evaluation findings.

- **Summary** — a summary of the evaluation result.

- **Findings** — specific design problems, missing requirements, or satisfied criteria.

- **Evaluator Results** — findings produced by the individual evaluators.

Each finding contains evidence and, when applicable, a problem description, why it matters, and a suggestion.

The result should explain the reasoning behind the feedback instead of only showing a score.

The current MVP calculates the score in application code from validated evaluator verdicts.

---

## 12. Feedback Structure

Each feedback item contains:

- **Evaluator** — identifies which evaluation layer produced the finding, such as `requirement`, `structural`, or `ai_reasoning`.

- **Criterion** — the rubric criterion being evaluated.

- **Verdict** — the result of the evaluation, such as `MET`, `PARTIALLY_MET`, `NOT_MET`, or `INSUFFICIENT_EVIDENCE`.

- **Severity** — how important the issue is.

- **Evidence** — what was observed in the learner's submission.

- **Problem** — what is wrong, incomplete, or missing.

- **Why it matters** — why the issue affects the design.

- **Suggestion** — a possible direction for improvement.

This structure makes feedback actionable instead of giving the learner only a score or a generic explanation.

---

## 13. Retry and History

The current MVP stores attempts and submissions so previous work can be preserved.

A future retry workflow can create a new submission for the same attempt while keeping previous submissions and evaluations available in the attempt history.

This would allow the learner to compare earlier and newer solutions and understand how their design improves over time.

The current implementation focuses on storing and reviewing evaluation results; explicit retry actions can be added without changing the core submission and evaluation model.

---

## 14. Backend Architecture

The backend follows a simple monolithic structure:

```text
Routes
  ↓
Application / Evaluation Logic
  ↓
Evaluators
  ↓
Prisma
  ↓
PostgreSQL
```

The application intentionally avoids unnecessary architectural layers for the MVP.

Routes handle HTTP requests, application logic coordinates the relevant operations, evaluator classes perform evaluation, and Prisma handles database access.

This keeps the backend small and appropriate for the scope of the assignment.

---

## 15. API Responsibilities

The backend provides APIs for the main learner actions:

- **Problems** — list available problems and retrieve a specific problem.

- **Attempts** — start an attempt for a problem and retrieve attempt information.

- **Submissions** — create and retrieve submissions for an attempt.

- **Evaluation** — retrieve evaluation results for a submission and execute the evaluation flow.

The evaluation architecture also keeps evaluation logic separate from submission creation so that evaluation can be retried independently in a future version.

The APIs use REST and return JSON responses.

The frontend communicates with the backend through these APIs rather than directly accessing the database.

---

## 16. Database Model

The main database tables are:

- `Problem`

- `Attempt`

- `Submission`

- `Evaluation`

- `Feedback`

The relationships follow the domain model:

```text
Problem 1 ──── * Attempt

Attempt 1 ──── * Submission

Submission 1 ──── 1 Evaluation

Evaluation 1 ──── * Feedback
```

The database uses PostgreSQL with Prisma.

The application initially used a local PostgreSQL database during development and was later moved to Neon PostgreSQL for hosted persistence.

---

## 17. Submission States

A submission can have one of the following states:

- `DRAFT` — the learner is still working on the submission.

- `SUBMITTED` — the learner has submitted the solution.

- `EVALUATING` — the evaluation is currently running.

- `COMPLETED` — evaluation finished successfully.

- `FAILED` — evaluation could not be completed.

The state is stored with the submission so that the frontend can show the learner what is currently happening.

The status also allows the backend to distinguish a submitted design from one that has already completed or failed evaluation.

---

## 18. Diagram Representation

LLD Dojo uses Mermaid for class diagrams.

The learner enters Mermaid class-diagram syntax as part of the submission. The frontend renders the syntax as a visual diagram.

This avoids building a custom diagram editor while still allowing learners to communicate classes, interfaces, attributes, methods, and relationships.

The submitted Mermaid source is also stored so the diagram can be rendered again when viewing previous submissions.

The MVP does not require a custom graphical diagram editor.

---

## 19. AI Reasoning Evaluator

The AI evaluator reviews the learner's design from a reasoning and design-quality perspective.

It receives:

- Problem requirements

- Learner's code

- Mermaid class diagram

- Learner's design explanation

It evaluates areas such as:

- Responsibilities

- Encapsulation

- Coupling

- Abstraction

- Extensibility

- Simplicity

- Design decisions

- Tradeoffs

The AI returns structured feedback rather than free-form text so that the backend can validate and store the result consistently.

The AI evaluator is not the only source of evaluation. Objective checks are handled by deterministic evaluators where possible.

The AI evaluator is also instructed to support multiple valid designs rather than requiring one specific class structure or design pattern unless the rubric explicitly requires it.

---

## 20. AI Failure Handling

The AI evaluator may fail because of a timeout, API error, rate limit, invalid AI response, or another unexpected application error.

When this happens:

1. The original submission remains stored.

2. The submission can be marked as `FAILED`.

3. The error can be logged for debugging.

4. A future retry workflow can execute the evaluation again.

5. A failed AI evaluation must not create or overwrite an incomplete evaluation result.

This keeps the learner's work safe and makes the evaluation process recoverable.

The separation between submission storage and evaluation processing means that an evaluation failure does not require the learner to recreate their design.

---

## 21. Validation

The backend validates incoming data before processing it.

Validation includes:

- Required submission fields must be present.

- Code and explanation cannot be empty when submitting.

- A submission must belong to an existing attempt.

- An attempt must belong to the selected problem.

- Evaluation requests must reference an existing submission.

Zod is used for structured validation where appropriate so invalid data is rejected before it reaches the relevant application logic.

Mermaid content is stored and rendered by the frontend. Rendering failures should be handled by the frontend rather than treated as arbitrary code execution on the backend.

---

## 22. Security Considerations

The MVP follows basic security practices:

- API keys and secrets are stored in environment variables.

- AI API keys are never exposed to the frontend.

- User input is validated on the backend.

- Database queries are performed through Prisma rather than constructing raw SQL from user input.

- Code submitted by learners is not executed on the server in the MVP.

- CORS is used to control frontend access and can be configured appropriately for production.

Authentication and authorization are intentionally kept outside the MVP scope so that the main focus remains on the LLD practice and evaluation experience.

Because learner-submitted code is not executed, the MVP avoids the security and infrastructure complexity of arbitrary code execution.

---

## 23. Out of Scope for MVP

The following features are not implemented in the MVP:

- Multi-language code execution.

- Hidden test-case execution.

- Real-time collaborative editing.

- Custom drag-and-drop diagram editor.

- Complex authentication and user management.

- Microservices or distributed architecture.

- Background job queues.

- Advanced analytics and leaderboards.

These features may be useful in a larger version of the platform, but excluding them keeps the MVP focused on LLD practice, submission, evaluation, feedback, and review.

The MVP intentionally favors a simple monolithic architecture over infrastructure that does not directly improve the core learning experience.

---

## 24. System Architecture

```text
┌──────────────────────────┐
│       React Client       │
│   Tailwind + Mermaid     │
└────────────┬─────────────┘
             │
             │ REST / JSON
             ▼
┌──────────────────────────┐
│     Express Server       │
├──────────────────────────┤
│ Routes                   │
│ Application Logic        │
│ Evaluation Service       │
│ Evaluators               │
└────────────┬─────────────┘
             │
       ┌─────┴─────┐
       │           │
       ▼           ▼
┌────────────┐ ┌──────────────┐
│ PostgreSQL │ │   Groq API   │
│  + Prisma  │ │ AI Evaluator │
└────────────┘ └──────────────┘
```

The React client communicates with the Express server through REST APIs.

The Express server coordinates problem, attempt, submission, and evaluation operations.

The evaluation service runs the deterministic and AI-based evaluators.

Prisma provides database access to PostgreSQL, while the AI reasoning evaluator communicates with the Groq API.

---

## 25. Design Conclusion

LLD Dojo uses a simple monolithic architecture with a React frontend, Express backend, and PostgreSQL database.

The domain is centered around problems, attempts, submissions, evaluations, and feedback.

The evaluation system uses a common evaluator contract so deterministic checks and AI reasoning can remain separate and new evaluation strategies can be added later.

The design intentionally avoids unnecessary infrastructure such as arbitrary code execution, background queues, microservices, complex authentication, and distributed architecture.

The MVP focuses on the core learning loop:

**Practice → Submit → Evaluate → Understand → Review**

The architecture is designed so that future capabilities such as explicit retry workflows, richer evaluation history, deeper structural analysis, and authentication can be added without fundamentally changing the core domain model.
