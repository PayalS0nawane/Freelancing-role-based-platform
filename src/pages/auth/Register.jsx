import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useActionData, useNavigate } from "react-router-dom";
export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
  e.preventDefault();
  setError("");
  if (!role) { setError("Please select a role."); return; }
  setLoading(true);
  try {
    await register(name, email, password, role);
    if (role === "client") navigate("/client/dashboard");
    else navigate("/freelancer/dashboard");
  } catch (err) {
    setError("Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-[#111110] flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-sm">

        {/* LOGO */}
        <div className="text-center mb-8">
          <div className="text-2xl font-extrabold tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
            Gig<span className="text-[#EF9F27]">Flow</span>
          </div>
          <p className="text-[#5F5E5A] text-sm mt-1">Create your account</p>
        </div>

        {/* CARD */}
        <div className="bg-[#161614] border border-white/8 rounded-2xl p-8">
          <h2 className="text-lg font-bold mb-6 text-[#f0ede4]" style={{ fontFamily: "'Syne', sans-serif" }}>
            Join GigFlow
          </h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-4 py-3 rounded-lg mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="flex flex-col gap-4">

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#888780]">Full name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="your name"
                required
                className="bg-[#1e1e1c] border border-white/8 rounded-lg px-4 py-2.5 text-sm text-[#f0ede4] placeholder-[#5F5E5A] outline-none focus:border-[#EF9F27]/50 transition-all"
              />
            </div>

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

            {/* ROLE SELECTION */}
            <div className="flex flex-col gap-2">
              <label className="text-xs text-[#888780]">Select your role <span className="text-[#EF9F27]">*</span></label>
              <p className="text-xs text-[#5F5E5A] -mt-1">This cannot be changed later.</p>
              <div className="grid grid-cols-2 gap-2 mt-1">

                <div
                  onClick={() => setRole("client")}
                  className={`cursor-pointer rounded-xl border p-4 transition-all ${role === "client" ? "border-[#EF9F27]/60 bg-[#EF9F27]/8" : "border-white/8 bg-[#1e1e1c] hover:border-white/15"}`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm mb-2 ${role === "client" ? "bg-[#EF9F27]/20" : "bg-white/5"}`}>
                    💼
                  </div>
                  <div className="text-sm font-bold text-[#f0ede4]" style={{ fontFamily: "'Syne', sans-serif" }}>Client</div>
                  <div className="text-xs text-[#5F5E5A] mt-0.5 leading-relaxed">Post gigs & hire freelancers</div>
                  {role === "client" && (
                    <div className="mt-2 text-xs text-[#EF9F27] font-medium">Selected ✓</div>
                  )}
                </div>

                <div
                  onClick={() => setRole("freelancer")}
                  className={`cursor-pointer rounded-xl border p-4 transition-all ${role === "freelancer" ? "border-[#1D9E75]/60 bg-[#1D9E75]/8" : "border-white/8 bg-[#1e1e1c] hover:border-white/15"}`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm mb-2 ${role === "freelancer" ? "bg-[#1D9E75]/20" : "bg-white/5"}`}>
                    ⚡
                  </div>
                  <div className="text-sm font-bold text-[#f0ede4]" style={{ fontFamily: "'Syne', sans-serif" }}>Freelancer</div>
                  <div className="text-xs text-[#5F5E5A] mt-0.5 leading-relaxed">Browse gigs & place bids</div>
                  {role === "freelancer" && (
                    <div className="mt-2 text-xs text-[#1D9E75] font-medium">Selected ✓</div>
                  )}
                </div>

              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-[#EF9F27] text-[#1a1208] py-2.5 rounded-lg text-sm font-medium hover:bg-[#FAC775] transition-all mt-1 disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>

          </form>

          <p className="text-center text-xs text-[#5F5E5A] mt-6">
            Already have an account?{" "}
            <span onClick={() => navigate("/login")} className="text-[#EF9F27] cursor-pointer hover:text-[#FAC775] transition-colors">
              Log in
            </span>
          </p>
        </div>

      </div>
    </div>
  );
}