import Link from "next/link";
import Image from "next/image";
import SEO from "../components/SEO";

export default function Home() {
  return (
    <>
      <SEO
        title="AI Tools for Developers | CodePilot AI"
        description="CodePilot AI gives developers superpowers. Explain code, generate SQL queries, create regex, review code, and build ATS-ready resumes — all powered by AI. Free to start."
        keywords="AI tools for developers, AI code explainer, SQL query generator AI, AI resume builder, regex generator online, AI code reviewer, developer productivity AI"
        canonical="/"
      />

      <div className="bg-gradient-to-br from-indigo-950 via-purple-900 to-black text-white">

        {/* HERO */}
        <section className="min-h-screen flex flex-col items-center justify-center text-center px-6">

          {/* Accessible hidden H1 for SEO — brand name is visual, this is semantic */}
          <h1 className="sr-only">
            CodePilot AI — AI Tools for Developers
          </h1>

          <p
            aria-hidden="true"
            className="text-6xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text"
          >
            CodePilot AI
          </p>

          <p className="mt-6 text-lg text-gray-300 max-w-xl">
            Your AI copilot for coding and career growth. Generate code,
            improve resumes, and build faster using AI tools.
          </p>

          <div className="mt-8 flex gap-4 flex-wrap justify-center">
            <Link
              href="/dashboard"
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105 transition shadow-lg font-semibold"
            >
              Enter Dashboard
            </Link>
            <Link
              href="/blog"
              className="px-8 py-3 rounded-xl border border-white/20 hover:bg-white/10 transition font-semibold"
            >
              Read Developer Guides →
            </Link>
          </div>

        </section>

        {/* FEATURES */}
        <section className="py-24 px-10 max-w-6xl mx-auto">

          <h2 className="text-4xl font-bold text-center mb-16">
            Powerful AI Features
          </h2>

          <div className="grid md:grid-cols-3 gap-10">

            <FeatureCard
              title="AI Code Explainer"
              desc="Paste any code and instantly understand how it works with AI explanations."
              img="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80"
              href="/tools/code-explainer"
            />

            <FeatureCard
              title="Regex Generator"
              desc="Generate complex regex patterns in seconds using natural language."
              img="https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80"
              href="/tools/regex-generator"
            />

            <FeatureCard
              title="SQL Query Builder"
              desc="Convert plain English into powerful SQL queries instantly."
              img="https://images.unsplash.com/photo-1542831371-d531d36971e6?w=600&q=80"
              href="/tools/sql-generator"
            />

          </div>

        </section>

        {/* RESUME BUILDER SECTION */}
        <section className="py-24 bg-black px-10">

          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">

            <div className="relative h-72 rounded-xl overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80"
                alt="AI Resume Builder for developers — CodePilot AI"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            <div>
              <h2 className="text-4xl font-bold">
                AI Resume Builder
              </h2>

              <p className="mt-6 text-gray-300">
                Build professional resumes in minutes. AI improves your bullet
                points, adds strong action verbs, and increases ATS score.
              </p>

              <ul className="mt-6 space-y-2 text-gray-400">
                <li>✔ AI bullet point improvement</li>
                <li>✔ ATS optimization</li>
                <li>✔ Export resume as PDF</li>
              </ul>

              <Link
                href="/resume-builder"
                className="mt-8 inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105 transition shadow-lg font-semibold"
              >
                Build Your Resume Free →
              </Link>
            </div>

          </div>

        </section>

        {/* BLOG SECTION */}
        <section className="py-24 px-10 max-w-6xl mx-auto">

          <h2 className="text-4xl font-bold text-center mb-6">
            Developer Guides & Tutorials
          </h2>

          <p className="text-center text-gray-400 mb-12">
            Learn how to use AI to code faster, build better resumes, and ace interviews.
          </p>

          <div className="text-center">
            <Link
              href="/blog"
              className="px-8 py-3 rounded-xl border border-purple-500 text-purple-400 hover:bg-purple-500/10 transition font-semibold"
            >
              Browse All Guides →
            </Link>
          </div>

        </section>

        {/* CTA */}
        <section className="py-24 text-center">

          <h2 className="text-4xl font-bold">
            Start Building with AI Today
          </h2>

          <p className="mt-4 text-gray-400">
            Join developers using CodePilot AI to work faster and smarter.
          </p>

          <Link
            href="/dashboard"
            className="mt-8 inline-block px-10 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg hover:scale-105 transition font-semibold"
          >
            Get Started — It&apos;s Free
          </Link>

        </section>

      </div>
    </>
  );
}

function FeatureCard({ title, desc, img, href }) {
  return (
    <Link
      href={href}
      className="bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden border border-white/10 hover:scale-105 transition block"
    >
      <div className="relative h-40 w-full">
        <Image
          src={img}
          alt={`${title} — CodePilot AI`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="mt-3 text-gray-300">{desc}</p>
      </div>
    </Link>
  );
}