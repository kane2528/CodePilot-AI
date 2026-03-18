import { useState } from "react";
import Layout from "../../components/Layout";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import SEO from "../../components/SEO";
import API from "../../utils/api";

export default function CodeReviewer() {
const [code, setCode] = useState("");
const [loading, setLoading] = useState(false);
const [result, setResult] = useState("");

const handleGenerate = async (e) => {
e.preventDefault();


if (!code.trim()) return;

setLoading(true);
setResult("");

try {
  const res = await API.post("/tools/code-reviewer", { prompt: code });
  const data = res.data;

  if (data.success) {
    setResult(data.data.result);
  } else {
    setResult("\u274c " + data.message);
  }
} catch (err) {
  setResult("\u274c Something went wrong");
} finally {
  setLoading(false);
}


};

  return (
    <>
      <SEO
        title="AI Code Reviewer — Instant AI-Powered Code Review | CodePilot AI"
        description="Paste your code and get instant AI-powered feedback, bug detection, and optimization suggestions. Free AI code review tool for developers."
        keywords="AI code reviewer, automated code review, AI code feedback, code quality checker, CodePilot AI code review"
        canonical="/tools/code-reviewer"
      />
      <Layout>
        <div className="max-w-4xl mx-auto flex flex-col gap-10">


    {/* Heading */}
    <div>
      <h1 className="text-4xl font-bold">Code Reviewer</h1>
      <p className="text-gray-400 mt-2">
        Get AI-powered feedback, improvements, and optimized code.
      </p>
    </div>

    {/* Form */}
    <form
      onSubmit={handleGenerate}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-8 flex flex-col gap-6 shadow-2xl"
    >
      <Textarea
        label="Paste your code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        rows="10"
        placeholder="Paste your code here..."
      />

      <button
        disabled={loading || !code}
        className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 rounded-lg font-semibold hover:scale-[1.02] transition disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? "⚡ Reviewing Code..." : "Review Code"}
      </button>
    </form>

    {/* Result */}
    {result && (
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-8 shadow-2xl">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-purple-400">
            Review
          </h2>

          <button
            onClick={() => navigator.clipboard.writeText(result)}
            className="text-sm text-purple-400 hover:underline"
          >
            Copy
          </button>
        </div>

        <div className="prose prose-invert max-w-none">
          <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
            {result}
          </ReactMarkdown>
        </div>

      </div>
    )}
      </div>
      </Layout>
    </>
  );
}

// Textarea Component
function Textarea({ label, value, onChange, rows = "3", placeholder = "" }) {
return ( <div className="flex flex-col gap-2"> <label className="text-sm text-gray-300">{label}</label> <textarea
     value={value}
     onChange={onChange}
     rows={rows}
     placeholder={placeholder}
     className="p-3 font-mono rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/40 focus:outline-none w-full"
   /> </div>
);
}
