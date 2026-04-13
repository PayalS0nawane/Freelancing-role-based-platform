import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function BrowseGigs() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [gigs, setGigs] = useState([]);
  const [myBidGigIds, setMyBidGigIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const gigSnap = await getDocs(query(collection(db, "gigs"), where("status", "==", "OPEN")));
      setGigs(gigSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

      const bidSnap = await getDocs(query(collection(db, "bids"), where("freelancerId", "==", user.uid)));
      setMyBidGigIds(bidSnap.docs.map((d) => d.data().gigId));
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const filtered = gigs.filter((g) => {
    const term = search.toLowerCase();
    return (
      g.title?.toLowerCase().includes(term) ||
      g.skills?.some((s) => s.toLowerCase().includes(term))
    );
  });

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
                <span className="text-base">{icon}</span>
                {label}
              </button>
            ))}
          </nav>
        </aside>

        {/* MAIN */}
        <main className="ml-56 flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>Browse gigs</h1>
            <p className="text-sm text-[#5F5E5A] mt-1">Only open gigs are shown. Search by title or skill.</p>
          </div>

          {/* SEARCH */}
          <div className="mb-6">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or skill..."
              className="w-full max-w-md bg-[#161614] border border-white/8 rounded-lg px-4 py-2.5 text-sm text-[#f0ede4] placeholder-[#5F5E5A] outline-none focus:border-[#1D9E75]/50 transition-all"
            />
          </div>

          {loading ? (
            <div className="text-center py-16 text-sm text-[#5F5E5A]">Loading gigs...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-3xl mb-3">🔍</div>
              <div className="text-sm text-[#5F5E5A]">No open gigs found. Try a different search.</div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filtered.map((gig) => {
                const alreadyBid = myBidGigIds.includes(gig.id);
                return (
                  <div key={gig.id} className="bg-[#161614] border border-white/6 rounded-xl px-6 py-5 flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="text-sm font-medium text-[#f0ede4]">{gig.title}</div>
                        {alreadyBid && (
                          <span className="text-xs bg-[#1D9E75]/15 text-[#5DCAA5] px-2 py-0.5 rounded-full">Bid placed</span>
                        )}
                      </div>
                      <p className="text-xs text-[#5F5E5A] leading-relaxed max-w-lg mb-2 line-clamp-2">{gig.description}</p>
                      <div className="flex gap-2 flex-wrap">
                        {gig.skills?.map((s) => (
                          <span key={s} className="text-xs bg-white/5 text-[#888780] px-2 py-0.5 rounded-full">{s}</span>
                        ))}
                      </div>
                    </div>
                    <div className="ml-6 text-right flex-shrink-0">
                      <div className="text-base font-bold text-[#EF9F27]">₹{gig.budget}</div>
                      <div className="text-xs text-[#5F5E5A] mt-0.5 mb-3">Due {gig.deadline}</div>
                      {alreadyBid ? (
                        <button
                          disabled
                          className="text-xs border border-white/8 text-[#5F5E5A] px-4 py-1.5 rounded-lg opacity-50 cursor-not-allowed"
                        >
                          Already bid
                        </button>
                      ) : (
                        <button
                          onClick={() => navigate(`/freelancer/gigs/${gig.id}/bid`)}
                          className="text-xs bg-[#1D9E75] text-white px-4 py-1.5 rounded-lg hover:bg-[#5DCAA5] hover:text-[#111110] transition-all"
                        >
                          Place bid →
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}