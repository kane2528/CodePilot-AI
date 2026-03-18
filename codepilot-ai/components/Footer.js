import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-purple-500/20 bg-black text-white">

      <div className="max-w-7xl mx-auto px-8 py-10 flex flex-col md:flex-row justify-between items-center gap-6">

        {/* Logo / Name */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <span className="text-xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
            CodePilot AI
          </span>
          <p className="text-sm text-gray-400 mt-1">
            Your AI copilot for coding and career
          </p>
        </div>

        {/* Links */}
        <div className="flex gap-6 text-gray-300 text-sm font-medium">

          <Link href="/dashboard" className="hover:text-purple-400 hover:scale-105 transition">
            Dashboard
          </Link>

          <Link href="/tools" className="hover:text-purple-400 hover:scale-105 transition">
            AI Tools
          </Link>

          <Link href="/resume-builder" className="hover:text-purple-400 hover:scale-105 transition">
            Resume Builder
          </Link>
          <Link href="/faq" className="hover:text-purple-400 hover:scale-105 transition">
            FAQs
          </Link>

        </div>

        {/* Copyright */}
        <div className="text-xs text-gray-500">
          © {new Date().getFullYear()} CodePilot AI
        </div>

      </div>

    </footer>
  );
}