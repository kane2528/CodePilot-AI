import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useRef, useEffect } from "react";
import API from "../utils/api";

export default function Sidebar() {
  const router = useRouter();
  const sidebarRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const fetchUser = async () => {
    try {
      const res = await API.get('/profile/me');
      setUser(res.data.data);
    } catch (err) {
      console.error("Sidebar user fetch failed", err);
    }
  };

  useEffect(() => {
    fetchUser();
    // Refresh user data occasionally or on route change
    const handleRouteChange = () => fetchUser();
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => router.events.off('routeChangeComplete', handleRouteChange);
  }, []);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const res = await API.post('/payment/create-order');
      const { order_id, key } = res.data;

      const options = {
        key,
        amount: 1500,
        currency: "INR",
        name: "CodePilot AI Pro",
        description: "Unlimited Daily Access",
        order_id,
        handler: async (response) => {
          await API.post('/payment/verify', {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
          });
          alert("Upgrade Successful!");
          fetchUser();
        },
        prefill: { name: user?.firstName, email: user?.email },
        theme: { color: "#6366f1" },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert("Upgrade failed: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };
  
  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: "🏠" },
    { name: "AI Tools", href: "/tools", icon: "⚡" },
    { name: "Resume Builder", href: "/resume-builder", icon: "📄" },
    { name: "Pricing", href: "/pricing", icon: "💎" },
  ];

  const handleMouseMove = (e) => {
    if (!sidebarRef.current) return;
    const rect = sidebarRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const usageLimit = 10;
  const currentUsage = user?.usageCount || 0;
  const isPro = user?.isPro || false;

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
        {/* Usage Card */}
        {!isPro && (
          <div className="mb-6 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-4">
             <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Daily Usage</span>
                <span className={`text-xs font-bold ${currentUsage >= usageLimit ? 'text-red-400' : 'text-indigo-400'}`}>
                  {currentUsage}/{usageLimit}
                </span>
             </div>
             <div className="w-full bg-white/5 rounded-full h-1.5 mb-3 overflow-hidden">
                <div 
                  className={`h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500`}
                  style={{ width: `${Math.min((currentUsage / usageLimit) * 100, 100)}%` }}
                />
             </div>
             <button 
              onClick={handleUpgrade}
              disabled={loading}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold rounded-lg transition-all shadow-[0_4px_10px_rgba(79,70,229,0.3)] hover:shadow-[0_4px_15px_rgba(79,70,229,0.5)] active:scale-95 disabled:opacity-50"
             >
                {loading ? "PROCESSING..." : "UPGRADE TO PRO"}
             </button>
          </div>
        )}

        {/* User Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/5 mb-5 group hover:border-indigo-500/20 hover:bg-white/[0.04] transition-all duration-300 cursor-pointer relative overflow-hidden">
          <Link href="/profile" className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-[2px] group-hover:shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all duration-300">
              <div className="w-full h-full bg-[#060813] rounded-full flex items-center justify-center relative overflow-hidden">
                 <span className="relative z-10 font-bold text-sm text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                   {user?.firstName?.substring(0, 1)}{user?.lastName?.substring(0, 1)}
                 </span>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors">
                {user?.firstName || "User"}
              </p>
              <p className="text-xs text-indigo-400/80 group-hover:text-indigo-300 transition-colors">
                {isPro ? "Pro Plan ✨" : "Free Plan →"}
              </p>
            </div>
          </Link>
        </div>

        {/* Footer info */}
        <div className="flex justify-between items-center text-[11px] text-gray-500 font-medium px-2">
            <span>© 2026 CodePilot</span>
            <span className="hover:text-indigo-400 cursor-pointer transition-colors px-2 py-1 rounded bg-white/5">v2.5.0</span>
        </div>
      </div>
    </div>
  );
}