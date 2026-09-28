import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    FiArrowDown,
  FiArrowUp,
  FiArrowLeft,
  FiBookOpen,
  FiCode,
  FiClock,
  FiFileText,
  FiLoader,
  FiSend,
} from "react-icons/fi";
import { LuNetwork } from "react-icons/lu";

export default function Attempt() {
  const { slug } = useParams();
  const [openHints, setOpenHints] = useState({});
  const [problem, setProblem] = useState(null);
  const [attemptId, setAttemptId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [code, setCode] = useState("");
const [diagram, setDiagram] = useState("");
const [explanation, setExplanation] = useState("");

  useEffect(() => {
    async function fetchProblem() {
      try {
        const response = await fetch(
          `http://localhost:5000/api/problems/${slug}`
        );

        if (!response.ok) {
          throw new Error("Problem not found");
        }

        const data = await response.json();
        setProblem(data);

       const storageKey = `llddojo_attempt_${slug}`;
const existingAttemptId = sessionStorage.getItem(storageKey);

if (existingAttemptId) {
  setAttemptId(existingAttemptId);
} else {
  const attemptResponse = await fetch(
    "http://localhost:5000/api/attempts",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        problemId: data.id,
      }),
    }
  );

  if (!attemptResponse.ok) {
    throw new Error("Failed to start attempt");
  }

  const attempt = await attemptResponse.json();

  sessionStorage.setItem(storageKey, attempt.id);
  setAttemptId(attempt.id);
}
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProblem();
  }, [slug]);

  async function handleSubmit() {
  if (!attemptId) {
    setError("Attempt is not ready yet.");
    return;
  }

  if (!code && !diagram && !explanation) {
    setError("Please provide at least one part of your design.");
    return;
  }

  try {
    setSubmitting(true);
    setError("");

    const response = await fetch(
      "http://localhost:5000/api/submissions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          attemptId,
          code,
          diagram,
          explanation,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to submit design");
    }

    const submission = await response.json();

    console.log("Submission created:", submission);

    const evaluationResponse = await fetch(
  "http://localhost:5000/api/evaluations",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      submission,
      problem,
    }),
  }
);

if (!evaluationResponse.ok) {
  throw new Error("Failed to evaluate submission");
}

const evaluation = await evaluationResponse.json();

console.log("Evaluation completed:", evaluation);
navigate(`/submissions/${submission.id}/result`);

  } catch (error) {
    setError(error.message);
  } finally {
    setSubmitting(false);
  }
}

  if (loading) {
    return (
      <main className="min-h-screen bg-[#08090b] text-white flex items-center justify-center">
        <div className="flex items-center gap-3 text-zinc-400">
          <FiLoader className="animate-spin" size={18} />
          Loading problem...
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#08090b] text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-2">Something went wrong</p>
          <p className="text-zinc-500 text-sm">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#08090b] text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#08090b]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            <FiArrowLeft size={16} />
            Problems
          </button>

          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Attempt in progress
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Problem heading */}
        <section className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="text-xs uppercase tracking-wider px-2.5 py-1 rounded-full border border-blue-400/20 bg-blue-400/5 text-blue-300">
              {problem.difficulty}
            </span>

            <span className="text-xs text-zinc-600">
              LLD Problem
            </span>
          </div>

         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
  <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
    {problem.title}
  </h1>

  <button
    type="button"
    onClick={() => navigate(`/attempts?problem=${problem.slug}`)}
    className="shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.025] text-sm text-zinc-300 hover:bg-white/[0.06] hover:text-white transition-colors"
  >
    <FiClock size={15} />
    Previous attempts
  </button>
</div>

          <p className="text-zinc-400 leading-7 max-w-4xl">
            {problem.description}
          </p>
        </section>

        {/* Main workspace */}
        <div className="grid lg:grid-cols-[360px_1fr] gap-6">
          {/* Problem panel */}
          <aside className="space-y-4">
            <div className="border border-white/10 bg-white/[0.025] rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <FiBookOpen className="text-blue-400" size={17} />
                <h2 className="font-medium">Requirements</h2>
              </div>

              <div className="space-y-3 text-sm text-zinc-400 leading-6">
                {JSON.parse(problem.functionalRequirements).map(
                  (requirement, index) => (
                    <div key={index} className="flex gap-3">
                      <span className="text-zinc-600 font-mono text-xs mt-1">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <p>{requirement}</p>
                    </div>
                  )
                )}
              </div>
            </div>

            {problem.concepts && (
              <div className="border border-white/10 bg-white/[0.025] rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <LuNetwork className="text-blue-400" size={17} />
                  <h2 className="font-medium">Concepts</h2>
                </div>

                <div className="flex flex-wrap gap-2">
                  {JSON.parse(problem.concepts).map((concept) => (
                    <span
                      key={concept}
                      className="text-xs px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-zinc-400"
                    >
                      {concept}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {problem.hints && (
  <div className="border border-white/10 bg-white/[0.025] rounded-2xl p-5">
    <div className="flex items-center gap-2 mb-4">
      <FiFileText className="text-blue-400" size={17} />
      <h2 className="font-medium">Hints</h2>
    </div>

    <div className="space-y-2">
      {JSON.parse(problem.hints).map((hint, index) => {
        const isOpen = openHints[index];

        return (
          <div
            key={index}
            className="rounded-xl border border-white/10 bg-black/20 overflow-hidden"
          >
            <button
              type="button"
              onClick={() =>
                setOpenHints((previous) => ({
                  ...previous,
                  [index]: !previous[index],
                }))
              }
              className="w-full flex items-center gap-3 p-4 text-left hover:bg-white/[0.03] transition-colors"
            >
              <span className="text-xs text-blue-400 font-mono">
                {String(index + 1).padStart(2, "0")}
              </span>

              <span className="flex-1 text-sm text-zinc-300 font-medium">
                {hint.title}
              </span>

              {isOpen ? (
                <FiArrowUp
                  size={15}
                  className="text-zinc-500 shrink-0"
                />
              ) : (
                <FiArrowDown
                  size={15}
                  className="text-zinc-500 shrink-0"
                />
              )}
            </button>

            {isOpen && (
              <div className="px-4 pb-4 pl-11">
                <p className="text-xs text-zinc-500 leading-5">
                  {hint.content}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  </div>
)}
          </aside>

          {/* Submission workspace */}
          <section className="space-y-4">
            {/* Code */}
            <div className="border border-white/10 bg-white/[0.025] rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-white/10 flex items-center gap-2">
                <FiCode className="text-blue-400" size={17} />
                <div>
                  <h2 className="font-medium text-sm">Code / Classes</h2>
                  <p className="text-xs text-zinc-600 mt-0.5">
                    Define your core classes, interfaces, and responsibilities.
                  </p>
                </div>
              </div>

              <textarea
               value={code}
  onChange={(event) => setCode(event.target.value)}
                placeholder="// Write your LLD implementation here..."
                className="w-full min-h-[280px] bg-transparent p-5 text-sm text-zinc-300 placeholder:text-zinc-700 outline-none resize-y font-mono"
              />
            </div>

            {/* Diagram */}
            <div className="border border-white/10 bg-white/[0.025] rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-white/10 flex items-center gap-2">
                <LuNetwork className="text-blue-400" size={17} />
                <div>
                  <h2 className="font-medium text-sm">Class Diagram</h2>
                  <p className="text-xs text-zinc-600 mt-0.5">
                    Use Mermaid syntax to describe your design.
                  </p>
                </div>
              </div>

              <textarea
               value={diagram}
  onChange={(event) => setDiagram(event.target.value)}
                placeholder={`classDiagram
    class Elevator
    class Request`}
                className="w-full min-h-[220px] bg-transparent p-5 text-sm text-zinc-300 placeholder:text-zinc-700 outline-none resize-y font-mono"
              />
            </div>

            {/* Explanation */}
            <div className="border border-white/10 bg-white/[0.025] rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-white/10 flex items-center gap-2">
                <FiFileText className="text-blue-400" size={17} />
                <div>
                  <h2 className="font-medium text-sm">Design Explanation</h2>
                  <p className="text-xs text-zinc-600 mt-0.5">
                    Explain your responsibilities, relationships, and tradeoffs.
                  </p>
                </div>
              </div>

              <textarea
               value={explanation}
  onChange={(event) => setExplanation(event.target.value)}
                placeholder="Explain why you designed the system this way..."
                className="w-full min-h-[180px] bg-transparent p-5 text-sm text-zinc-300 placeholder:text-zinc-700 outline-none resize-y"
              />
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleSubmit}
  disabled={submitting || !attemptId}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black text-sm font-medium hover:bg-zinc-200 transition-colors"
              >
                 {submitting ? (
    <>
      <FiLoader className="animate-spin" />
      Submitting...
    </>
  ) : (
    <>
      Submit design
                <FiSend size={16} />
    </>
  )}
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}