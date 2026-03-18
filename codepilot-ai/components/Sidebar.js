import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useRef } from "react";

export default function Sidebar() {
  const router = useRouter();
  const sidebarRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  
  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: "🏠" },
    { name: "AI Tools", href: "/tools", icon: "⚡" },
    { name: "Resume Builder", href: "/resume-builder", icon: "📄" },
  ];

  const handleMouseMove = (e) => {
    if (!sidebarRef.current) return;
    const rect = sidebarRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div 
      ref={sidebarRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="w-[280px] min-h-screen bg-[#060813]/80 backdrop-blur-3xl border-r border-white/5 p-6 flex flex-col justify-between shadow-[10px_0_30px_rgba(0,0,0,0.5)] relative overflow-hidden transition-all duration-300"
    >
      
      {/* Dynamic Cursor Spotlight Effect */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-500 ease-in-out z-0"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(129, 140, 248, 0.12), transparent 45%)`,
        }}
      />

      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[300px] bg-indigo-600/10 blur-[100px] -z-10 rounded-full translate-x-[-20%] translate-y-[-20%] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-purple-600/10 blur-[100px] -z-10 rounded-full translate-x-[20%] translate-y-[20%] pointer-events-none"></div>

      <div className="relative z-10">
        {/* Logo Section */}
        <Link href="/" className="group flex items-center gap-4 mb-12 ml-2">
          <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-[0_0_20px_rgba(99,102,241,0.3)] group-hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] group-hover:scale-105 transition-all duration-300">
            <span className="text-white font-black text-2xl tracking-tighter">CP</span>
          </div>
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-gray-100 to-gray-400 text-transparent bg-clip-text group-hover:from-white group-hover:to-gray-300 transition-colors tracking-tight">
            CodePilot
          </h1>
        </Link>

        {/* Navigation */}
        <nav className="flex flex-col gap-2.5">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest pl-2 mb-2">Main Menu</div>
          {navItems.map((item) => {
            const isActive = router.pathname === item.href || router.pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3.5 px-3 py-3 rounded-xl transition-all duration-300 group relative ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-500/15 to-purple-500/5 border border-indigo-500/20 shadow-[0_0_15px_rgba(79,70,229,0.1)] text-white"
                    : "text-gray-400 hover:bg-white/[0.03] hover:text-gray-100 border border-transparent"
                }`}
              >
                {/* Shiny hover border effect inside links */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                     style={{
                        background: isHovered ? `radial-gradient(100px circle at ${mousePosition.x - 20}px ${mousePosition.y - 120}px, rgba(255,255,255,0.06), transparent)` : 'transparent'
                     }}
                />
                
                <div
                  className={`flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-300 relative z-10 ${
                    isActive
                      ? "bg-indigo-500/20 shadow-[inset_0_0_10px_rgba(99,102,241,0.2)] scale-110"
                      : "bg-white/5 group-hover:scale-110 group-hover:bg-white/10 group-hover:shadow-[inset_0_0_10px_rgba(255,255,255,0.05)]"
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                </div>
                <span className={`font-medium relative z-10 text-[15px] ${isActive ? "text-indigo-100 font-semibold" : ""}`}>
                  {item.name}
                </span>
                
                {isActive && (
                   <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.9)] animate-pulse relative z-10"></div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="relative z-10">
        {/* User Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/5 mb-5 group hover:border-indigo-500/20 hover:bg-white/[0.04] transition-all duration-300 cursor-pointer relative overflow-hidden">
          
          {/* Internal Shiny effect for card */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
               style={{
                 background: `radial-gradient(200px circle at ${mousePosition.x - 10}px ${mousePosition.y - 650}px, rgba(129, 140, 248, 0.15), transparent 40%)`
               }}
          />

          <Link href="/profile" className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-[2px] group-hover:shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all duration-300">
              <div className="w-full h-full bg-[#060813] rounded-full flex items-center justify-center relative overflow-hidden">
                 <span className="relative z-10 font-bold text-sm text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">KP</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors">My Profile</p>
              <p className="text-xs text-indigo-400/80 group-hover:text-indigo-300 transition-colors">View Profile →</p>
            </div>
          </Link>
        </div>

        {/* Footer info */}
        <div className="flex justify-between items-center text-[11px] text-gray-500 font-medium px-2">
            <span>© 2026 CodePilot</span>
            <span className="hover:text-indigo-400 cursor-pointer transition-colors px-2 py-1 rounded bg-white/5">v2.1.0</span>
        </div>
      </div>

    </div>
  );
}