import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiClock,
  FiLoader,
  FiTarget,
} from "react-icons/fi";
import { LuSparkles } from "react-icons/lu";

export default function Attempts() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const problemSlug = searchParams.get("problem");

  useEffect(() => {
    async function fetchAttempts() {
      try {
        const response = await fetch(
          "http://localhost:5000/api/attempts"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch attempts");
        }

        const data = await response.json();

        const filteredAttempts = problemSlug
          ? data.filter(
              (attempt) => attempt.problem.slug === problemSlug
            )
          : data;

        setAttempts(filteredAttempts);
      } catch (error) {
        console.error("FETCH ATTEMPTS ERROR:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAttempts();
  }, [problemSlug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#08090b] text-white flex items-center justify-center">
        <div className="flex items-center gap-3 text-zinc-400">
          <FiLoader className="animate-spin" size={18} />
          Loading attempts...
        </div>
      </main>
    );
  }

  const problemTitle =
    attempts.length > 0 ? attempts[0].problem.title : "Attempt History";

  return (
    <main className="min-h-screen bg-[#08090b] text-white">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-blue-500/10 blur-[120px]" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <header className="mb-10">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors mb-8"
          >
            <FiArrowLeft size={16} />
            Back
          </button>

          <div className="flex items-center gap-2 text-blue-400 text-sm font-medium mb-4">
            <LuSparkles size={16} />
            <span>ATTEMPT HISTORY</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-3">
            {problemSlug ? problemTitle : "Your previous attempts"}
          </h1>

          <p className="text-zinc-400 leading-6 max-w-2xl">
            Review your previous designs and evaluation results.
          </p>
        </header>

        {/* Empty state */}
        {attempts.length === 0 ? (
          <div className="border border-white/10 bg-white/[0.025] rounded-2xl p-10 text-center">
            <FiTarget
              size={24}
              className="text-zinc-600 mx-auto mb-4"
            />

            <h2 className="font-medium mb-2">
              No previous attempts
            </h2>

            <p className="text-sm text-zinc-500 mb-6">
              Complete an attempt to see it here.
            </p>

            <button
              type="button"
              onClick={() => navigate("/problems")}
              className="px-5 py-2.5 rounded-xl bg-white text-black text-sm font-medium hover:bg-zinc-200 transition-colors"
            >
              Browse problems
            </button>
          </div>
        ) : (
          <section className="space-y-3">
            {attempts.map((attempt, index) => {
                
              const submission = attempt.submissions?.[0];
              const score = submission?.evaluation?.score;

              return (
                <article
                  key={attempt.id}
                  className="border border-white/10 bg-white/[0.025] hover:bg-white/[0.04] rounded-2xl p-5 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-5">
                    {/* Number */}
                    <div className="hidden md:flex shrink-0 w-11 h-11 rounded-xl bg-white/[0.04] border border-white/10 items-center justify-center text-xs text-zinc-500 font-mono">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    {/* Main info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h2 className="font-medium">
                          {attempt.problem.title}
                        </h2>

                        <span
  className={`text-[11px] uppercase tracking-wider px-2.5 py-1 rounded-full border ${
    attempt.status === "COMPLETED"
      ? "border-emerald-400/20 bg-emerald-400/5 text-emerald-300"
      : attempt.status === "FAILED"
      ? "border-red-400/20 bg-red-400/5 text-red-300"
      : attempt.status === "SUBMITTED"
      ? "border-yellow-400/20 bg-yellow-400/5 text-yellow-300"
      : "border-blue-400/20 bg-blue-400/5 text-blue-300"
  }`}
>
  {attempt.status}
</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-600">
                        <span className="flex items-center gap-1.5">
                          <FiClock size={13} />
                          {new Date(
                            attempt.createdAt
                          ).toLocaleString()}
                        </span>

                        {score != null && (
                          <>
                            <span>•</span>
                            <span className="text-zinc-400">
                              Score:{" "}
                              <span className="text-white font-medium">
                                {score}
                              </span>
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Action */}
                    {submission && (
                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/submissions/${submission.id}/result`
                          )
                        }
                        className="shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-sm text-zinc-300 hover:bg-white/[0.06] hover:text-white transition-colors"
                      >
                        <FiCheckCircle size={15} />
                        View result
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}