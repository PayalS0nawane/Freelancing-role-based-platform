import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase/config";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";

export default function FreelancerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [bids, setBids] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const profileSnap = await getDoc(doc(db, "users", user.uid));
      setProfile(profileSnap.data());

      const q = query(collection(db, "bids"), where("freelancerId", "==", user.uid));
      const snap = await getDocs(q);
      setBids(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const stats = [
    { label: "Total bids", value: bids.length },
    { label: "Pending", value: bids.filter((b) => b.status === "PENDING").length },
    { label: "Accepted", value: bids.filter((b) => b.status === "ACCEPTED").length },
    { label: "Rejected", value: bids.filter((b) => b.status === "REJECTED").length },
  ];

  const bidStatusStyle = {
    PENDING: "bg-[#EF9F27]/15 text-[#FAC775]",
    ACCEPTED: "bg-[#1D9E75]/15 text-[#5DCAA5]",
    REJECTED: "bg-red-500/10 text-red-400",
  };

  const acceptanceRate = bids.length > 0
    ? Math.round((bids.filter((b) => b.status === "ACCEPTED").length / bids.length) * 100)
    : 0;

  const handleLogout = async () => {
    await logout();
    navigate("/");
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
          <div className="px-3 py-4 border-t border-white/6">
            <div className="px-3 py-2 mb-2">
              <div className="text-xs font-medium text-[#f0ede4] truncate">{user?.email}</div>
              <div className="text-xs text-[#5F5E5A]">Freelancer</div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#888780] hover:text-red-400 hover:bg-red-500/5 transition-all text-left"
            >
              <span>⎋</span> Log out
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <main className="ml-56 flex-1 p-8">

          {/* HEADER */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
              Welcome back, {profile?.name?.split(" ")[0] || "Freelancer"}
            </h1>
            <p className="text-sm text-[#5F5E5A] mt-1">Here's your activity overview.</p>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {stats.map(({ label, value }) => (
              <div key={label} className="bg-[#161614] border border-white/6 rounded-xl p-5">
                <div className="text-xs text-[#5F5E5A] mb-2">{label}</div>
                <div className="text-3xl font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>{value}</div>
              </div>
            ))}
          </div>

          {/* SKILL SCORE + GROWTH */}
          <div className="grid grid-cols-3 gap-4 mb-8">

            <div className="bg-[#161614] border border-white/6 rounded-xl p-5">
              <div className="text-xs text-[#5F5E5A] mb-3">Skill score</div>
              <div className="text-3xl font-bold text-[#1D9E75]" style={{ fontFamily: "'Syne', sans-serif" }}>
                {profile?.skillScore ?? 0}
              </div>
              <div className="mt-3 h-1.5 bg-white/6 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#1D9E75] rounded-full transition-all"
                  style={{ width: `${Math.min((profile?.skillScore ?? 0), 100)}%` }}
                />
              </div>
              <div className="text-xs text-[#5F5E5A] mt-1.5">out of 100</div>
            </div>

            <div className="bg-[#161614] border border-white/6 rounded-xl p-5">
              <div className="text-xs text-[#5F5E5A] mb-3">Quality score</div>
              <div className="text-3xl font-bold text-[#EF9F27]" style={{ fontFamily: "'Syne', sans-serif" }}>
                {profile?.qualityScore ?? 0}
              </div>
              <div className="mt-3 h-1.5 bg-white/6 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#EF9F27] rounded-full transition-all"
                  style={{ width: `${Math.min((profile?.qualityScore ?? 0), 100)}%` }}
                />
              </div>
              <div className="text-xs text-[#5F5E5A] mt-1.5">based on feedback</div>
            </div>

            <div className="bg-[#161614] border border-white/6 rounded-xl p-5">
              <div className="text-xs text-[#5F5E5A] mb-3">Acceptance rate</div>
              <div className="text-3xl font-bold text-[#f0ede4]" style={{ fontFamily: "'Syne', sans-serif" }}>
                {acceptanceRate}%
              </div>
              <div className="mt-3 h-1.5 bg-white/6 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white/40 rounded-full transition-all"
                  style={{ width: `${acceptanceRate}%` }}
                />
              </div>
              <div className="text-xs text-[#5F5E5A] mt-1.5">{bids.filter(b => b.status === "ACCEPTED").length} of {bids.length} bids</div>
            </div>

          </div>

          {/* RECENT BIDS */}
          <div className="bg-[#161614] border border-white/6 rounded-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/6">
              <h2 className="text-sm font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>Recent bids</h2>
              <button
                onClick={() => navigate("/freelancer/browse")}
                className="bg-[#1D9E75] text-white text-xs font-medium px-4 py-1.5 rounded-lg hover:bg-[#5DCAA5] hover:text-[#111110] transition-all"
              >
                Browse gigs
              </button>
            </div>

            {loading ? (
              <div className="text-center py-10 text-sm text-[#5F5E5A]">Loading...</div>
            ) : bids.length === 0 ? (
              <div className="text-center py-14">
                <div className="text-3xl mb-3">🎯</div>
                <div className="text-sm text-[#5F5E5A]">No bids placed yet. Start browsing open gigs.</div>
                <button
                  onClick={() => navigate("/freelancer/browse")}
                  className="mt-4 bg-[#1D9E75] text-white text-xs font-medium px-5 py-2 rounded-lg hover:bg-[#5DCAA5] hover:text-[#111110] transition-all"
                >
                  Browse gigs
                </button>
              </div>
            ) : (
              <div className="divide-y divide-white/4">
                {bids.slice(0, 5).map((bid) => (
                  <div key={bid.id} className="flex items-center justify-between px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-[#f0ede4]">{bid.gigTitle || "Gig"}</div>
                      <div className="text-xs text-[#5F5E5A] mt-0.5">₹{bid.price} · {bid.deliveryTime}</div>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full ${bidStatusStyle[bid.status]}`}>
                      {bid.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  );
}