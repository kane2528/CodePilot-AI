import { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import ReactMarkdown from "react-markdown";
import SEO from "../../components/SEO";
import rehypeHighlight from "rehype-highlight";
import API from "../../utils/api";

export default function CodeExplainer() {
const [code, setCode] = useState("");
const [language, setLanguage] = useState("javascript");
const [loading, setLoading] = useState(false);
const [result, setResult] = useState("");

const handleGenerate = async (e) => {
e.preventDefault();


if (!code.trim()) return;

setLoading(true);
setResult("");

try {
  const res = await API.post("/tools/code-explainer", {
    prompt: `Explain this ${language} code:\n${code}`,
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

// auto scroll to result
useEffect(() => {
if (result) {
window.scrollTo({
top: document.body.scrollHeight,
behavior: "smooth",
});
}
}, [result]);

  return (
    <>
      <SEO
        title="AI Code Explainer — Understand Any Code Instantly | CodePilot AI"
        description="Paste any code and let AI explain it in plain English. Supports JavaScript, Python, C++, Java and more. Try CodePilot AI's free code explainer tool instantly."
        keywords="AI code explainer, explain code with AI, understand code AI, code explanation tool, CodePilot AI code explainer"
        canonical="/tools/code-explainer"
      />
      <Layout>
        <div className="max-w-4xl mx-auto flex flex-col gap-10">
          {/* Heading */}
          <div>
            <h1 className="text-4xl font-bold">AI Code Explainer</h1>
            <p className="text-gray-400 mt-2">
              Paste any code and let AI explain how it works — in plain English.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleGenerate}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-8 flex flex-col gap-6 shadow-2xl"
          >
            {/* Language Select */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-300">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="p-3 rounded-lg bg-white/5 border border-white/10 text-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/40 focus:outline-none"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
              </select>
            </div>

            {/* Code Input */}
            <Textarea
              label="Paste your code here"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows="8"
              placeholder="Paste your code here... (e.g. array.map example)"
            />

            {/* Button */}
            <button
              disabled={loading}
              className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 rounded-lg font-semibold hover:scale-[1.02] transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "⚡ AI is thinking..." : "Explain Code"}
            </button>
          </form>

          {/* Result */}
          {result && (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-8 shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Explanation</h2>
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

// Reusable Textarea Component
function Textarea({
label,
value,
onChange,
rows = "3",
placeholder = "",
}) {
return ( <div className="flex flex-col gap-2"> <label className="text-sm text-gray-300">{label}</label> <textarea
     value={value}
     onChange={onChange}
     rows={rows}
     placeholder={placeholder}
     className="p-3 font-mono rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/40 focus:outline-none w-full"
   /> </div>
);
}
