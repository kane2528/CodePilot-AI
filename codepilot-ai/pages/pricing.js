import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import API from "../utils/api";
import SEO from "../components/SEO";

export default function Pricing() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get('/profile/me');
        setUser(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);

  const handleUpgrade = async () => {
    if (!window.Razorpay) {
      alert("Razorpay SDK not loaded. Refresh the page.");
      return;
    }

    setLoading(true);

    try {
      const res = await API.post('/payment/create-order');
      const { order_id, key } = res.data;

      console.log("Order:", res.data); // debug

      const options = {
        key,
        amount: 1500,        // in paise → ₹15 (REQUIRED for UPI to appear)
        currency: "INR",     // REQUIRED for UPI to appear
        order_id,
        name: "CodePilot AI Pro",
        description: "Unlock Unlimited Access",

        handler: async (response) => {
          try {
            await API.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            alert("Upgrade Successful 🎉");
            window.location.reload();
          } catch (err) {
            alert("Verification failed");
            console.error(err);
          }
        },

        prefill: {
          name: user?.firstName || "User",
          email: user?.email || "test@example.com"
        },

        theme: {
          color: "#6366f1"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
      alert("Upgrade failed: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <SEO title="Pricing — Upgrade to CodePilot AI Pro" />

      <div className="max-w-4xl mx-auto py-12 text-center">
        <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Simple, Transparent Pricing
        </h1>

        <p className="text-gray-400 mb-12 text-lg">
          Choose the plan that's right for your development workflow.
        </p>

        <div className="grid md:grid-cols-2 gap-8">

          {/* FREE PLAN */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col items-center gap-6 backdrop-blur-xl">
            <div className="text-xl font-bold text-gray-400 uppercase tracking-widest">
              Free
            </div>

            <div className="text-5xl font-bold">
              ₹0<span className="text-lg text-gray-500 font-normal">/day</span>
            </div>

            <ul className="text-gray-300 flex flex-col gap-3 text-left w-full h-40">
              <li>✅ 10 AI Requests/day</li>
              <li>✅ Community Tools</li>
              <li>✅ Normal AI Speed</li>
              <li className="text-gray-500">❌ Unlimited Access</li>
            </ul>

            <button className="w-full py-4 border border-white/10 rounded-2xl text-gray-400 font-bold cursor-default">
              CURRENT PLAN
            </button>
          </div>

          {/* PRO PLAN */}
          <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/10 border border-indigo-500/40 rounded-3xl p-8 flex flex-col items-center gap-6 relative overflow-hidden backdrop-blur-xl">

            <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase">
              Popular
            </div>

            <div className="text-xl font-bold text-indigo-400 uppercase tracking-widest">
              Pro ✨
            </div>

            <div className="text-5xl font-bold">
              ₹15<span className="text-lg text-indigo-400/60 font-normal">/24h</span>
            </div>

            <ul className="text-gray-200 flex flex-col gap-3 text-left w-full h-40">
              <li>✅ Unlimited AI Requests</li>
              <li>✅ Premium AI Speed</li>
              <li>✅ Early Access to Tools</li>
              <li>✅ No Limits, Just Code</li>
            </ul>

            <button
              onClick={handleUpgrade}
              disabled={loading || user?.isPro}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold transition-all shadow-lg disabled:opacity-50"
            >
              {loading ? "PROCESSING..." : user?.isPro ? "PRO ACTIVE" : "UPGRADE NOW"}
            </button>

            {user?.isPro && (
              <p className="text-xs text-indigo-400">
                Expires: {new Date(user.proExpiry).toLocaleString()}
              </p>
            )}

          </div>
        </div>

        <p className="mt-12 text-gray-500 text-sm italic">
          Payments are securely processed via Razorpay. Pro access is valid for 24 hours.
        </p>
      </div>
    </Layout>
  );
}