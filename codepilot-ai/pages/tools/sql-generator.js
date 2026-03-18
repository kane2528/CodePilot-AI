import { useState } from "react";
import Layout from "../../components/Layout";
import SEO from "../../components/SEO";
import API from "../../utils/api";

export default function SqlGenerator() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const handleGenerate = async (e) => {
  e.preventDefault();

  if (!query.trim()) return;

  setLoading(true);
  setResult("");

  try {
    const res = await API.post("/tools/sql-generator", { prompt: query });
    const data = res.data;

    if (data.success) {
      // Extract SQL cleanly if wrapped in ```sql ```
      let output = data.data.result;
      const match = output.match(/```sql\n([\s\S]*?)```/);
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
        title="SQL Query Generator AI — Convert English to SQL Instantly | CodePilot AI"
        description="Describe your SQL query in plain English and let AI generate optimized SQL instantly. Supports SELECT, JOIN, GROUP BY and more. Free to try."
        keywords="SQL query generator AI, AI SQL tool, convert English to SQL, natural language SQL, SQL generator online"
        canonical="/tools/sql-generator"
      />
      <Layout>
      <div className="max-w-4xl mx-auto flex flex-col gap-10">
        <div>
          <h1 className="text-4xl font-bold">SQL Generator</h1>
          <p className="text-gray-400 mt-2">Convert plain English into powerful SQL queries instantly.</p>
        </div>

        <form onSubmit={handleGenerate} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-8 flex flex-col gap-6 shadow-2xl">
          <Input 
            label="Describe your query" 
            placeholder="e.g. Find top 5 customers by revenue" 
            value={query} 
            onChange={(e) => setQuery(e.target.value)} 
          />

          <button 
            disabled={loading || !query}
            className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 rounded-lg font-semibold hover:scale-[1.02] transition disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Generating..." : "Generate SQL"}
          </button>
        </form>

        {result && (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-8 shadow-2xl">
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">Generated SQL</h2>
            <div className="bg-black/50 p-6 rounded-lg border border-white/10 overflow-x-auto">
              <div className="bg-black/70 p-6 rounded-lg border border-white/10 overflow-x-auto relative">
  
  {/* Copy Button */}
  <button
    onClick={() => navigator.clipboard.writeText(result)}
    className="absolute top-3 right-3 text-xs text-purple-400 hover:underline"
  >
    Copy
  </button>

  <pre className="text-green-400 font-mono text-sm leading-relaxed">
    <code>{result}</code>
  </pre>
</div>
            </div>
          </div>
        )}
      </div>
      </Layout>
    </>
  );
}

function Input({ label, value, onChange, placeholder = "" }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-gray-300">{label}</label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="p-3 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/40 focus:outline-none w-full"
      />
    </div>
  );
}
