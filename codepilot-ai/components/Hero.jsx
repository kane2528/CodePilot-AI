// components/Hero.jsx
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative bg-black text-white overflow-hidden">
      
      {/* subtle gradient glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent pointer-events-none" />

      <div className="relative max-w-4xl mx-auto text-center">

        {/* PARAGRAPH HERO */}
        <p className="text-xs text-gray-300 leading-relaxed">
          <span className="text-white font-semibold">CodePilot AI</span> is an all-in-one 
          <span className="text-white"> AI-powered developer platform</span> designed to help 
          programmers write, understand, and optimize code faster. Use powerful tools like 
          <span className="text-white"> AI code explainer</span>, 
          <span className="text-white"> SQL query generator</span>, 
          <span className="text-white"> regex generator</span>, 
          <span className="text-white"> code reviewer</span>, 
          <span className="text-white"> interview preparation assistant</span>, and an 
          <span className="text-white"> ATS-friendly resume builder</span> to boost productivity, 
          debug efficiently, and build professional developer workflows with cutting-edge AI.
        </p>

        {/* CTA BUTTONS */}
        

        {/* TRUST LINE */}
        <p className="text-xs text-gray-500">
          Built for developers to save hours of work ⚡
        </p>

      </div>
    </section>
  );
}