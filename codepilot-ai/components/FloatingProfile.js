import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function FloatingProfile() {
  const router = useRouter();
  const [isLogged, setIsLogged] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Check login status on mount and on route change
    const checkStatus = () => {
        setIsLogged(!!localStorage.getItem("token"));
    };
    
    checkStatus();
    router.events.on('routeChangeComplete', checkStatus);

    return () => {
        router.events.off('routeChangeComplete', checkStatus);
    }
  }, [router.events]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isLogged) return null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLogged(false);
    setIsOpen(false);
    toast.success("Logged out successfully");
    router.push("/signin");
  };

  return (
    <div className="fixed top-6 right-6 z-[10000]" ref={dropdownRef}>
      <div className="relative">
        
        {/* Floating Avatar Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-[2px] shadow-[0_0_20px_rgba(99,102,241,0.5)] hover:shadow-[0_0_25px_rgba(99,102,241,0.8)] transition-all duration-300 hover:scale-105 group"
          title="Account Menu"
        >
          <div className="w-full h-full bg-[#060813] rounded-full flex items-center justify-center relative overflow-hidden select-none">
             <span className="relative z-10 font-bold text-sm text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 group-hover:text-white transition-colors">KS</span>
          </div>
        </button>

        {/* Dropdown Card */}
        {isOpen && (
          <div className="absolute right-0 mt-3 w-52 rounded-2xl bg-[#0a0d20]/90 backdrop-blur-xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden pointer-events-auto transform origin-top-right transition-all animate-in fade-in zoom-in-95 duration-200">
            {/* Inner subtle glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 pointer-events-none" />
            
            <ul className="flex flex-col py-2 relative z-10">
              <li className="px-4 py-2 border-b border-white/5 mb-1 cursor-default select-none">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest hidden sm:block">Account Menu</span>
              </li>
              
              <li>
                <Link
                  href="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  My Profile
                </Link>
              </li>
              
              <li>
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Dashboard
                </Link>
              </li>

              <li className="mt-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer text-left"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
