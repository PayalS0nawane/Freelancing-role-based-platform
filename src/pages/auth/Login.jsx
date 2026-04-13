import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { auth } from "../../firebase/config";

export default function Login() {
  const { login, role } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  

  const handleLogin = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);
  try {
    const cred = await login(email, password);
    const snap = await getDoc(doc(db, "users", auth.currentUser.uid));
    const userRole = snap.data()?.role;
    if (userRole === "client") navigate("/client/dashboard");
    else navigate("/freelancer/dashboard");
  } catch (err) {
    setError("Invalid email or password.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-[#111110] flex items-center justify-center px-4">

      <div className="w-full max-w-sm">

        {/* LOGO */}
        <div className="text-center mb-8">
          <div className="text-2xl font-extrabold tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
            Gig<span className="text-[#EF9F27]">Flow</span>
          </div>
          <p className="text-[#5F5E5A] text-sm mt-1">Welcome back</p>
        </div>

        {/* CARD */}
        <div className="bg-[#161614] border border-white/8 rounded-2xl p-8">
          <h2 className="text-lg font-bold mb-6 text-[#f0ede4]" style={{ fontFamily: "'Syne', sans-serif" }}>
            Log in to your account
          </h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-4 py-3 rounded-lg mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-4">

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#888780]">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="bg-[#1e1e1c] border border-white/8 rounded-lg px-4 py-2.5 text-sm text-[#f0ede4] placeholder-[#5F5E5A] outline-none focus:border-[#EF9F27]/50 transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#888780]">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-[#1e1e1c] border border-white/8 rounded-lg px-4 py-2.5 text-sm text-[#f0ede4] placeholder-[#5F5E5A] outline-none focus:border-[#EF9F27]/50 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-[#EF9F27] text-[#1a1208] py-2.5 rounded-lg text-sm font-medium hover:bg-[#FAC775] transition-all mt-1 disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>

          </form>

          <p className="text-center text-xs text-[#5F5E5A] mt-6">
            Don't have an account?{" "}
            <span onClick={() => navigate("/register")} className="text-[#EF9F27] cursor-pointer hover:text-[#FAC775] transition-colors">
              Sign up
            </span>
          </p>
        </div>

      </div>
    </div>
  );
}