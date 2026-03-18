import { useRouter } from "next/router";
import { useState } from "react";
import API from "../../utils/api";
import { toast } from "react-hot-toast";
import Link from "next/link";

export default function ResetPassword() {
  const router = useRouter();
  const { token } = router.query;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match!");
    }

    try {
      setLoading(true);
      await API.post("/auth/reset-password", {
        token,
        newPassword: password,
      });

      toast.success("Password reset successful 🔥");
      router.push("/signin");

    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-950 to-black text-white relative">
      
      {/* Floating Home Button */}
      <Link href="/" className="absolute top-6 left-6 p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:scale-110 transition-all text-gray-400 hover:text-white group z-50">
         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
         </svg>
      </Link>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-10 w-full max-w-md shadow-2xl relative z-10">

        <h2 className="text-3xl font-extrabold mb-2 text-center bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
          Reset Password
        </h2>

        <p className="text-gray-400 text-center mb-8 text-sm">
          Please enter your new password below.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          <div className="flex flex-col gap-1.5">
              <label className="text-sm text-gray-300 font-medium">New Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="p-3 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 focus:bg-white/10 focus:outline-none transition text-sm text-white"
              />
          </div>

          <div className="flex flex-col gap-1.5">
              <label className="text-sm text-gray-300 font-medium">Confirm New Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="p-3 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 focus:bg-white/10 focus:outline-none transition text-sm text-white"
              />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`mt-4 font-semibold text-lg bg-gradient-to-r from-blue-500 to-purple-600 p-3.5 rounded-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center justify-center gap-2 ${loading ? 'opacity-80 cursor-not-allowed scale-100' : 'hover:scale-[1.02]'}`}
          >
            {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Resetting...
                </>
            ) : "Reset Password"}
          </button>

        </form>

        <p className="text-sm text-gray-400 mt-6 text-center">
            Remember your password?{" "}
            <Link href="/signin" className="text-purple-400 font-semibold hover:text-purple-300 underline decoration-purple-500/30 underline-offset-4">
                Sign In
            </Link>
        </p>

      </div>

    </div>
  );
}