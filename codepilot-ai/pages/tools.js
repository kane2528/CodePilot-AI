import Layout from "../components/Layout";
import Link from "next/link";

export default function Tools() {
  return (
    <Layout>

      <div className="flex flex-col gap-10">

        <div>
          <h1 className="text-4xl font-bold mb-2">
            AI Tools
          </h1>
          <p className="text-gray-400">
            Explore powerful AI tools to boost productivity.
          </p>
        </div>

        {/* TOOL GRID */}

        <div className="grid md:grid-cols-3 gap-6">

          <ToolCard
            title="Code Explainer"
            desc="Paste any code and get instant explanations."
            icon="⚡"
            link="/tools/code-explainer"
          />

          <ToolCard
            title="SQL Generator"
            desc="Convert natural language into SQL queries."
            icon="🧠"
            link="/tools/sql-generator"
          />

          <ToolCard
            title="Regex Generator"
            desc="Generate regex patterns easily."
            icon="🔍"
            link="/tools/regex-generator"
          />

          <ToolCard
            title="Code Reviewer"
            desc="Detect bugs and improve code quality."
            icon="🛠"
            link="/tools/code-reviewer"
          />

          <ToolCard
            title="Interview Questions"
            desc="Generate interview questions instantly."
            icon="🎯"
            link="/tools/interview"
          />

          <ToolCard
            title="Resume Builder"
            desc="Create professional resumes using AI."
            icon="📄"
            link="/resume-builder"
          />

        </div>

      </div>

    </Layout>
  );
}

function ToolCard({ title, desc, icon, link }) {
  return (
    <Link href={link}>
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:bg-white/10 transition cursor-pointer">

        <div className="text-3xl mb-3">
          {icon}
        </div>

        <h3 className="text-lg font-semibold">
          {title}
        </h3>

        <p className="text-gray-400 text-sm mt-1">
          {desc}
        </p>

      </div>
    </Link>
  );
}