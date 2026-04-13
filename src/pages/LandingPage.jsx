import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#111110] min-h-screen text-[#f0ede4] font-sans">

      {/* NAV */}
      <nav className="flex items-center justify-between px-10 py-4 border-b border-white/8 sticky top-0 bg-[#111110]/95 backdrop-blur-md z-50">
        <div className="font-extrabold text-xl tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
          Gig<span className="text-[#EF9F27]">Flow</span>
        </div>
        <ul className="flex gap-7 list-none text-sm text-[#888780]">
          <li className="cursor-pointer hover:text-white transition-colors">How it works</li>
          <li className="cursor-pointer hover:text-white transition-colors">For clients</li>
          <li className="cursor-pointer hover:text-white transition-colors">For freelancers</li>
        </ul>
        <div className="flex gap-2">
          <button onClick={() => navigate("/login")} className="border border-white/10 text-[#888780] px-4 py-2 rounded-md text-sm hover:text-white hover:border-white/25 transition-all">
            Log in
          </button>
          <button onClick={() => navigate("/register")} className="bg-[#EF9F27] text-[#1a1208] px-4 py-2 rounded-md text-sm font-medium hover:bg-[#FAC775] transition-all">
            Get started
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-4xl mx-auto px-10 pt-20 pb-12 text-center">
        <div className="inline-flex items-center gap-2 bg-[#EF9F27]/10 border border-[#EF9F27]/30 text-[#FAC775] text-xs px-4 py-1.5 rounded-full mb-7 tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-[#EF9F27] inline-block"></span>
          Smart freelancing platform
        </div>
        <h1 className="text-5xl font-extrabold leading-tight tracking-tighter mb-5" style={{ fontFamily: "'Syne', sans-serif" }}>
          Where skilled work meets{" "}
          <span className="text-[#EF9F27]">real opportunity</span>
        </h1>
        <p className="text-[#888780] text-base max-w-lg mx-auto mb-8 leading-relaxed">
          GigFlow connects clients with verified freelancers. Post gigs, place bids, track progress — all in one place with skill-based matching.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button onClick={() => navigate("/register")} className="bg-[#EF9F27] text-[#1a1208] px-8 py-3 rounded-lg text-sm font-medium hover:bg-[#FAC775] transition-all">
            Post a gig
          </button>
          <button onClick={() => navigate("/register")} className="border border-white/15 text-[#f0ede4] px-8 py-3 rounded-lg text-sm hover:border-white/30 transition-all">
            Browse gigs →
          </button>
        </div>
      </section>

      {/* STATS */}
      <div className="flex justify-center gap-16 py-10 border-y border-white/6 mx-10">
        {[
          ["2.4k+", "Active gigs"],
          ["800+", "Verified freelancers"],
          ["98%", "Completion rate"],
          ["4.9★", "Avg. rating"],
        ].map(([num, label]) => (
          <div key={label} className="text-center">
            <div className="text-3xl font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>{num}</div>
            <div className="text-xs text-[#5F5E5A] mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* HOW IT WORKS */}
      <div className="max-w-5xl mx-auto px-10 py-16">
        <div className="text-xs text-[#EF9F27] tracking-widest uppercase mb-2">How it works</div>
        <div className="text-3xl font-bold tracking-tight mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>Simple. Fast. Transparent.</div>
        <div className="text-[#888780] text-sm max-w-md leading-relaxed mb-10">From posting to delivery — every step is tracked and role-protected.</div>
        <div className="grid grid-cols-2 border border-white/6 rounded-xl overflow-hidden">
          {[
            ["01", "Post a gig", "Clients define the work — title, skills required, budget, and deadline."],
            ["02", "Freelancers bid", "Qualified freelancers submit proposals with skill proof and delivery time."],
            ["03", "Client decides", "Accept the best bid — all others are auto-rejected. Work begins immediately."],
            ["04", "Rate & grow", "After delivery, feedback updates the freelancer's skill score and quality rating."],
          ].map(([num, title, desc], i) => (
            <div key={num} className={`bg-[#111110] p-7 ${i % 2 === 0 ? "border-r border-white/6" : ""} ${i > 1 ? "border-t border-white/6" : ""}`}>
              <div className="text-4xl font-extrabold text-[#EF9F27]/15 leading-none mb-3" style={{ fontFamily: "'Syne', sans-serif" }}>{num}</div>
              <h3 className="text-sm font-bold mb-1 text-[#f0ede4]" style={{ fontFamily: "'Syne', sans-serif" }}>{title}</h3>
              <p className="text-xs text-[#5F5E5A] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ROLES */}
      <div className="max-w-5xl mx-auto px-10 pb-16">
        <div className="text-xs text-[#EF9F27] tracking-widest uppercase mb-2">Two roles</div>
        <div className="text-3xl font-bold tracking-tight mb-6" style={{ fontFamily: "'Syne', sans-serif" }}>Built for both sides</div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: "💼", role: "Client", desc: "Post gigs, review bids, and manage work from one clean dashboard.", items: ["Post gigs with budget & deadline", "View freelancer profiles & skills", "Accept or reject bids", "Track gig status in real-time", "Leave skill-based feedback"], accent: true },
            { icon: "⚡", role: "Freelancer", desc: "Browse open gigs, place smart bids, and build your skill score over time.", items: ["Browse & filter open gigs", "Submit proposals with skill proof", "Submit work files & links", "Track acceptance rate", "Grow skill score with feedback"], accent: false },
          ].map(({ icon, role, desc, items, accent }) => (
            <div key={role} className={`rounded-xl p-7 border ${accent ? "border-[#EF9F27]/25 bg-[#EF9F27]/4" : "border-white/8 bg-[#161614]"}`}>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-base mb-4 ${accent ? "bg-[#EF9F27]/15" : "bg-[#1D9E75]/15"}`}>{icon}</div>
              <h3 className="text-base font-bold mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>I'm a {role}</h3>
              <p className="text-xs text-[#5F5E5A] leading-relaxed mb-4">{desc}</p>
              <ul className="flex flex-col gap-1.5">
                {items.map(item => (
                  <li key={item} className="flex items-center gap-2 text-xs text-[#888780]">
                    <span className={`w-1 h-1 rounded-full flex-shrink-0 ${accent ? "bg-[#EF9F27]" : "bg-[#1D9E75]"}`}></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center py-16 border-t border-white/6 px-10">
        <h2 className="text-4xl font-extrabold tracking-tight mb-3" style={{ fontFamily: "'Syne', sans-serif" }}>Ready to get started?</h2>
        <p className="text-[#888780] text-sm mb-8">Join as a client or freelancer — your role is permanent, so choose wisely.</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => navigate("/register")} className="bg-[#EF9F27] text-[#1a1208] px-8 py-3 rounded-lg text-sm font-medium hover:bg-[#FAC775] transition-all">
            Create account
          </button>
          <button onClick={() => navigate("/login")} className="border border-white/15 text-[#f0ede4] px-8 py-3 rounded-lg text-sm hover:border-white/30 transition-all">
            Log in
          </button>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="flex justify-between items-center px-10 py-5 border-t border-white/6">
        <div className="font-extrabold text-sm" style={{ fontFamily: "'Syne', sans-serif" }}>
          Gig<span className="text-[#EF9F27]">Flow</span>
        </div>
        <p className="text-xs text-[#5F5E5A]">© 2026 GigFlow. All rights reserved.</p>
      </footer>

    </div>
  );
}