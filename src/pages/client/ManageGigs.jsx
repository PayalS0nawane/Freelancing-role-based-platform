import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function ManageGigs() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    const fetchGigs = async () => {
      const q = query(collection(db, "gigs"), where("clientId", "==", user.uid));
      const snap = await getDocs(q);
      setGigs(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    };
    fetchGigs();
  }, [user]);

  const statusStyle = {
    OPEN: "bg-[#1D9E75]/15 text-[#5DCAA5]",
    IN_PROGRESS: "bg-[#EF9F27]/15 text-[#FAC775]",
    SUBMITTED: "bg-blue-500/15 text-blue-400",
    COMPLETED: "bg-white/8 text-[#888780]",
  };

  const filtered = filter === "ALL" ? gigs : gigs.filter((g) => g.status === filter);

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
        <main className="ml-56 flex-1 p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>My gigs</h1>
              <p className="text-sm text-[#5F5E5A] mt-1">Manage all your posted gigs.</p>
            </div>
            <button
              onClick={() => navigate("/client/post-gig")}
              className="bg-[#EF9F27] text-[#1a1208] text-sm font-medium px-5 py-2 rounded-lg hover:bg-[#FAC775] transition-all"
            >
              + Post gig
            </button>
          </div>

          {/* FILTER TABS */}
          <div className="flex gap-2 mb-6">
            {["ALL", "OPEN", "IN_PROGRESS", "SUBMITTED", "COMPLETED"].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`text-xs px-4 py-1.5 rounded-full border transition-all ${
                  filter === s
                    ? "border-[#EF9F27]/50 bg-[#EF9F27]/10 text-[#EF9F27]"
                    : "border-white/8 text-[#888780] hover:border-white/15"
                }`}
              >
                {s.replace("_", " ")}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-16 text-sm text-[#5F5E5A]">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-3xl mb-3">📭</div>
              <div className="text-sm text-[#5F5E5A]">No gigs found for this filter.</div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filtered.map((gig) => (
                <div key={gig.id} className="bg-[#161614] border border-white/6 rounded-xl px-6 py-5 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-[#f0ede4] mb-1">{gig.title}</div>
                    <div className="flex gap-2 flex-wrap">
                      {gig.skills?.map((s) => (
                        <span key={s} className="text-xs bg-white/5 text-[#888780] px-2 py-0.5 rounded-full">{s}</span>
                      ))}
                    </div>
                    <div className="text-xs text-[#5F5E5A] mt-2">₹{gig.budget} · Due {gig.deadline}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full ${statusStyle[gig.status]}`}>
                      {gig.status?.replace("_", " ")}
                    </span>
                    <button
                      onClick={() => navigate(`/client/gigs/${gig.id}/bids`)}
                      className="text-xs border border-white/8 text-[#888780] px-3 py-1.5 rounded-lg hover:border-[#EF9F27]/40 hover:text-[#EF9F27] transition-all"
                    >
                      View bids →
                    </button>

                    {gig.status === "SUBMITTED" && (
                        <button
                          onClick={() => navigate(`/client/gigs/${gig.id}/review`)}
                          className="text-xs bg-blue-500/15 text-blue-400 border border-blue-500/20 px-3 py-1.5 rounded-lg hover:bg-blue-500/25 transition-all">
                          Review work →
                        </button>
                      )}
                      {gig.status === "COMPLETED" && !gig.feedbackLeft && (
                        <button
                          onClick={() => navigate(`/client/gigs/${gig.id}/feedback`)}
                          className="text-xs bg-[#EF9F27]/15 text-[#FAC775] border border-[#EF9F27]/20 px-3 py-1.5 rounded-lg hover:bg-[#EF9F27]/25 transition-all">
                          Leave feedback →
                        </button>
                      )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}