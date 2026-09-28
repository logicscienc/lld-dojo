# LLD Dojo — Research

## 1. What is an LLD Practice Platform?

Low-Level Design (LLD) is the phase of software/system design where a system is broken down into modules, classes, interfaces, data structures, method signatures, and component responsibilities.

An interactive LLD practice platform allows developers to practice these design decisions by:

1. Choosing a design problem
2. Creating a solution
3. Submitting the design
4. Receiving structured feedback
5. Reviewing the result
6. Retrying with an improved design

The goal of LLD Dojo is not to teach one "correct" implementation. It is to help learners practice making and explaining design decisions.

---

## 2. Existing Solutions

### LLD Arena

LLD Arena provides a practice-oriented environment for solving Low-Level Design problems.

Some useful ideas identified during research are:

- **Multiple problems with different difficulty levels** — users can choose problems according to their current experience and gradually attempt harder designs.

- **Code execution and hidden test cases** — executable solutions can be checked against tests that the learner cannot see beforehand.

- **Design rubric** — designs can be evaluated against criteria such as responsibilities, abstraction, coupling, and extensibility rather than only checking whether the implementation matches one expected solution.

- **AI design grader** — AI can provide feedback on design quality, strengths, weaknesses, and possible improvements.

- **UML/class diagrams** — visual representations help learners communicate relationships and responsibilities between classes.

### What LLD Dojo Learns From This

LLD Dojo adopts the ideas of:

- problem-based practice
- design-focused evaluation
- rubric-based feedback
- AI-assisted evaluation
- visual design representation
- retry and review

However, the MVP intentionally avoids building a multi-language compiler, hidden code-execution environment, or complex sandbox.

The primary goal is to evaluate LLD thinking and design decisions within the scope of the assignment.

---

## 3. Evaluation Challenge

LLD is not about finding one perfect class diagram or memorizing design patterns.

Different designs can solve the same problem, and a good design depends on:

- requirements
- responsibilities
- constraints
- expected changes
- coupling
- complexity
- maintainability

A learner might choose a different structure from an expected solution while still producing a maintainable and extensible design.

Therefore, LLD Dojo should not evaluate a submission by comparing it against one fixed "correct" design.

Instead, evaluation should focus on:

- whether requirements are addressed
- whether responsibilities are clear
- whether abstractions are meaningful
- whether coupling is reasonable
- whether the design can handle relevant changes
- whether the design is unnecessarily complex
- whether the learner can explain important design decisions

---

## 4. Research Paper: Rubric-Based LLM Evaluation

A key research source used while designing the evaluation system was:

> **"Rubric Is All You Need: Improving LLM-based Code Evaluation With Question-Specific Rubrics"**

The paper was written by Aditya Pathak, Rachit Gandhi, Vaibhav Uttam, Arnav Ramamoorthy, Pratyush Ghosh, Aaryan Raj Jindal, Shreyash Verma, Aditya Mittal, Aashna Ased, Chirag Khatri, Yashwanth Nakka, Devansh, Jagat Sesh Challa, and Dhruv Kumar.

The paper investigates how question-specific rubrics can improve LLM-based evaluation.

### Important Findings

The research suggests that LLM evaluation can be improved when the evaluator is given a structured rubric that clearly defines the criteria being judged.

Important ideas from the research included:

- using question-specific rubrics
- evaluating criteria explicitly instead of asking for a vague overall judgment
- separating logical evaluation from deterministic correctness where possible
- generating feedback aligned with the evaluation criteria
- considering multiple valid approaches
- avoiding reliance on a single unconstrained overall LLM judgment

The paper also explores different evaluation approaches, including:

- **CRE — Complete Rubric Evaluation**
- **PRE**
- **EME**

### What LLD Dojo Adopted

LLD Dojo adopted the core idea of **rubric-driven evaluation** rather than copying the paper's complete evaluation architecture.

The runtime AI evaluator receives:

- the problem
- the relevant rubric criteria
- learner code
- learner class diagram
- learner design explanation

The AI evaluates the submission against each criterion and returns structured findings.

Each finding contains:

- criterion
- verdict
- severity
- evidence
- problem
- why it matters
- suggestion

### Why a Simpler Approach Was Chosen

The paper explores more resource-intensive evaluation approaches.

For the LLD Dojo MVP, using many separate LLM calls for every criterion would increase:

- latency
- cost
- implementation complexity
- failure points

Instead, LLD Dojo uses a simpler rubric-based AI evaluator while keeping objective checks deterministic.

This provides a practical balance between evaluation quality and MVP complexity.

---

## 5. Product Principle

Two different designs can both be valid when they:

- satisfy the functional requirements
- assign domain responsibilities clearly
- maintain reasonable coupling and encapsulation
- provide meaningful abstractions
- handle relevant changes
- avoid unnecessary complexity

A design should not automatically receive a better evaluation simply because it uses more classes, interfaces, or design patterns.

Patterns are tools rather than requirements.

The evaluator should judge whether a design property is satisfied rather than requiring a specific implementation unless the problem explicitly requires it.

---

## 6. Evaluation Rubric

LLD Dojo evaluates submissions across the following areas.

### 6.1 Requirement Coverage

Questions include:

- Does the design address the functional requirements?
- Does it account for important constraints?
- Does it handle relevant edge cases?

### 6.2 Responsibility and Encapsulation

Questions include:

- Are responsibilities divided logically?
- Does each class or interface have a clear purpose?
- Is state owned by the appropriate component?
- Are implementation details appropriately encapsulated?

### 6.3 Abstraction and Relationships

Questions include:

- Are domain concepts represented clearly?
- Are relationships between components understandable?
- Are abstractions used where they provide meaningful flexibility?
- Are unnecessary abstractions avoided?

### 6.4 Extensibility

Questions include:

- Can the design accommodate relevant requirement changes?
- Can appropriate behavior be extended without major restructuring?
- Does the design avoid unnecessary rigidity?

### 6.5 Coupling and Simplicity

Questions include:

- Are unnecessary dependencies avoided?
- Are components reasonably independent?
- Is the design understandable?
- Is the amount of abstraction appropriate for the problem?

### 6.6 Design Reasoning and Tradeoffs

Questions include:

- Can the learner explain important design decisions?
- Are important alternatives or tradeoffs acknowledged?
- Is the chosen approach justified by the requirements?

---

## 7. Evaluation Architecture

LLD Dojo separates evaluation into three evaluator responsibilities.

### RequirementEvaluator

Responsible for objective/basic requirement coverage.

It uses deterministic checks where appropriate.

Examples include checking whether the submission contains evidence of required concepts or behaviors.

The RequirementEvaluator answers:

> "Did the learner address the required functionality?"

---

### StructuralEvaluator

Responsible for observable structural properties.

It can inspect signals such as:

- expected methods
- domain concepts
- structural relationships
- explicit design elements

For example, it can check whether expected methods or important domain concepts appear in the submitted design.

The StructuralEvaluator answers:

> "What can we objectively observe about the structure of the learner's design?"

It does not attempt to determine the overall quality of the design.

---

### AIReasoningEvaluator

Responsible for semantic design evaluation.

It evaluates areas such as:

- responsibility
- encapsulation
- abstraction
- extensibility
- coupling
- simplicity
- design reasoning
- tradeoffs

The AI is given the rubric criteria and submission evidence instead of being asked for an unrestricted overall score.

The AIReasoningEvaluator answers:

> "Given the available evidence and rubric criteria, is the design reasonable, maintainable, extensible, and appropriately designed?"

---

## 8. Deterministic Checks + AI Reasoning

LLD Dojo uses a hybrid evaluation approach.

### Deterministic Evaluation

Deterministic checks are used for objective signals where possible.

Examples include:

- required terms
- expected methods
- structural concepts

These checks are predictable and easy to test.

For example:

```text
Submission

    ↓

Check required concepts

    ↓

Check expected methods

    ↓

Produce objective findings

### AI Evaluation

AI is used when semantic reasoning is required.

Examples include:

- Whether responsibilities are appropriately divided
- Whether coupling is reasonable
- Whether an abstraction is justified
- Whether the design is unnecessarily complex
- Whether the explanation demonstrates meaningful design reasoning
- Whether relevant tradeoffs have been considered

### Why Hybrid Evaluation?

Using AI for every check would make the system:

- More expensive
- Less predictable
- Harder to debug
- More dependent on model behavior

Using only deterministic checks would make it difficult to evaluate design quality and reasoning.

The hybrid approach combines the strengths of both.

---

## 9. Multiple Valid Solutions

A central requirement of LLD Dojo is that multiple valid designs should be accepted.

The AI evaluator is explicitly instructed not to:

- Require one specific class structure
- Require one specific design pattern
- Invent missing evidence
- Penalize simple designs merely for being simple
- Prescribe one exact implementation when multiple approaches are valid

For example, if a problem requires an extensible dispatch mechanism, the evaluator should judge whether the design provides an appropriate extension point.

It should not automatically require a specific class named `DispatchStrategy` unless the rubric explicitly requires that abstraction.

This prevents LLD Dojo from becoming a pattern-memorization test.

## 10. Evaluation Verdicts

Each rubric criterion can receive one of four verdicts.

### MET

The submission clearly satisfies the criterion based on the available evidence.

### PARTIALLY_MET

The submission demonstrates meaningful progress toward the criterion but has an identifiable gap.

### NOT_MET

There is sufficient evidence that the criterion is not satisfied.

### INSUFFICIENT_EVIDENCE

The submission does not contain enough information to make a reliable judgment.

`INSUFFICIENT_EVIDENCE` is important because missing information should not automatically be interpreted as a design failure.

For example, if the learner does not provide enough information to determine how a component behaves, the evaluator should report insufficient evidence rather than inventing behavior that was never shown.

## 11. Evidence-Based Feedback

LLD Dojo does not only give a score.

Each finding can contain:

- **Evidence** — what was observed in the submission
- **Problem** — what is incomplete or problematic
- **Why it matters** — the design consequence
- **Suggestion** — a possible direction for improvement

This structure makes feedback more useful than a simple numeric score.
The evaluator is instructed to ground judgments in evidence from the learner's:

- Code
- Diagram
- Explanation

A useful finding should answer:

```text
What did you do?

        ↓

What is the issue?

        ↓

Why does it matter?

        ↓

What could be improved?
```

## 12. Structured AI Output

The runtime AI evaluator returns structured JSON.

A finding has the following structure:

```json
{
  "criterion": "reasonable-coupling",
  "verdict": "PARTIALLY_MET",
  "severity": "MEDIUM",
  "evidence": "Specific evidence from the submission.",
  "problem": "What is incomplete or problematic.",
  "whyItMatters": "Why this matters for the design.",
  "suggestion": "A possible improvement."
}
```

### Supported Verdicts

The supported verdicts are:

```text
MET
PARTIALLY_MET
NOT_MET
INSUFFICIENT_EVIDENCE
```

### Supported Severities

The supported severities are:

```text
LOW
MEDIUM
HIGH
CRITICAL
```

The application validates the response using Zod before storing it.

This creates a boundary between probabilistic AI output and application logic.

If the model returns invalid JSON or an invalid structure, the evaluation fails instead of silently storing malformed data.

## 13. Scoring

The final score is calculated by application code rather than by the LLM.

Current mapping:

| Verdict | Score |
|---|---:|
| MET | 100 |
| PARTIALLY_MET | 50 |
| NOT_MET | 0 |
| INSUFFICIENT_EVIDENCE | Excluded |

The score is calculated from the evaluator findings after they have been validated.

### Why Score Outside the LLM?

Arithmetic and aggregation are deterministic operations.

Keeping score calculation outside the LLM makes scoring:

- reproducible
- testable
- easier to change
- independent of model behavior

The LLM is therefore responsible for evaluating criteria, while the application is responsible for calculating the final score.

---

## 14. What Makes Feedback Useful?

LLD Dojo should help learners understand:

1. What they did well
2. What problem exists
3. Why it matters
4. How the design could be improved

Useful feedback considers:

- requirement coverage
- responsibility separation
- encapsulation
- coupling
- abstraction
- extensibility
- complexity
- design reasoning
- tradeoffs

When multiple approaches are valid, the feedback should describe the desired design property rather than presenting one implementation as the only correct answer.

For example, instead of saying:

> "You must create a `PaymentStrategy` class."

the evaluator should explain the underlying design requirement:

> "The design should provide an appropriate extension point if multiple payment mechanisms are part of the problem requirements."

This allows multiple valid implementations.

---

## 15. Submission Format

LLD Dojo allows learners to submit three parts of their solution.

### Code

Represents the implementation of the designed system.

### UML/Class Diagram

Represents:

- classes
- interfaces
- relationships
- responsibilities

### Design Explanation

Explains:

- design decisions
- responsibilities
- abstractions
- tradeoffs
- reasons for choosing particular approaches

These three parts provide different views of the same solution:

```text
Code        → Implementation

Diagram     → Structure

Explanation → Reasoning
```

## 16. Evaluation Flow

The implemented evaluation flow is:

```text
Learner Submission

        ↓

RequirementEvaluator

        ↓

StructuralEvaluator

        ↓

AIReasoningEvaluator

        ↓

Combine Findings

        ↓

Validate Findings

        ↓

Calculate Score

        ↓

Persist Evaluation

        ↓

Result Page
```

## 17. Evaluation Data Model

The evaluation system stores the results of the evaluation rather than only returning them temporarily.

The main evaluation entities are:

```text
Submission
    │
    └── Evaluation
          │
          └── Feedback[]
```

Each feedback record contains:

- evaluator
- criterion
- verdict
- severity
- evidence
- problem
- whyItMatters
- suggestion

The `evaluator` field identifies whether the finding came from:

- `requirement`
- `structural`
- `ai_reasoning`

This allows the Result page to show how different evaluation layers contributed to the review.

## 18. Handling Evaluation Failures

Evaluation may fail because:

- the AI service is unavailable
- the model returns invalid output
- a network/API request fails
- an unexpected application error occurs

The learner's submission should not be lost because of an evaluation failure.

The intended lifecycle is:

```text
Submission
    ↓
Evaluation
    ↓
Completed
   or
Failed → Retry
```

The submission and evaluation are treated as separate concerns so that an evaluation failure does not require the learner to recreate their design.

The architecture also keeps the evaluation service separate from the submission creation flow, making it possible to retry evaluation independently in the future.

---

## 19. Database and Persistence

LLD Dojo uses PostgreSQL with Prisma.

During early development, the application used a local PostgreSQL database.

The database was later moved to Neon PostgreSQL for hosted persistence while Prisma remained responsible for database access and schema management.

The main entities are:

- `Problem`
- `Attempt`
- `Submission`
- `Evaluation`
- `Feedback`

Relationships include:

```text
Problem
   ↓
Attempt
   ↓
Submission
   ↓
Evaluation
   ↓
Feedback
```

The application does not execute learner-submitted code on the server.

This avoids the security and infrastructure complexity of arbitrary code execution.

---

## 20. Existing Solution vs LLD Dojo

Research showed that a full LLD platform could include:

- code execution
- hidden tests
- multiple programming languages
- complex diagram editors
- authentication
- leaderboards
- collaboration
- analytics

These features were intentionally excluded from the MVP.

### MVP Focus

LLD Dojo focuses on:

- LLD problems
- code submission
- class diagrams
- design explanations
- rubric-based evaluation
- deterministic checks
- AI reasoning
- useful feedback
- evaluation history
- retry/review

This keeps the implementation small enough to focus on the core learning experience.

---

## 21. AI-Assisted Development

AI was also used during development as an engineering assistant.

Examples include:

- exploring the product and evaluation architecture
- researching LLD evaluation approaches
- designing the rubric structure
- designing evaluator responsibilities
- developing the AI evaluator prompt
- debugging Prisma migrations
- debugging Express routes
- debugging React issues
- improving the Result page UX
- reasoning about frontend/backend data flow
- reviewing implementation decisions

AI-generated suggestions were tested and adapted during implementation rather than being accepted blindly.

A detailed record of development-time AI usage is maintained separately in `AI_USAGE.md`.

---

## 22. Research-Driven Design Decisions

The research directly influenced several implementation decisions.

### Decision 1: Use Question-Specific Rubrics

**Research insight:**

LLM evaluation becomes more structured when evaluation criteria are explicitly defined.

**Implementation:**

Each LLD problem has its own rubric containing criteria relevant to that problem.

### Decision 2: Evaluate Criteria Individually

**Research insight:**

A structured rubric provides clearer evaluation than asking an LLM for one unrestricted judgment.

**Implementation:**

The AI evaluator receives individual rubric criteria and returns one finding per criterion.

### Decision 3: Separate Deterministic and Semantic Evaluation

**Research insight:**

Not every evaluation decision needs to be made by an LLM.

**Implementation:**

Requirement and structural signals are checked deterministically where possible, while semantic design quality is evaluated by AI.

### Decision 4: Keep Arithmetic Outside the LLM

**Research insight:**

Deterministic operations should not depend on probabilistic model output.

**Implementation:**

The backend calculates the final score from validated verdicts.

### Decision 5: Support Multiple Valid Solutions

**Research insight:**

Evaluation should be aligned with the rubric rather than with one expected implementation.

**Implementation:**

The evaluator prompt explicitly prevents requiring specific patterns or class structures unless the rubric requires them.

### Decision 6: Use Evidence-Based Findings

**Research insight:**

Rubric-aligned feedback should explain why a criterion was judged in a particular way.

**Implementation:**

Each finding stores evidence, problem, impact, and suggestion.

---

## 23. Limitations and Future Improvements

The current MVP intentionally has several limitations.

### AI Evaluation

LLM evaluation can still produce:

- overly prescriptive suggestions
- incorrect interpretations
- inconsistent judgments
- recommendations that introduce unnecessary abstractions

Future improvements could include:

- stronger rubric-specific prompts
- evaluator calibration using known submissions
- evaluation consistency tests
- multiple evaluation passes for high-value criteria
- human review for disputed results

### Deterministic Evaluation

The current deterministic checks rely on relatively simple signals.

Future versions could perform deeper structural analysis without executing arbitrary code.

### Evaluation History

The platform currently stores attempts and evaluations, but a richer history experience could compare multiple submissions for the same problem.

### Retry Workflow

The result page can support reviewing and retrying, while a future version could create explicit versioned submissions and compare improvements across attempts.

---

## 24. Research Conclusion

The research led to several important product and engineering decisions.

### Decision 1: Do Not Require One Correct Design

LLD problems can have multiple valid solutions.

### Decision 2: Use Question-Specific Rubrics

Evaluation criteria should be explicit rather than relying on an unrestricted LLM judgment.

### Decision 3: Separate Evaluation Responsibilities

Requirement coverage, structural evidence, and semantic reasoning should not all be handled by one mechanism.

### Decision 4: Combine Deterministic Checks with AI

Objective signals should be handled deterministically where possible, while AI handles semantic reasoning.

### Decision 5: Keep Scoring Outside the LLM

Scores should be calculated deterministically from validated findings.

### Decision 6: Provide Evidence-Based Feedback

Learners should understand what was observed, why it matters, and how they might improve.

### Decision 7: Avoid Unnecessary Complexity

The MVP should not introduce code execution, queues, complex authentication, or distributed architecture when they do not directly improve the core learning experience.

### Final Principle

LLD Dojo is designed around the idea that:

> Good LLD evaluation should assess design decisions and reasoning, not whether a learner reproduced one predetermined solution.

## 25. References

1. LLD Arena — GitHub Repository  
   https://github.com/mightbeanshuu/lld-arena

2. Pathak, A., Gandhi, R., Uttam, V., et al.  
   "Rubric Is All You Need: Improving LLM-based Code Evaluation With Question-Specific Rubrics."  
   arXiv:2503.23989  
   https://arxiv.org/abs/2503.23989

3. Any other sources used during the research process.