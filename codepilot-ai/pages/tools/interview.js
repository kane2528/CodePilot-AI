import { useState } from "react";
import Layout from "../../components/Layout";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import SEO from "../../components/SEO";
import API from "../../utils/api";

export default function InterviewPrep() {
const [topic, setTopic] = useState("");
const [level, setLevel] = useState("mixed"); // 🔥 NEW
const [language, setLanguage] = useState("any");
const [loading, setLoading] = useState(false);
const [result, setResult] = useState("");

const handleGenerate = async (e) => {
e.preventDefault();
if (!topic.trim()) return;


setLoading(true);
setResult("");

try {
  const res = await API.post("/tools/interview", {
    prompt: topic,
    level,
    language,
  });
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
        title="AI Interview Prep — Generate Coding Interview Questions | CodePilot AI"
        description="Generate AI-powered coding interview questions with detailed answers. Choose topic, difficulty, and programming language. Free interview prep tool for developers."
        keywords="AI interview prep, coding interview questions generator, technical interview AI, interview preparation developer, CodePilot AI interview"
        canonical="/tools/interview"
      />
      <Layout>
        <div className="max-w-4xl mx-auto flex flex-col gap-10">

        {/* Heading */}
        <div>
      <h1 className="text-4xl font-bold">Interview Prep</h1>
      <p className="text-gray-400 mt-2">
        Generate interview questions with answers instantly.
      </p>
    </div>

    {/* Form */}
    <form
      onSubmit={handleGenerate}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-8 flex flex-col gap-6 shadow-2xl"
    >

      {/* Topic */}
      <Input
        label="Enter topic"
        placeholder="e.g. React, DSA, SQL, System Design"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      />

      {/* 🔥 LEVEL SELECT */}
      <div className="flex flex-col gap-2">
        <label className="text-sm text-gray-300">Difficulty Level</label>
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="p-3 rounded-lg bg-white/5 border border-white/10 text-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/40 focus:outline-none"
        >
          <option value="mixed">Mixed</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      {/* 🔥 LANGUAGE SELECT */}
      <div className="flex flex-col gap-2">
        <label className="text-sm text-gray-300">Programming Language (Optional)</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="p-3 rounded-lg bg-white/5 border border-white/10 text-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/40 focus:outline-none"
        >
          <option value="any">Any / Not Specific</option>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="c++">C++</option>
          <option value="c#">C#</option>
          <option value="go">Go</option>
          <option value="ruby">Ruby</option>
          <option value="php">PHP</option>
          <option value="swift">Swift</option>
          <option value="typescript">TypeScript</option>
        </select>
      </div>

      {/* Button */}
      <button
        disabled={loading || !topic}
        className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 rounded-lg font-semibold hover:scale-[1.02] transition disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? "⚡ Generating Questions..." : "Generate Questions"}
      </button>
    </form>

    {/* Result */}
    {result && (
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-8 shadow-2xl">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-purple-400">
            {level.toUpperCase()} Questions
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

// Input Component
function Input({ label, value, onChange, placeholder = "" }) {
return ( <div className="flex flex-col gap-2"> <label className="text-sm text-gray-300">{label}</label> <input
     type="text"
     value={value}
     onChange={onChange}
     placeholder={placeholder}
     className="p-3 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/40 focus:outline-none w-full"
   /> </div>
);
}
