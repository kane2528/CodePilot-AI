// pages/blog/[slug].js
import Link from "next/link";
import SEO from "../../components/SEO";

// Static blog data — replace with CMS/API/MDX when ready
const blogPosts = {
  "best-ai-tools-for-developers-2025": {
    title: "Best AI Tools for Developers in 2025 (Free + Paid)",
    description:
      "Discover the best AI tools for developers in 2025. From code explainers to SQL generators and resume builders — ranked and reviewed.",
    category: "Listicle",
    date: "2026-03-01",
    readTime: "8 min read",
    ogImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80",
    content: [
      {
        heading: "Why Developers Need AI Tools in 2025",
        body: "AI has fundamentally changed how developers write, understand, and review code. From auto-completing functions to generating entire SQL queries from plain English, AI developer tools are no longer optional — they're essential.",
      },
      {
        heading: "1. CodePilot AI — Best All-in-One AI Tool for Developers",
        body: "CodePilot AI bundles code explanation, SQL generation, regex building, code review, interview prep, and resume building into one platform. It's built specifically for developers and is free to start.",
      },
      {
        heading: "2. GitHub Copilot — Best for IDE Integration",
        body: "GitHub Copilot integrates directly into VS Code and IntelliJ. It excels at auto-completing code but lacks the standalone tools that CodePilot AI offers.",
      },
      {
        heading: "3. ChatGPT — Best for General Coding Questions",
        body: "ChatGPT is a versatile tool but requires manual prompting for coding tasks. CodePilot AI is purpose-built for developer workflows.",
      },
      {
        heading: "Frequently Asked Questions",
        faqs: [
          {
            q: "What is the best AI tool for developers in 2025?",
            a: "CodePilot AI is the best all-in-one AI tool for developers, offering code explanation, SQL generation, and resume building.",
          },
          {
            q: "Are there free AI tools for developers?",
            a: "Yes. CodePilot AI offers a free plan. GitHub Copilot has a free tier for individual developers.",
          },
          {
            q: "Can AI replace developers?",
            a: "No. AI tools assist developers by handling repetitive tasks, but creative problem-solving and system design still require human expertise.",
          },
        ],
      },
    ],
  },
  "how-to-explain-code-using-ai": {
    title: "How to Explain Code Using AI: A Developer's Complete Guide (2025)",
    description:
      "Learn how AI can explain complex code in plain English. Step-by-step guide with examples in Python, JavaScript, and C++ using CodePilot AI.",
    category: "Tutorial",
    date: "2026-03-05",
    readTime: "6 min read",
    ogImage: "https://images.unsplash.com/photo-1542831371-d531d36971e6?w=1200&q=80",
    content: [
      {
        heading: "Why Developers Struggle to Understand Code",
        body: "Reading unfamiliar code — especially legacy codebases or open-source libraries — is one of the hardest things a developer faces. AI code explainers make this dramatically easier.",
      },
      {
        heading: "What Is an AI Code Explainer?",
        body: "An AI code explainer is a tool that takes any code snippet and returns a plain-English explanation of what each line does, how the logic flows, and what patterns are being used.",
      },
      {
        heading: "How to Use CodePilot AI's Code Explainer",
        body: "1. Go to codepilotai.com/tools/code-explainer\n2. Select your programming language\n3. Paste your code\n4. Click 'Explain Code'\n5. Get a detailed, AI-powered explanation instantly.",
      },
      {
        heading: "When Should You Use an AI Code Explainer?",
        body: "Use an AI code explainer when: reviewing a PR you don't fully understand, onboarding into a new codebase, studying open-source libraries, or debugging complex logic.",
      },
      {
        heading: "Frequently Asked Questions",
        faqs: [
          {
            q: "Can AI explain any programming language?",
            a: "CodePilot AI supports JavaScript, Python, C++, Java, and many more languages.",
          },
          {
            q: "Is the AI code explainer free?",
            a: "Yes, CodePilot AI offers free uses. Sign up to get started immediately.",
          },
        ],
      },
    ],
  },
};

// Static paths for build
export async function getStaticPaths() {
  const paths = Object.keys(blogPosts).map((slug) => ({
    params: { slug },
  }));
  return { paths, fallback: "blocking" };
}

export async function getStaticProps({ params }) {
  const post = blogPosts[params.slug] || null;
  if (!post) return { notFound: true };
  return { props: { post, slug: params.slug }, revalidate: 86400 };
}

export default function BlogPost({ post, slug }) {
  const SITE_URL = "https://codepilotai.com";

  // Article JSON-LD Schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: post.ogImage,
    datePublished: post.date,
    author: {
      "@type": "Organization",
      name: "CodePilot AI",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "CodePilot AI",
      url: SITE_URL,
    },
    url: `${SITE_URL}/blog/${slug}`,
  };

  return (
    <>
      <SEO
        title={post.title}
        description={post.description}
        ogImage={post.ogImage}
        canonical={`/blog/${slug}`}
      />

      {/* Article JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <div className="bg-gradient-to-br from-indigo-950 via-purple-900 to-black text-white min-h-screen">
        <article className="max-w-3xl mx-auto px-6 py-20">

          {/* Breadcrumb */}
          <nav className="text-sm text-gray-400 mb-8" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white transition">Home</Link>
            {" / "}
            <Link href="/blog" className="hover:text-white transition">Blog</Link>
            {" / "}
            <span className="text-gray-300">{post.category}</span>
          </nav>

          {/* Header */}
          <header className="mb-12">
            <span className="inline-block px-3 py-1 text-xs font-semibold bg-purple-500/20 text-purple-300 rounded-full mb-4 border border-purple-500/30">
              {post.category}
            </span>
            <h1 className="text-4xl font-extrabold leading-tight mb-4">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>CodePilot AI Team</span>
              <span>·</span>
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <span>·</span>
              <span>{post.readTime}</span>
            </div>
          </header>

          {/* Intro CTA */}
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6 mb-12 text-center">
            <p className="text-gray-300 mb-3">
              Try the tool mentioned in this article — free, no credit card required.
            </p>
            <Link
              href="/tools/code-explainer"
              className="inline-block px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105 transition font-semibold text-sm"
            >
              Try CodePilot AI Free →
            </Link>
          </div>

          {/* Content */}
          <div className="prose prose-invert max-w-none space-y-10">
            {post.content.map((section, i) => (
              <section key={i}>
                {section.heading && (
                  <h2 className="text-2xl font-bold mb-4 text-white">
                    {section.heading}
                  </h2>
                )}
                {section.body && (
                  <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                    {section.body}
                  </p>
                )}
                {section.faqs && (
                  <div className="space-y-4 mt-4">
                    {section.faqs.map((faq, fi) => (
                      <div key={fi} className="bg-white/5 rounded-xl p-5 border border-white/10">
                        <h3 className="font-semibold text-white mb-2">{faq.q}</h3>
                        <p className="text-gray-400 text-sm">{faq.a}</p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>

          {/* End CTA */}
          <div className="mt-16 bg-gradient-to-r from-blue-500/10 to-purple-600/10 border border-purple-500/30 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-3">Try CodePilot AI for Free</h2>
            <p className="text-gray-400 mb-6">
              Join developers using AI to code faster, build better resumes, and ace interviews.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/dashboard"
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105 transition font-semibold"
              >
                Get Started Free
              </Link>
              <Link
                href="/blog"
                className="px-8 py-3 rounded-xl border border-white/20 hover:bg-white/10 transition font-semibold"
              >
                More Guides →
              </Link>
            </div>
          </div>

        </article>
      </div>
    </>
  );
}
