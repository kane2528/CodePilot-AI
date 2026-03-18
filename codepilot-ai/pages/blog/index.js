// pages/blog/index.js
import Link from "next/link";
import Image from "next/image";
import SEO from "../../components/SEO";

const posts = [
  {
    slug: "best-ai-tools-for-developers-2025",
    title: "Best AI Tools for Developers in 2025 (Free + Paid)",
    description:
      "Discover the best AI tools for developers in 2025. From code explainers to SQL generators and resume builders — ranked and reviewed.",
    category: "Listicle",
    date: "2026-03-01",
    readTime: "8 min",
    img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
  },
  {
    slug: "how-to-explain-code-using-ai",
    title: "How to Explain Code Using AI: A Developer's Complete Guide (2025)",
    description:
      "Learn how AI can explain complex code in plain English. Step-by-step guide with examples in Python, JavaScript, and C++.",
    category: "Tutorial",
    date: "2026-03-05",
    readTime: "6 min",
    img: "https://images.unsplash.com/photo-1542831371-d531d36971e6?w=800&q=80",
  },
];

export default function Blog() {
  return (
    <>
      <SEO
        title="Developer Blog — AI Guides & Tutorials | CodePilot AI"
        description="Learn how to use AI tools to explain code, generate SQL queries, build ATS resumes, and ace coding interviews. Developer guides and tutorials by CodePilot AI."
        keywords="AI developer blog, AI coding tutorials, SQL generator guide, AI code explainer tutorial, developer productivity tips"
        canonical="/blog"
      />

      <div className="bg-gradient-to-br from-indigo-950 via-purple-900 to-black text-white min-h-screen">
        <section className="max-w-5xl mx-auto px-6 py-20">

          <div className="text-center mb-16">
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text mb-4">
              Developer Guides & Tutorials
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Learn how to use AI tools to code faster, prepare for interviews, and build standout resumes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl overflow-hidden transition hover:scale-[1.02] hover:shadow-xl block"
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={post.img}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <span className="absolute top-3 left-3 px-2 py-1 text-xs font-semibold bg-purple-600/80 text-white rounded-full">
                    {post.category}
                  </span>
                </div>

                <div className="p-6">
                  <h2 className="text-xl font-bold leading-snug group-hover:text-purple-300 transition mb-3">
                    {post.title}
                  </h2>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {post.description}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </time>
                    <span>·</span>
                    <span>{post.readTime} read</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* More coming soon */}
          <div className="mt-16 text-center border border-white/10 rounded-2xl p-10 bg-white/5">
            <p className="text-gray-400 mb-6 text-lg">
              More guides are coming soon. Try CodePilot AI&apos;s tools while you wait.
            </p>
            <Link
              href="/dashboard"
              className="inline-block px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105 transition font-semibold"
            >
              Explore AI Tools →
            </Link>
          </div>

        </section>
      </div>
    </>
  );
}
