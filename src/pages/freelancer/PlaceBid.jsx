import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase/config";
import { doc, getDoc, addDoc, collection, serverTimestamp, query, where, getDocs } from "firebase/firestore";

export default function PlaceBid() {
  const { gigId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    proposal: "",
    price: "",
    deliveryTime: "",
    githubLink: "",
  });

  useEffect(() => {
    const fetchGig = async () => {
      const gigSnap = await getDoc(doc(db, "gigs", gigId));
      if (!gigSnap.exists() || gigSnap.data().status !== "OPEN") {
        navigate("/freelancer/browse");
        return;
      }
      setGig({ id: gigSnap.id, ...gigSnap.data() });

      const existing = await getDocs(
        query(collection(db, "bids"), where("gigId", "==", gigId), where("freelancerId", "==", user.uid))
      );
      if (!existing.empty) {
        navigate("/freelancer/browse");
        return;
      }
      setLoading(false);
    };
    fetchGig();
  }, [gigId, user, navigate]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const profileSnap = await getDoc(doc(db, "users", user.uid));
      const profileData = profileSnap.data();
      await addDoc(collection(db, "bids"), {
        gigId,
        gigTitle: gig.title,
        freelancerId: user.uid,
        freelancerName: profileData?.name || "Freelancer",
        proposal: form.proposal,
        price: Number(form.price),
        deliveryTime: form.deliveryTime,
        githubLink: form.githubLink,
        status: "PENDING",
        createdAt: serverTimestamp(),
      });
      navigate("/freelancer/bids");
    } catch (err) {
      setError("Failed to place bid. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111110] flex items-center justify-center text-sm text-[#5F5E5A]">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111110] text-[#f0ede4]">
      <div className="flex">

        {/* SIDEBAR */}
        <aside className="w-56 min-h-screen bg-[#161614] border-r border-white/6 flex flex-col fixed top-0 left-0">
          <div className="px-6 py-5 border-b border-white/6">
            <div className="text-lg font-extrabold tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
              Gig<span className="text-[#EF9F27]">Flow</span>
            </div>
            <div className="text-xs text-[#5F5E5A] mt-0.5">Freelancer panel</div>
          </div>
          <nav className="flex flex-col gap-1 px-3 py-4">
            {[
              { label: "Dashboard", path: "/freelancer/dashboard", icon: "▦" },
              { label: "Browse gigs", path: "/freelancer/browse", icon: "⊞" },
              { label: "My bids", path: "/freelancer/bids", icon: "≡" },
            ].map(({ label, path, icon }) => (
              <button
                key={label}
                onClick={() => navigate(path)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left transition-all ${
                  window.location.pathname === path
                    ? "bg-[#1D9E75]/10 text-[#1D9E75]"
                    : "text-[#888780] hover:text-[#f0ede4] hover:bg-white/4"
                }`}
              >
                <span>{icon}</span>
                {label}
              </button>
            ))}
          </nav>
        </aside>

        {/* MAIN */}
        <main className="ml-56 flex-1 p-8 max-w-2xl">
          <button
            onClick={() => navigate("/freelancer/browse")}
            className="text-xs text-[#5F5E5A] hover:text-[#1D9E75] transition-colors mb-6 flex items-center gap-1"
          >
            ← Back to gigs
          </button>

          {/* GIG SUMMARY */}
          <div className="bg-[#161614] border border-white/6 rounded-xl px-6 py-5 mb-6">
            <div className="text-xs text-[#5F5E5A] mb-1">You're bidding on</div>
            <div className="text-base font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>{gig?.title}</div>
            <p className="text-xs text-[#5F5E5A] mt-1 leading-relaxed">{gig?.description}</p>
            <div className="flex items-center justify-between mt-3">
              <div className="flex gap-2 flex-wrap">
                {gig?.skills?.map((s) => (
                  <span key={s} className="text-xs bg-white/5 text-[#888780] px-2 py-0.5 rounded-full">{s}</span>
                ))}
              </div>
              <div className="text-sm font-bold text-[#EF9F27]">₹{gig?.budget}</div>
            </div>
          </div>

          {/* BID FORM */}
          <div className="bg-[#161614] border border-white/6 rounded-xl p-7">
            <h2 className="text-base font-bold mb-6" style={{ fontFamily: "'Syne', sans-serif" }}>Your proposal</h2>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-4 py-3 rounded-lg mb-5">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#888780]">Short proposal</label>
                <textarea
                  name="proposal"
                  value={form.proposal}
                  onChange={handleChange}
                  placeholder="Why are you the right fit? Describe your approach..."
                  required
                  rows={4}
                  className="bg-[#1e1e1c] border border-white/8 rounded-lg px-4 py-2.5 text-sm text-[#f0ede4] placeholder-[#5F5E5A] outline-none focus:border-[#1D9E75]/50 transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-[#888780]">Your price (₹)</label>
                  <input
                    name="price"
                    type="number"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="e.g. 4500"
                    required
                    className="bg-[#1e1e1c] border border-white/8 rounded-lg px-4 py-2.5 text-sm text-[#f0ede4] placeholder-[#5F5E5A] outline-none focus:border-[#1D9E75]/50 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-[#888780]">Delivery time</label>
                  <input
                    name="deliveryTime"
                    value={form.deliveryTime}
                    onChange={handleChange}
                    placeholder="e.g. 5 days"
                    required
                    className="bg-[#1e1e1c] border border-white/8 rounded-lg px-4 py-2.5 text-sm text-[#f0ede4] placeholder-[#5F5E5A] outline-none focus:border-[#1D9E75]/50 transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#888780]">Skill proof <span className="text-[#5F5E5A]">(GitHub / portfolio link)</span></label>
                <input
                  name="githubLink"
                  value={form.githubLink}
                  onChange={handleChange}
                  placeholder="https://github.com/..."
                  className="bg-[#1e1e1c] border border-white/8 rounded-lg px-4 py-2.5 text-sm text-[#f0ede4] placeholder-[#5F5E5A] outline-none focus:border-[#1D9E75]/50 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="bg-[#1D9E75] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#5DCAA5] hover:text-[#111110] transition-all disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit bid"}
              </button>

            </form>
          </div>
        </main>
      </div>
    </div>
  );
}    