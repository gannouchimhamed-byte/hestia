import { Link } from 'react-router-dom'

const STATS = [
  { value: '2,500+', label: 'Verified listings' },
  { value: '180+',   label: 'Trusted agents' },
  { value: '12',     label: 'Governorates covered' },
  { value: '4,000+', label: 'Happy clients' },
]

const VALUES = [
  {
    icon: 'fa-shield-alt',
    title: 'Transparency',
    desc: 'Every listing is reviewed before it goes live. No fake prices, no ghost properties, no wasted viewings.',
  },
  {
    icon: 'fa-handshake',
    title: 'Trust',
    desc: 'We verify every agent on our platform. When you contact someone through Hestia, you know they are real.',
  },
  {
    icon: 'fa-bolt',
    title: 'Speed',
    desc: 'Find a property, contact an agent, and book a viewing — all in under five minutes. No phone tag, no waiting.',
  },
  {
    icon: 'fa-users',
    title: 'For Everyone',
    desc: 'Whether you are a first-time renter, a buyer looking for a family villa, or an agent managing 50 listings — Hestia works for you.',
  },
]

const TEAM = [
  {
    name: 'Mohamed Gannouchi',
    role: 'Founder & CEO',
    bio: 'Spent years navigating Tunisia\'s fragmented property market and decided to build the platform he always wished existed.',
    initials: 'MG',
    color: 'bg-primary',
  },
]

export default function About() {
  return (
    <div className="min-h-screen bg-white pt-16">

      {/* ── HERO ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-primary-dark py-20 px-4">
        <div className="absolute inset-0 opacity-10">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="absolute rounded-full border border-white"
              style={{ width: `${200 + i*120}px`, height: `${200 + i*120}px`, top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
          ))}
        </div>
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white px-4 py-1.5 rounded-full text-sm font-semibold mb-6 backdrop-blur-sm">
            <i className="fas fa-home text-accent" style={{fontSize:12}} /> Our Story
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Built by a Tunisian,<br />
            <span className="text-accent">for Tunisia</span>
          </h1>
          <p className="text-white/75 text-lg leading-relaxed max-w-2xl mx-auto">
            Hestia was born out of frustration — the kind that comes from spending weeks searching for a property through Facebook groups, unanswered phone calls, and listings that turned out to be nothing like the photos.
          </p>
        </div>
      </div>

      {/* ── STORY ── */}
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
          <p>
            Tunisia has a vibrant real estate market. Millions of people buy, rent, and invest in property every year. But for a long time, finding the right property has been unnecessarily hard — listings scattered across dozens of platforms, prices that bear no relation to reality, and agents with no tools to manage their clients properly.
          </p>
          <p>
            We believed there had to be a better way. So we built one.
          </p>
          <p>
            <strong className="text-gray-900">Hestia</strong> is Tunisia's first real estate platform built with two goals in mind: give buyers and renters a trustworthy place to find their next home, and give agents the professional tools they deserve to grow their business.
          </p>
          <p>
            Every listing on Hestia is reviewed by our team before it goes live. Every agent is verified. Every enquiry goes directly to a real person who can help. That is not the norm in Tunisian real estate today — but we are making it the standard.
          </p>
          <blockquote className="border-l-4 border-accent pl-6 py-2 my-8">
            <p className="text-gray-700 text-xl font-medium italic">
              "I wanted to build the platform I wished existed when I was searching for my first apartment in Tunis. Something honest, fast, and built for how people actually search today."
            </p>
            <footer className="text-gray-400 text-sm mt-3 font-semibold not-italic">— Mohamed Gannouchi, Founder</footer>
          </blockquote>
          <p>
            We are just getting started. The platform is live, the listings are growing, and the feedback from both buyers and agents has been clear: this is what the market needed.
          </p>
        </div>
      </div>

      {/* ── STATS ── */}
      <div className="bg-primary py-14 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map(s => (
            <div key={s.label} className="text-center">
              <div className="font-display text-4xl font-bold text-white mb-1">{s.value}</div>
              <div className="text-white/60 text-sm uppercase tracking-wide">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── MISSION ── */}
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Our mission</div>
        <h2 className="font-display text-3xl font-bold text-gray-900 mb-6">
          Transparent search. Empowered agents.
        </h2>
        <p className="text-gray-500 text-lg leading-relaxed">
          We exist to make property search in Tunisia trustworthy and efficient — for the buyer who deserves honest listings, and for the agent who deserves real tools to close real deals.
        </p>
      </div>

      {/* ── VALUES ── */}
      <div className="bg-gray-50 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-xs font-bold text-primary uppercase tracking-widest mb-2">What we stand for</div>
            <h2 className="font-display text-3xl font-bold text-gray-900">Our values</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {VALUES.map(v => (
              <div key={v.title} className="bg-white rounded-2xl border border-gray-100 p-6 flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-soft flex items-center justify-center flex-shrink-0">
                  <i className={`fas ${v.icon} text-primary text-lg`} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{v.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TEAM ── */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="text-xs font-bold text-primary uppercase tracking-widest mb-2">The people behind it</div>
          <h2 className="font-display text-3xl font-bold text-gray-900">Our team</h2>
        </div>
        <div className="flex justify-center">
          {TEAM.map(m => (
            <div key={m.name} className="bg-white rounded-2xl border border-gray-100 p-8 text-center max-w-xs w-full">
              <div className={`w-20 h-20 rounded-full ${m.color} text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4`}>
                {m.initials}
              </div>
              <h3 className="font-bold text-gray-900 text-lg">{m.name}</h3>
              <div className="text-primary text-sm font-semibold mb-3">{m.role}</div>
              <p className="text-gray-500 text-sm leading-relaxed">{m.bio}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="bg-gray-50 py-14 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-3">
            Ready to find your next property?
          </h2>
          <p className="text-gray-400 mb-8">
            Browse 2,500+ verified listings across Tunisia — or list your property today.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link to="/search" className="btn-primary px-8 py-3">
              <i className="fas fa-search text-xs" /> Browse Listings
            </Link>
            <a href="/agent" className="btn-ghost px-8 py-3">
              <i className="fas fa-user-tie text-xs" /> Agent Portal
            </a>
          </div>
        </div>
      </div>

      {/* Footer nav */}
      <div className="border-t border-gray-100 py-6 px-4">
        <div className="max-w-3xl mx-auto flex gap-6 text-sm text-gray-400">
          <Link to="/" className="hover:text-primary">Home</Link>
          <Link to="/search" className="hover:text-primary">Properties</Link>
          <Link to="/privacy" className="hover:text-primary">Privacy</Link>
          <Link to="/terms" className="hover:text-primary">Terms</Link>
        </div>
      </div>
    </div>
  )
}
