import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../firebase/config";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";

export default function ReviewWork() {
  const { gigId } = useParams();
  const navigate = useNavigate();
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);

  useEffect(() => {
    const fetchGig = async () => {
      const snap = await getDoc(doc(db, "gigs", gigId));
      if (!snap.exists() || snap.data().status !== "SUBMITTED") {
        navigate("/client/gigs");
        return;
      }
      setGig({ id: snap.id, ...snap.data() });
      setLoading(false);
    };
    fetchGig();
  }, [gigId, navigate]);

  const handleAccept = async () => {
    setActing(true);
    await updateDoc(doc(db, "gigs", gigId), {
      status: "COMPLETED",
      completedAt: serverTimestamp(),
    });
    navigate(`/client/gigs/${gigId}/feedback`);
  };

  const handleRevision = async () => {
    setActing(true);
    await updateDoc(doc(db, "gigs", gigId), {
      status: "IN_PROGRESS",
      submittedFileLink: null,
      completionMessage: null,
      revisionRequestedAt: serverTimestamp(),
    });
    setGig((prev) => ({ ...prev, status: "IN_PROGRESS" }));
    setActing(false);
    navigate("/client/gigs");
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
          <button
            onClick={() => navigate("/client/gigs")}
            className="text-xs text-[#5F5E5A] hover:text-[#EF9F27] transition-colors mb-6 flex items-center gap-1"
          >
            ← Back to gigs
          </button>

          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
              Review submitted work
            </h1>
            <p className="text-sm text-[#5F5E5A] mt-1">Check the freelancer's submission and decide.</p>
          </div>

          {/* GIG INFO */}
          <div className="bg-[#161614] border border-white/6 rounded-xl px-6 py-5 mb-4">
            <div className="text-xs text-[#5F5E5A] mb-1">Gig</div>
            <div className="text-base font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>{gig?.title}</div>
            <div className="flex gap-2 mt-2 flex-wrap">
              {gig?.skills?.map((s) => (
                <span key={s} className="text-xs bg-white/5 text-[#888780] px-2 py-0.5 rounded-full">{s}</span>
              ))}
            </div>
          </div>

          {/* SUBMISSION */}
          <div className="bg-[#161614] border border-[#1D9E75]/20 rounded-xl px-6 py-5 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-[#1D9E75]"></div>
              <div className="text-xs text-[#5DCAA5] font-medium">Work submitted</div>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <div className="text-xs text-[#5F5E5A] mb-1">Completion message</div>
                <p className="text-sm text-[#f0ede4] leading-relaxed">{gig?.completionMessage}</p>
              </div>

              <div>
                <div className="text-xs text-[#5F5E5A] mb-1">Submitted file / link</div>
                <a
                  href={gig?.submittedFileLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-[#1D9E75] hover:underline break-all"
                >
                  {gig?.submittedFileLink}
                </a>
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="bg-[#161614] border border-white/6 rounded-xl px-6 py-5">
            <div className="text-sm font-bold mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>
              Your decision
            </div>
            <p className="text-xs text-[#5F5E5A] mb-5 leading-relaxed">
              Accepting marks the gig as completed and takes you to leave feedback.
              Requesting revision sends it back to the freelancer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleAccept}
                disabled={acting}
                className="flex-1 bg-[#1D9E75] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#5DCAA5] hover:text-[#111110] transition-all disabled:opacity-50"
              >
                Accept work ✓
              </button>
              <button
                onClick={handleRevision}
                disabled={acting}
                className="flex-1 border border-[#EF9F27]/30 text-[#FAC775] py-2.5 rounded-lg text-sm hover:bg-[#EF9F27]/8 transition-all disabled:opacity-50"
              >
                Request revision ↩
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}