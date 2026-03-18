import "@/styles/globals.css";
import { Toaster } from "react-hot-toast";
import Snowfall from "react-snowfall";
import FloatingProfile from "../components/FloatingProfile";
import Footer from "../components/Footer";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import "highlight.js/styles/github-dark.css";
import Hero from "@/components/Hero";
const protectedRoutes = ["/dashboard", "/tools", "/resume-builder", "/profile"];

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const isProtectedRoute = protectedRoutes.some(route => router.pathname.startsWith(route));
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (isProtectedRoute) {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthorized(false);
        router.replace("/signin");
      } else {
        setIsAuthorized(true);
      }
    } else {
      setIsAuthorized(true);
    }
  }, [router.pathname, isProtectedRoute]);

  // Prevent flash of protected content prior to verifying auth
  const shouldRender = !isProtectedRoute || isAuthorized;

  return (
    <div className="flex flex-col min-h-screen">
      <Toaster position="top-center" />
      <FloatingProfile />
      <Snowfall 
        snowflakeCount={50}
        style={{
          position: 'fixed',
          width: '100vw',
          height: '100vh',
          zIndex: 9999,
          pointerEvents: 'none'
        }}
        color="rgba(255, 255, 255, 0.5)"
      />
      
      {/* Main Content Area */}
      <main className="flex-grow">
        
        {shouldRender ? (
          <Component {...pageProps} />
        ) : (
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-950 to-black text-white">
            <svg className="animate-spin h-10 w-10 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}
      </main>
<Hero />
      {/* Global Footer */}
      <Footer />
    </div>
  );
}
