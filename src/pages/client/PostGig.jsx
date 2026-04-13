import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function PostGig() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    skills: "",
    budget: "",
    deadline: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await addDoc(collection(db, "gigs"), {
        title: form.title,
        description: form.description,
        skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
        budget: Number(form.budget),
        deadline: form.deadline,
        clientId: user.uid,
        status: "OPEN",
        createdAt: serverTimestamp(),
      });
      navigate("/client/gigs");
    } catch (err) {
      setError("Failed to post gig. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111110] text-[#f0ede4]">
      <div className="flex">

        {/* SIDEBAR */}
        <aside className="w-56 min-h-screen bg-[#161614] border-r border-white/6 flex flex-col fixed top-0 left-0">
          <div className="px-6 py-5 border-b border-white/6">
            <div className="text-lg font-extrabold tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
              Gig<span className="text-[#EF9F27]">Flow</span>
            </div>
            <div className="text-xs text-[#5F5E5A] mt-0.5">Client panel</div>
          </div>
          <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
            {[
              { label: "Dashboard", path: "/client/dashboard", icon: "▦" },
              { label: "Post a gig", path: "/client/post-gig", icon: "＋" },
              { label: "My gigs", path: "/client/gigs", icon: "≡" },
            ].map(({ label, path, icon }) => (
              <button
                key={label}
                onClick={() => navigate(path)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left transition-all ${
                  window.location.pathname === path
                    ? "bg-[#EF9F27]/10 text-[#EF9F27]"
                    : "text-[#888780] hover:text-[#f0ede4] hover:bg-white/4"
                }`}
              >
                <span className="text-base">{icon}</span>
                {label}
              </button>
            ))}
          </nav>
        </aside>

        {/* MAIN */}
        <main className="ml-56 flex-1 p-8 max-w-2xl">
          <div className="mb-8">
            <button onClick={() => navigate("/client/gigs")} className="text-xs text-[#5F5E5A] hover:text-[#EF9F27] transition-colors mb-4 flex items-center gap-1">
              ← Back to gigs
            </button>
            <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>Post a gig</h1>
            <p className="text-sm text-[#5F5E5A] mt-1">Fill in the details — freelancers will bid on this.</p>
          </div>

          <div className="bg-[#161614] border border-white/6 rounded-xl p-7">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-4 py-3 rounded-lg mb-5">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#888780]">Gig title</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Build a React dashboard"
                  required
                  className="bg-[#1e1e1c] border border-white/8 rounded-lg px-4 py-2.5 text-sm text-[#f0ede4] placeholder-[#5F5E5A] outline-none focus:border-[#EF9F27]/50 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#888780]">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe the work in detail..."
                  required
                  rows={4}
                  className="bg-[#1e1e1c] border border-white/8 rounded-lg px-4 py-2.5 text-sm text-[#f0ede4] placeholder-[#5F5E5A] outline-none focus:border-[#EF9F27]/50 transition-all resize-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#888780]">Required skills <span className="text-[#5F5E5A]">(comma separated)</span></label>
                <input
                  name="skills"
                  value={form.skills}
                  onChange={handleChange}
                  placeholder="e.g. React, Node.js, Firebase"
                  required
                  className="bg-[#1e1e1c] border border-white/8 rounded-lg px-4 py-2.5 text-sm text-[#f0ede4] placeholder-[#5F5E5A] outline-none focus:border-[#EF9F27]/50 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-[#888780]">Budget (₹ fixed)</label>
                  <input
                    name="budget"
                    type="number"
                    value={form.budget}
                    onChange={handleChange}
                    placeholder="e.g. 5000"
                    required
                    className="bg-[#1e1e1c] border border-white/8 rounded-lg px-4 py-2.5 text-sm text-[#f0ede4] placeholder-[#5F5E5A] outline-none focus:border-[#EF9F27]/50 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-[#888780]">Deadline</label>
                  <input
                    name="deadline"
                    type="date"
                    value={form.deadline}
                    onChange={handleChange}
                    required
                    className="bg-[#1e1e1c] border border-white/8 rounded-lg px-4 py-2.5 text-sm text-[#f0ede4] outline-none focus:border-[#EF9F27]/50 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-[#EF9F27] text-[#1a1208] py-2.5 rounded-lg text-sm font-medium hover:bg-[#FAC775] transition-all mt-1 disabled:opacity-50"
              >
                {loading ? "Posting..." : "Post gig"}
              </button>

            </form>
          </div>
        </main>
      </div>
    </div>
  );
}