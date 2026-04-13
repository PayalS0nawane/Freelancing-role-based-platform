import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../firebase/config";
import {
  doc, getDoc, addDoc, updateDoc,
  collection, serverTimestamp, increment
} from "firebase/firestore";

export default function LeaveFeedback() {
  const { gigId } = useParams();
  const navigate = useNavigate();
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    rating: 0,
    comment: "",
    skillFeedback: [],
  });

  const skillOptions = ["Communication", "Code quality", "On-time delivery", "Problem solving", "Creativity"];

  useEffect(() => {
    const fetchGig = async () => {
      const snap = await getDoc(doc(db, "gigs", gigId));
      if (!snap.exists() || snap.data().status !== "COMPLETED") {
        navigate("/client/gigs");
        return;
      }
      setGig({ id: snap.id, ...snap.data() });
      setLoading(false);
    };
    fetchGig();
  }, [gigId, navigate]);

  const toggleSkill = (skill) => {
    setForm((prev) => ({
      ...prev,
      skillFeedback: prev.skillFeedback.includes(skill)
        ? prev.skillFeedback.filter((s) => s !== skill)
        : [...prev.skillFeedback, skill],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.rating === 0) { setError("Please select a rating."); return; }
    setError("");
    setSubmitting(true);
    try {
      await addDoc(collection(db, "feedback"), {
        gigId,
        gigTitle: gig.title,
        freelancerId: gig.assignedFreelancerId,
        clientId: gig.clientId,
        rating: form.rating,
        comment: form.comment,
        skillFeedback: form.skillFeedback,
        createdAt: serverTimestamp(),
      });

      const scoreGain = Math.round((form.rating / 5) * 10);
      await updateDoc(doc(db, "users", gig.assignedFreelancerId), {
        qualityScore: increment(scoreGain),
        skillScore: increment(form.skillFeedback.length * 2),
      });

      await updateDoc(doc(db, "gigs", gigId), {
        feedbackLeft: true,
      });

      navigate("/client/gigs");
    } catch (err) {
      setError("Failed to submit feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#111110] flex items-center justify-center text-sm text-[#5F5E5A]">
      Loading...
    </div>
  );

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
          <nav className="flex flex-col gap-1 px-3 py-4">
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
                <span>{icon}</span>{label}
              </button>
            ))}
          </nav>
        </aside>

        {/* MAIN */}
        <main className="ml-56 flex-1 p-8 max-w-2xl">
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
              Leave feedback
            </h1>
            <p className="text-sm text-[#5F5E5A] mt-1">
              Your feedback updates the freelancer's skill score and quality rating.
            </p>
          </div>

          {/* GIG INFO */}
          <div className="bg-[#161614] border border-white/6 rounded-xl px-6 py-4 mb-6">
            <div className="text-xs text-[#5F5E5A] mb-0.5">Completed gig</div>
            <div className="text-sm font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>{gig?.title}</div>
          </div>

          <div className="bg-[#161614] border border-white/6 rounded-xl p-7">

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-4 py-3 rounded-lg mb-5">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">

              {/* STAR RATING */}
              <div className="flex flex-col gap-2">
                <label className="text-xs text-[#888780]">Overall rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setForm({ ...form, rating: star })}
                      className={`text-2xl transition-all ${
                        star <= form.rating ? "opacity-100" : "opacity-25"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                  {form.rating > 0 && (
                    <span className="text-xs text-[#5F5E5A] self-center ml-1">
                      {["", "Poor", "Fair", "Good", "Very good", "Excellent"][form.rating]}
                    </span>
                  )}
                </div>
              </div>

              {/* SKILL FEEDBACK */}
              <div className="flex flex-col gap-2">
                <label className="text-xs text-[#888780]">
                  Skill highlights <span className="text-[#5F5E5A]">(select all that apply)</span>
                </label>
                <div className="flex gap-2 flex-wrap">
                  {skillOptions.map((skill) => (
                    <button
                      type="button"
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                        form.skillFeedback.includes(skill)
                          ? "border-[#1D9E75]/50 bg-[#1D9E75]/10 text-[#5DCAA5]"
                          : "border-white/8 text-[#888780] hover:border-white/20"
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              {/* COMMENT */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#888780]">Comment</label>
                <textarea
                  value={form.comment}
                  onChange={(e) => setForm({ ...form, comment: e.target.value })}
                  placeholder="Share your experience working with this freelancer..."
                  required
                  rows={4}
                  className="bg-[#1e1e1c] border border-white/8 rounded-lg px-4 py-2.5 text-sm text-[#f0ede4] placeholder-[#5F5E5A] outline-none focus:border-[#EF9F27]/50 transition-all resize-none"
                />
              </div>

              {/* SCORE PREVIEW */}
              {(form.rating > 0 || form.skillFeedback.length > 0) && (
                <div className="bg-white/3 border border-white/6 rounded-lg px-4 py-3 text-xs text-[#888780]">
                  This feedback will add{" "}
                  <span className="text-[#EF9F27]">+{Math.round((form.rating / 5) * 10)} quality score</span>
                  {form.skillFeedback.length > 0 && (
                    <> and <span className="text-[#1D9E75]">+{form.skillFeedback.length * 2} skill score</span></>
                  )}{" "}
                  to the freelancer's profile.
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="bg-[#EF9F27] text-[#1a1208] py-2.5 rounded-lg text-sm font-medium hover:bg-[#FAC775] transition-all disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit feedback"}
              </button>

            </form>
          </div>
        </main>
      </div>
    </div>
  );
}