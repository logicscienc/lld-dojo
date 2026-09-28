import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiAlertTriangle,
  FiArrowLeft,
  FiCheckCircle,
  FiChevronDown,
  FiChevronUp,
  FiCpu,
  FiCode,
  FiHelpCircle,
  FiRefreshCw,
  FiTarget,
  FiXCircle,
} from "react-icons/fi";


export default function Result() {
  const { submissionId } = useParams();
  const navigate = useNavigate();

  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openFeedback, setOpenFeedback] = useState({});

  useEffect(() => {
    async function fetchEvaluation() {
      try {
        const response = await fetch(
          `http://localhost:5000/api/evaluations/${submissionId}`
        );

        if (!response.ok) {
          throw new Error("Evaluation not found");
        }

        const data = await response.json();
        console.log("EVALUATION DATA:", data);

        setEvaluation(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchEvaluation();
  }, [submissionId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#08090b] text-white flex items-center justify-center">
        <div className="flex items-center gap-3 text-zinc-400">
          <FiCpu className="animate-pulse" size={18} />
          Loading your design review...
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#08090b] text-white flex items-center justify-center px-6">
        <div className="text-center">
          <FiAlertTriangle
            className="mx-auto mb-4 text-red-400"
            size={28}
          />

          <h1 className="text-lg font-medium mb-2">
            Unable to load evaluation
          </h1>

          <p className="text-sm text-zinc-500">
            {error}
          </p>
        </div>
      </main>
    );
  }

  const feedback = evaluation.feedback ?? [];

  const counts = {
    met: feedback.filter((item) => item.verdict === "MET").length,
    partial: feedback.filter(
      (item) => item.verdict === "PARTIALLY_MET"
    ).length,
    notMet: feedback.filter(
      (item) => item.verdict === "NOT_MET"
    ).length,
    insufficient: feedback.filter(
      (item) => item.verdict === "INSUFFICIENT_EVIDENCE"
    ).length,
  };

  const strengths = feedback.filter(
    (item) => item.verdict === "MET"
  );

  const needsAttention = feedback.filter(
    (item) =>
      item.verdict === "PARTIALLY_MET" ||
      item.verdict === "NOT_MET" ||
      item.verdict === "INSUFFICIENT_EVIDENCE"
  );

  const getScoreLabel = (score) => {
    if (score >= 85) return "Strong design";
    if (score >= 70) return "Good foundation";
    if (score >= 50) return "Needs refinement";
    return "Needs significant work";
  };

  const getVerdictIcon = (verdict) => {
    if (verdict === "MET") {
      return (
        <FiCheckCircle
          className="text-emerald-400 shrink-0"
          size={18}
        />
      );
    }

    if (verdict === "PARTIALLY_MET") {
      return (
        <FiAlertTriangle
          className="text-amber-400 shrink-0"
          size={18}
        />
      );
    }

    if (verdict === "NOT_MET") {
      return (
        <FiXCircle
          className="text-red-400 shrink-0"
          size={18}
        />
      );
    }

    return (
      <FiHelpCircle
        className="text-zinc-500 shrink-0"
        size={18}
      />
    );
  };

  const getVerdictLabel = (verdict) => {
    if (verdict === "MET") return "MET";
    if (verdict === "PARTIALLY_MET") return "PARTIALLY MET";
    if (verdict === "NOT_MET") return "NOT MET";
    return "INSUFFICIENT EVIDENCE";
  };

  const toggleFeedback = (id) => {
    setOpenFeedback((previous) => ({
      ...previous,
      [id]: !previous[id],
    }));
  };

  return (
    <main className="min-h-screen bg-[#08090b] text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#08090b]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/problems")}
            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            <FiArrowLeft size={16} />
            Problems
          </button>

          <div className="flex items-center gap-2 text-xs text-emerald-400">
            <FiCheckCircle size={15} />
            Evaluation completed
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Hero */}
        <section className="mb-10">
          <div className="flex items-center gap-2 text-xs text-blue-400 uppercase tracking-[0.18em] mb-4">
            <FiTarget size={14} />
            Design Review
          </div>

          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-3">
  {evaluation.submission?.attempt?.problem?.title ||
    "Your LLD evaluation"}
</h1>

         <p className="text-zinc-500 text-sm">
  Submission {submissionId}
</p>
        </section>

        {/* Score */}
        <section className="grid lg:grid-cols-[280px_1fr] gap-5 mb-10">
          <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-7 flex flex-col items-center justify-center text-center">
            <div className="w-32 h-32 rounded-full border border-blue-400/20 bg-blue-400/[0.04] flex flex-col items-center justify-center mb-5">
              <span className="text-5xl font-semibold tracking-tight">
                {evaluation.score ?? "—"}
              </span>

              <span className="text-xs text-zinc-600 mt-1">
                / 100
              </span>
            </div>

            <h2 className="text-lg font-medium">
              {getScoreLabel(evaluation.score ?? 0)}
            </h2>

            <p className="text-sm text-zinc-500 mt-2">
              Based on your submitted design
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">
            <div className="flex items-center gap-2 mb-6">
              <FiTarget className="text-blue-400" size={17} />
              <h2 className="font-medium">
                Evaluation summary
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <SummaryCard
                icon={<FiCheckCircle size={17} />}
                label="Criteria met"
                value={counts.met}
                className="text-emerald-400"
              />

              <SummaryCard
                icon={<FiAlertTriangle size={17} />}
                label="Partially met"
                value={counts.partial}
                className="text-amber-400"
              />

              <SummaryCard
                icon={<FiXCircle size={17} />}
                label="Not met"
                value={counts.notMet}
                className="text-red-400"
              />

              <SummaryCard
                icon={<FiHelpCircle size={17} />}
                label="Insufficient evidence"
                value={counts.insufficient}
                className="text-zinc-400"
              />
            </div>
          </div>
        </section>

        <section className="mb-10">
  <SectionHeading
    icon={<FiCpu />}
    title="Evaluation by layer"
    subtitle="See how each part of the review contributed to your result."
  />

  <div className="grid md:grid-cols-3 gap-3">
    {[
      {
        key: "requirement",
        label: "Requirement",
        description: "Checks problem coverage",
      },
      {
        key: "structural",
        label: "Structural",
        description: "Checks design structure",
      },
      {
        key: "ai_reasoning",
        label: "AI reasoning",
        description: "Checks design quality",
      },
    ].map((layer) => {
      const findings = feedback.filter(
        (item) => item.evaluator === layer.key
      );

      const met = findings.filter(
        (item) => item.verdict === "MET"
      ).length;

      const partial = findings.filter(
        (item) => item.verdict === "PARTIALLY_MET"
      ).length;

      const notMet = findings.filter(
        (item) => item.verdict === "NOT_MET"
      ).length;

      return (
        <div
          key={layer.key}
          className="rounded-xl border border-white/10 bg-white/[0.025] p-5"
        >
          <h3 className="text-sm font-medium text-zinc-200">
            {layer.label}
          </h3>

          <p className="text-xs text-zinc-600 mt-1 mb-4">
            {layer.description}
          </p>

          <div className="flex items-center gap-4 text-xs">
            <span className="text-emerald-400">
              {met} met
            </span>

            <span className="text-amber-400">
              {partial} partial
            </span>

            <span className="text-red-400">
              {notMet} not met
            </span>
          </div>
        </div>
      );
    })}
  </div>
</section>

{/* Submission */}
<section className="mb-10">
  <SectionHeading
    icon={<FiCode />}
    title="Your submission"
    subtitle="Review the design you submitted for this attempt."
  />

  <div className="space-y-4">
    {evaluation.submission?.code && (
      <div className="rounded-2xl border border-white/10 bg-white/[0.025] overflow-hidden">
        <div className="px-5 py-3 border-b border-white/10">
          <h3 className="text-sm font-medium text-zinc-200">
            Code
          </h3>
        </div>

        <pre className="p-5 overflow-x-auto text-sm text-zinc-300 leading-6 bg-black/20">
          <code>{evaluation.submission.code}</code>
        </pre>
      </div>
    )}

    {evaluation.submission?.diagram && (
      <div className="rounded-2xl border border-white/10 bg-white/[0.025] overflow-hidden">
        <div className="px-5 py-3 border-b border-white/10">
          <h3 className="text-sm font-medium text-zinc-200">
            Class diagram
          </h3>
        </div>

        <pre className="p-5 overflow-x-auto text-sm text-zinc-400 leading-6 bg-black/20">
          <code>{evaluation.submission.diagram}</code>
        </pre>
      </div>
    )}

    {evaluation.submission?.explanation && (
      <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
        <h3 className="text-sm font-medium text-zinc-200 mb-3">
          Design explanation
        </h3>

        <p className="text-sm text-zinc-400 leading-6 whitespace-pre-line">
          {evaluation.submission.explanation}
        </p>
      </div>
    )}
  </div>
</section>

        {/* Strengths */}
        {strengths.length > 0 && (
          <section className="mb-10">
            <SectionHeading
              icon={<FiCheckCircle />}
              title="What went well"
              subtitle="Areas where your design clearly satisfied the evaluation criteria."
            />

            <div className="grid md:grid-cols-2 gap-3">
              {strengths.map((item) => (
                <div
                  key={item.id}
                  className="border border-emerald-400/10 bg-emerald-400/[0.025] rounded-xl p-4"
                >
                  <div className="flex items-start gap-3">
                    <FiCheckCircle
                      className="text-emerald-400 mt-0.5 shrink-0"
                      size={17}
                    />

                    <div>
                      <h3 className="text-sm font-medium text-zinc-200">
                        {item.criterion}
                      </h3>

                      {item.evidence && (
                        <p className="text-xs text-zinc-500 mt-2 leading-5">
                          {item.evidence}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Needs attention */}
        {needsAttention.length > 0 && (
          <section className="mb-10">
            <SectionHeading
              icon={<FiAlertTriangle />}
              title="Needs attention"
              subtitle="These are the areas where your design can be improved."
            />

            <div className="space-y-3">
              {needsAttention.map((item) => {
                const isOpen = openFeedback[item.id];

                return (
                  <div
                    key={item.id}
                    className="border border-white/10 bg-white/[0.025] rounded-2xl overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFeedback(item.id)}
                      className="w-full flex items-center gap-4 p-5 text-left hover:bg-white/[0.025] transition-colors"
                    >
                      {getVerdictIcon(item.verdict)}

                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-zinc-200">
                          {item.criterion}
                        </h3>

                       <div className="flex items-center gap-2 mt-1">
  <p className="text-xs text-zinc-600">
    {getVerdictLabel(item.verdict)}
  </p>

  {item.evaluator && (
    <>
      <span className="text-zinc-700">•</span>

      <p className="text-xs text-blue-400/70">
        {item.evaluator === "requirement"
          ? "Requirement check"
          : item.evaluator === "structural"
          ? "Structural review"
          : "AI reasoning"}
      </p>
    </>
  )}
</div>
                      </div>

                      {isOpen ? (
                        <FiChevronUp
                          className="text-zinc-600 shrink-0"
                          size={17}
                        />
                      ) : (
                        <FiChevronDown
                          className="text-zinc-600 shrink-0"
                          size={17}
                        />
                      )}
                    </button>

                    {isOpen && (
                      <div className="border-t border-white/10 px-5 py-5 space-y-5">
                        {item.evidence && (
                          <FeedbackBlock
                            label="Evidence"
                            value={item.evidence}
                          />
                        )}

                        {item.problem && (
                          <FeedbackBlock
                            label="What needs improvement"
                            value={item.problem}
                          />
                        )}

                        {item.whyItMatters && (
                          <FeedbackBlock
                            label="Why it matters"
                            value={item.whyItMatters}
                          />
                        )}

                        {item.suggestion && (
                          <FeedbackBlock
                            label="Suggested improvement"
                            value={item.suggestion}
                          />
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Footer actions */}
        <section className="border-t border-white/10 pt-8 flex flex-col sm:flex-row gap-3 justify-between">
          <button
            type="button"
            onClick={() => navigate("/problems")}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-white/10 text-sm text-zinc-300 hover:bg-white/[0.04] transition-colors"
          >
            <FiArrowLeft size={16} />
            Try another problem
          </button>

          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-black text-sm font-medium hover:bg-zinc-200 transition-colors"
          >
            <FiRefreshCw size={15} />
            Review again
          </button>
        </section>
      </div>
    </main>
  );
}

function SummaryCard({ icon, label, value, className }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-4">
      <div className={`mb-3 ${className}`}>
        {icon}
      </div>

      <div className="text-2xl font-semibold">
        {value}
      </div>

      <div className="text-xs text-zinc-500 mt-1">
        {label}
      </div>
    </div>
  );
}

function SectionHeading({ icon, title, subtitle }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-blue-400">
          {icon}
        </span>

        <h2 className="text-lg font-medium">
          {title}
        </h2>
      </div>

      <p className="text-sm text-zinc-600">
        {subtitle}
      </p>
    </div>
  );
}

function FeedbackBlock({ label, value }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wider text-zinc-600 mb-2">
        {label}
      </p>

      <p className="text-sm text-zinc-400 leading-6">
        {value}
      </p>
    </div>
  );
}