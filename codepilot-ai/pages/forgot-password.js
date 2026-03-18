import { useState } from "react";
import API from "../utils/api";
import { toast } from "react-hot-toast";
import Link from "next/link";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/forgot-password", { email });

      toast.success("Reset link sent to your email 📩");

    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-950 to-black text-white">

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-10 w-full max-w-md shadow-2xl">

        <h2 className="text-3xl font-bold text-center mb-2">
          Forgot Password
        </h2>

        <p className="text-gray-400 text-center mb-6 text-sm">
          Enter your email and we'll send a reset link.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <input
            type="email"
            required
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/40 focus:outline-none"
          />

          <button className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-lg hover:scale-[1.02] transition">
            Send Reset Link
          </button>

        </form>

        <p className="text-sm text-gray-400 mt-6 text-center">
          Remember your password?{" "}
          <Link href="/signin" className="text-purple-400 underline">
            Sign In
          </Link>
        </p>

      </div>

    </div>
  );
}