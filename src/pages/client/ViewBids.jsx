import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../firebase/config";
import {
  collection, query, where, getDocs,
  doc, getDoc, updateDoc, writeBatch
} from "firebase/firestore";

export default function ViewBids() {
  const { gigId } = useParams();
  const navigate = useNavigate();
  const [gig, setGig] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const gigSnap = await getDoc(doc(db, "gigs", gigId));
      setGig({ id: gigSnap.id, ...gigSnap.data() });
      const q = query(collection(db, "bids"), where("gigId", "==", gigId));
      const snap = await getDocs(q);
      setBids(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    };
    fetchData();
  }, [gigId]);

  const handleAccept = async (bidId, freelancerId) => {
    setActing(true);
    const batch = writeBatch(db);
    bids.forEach((bid) => {
      batch.update(doc(db, "bids", bid.id), {
        status: bid.id === bidId ? "ACCEPTED" : "REJECTED",
      });
    });
    batch.update(doc(db, "gigs", gigId), {
      status: "IN_PROGRESS",
      assignedFreelancerId: freelancerId,
    });
    await batch.commit();
    setBids((prev) =>
      prev.map((b) => ({ ...b, status: b.id === bidId ? "ACCEPTED" : "REJECTED" }))
    );
    setGig((prev) => ({ ...prev, status: "IN_PROGRESS" }));
    setActing(false);
  };

  const handleReject = async (bidId) => {
    setActing(true);
    await updateDoc(doc(db, "bids", bidId), { status: "REJECTED" });
    setBids((prev) =>
      prev.map((b) => (b.id === bidId ? { ...b, status: "REJECTED" } : b))
    );
    setActing(false);
  };

  const bidStatusStyle = {
    PENDING: "bg-[#EF9F27]/15 text-[#FAC775]",
    ACCEPTED: "bg-[#1D9E75]/15 text-[#5DCAA5]",
    REJECTED: "bg-red-500/10 text-red-400",
  };

  const gigLocked = gig?.status !== "OPEN";

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
                <span className="text-base">{icon}</span>
                {label}
              </button>
            ))}
          </nav>
        </aside>

        {/* MAIN */}
        <main className="ml-56 flex-1 p-8">
          <button onClick={() => navigate("/client/gigs")} className="text-xs text-[#5F5E5A] hover:text-[#EF9F27] transition-colors mb-6 flex items-center gap-1">
            ← Back to gigs
          </button>

          {loading ? (
            <div className="text-center py-16 text-sm text-[#5F5E5A]">Loading...</div>
          ) : (
            <>
              {/* GIG INFO */}
              <div className="bg-[#161614] border border-white/6 rounded-xl px-6 py-5 mb-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-lg font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>{gig?.title}</h1>
                    <p className="text-sm text-[#5F5E5A] mt-1 max-w-xl">{gig?.description}</p>
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {gig?.skills?.map((s) => (
                        <span key={s} className="text-xs bg-white/5 text-[#888780] px-2 py-0.5 rounded-full">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-[#EF9F27]">₹{gig?.budget}</div>
                    <div className="text-xs text-[#5F5E5A] mt-0.5">Due {gig?.deadline}</div>
                    <div className={`mt-2 text-xs px-2.5 py-1 rounded-full inline-block ${
                      gig?.status === "OPEN" ? "bg-[#1D9E75]/15 text-[#5DCAA5]" : "bg-[#EF9F27]/15 text-[#FAC775]"
                    }`}>
                      {gig?.status?.replace("_", " ")}
                    </div>
                  </div>
                </div>
              </div>

              {/* BIDS */}
              <div className="bg-[#161614] border border-white/6 rounded-xl">
                <div className="px-6 py-4 border-b border-white/6">
                  <h2 className="text-sm font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>
                    Bids received <span className="text-[#5F5E5A] font-normal">({bids.length})</span>
                  </h2>
                  {gigLocked && (
                    <p className="text-xs text-[#5F5E5A] mt-1">This gig is locked — a freelancer has been assigned.</p>
                  )}
                </div>

                {bids.length === 0 ? (
                  <div className="text-center py-14">
                    <div className="text-3xl mb-3">📬</div>
                    <div className="text-sm text-[#5F5E5A]">No bids yet. Check back soon.</div>
                  </div>
                ) : (
                  <div className="divide-y divide-white/4">
                    {bids.map((bid) => (
                      <div key={bid.id} className="px-6 py-5">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-7 h-7 rounded-full bg-[#EF9F27]/15 flex items-center justify-center text-xs text-[#EF9F27] font-medium">
                                F
                              </div>
                              <span className="text-sm font-medium">{bid.freelancerName || "Freelancer"}</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${bidStatusStyle[bid.status]}`}>
                                {bid.status}
                              </span>
                            </div>
                            <p className="text-xs text-[#888780] mt-2 leading-relaxed max-w-lg">{bid.proposal}</p>
                            {bid.githubLink && (
                              <a href={bid.githubLink} target="_blank" rel="noreferrer" className="text-xs text-[#EF9F27] mt-1 inline-block hover:underline">
                                View skill proof →
                              </a>
                            )}
                            <div className="text-xs text-[#5F5E5A] mt-2">Delivery: {bid.deliveryTime}</div>
                          </div>
                          <div className="text-right ml-6">
                            <div className="text-base font-bold text-[#f0ede4]">₹{bid.price}</div>
                            {!gigLocked && bid.status === "PENDING" && (
                              <div className="flex gap-2 mt-3">
                                <button
                                  onClick={() => handleAccept(bid.id, bid.freelancerId)}
                                  disabled={acting}
                                  className="text-xs bg-[#1D9E75]/15 text-[#5DCAA5] border border-[#1D9E75]/25 px-3 py-1.5 rounded-lg hover:bg-[#1D9E75]/25 transition-all disabled:opacity-50"
                                >
                                  Accept
                                </button>
                                <button
                                  onClick={() => handleReject(bid.id)}
                                  disabled={acting}
                                  className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-lg hover:bg-red-500/15 transition-all disabled:opacity-50"
                                >
                                  Reject
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}