# LLD Dojo

LLD Dojo is a focused Low-Level Design practice platform built as part of the **LLD Practice Platform — 2-Day Engineering Assignment**.

The platform allows a learner to:

**Choose a problem → Design a solution → Submit → Get evaluated → Review feedback → View previous submissions**

The goal is to provide useful and explainable feedback on LLD design decisions rather than expecting one predefined solution.

---

## Features

- Practice LLD problems with clear requirements
- Submit a combination of:
  - Code
  - Mermaid class diagram
  - Design explanation
- Track submission status
- Receive structured, evidence-backed feedback
- Evaluate submissions using multiple evaluation layers
- Store evaluation history
- Review previous submissions and evaluations
- Support multiple valid design approaches

### Current Problems

- Parking Lot
- Vending Machine
- Elevator System

---

## Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Mermaid

### Backend

- Node.js
- Express.js
- Zod
- Prisma
- PostgreSQL

### AI Evaluation

- Groq API
- `openai/gpt-oss-120b`

The AI evaluator is used for design reasoning that is difficult to evaluate reliably using deterministic checks alone.

---

## Project Structure

```text
lld-dojo/
├── client/
│   └── React frontend
│
├── server/
│   ├── src/
│   │   ├── evaluators/
│   │   ├── routes/
│   │   ├── services/
│   │   └── ...
│   └── prisma/
│
├── docs/
│   ├── RESEARCH.md
│   ├── DESIGN.md
│   └── AI_USAGE.md
│
└── README.md
```

Setup
Prerequisites

Make sure the following are installed:

Node.js
npm
PostgreSQL database

A PostgreSQL-compatible database such as Neon can also be used.

1. Clone the Repository
git clone https://github.com/logicscienc/lld-dojo.git
cd lld-dojo
2. Install Dependencies

Install frontend dependencies:

cd client
npm install

Install backend dependencies:

cd ../server
npm install
3. Configure Environment Variables

Create a .env file inside the server directory.

Example:

DATABASE_URL="your-postgresql-connection-string"
DIRECT_URL="your-direct-postgresql-connection-string"
GROQ_API_KEY="your-groq-api-key"
PORT=5000

Do not commit the .env file to the repository.

4. Setup the Database

From the server directory:

npx prisma generate

Run the database migrations:

npx prisma migrate deploy

For local development when creating new migrations:

npx prisma migrate dev
Running the Project

The frontend and backend run separately.

Start the Backend

From the server directory:

npm run dev

The API runs on:

http://localhost:5000
Start the Frontend

Open another terminal and go to the client directory:

cd client
npm run dev

Vite will provide the local frontend URL in the terminal.

Evaluation Approach

LLD Dojo uses a hybrid evaluation approach.

The evaluation is divided into three layers:

1. Requirement Evaluator

Checks whether the submission addresses the functional requirements of the problem using deterministic checks where possible.

2. Structural Evaluator

Checks visible structural signals such as classes, methods, concepts, and other design evidence.

3. AI Reasoning Evaluator

Uses an LLM to evaluate design qualities such as:

Responsibility and encapsulation
Abstraction and relationships
Extensibility
Coupling and simplicity
Design reasoning and trade-offs

The evaluator is designed to allow multiple valid solutions instead of requiring a single reference architecture.

Evaluation Feedback

Each finding contains:

Evaluator
Criterion
Verdict
Severity
Evidence
Problem
Why it matters
Suggestion

The possible verdicts are:

MET
PARTIALLY_MET
NOT_MET
INSUFFICIENT_EVIDENCE

INSUFFICIENT_EVIDENCE prevents the evaluator from assuming that an unshown design element exists.

The final score is calculated by application code from validated evaluator results rather than being generated directly by the LLM.

Submission Lifecycle

A submission follows this lifecycle:

DRAFT
  ↓
SUBMITTED
  ↓
EVALUATING
  ↓
COMPLETED

If evaluation fails:

EVALUATING
  ↓
FAILED

The original submission is retained when evaluation fails.

Key Design Decisions
Hybrid Evaluation

Deterministic checks are used where requirements can be checked reliably. LLM evaluation is used for higher-level design reasoning.

This avoids relying entirely on an LLM while still allowing semantic evaluation of design quality.

Multiple Valid Solutions

The evaluator works against rubric criteria rather than a single expected implementation.

A learner can use different class structures, abstractions, or design approaches as long as they satisfy the underlying requirements.

Structured Feedback

The system does not rely only on a numerical score. Findings include evidence, the identified problem, why it matters, and a suggested improvement.

Simple Monolith

The project uses a monolithic React + Express + PostgreSQL architecture.

Microservices, queues, and distributed infrastructure were intentionally avoided because they are unnecessary for the MVP.

No Arbitrary Code Execution

The MVP evaluates submitted design evidence rather than executing arbitrary learner code. This avoids sandboxing and security complexity while keeping the focus on LLD design.

Limitations

The current prototype has several intentional limitations:

Deterministic structural checks are relatively simple.
LLM evaluation can be imperfect or inconsistent.
There is no user authentication.
There is no arbitrary code execution or hidden test system.
Retry and deeper submission comparison can be expanded further.
Evaluation is currently synchronous from the application's perspective.
The MVP does not include analytics, leaderboards, or real-time collaboration.

These limitations were kept within the scope of the two-day assignment.

Documentation

More detailed project documentation is available in the docs/ directory:

docs/RESEARCH.md — research, existing approaches, evaluation research, and product direction.
docs/DESIGN.md — detailed architecture, domain model, evaluator design, database model, API responsibilities, validation, and trade-offs.
docs/AI_USAGE.md — meaningful AI-assisted development decisions, accepted/rejected suggestions, and rationale.

The Research Note and Design Note are provided separately as PDF deliverables.

Assignment Deliverables

This repository contains the implementation and supporting documentation for:

Research Note
Design Note
Working Prototype
Tests
README
AI_USAGE.md
Repository

GitHub: https://github.com/logicscienc/lld-dojo

License

This project was created as a take-home engineering assignment and is intended primarily for demonstration and evaluation purposes.

