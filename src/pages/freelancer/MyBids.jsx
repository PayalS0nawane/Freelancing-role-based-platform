import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function MyBids() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    const fetchBids = async () => {
      const q = query(collection(db, "bids"), where("freelancerId", "==", user.uid));
      const snap = await getDocs(q);
      setBids(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    };
    fetchBids();
  }, [user]);

  const bidStatusStyle = {
    PENDING: "bg-[#EF9F27]/15 text-[#FAC775]",
    ACCEPTED: "bg-[#1D9E75]/15 text-[#5DCAA5]",
    REJECTED: "bg-red-500/10 text-red-400",
  };

  const filtered = filter === "ALL" ? bids : bids.filter((b) => b.status === filter);

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
          <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
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
        <main className="ml-56 flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>My bids</h1>
            <p className="text-sm text-[#5F5E5A] mt-1">Track the status of all your submitted bids.</p>
          </div>

          {/* FILTER */}
          <div className="flex gap-2 mb-6">
            {["ALL", "PENDING", "ACCEPTED", "REJECTED"].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`text-xs px-4 py-1.5 rounded-full border transition-all ${
                  filter === s
                    ? "border-[#1D9E75]/50 bg-[#1D9E75]/10 text-[#1D9E75]"
                    : "border-white/8 text-[#888780] hover:border-white/15"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-16 text-sm text-[#5F5E5A]">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-3xl mb-3">📭</div>
              <div className="text-sm text-[#5F5E5A]">No bids found for this filter.</div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filtered.map((bid) => (
                <div key={bid.id} className="bg-[#161614] border border-white/6 rounded-xl px-6 py-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-sm font-medium text-[#f0ede4]">{bid.gigTitle || "Gig"}</div>
                        <span className={`text-xs px-2.5 py-0.5 rounded-full ${bidStatusStyle[bid.status]}`}>
                          {bid.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#5F5E5A] leading-relaxed max-w-lg mb-3 line-clamp-2">{bid.proposal}</p>
                      <div className="flex gap-4">
                        <div className="text-xs text-[#888780]">Delivery: <span className="text-[#f0ede4]">{bid.deliveryTime}</span></div>
                        {bid.githubLink && (
                          <a href={bid.githubLink} target="_blank" rel="noreferrer" className="text-xs text-[#1D9E75] hover:underline">
                            Skill proof →
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="text-right ml-6">
                      <div className="text-base font-bold text-[#EF9F27]">₹{bid.price}</div>
                      {bid.status === "ACCEPTED" && (
                        // <div className="mt-2 text-xs bg-[#1D9E75]/10 text-[#5DCAA5] border border-[#1D9E75]/20 px-3 py-1 rounded-lg">
                        //   Gig assigned to you ✓
                        // </div>
                        <button
                            onClick={() => navigate(`/freelancer/gigs/${bid.gigId}/submit`)}
                            className="mt-2 text-xs bg-[#1D9E75] text-white px-4 py-1.5 rounded-lg hover:bg-[#5DCAA5] hover:text-[#111110] transition-all">
                            Submit work →
                          </button>
                      )}
                      {bid.status === "REJECTED" && (
                        <div className="mt-2 text-xs text-[#5F5E5A]">Better luck next time</div>
                      )}
                    </div>
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