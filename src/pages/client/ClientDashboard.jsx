import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function ClientDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGigs = async () => {
      const q = query(collection(db, "gigs"), where("clientId", "==", user.uid));
      const snap = await getDocs(q);
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setGigs(data);
      setLoading(false);
    };
    fetchGigs();
  }, [user]);

  const stats = [
    { label: "Total gigs", value: gigs.length },
    { label: "Open", value: gigs.filter((g) => g.status === "OPEN").length },
    { label: "In progress", value: gigs.filter((g) => g.status === "IN_PROGRESS").length },
    { label: "Completed", value: gigs.filter((g) => g.status === "COMPLETED").length },
  ];

  const statusStyle = {
    OPEN: "bg-[#1D9E75]/15 text-[#5DCAA5]",
    IN_PROGRESS: "bg-[#EF9F27]/15 text-[#FAC775]",
    SUBMITTED: "bg-blue-500/15 text-blue-400",
    COMPLETED: "bg-white/8 text-[#888780]",
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#111110] text-[#f0ede4]">

      {/* SIDEBAR */}
      <div className="flex">
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

          <div className="px-3 py-4 border-t border-white/6">
            <div className="px-3 py-2 mb-2">
              <div className="text-xs font-medium text-[#f0ede4] truncate">{user?.email}</div>
              <div className="text-xs text-[#5F5E5A]">Client</div>
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
              Dashboard
            </h1>
            <p className="text-sm text-[#5F5E5A] mt-1">Here's what's happening with your gigs.</p>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {stats.map(({ label, value }) => (
              <div key={label} className="bg-[#161614] border border-white/6 rounded-xl p-5">
                <div className="text-xs text-[#5F5E5A] mb-2">{label}</div>
                <div className="text-3xl font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>{value}</div>
              </div>
            ))}
          </div>

          {/* RECENT GIGS */}
          <div className="bg-[#161614] border border-white/6 rounded-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/6">
              <h2 className="text-sm font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>Recent gigs</h2>
              <button
                onClick={() => navigate("/client/post-gig")}
                className="bg-[#EF9F27] text-[#1a1208] text-xs font-medium px-4 py-1.5 rounded-lg hover:bg-[#FAC775] transition-all"
              >
                + Post gig
              </button>
            </div>

            {loading ? (
              <div className="px-6 py-10 text-center text-sm text-[#5F5E5A]">Loading...</div>
            ) : gigs.length === 0 ? (
              <div className="px-6 py-14 text-center">
                <div className="text-3xl mb-3">📋</div>
                <div className="text-sm text-[#5F5E5A]">No gigs yet. Post your first gig to get started.</div>
                <button
                  onClick={() => navigate("/client/post-gig")}
                  className="mt-4 bg-[#EF9F27] text-[#1a1208] text-xs font-medium px-5 py-2 rounded-lg hover:bg-[#FAC775] transition-all"
                >
                  Post a gig
                </button>
              </div>
            ) : (
              <div className="divide-y divide-white/4">
                {gigs.slice(0, 5).map((gig) => (
                  <div key={gig.id} className="flex items-center justify-between px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-[#f0ede4]">{gig.title}</div>
                      <div className="text-xs text-[#5F5E5A] mt-0.5">₹{gig.budget} · {gig.skills?.join(", ")}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full ${statusStyle[gig.status]}`}>
                        {gig.status?.replace("_", " ")}
                      </span>
                      <button
                        onClick={() => navigate(`/client/gigs/${gig.id}/bids`)}
                        className="text-xs text-[#888780] hover:text-[#EF9F27] transition-colors"
                      >
                        View bids →
                      </button>
                    </div>
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