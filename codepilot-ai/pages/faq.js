// pages/faq.js
import SEO from "../components/SEO";

const faqs = [
  {
    q: "What is CodePilot AI?",
    a: "CodePilot AI is an AI-powered developer platform that helps programmers explain code, generate SQL queries, create regex patterns, review code, and build ATS-friendly resumes instantly.",
  },
  {
    q: "Is CodePilot AI free to use?",
    a: "Yes, CodePilot AI offers a free plan with limited usage. You can upgrade to a premium plan for unlimited access and advanced features.",
  },
  {
    q: "How does the AI Code Explainer work?",
    a: "You simply paste your code, and CodePilot AI analyzes it using advanced AI models to provide a clear, step-by-step explanation.",
  },
  {
    q: "Can I generate SQL queries using CodePilot AI?",
    a: "Yes, you can describe your requirements in plain English, and the AI will generate optimized SQL queries instantly.",
  },
  {
    q: "Does CodePilot AI help with interview preparation?",
    a: "Yes, it provides AI-generated interview questions based on difficulty levels such as easy, medium, hard, and advanced.",
  },
  {
    q: "Can I create a professional resume using CodePilot AI?",
    a: "Yes, the platform includes an ATS-friendly resume builder that generates resumes in Markdown and allows PDF download.",
  },
  {
    q: "Is my data secure?",
    a: "Yes, CodePilot AI uses secure authentication and follows best practices to ensure your data remains safe and private.",
  },
  {
    q: "Which AI model does CodePilot AI use?",
    a: "CodePilot AI uses advanced AI models like LLaMA via Groq to deliver fast and accurate results.",
  },
  {
    q: "Do I need coding experience to use CodePilot AI?",
    a: "No, beginners can also use the platform easily, as it is designed to simplify complex programming tasks.",
  },
  {
    q: "How can I get started?",
    a: "Simply sign up, choose a tool, and start using AI to improve your development workflow instantly.",
  },
];

// JSON-LD FAQ Schema
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.a,
    },
  })),
};

export default function FAQ() {
  return (
    <>
      <SEO
        title="FAQ — CodePilot AI | AI Tools for Developers"
        description="Find answers about CodePilot AI, including code explainer, SQL generator, regex generator, resume builder, pricing, and features."
        keywords="CodePilot AI FAQ, AI code explainer FAQ, SQL generator questions, AI resume builder help, CodePilot AI pricing"
        canonical="/faq"
      />

      {/* FAQ JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="bg-black text-white min-h-screen py-20 px-6">
        <div className="max-w-4xl mx-auto">

          <h1 className="text-4xl font-bold text-center">
            Frequently Asked Questions ❓
          </h1>

          <p className="text-gray-400 text-center mt-4">
            Everything you need to know about CodePilot AI
          </p>

          <div className="mt-12 space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-gray-900 p-6 rounded-xl border border-gray-800"
              >
                <h2 className="text-xl font-semibold">{faq.q}</h2>
                <p className="text-gray-400 mt-2">{faq.a}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <p className="text-gray-400 mb-4">Still have questions? Try CodePilot AI for free.</p>
            <a
              href="/dashboard"
              className="inline-block px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105 transition shadow-lg font-semibold text-white"
            >
              Get Started Free →
            </a>
          </div>

        </div>
      </section>
    </>
  );
}