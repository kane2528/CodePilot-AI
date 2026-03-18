import { useState } from "react";
import Layout from "../../components/Layout";
import SEO from "../../components/SEO";
import API from "../../utils/api";

export default function RegexGenerator() {
const [description, setDescription] = useState("");
const [loading, setLoading] = useState(false);
const [result, setResult] = useState("");

const handleGenerate = async (e) => {
e.preventDefault();


if (!description.trim()) return;

setLoading(true);
setResult("");

try {
  const res = await API.post("/tools/regex-generator", { prompt: description });
  const data = res.data;

  if (data.success) {
    let output = data.data.result;
    // Extract regex from ``` block
    const match = output.match(/```([\s\S]*?)```/);
    if (match) output = match[1];
    setResult(output.trim());
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
      title="AI Regex Generator — Generate Regex Patterns Instantly | CodePilot AI"
      description="Describe what your regex should do in plain English and let AI generate the pattern instantly. Free online regex generator for developers."
      keywords="regex generator online, AI regex builder, regex pattern generator, natural language regex, CodePilot AI regex"
      canonical="/tools/regex-generator"
    />
    <Layout>
      <div className="max-w-4xl mx-auto flex flex-col gap-10">
        {/* Heading */}
        <div>
      <h1 className="text-4xl font-bold">Regex Generator</h1>
      <p className="text-gray-400 mt-2">
        Generate complex regex patterns instantly using AI.
      </p>
    </div>

    {/* Form */}
    <form
      onSubmit={handleGenerate}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-8 flex flex-col gap-6 shadow-2xl"
    >
      <Input
        label="What should the regex do?"
        placeholder="e.g. Match valid email addresses"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button
        disabled={loading || !description}
        className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 rounded-lg font-semibold hover:scale-[1.02] transition disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? "⚡ Generating Regex..." : "Generate Regex"}
      </button>
    </form>

    {/* Result */}
    {result && (
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-8 shadow-2xl">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-purple-400">
            Generated Pattern
          </h2>

          <button
            onClick={() => navigator.clipboard.writeText(result)}
            className="text-sm text-purple-400 hover:underline"
          >
            Copy
          </button>
        </div>

        <div className="bg-black/70 p-6 rounded-lg border border-white/10 overflow-x-auto">
          <pre className="text-pink-400 font-mono text-sm">
            <code>{result}</code>
          </pre>
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
