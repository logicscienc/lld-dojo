import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiCheckCircle,
  FiCode,
  FiLoader,
  FiTarget,
} from "react-icons/fi";
import { LuBrain, LuSparkles } from "react-icons/lu";


export default function Problems() {
      const navigate = useNavigate();

  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProblems() {
      try {
        const response = await fetch("http://localhost:5000/api/problems");

        if (!response.ok) {
          throw new Error("Failed to load problems");
        }

        const data = await response.json();
        console.log(data);
        setProblems(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProblems();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#08090b] text-white flex items-center justify-center">
        <div className="flex items-center gap-3 text-zinc-400">
          <FiLoader className="animate-spin" size={20} />
          Loading problems...
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
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-blue-500/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="mb-12">
  <div className="flex items-center justify-between gap-6">
    <div>
      <div className="flex items-center gap-2 text-blue-400 text-sm font-medium mb-5">
        <LuSparkles size={16} />
        <span>LLD PRACTICE PLATFORM</span>
      </div>

      <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
        Practice designing
        <br />
        <span className="text-zinc-500">better systems.</span>
      </h1>

      <p className="text-zinc-400 max-w-2xl leading-relaxed">
        Choose a problem, design your solution, and get structured
        feedback on your object-oriented thinking.
      </p>
    </div>

    <button
      type="button"
      onClick={() => navigate("/attempts")}
      className="shrink-0 px-4 py-2.5 rounded-lg border border-white/10 bg-white/[0.025] text-sm text-zinc-300 hover:bg-white/[0.06] hover:text-white transition-colors"
    >
      Attempt History
    </button>
  </div>
</header>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
          <div className="border border-white/10 bg-white/[0.025] rounded-xl p-5">
            <FiCode className="text-blue-400 mb-4" size={20} />
            <p className="text-2xl font-semibold">{problems.length}</p>
            <p className="text-sm text-zinc-500 mt-1">Practice problems</p>
          </div>

          <div className="border border-white/10 bg-white/[0.025] rounded-xl p-5">
            <FiTarget className="text-blue-400 mb-4" size={20} />
            <p className="text-2xl font-semibold">6</p>
            <p className="text-sm text-zinc-500 mt-1">Design criteria</p>
          </div>

          <div className="border border-white/10 bg-white/[0.025] rounded-xl p-5">
            <LuBrain className="text-blue-400 mb-4" size={20} />
            <p className="text-2xl font-semibold">AI</p>
            <p className="text-sm text-zinc-500 mt-1">Design feedback</p>
          </div>
        </div>

        {/* Problems */}
        <section>
          <div className="flex items-end justify-between mb-5">
            <div>
              <h2 className="text-xl font-semibold">Choose a problem</h2>
              <p className="text-sm text-zinc-500 mt-1">
                Start with any problem and submit your design.
              </p>
            </div>

            <span className="hidden sm:block text-xs text-zinc-600">
              {problems.length} available
            </span>
          </div>

          <div className="grid gap-4">
            {problems.map((problem, index) => (
              <article
                key={problem.id}
                className="group border border-white/10 bg-white/[0.025] hover:bg-white/[0.045] hover:border-white/20 rounded-2xl p-6 transition-all duration-200"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  {/* Number */}
                  <div className="hidden md:flex shrink-0 w-12 h-12 rounded-xl bg-white/[0.04] border border-white/10 items-center justify-center text-sm text-zinc-500 font-mono">
                    0{index + 1}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <h3 className="text-lg font-medium">
                        {problem.title}
                      </h3>

                      <span className="text-[11px] uppercase tracking-wider px-2.5 py-1 rounded-full border border-blue-400/20 bg-blue-400/5 text-blue-300">
                        {problem.difficulty}
                      </span>
                    </div>

                    <p className="text-sm text-zinc-400 leading-6 max-w-3xl line-clamp-2">
                      {problem.description}
                    </p>

                    <div className="flex items-center gap-2 mt-4 text-xs text-zinc-600">
                      <FiCheckCircle size={14} />
                      <span>Code</span>
                      <span>•</span>
                      <span>Diagram</span>
                      <span>•</span>
                      <span>Explanation</span>
                    </div>
                  </div>

                  {/* Action */}
                  <button
                    type="button"
                    onClick={() => navigate(`/problems/${problem.slug}`)}
                    className="shrink-0 w-full md:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-black text-sm font-medium hover:bg-zinc-200 transition-colors"
                  >
                    Start problem
                    <FiArrowRight
                      size={16}
                      className="group-hover:translate-x-0.5 transition-transform"
                    />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}