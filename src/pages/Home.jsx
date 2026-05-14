import { useNavigate, Link } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import PropertyCard from '../components/PropertyCard'
import { properties } from '../lib/data'

const FEATURED   = properties.filter(p => p.featured)
const CITIES = [
  { name:'Tunis',    count:'1,240', img:'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=600&q=80' },
  { name:'Sfax',     count:'486',   img:'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&q=80' },
  { name:'Sousse',   count:'352',   img:'https://images.unsplash.com/photo-1559628233-100c798642d4?w=600&q=80' },
  { name:'Hammamet', count:'215',   img:'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80' },
  { name:'Monastir', count:'178',   img:'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600&q=80' },
  { name:'Nabeul',   count:'134',   img:'https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?w=600&q=80' },
]

const NEW_PROJECTS = [
  { name:'Les Jardins de Carthage', location:'Carthage, Tunis', price:'From 280,000 TND', beds:'2–3 Beds', delivery:'Q4 2027', img:'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80', badge:'New Launch' },
  { name:'Marina Bay Residences',   location:'Sousse Nord',     price:'From 195,000 TND', beds:'1–2 Beds', delivery:'Q2 2027', img:'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80',  badge:'Off-Plan'   },
  { name:'Hammamet Hills',          location:'Hammamet Nord',   price:'From 320,000 TND', beds:'3–4 Beds', delivery:'Q1 2028', img:'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80', badge:'Pre-Launch' },
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen">

      {/* ── HERO ────────────────────────────────────────────────── */}
      <div className="relative flex flex-col" style={{minHeight:'90vh'}}>
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=1800&q=85"
            alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/80 via-primary/70 to-primary-dark/75" />
        </div>

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pt-24 pb-8">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white px-4 py-1.5 rounded-full text-sm font-semibold mb-5 backdrop-blur-sm">
            <i className="fas fa-award text-accent" style={{fontSize:12}} />
            Tunisia's No.1 Real Estate Platform
          </div>
          <h1 className="font-display text-5xl md:text-6xl text-white text-center font-bold leading-tight mb-3">
            Find Your <span className="text-accent">Dream Property</span>
          </h1>
          <p className="text-white/70 text-center text-lg mb-8 max-w-xl">
            2,500+ properties across Tunisia. Buy, rent, or invest with confidence.
          </p>
          <SearchBar navigateOnSearch />
        </div>

        {/* Stats bar */}
        <div className="relative z-10 bg-black/20 backdrop-blur-sm border-t border-white/10">
          <div className="max-w-4xl mx-auto flex justify-around py-5 px-4">
            {[['2,500+','Properties'],['180+','Verified Agents'],['4,000+','Happy Clients'],['12','Governorates']].map(([n,l]) => (
              <div key={l} className="text-center">
                <div className="text-2xl font-bold text-white">{n}</div>
                <div className="text-xs text-white/60 uppercase tracking-wide mt-0.5">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FEATURED LISTINGS ───────────────────────────────────── */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Hand-picked</div>
              <h2 className="font-display text-3xl font-bold text-gray-900">Featured Properties</h2>
            </div>
            <Link to="/search" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1.5">
              View all listings <i className="fas fa-arrow-right text-xs" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {properties.slice(0, 3).map(p => (
              <PropertyCard key={p.id} p={p} view="grid" />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/search" className="btn-outline inline-flex gap-2">
              <i className="fas fa-search" /> Browse All Properties
            </Link>
          </div>
        </div>
      </section>

      {/* ── NEW PROJECTS ────────────────────────────────────────── */}
      <section className="py-14 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="text-xs font-bold text-accent uppercase tracking-widest mb-1">Off-plan & new launch</div>
              <h2 className="font-display text-3xl font-bold text-gray-900">New Projects</h2>
            </div>
            <Link to="/search?type=new" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1.5">
              View all <i className="fas fa-arrow-right text-xs" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {NEW_PROJECTS.map(p => (
              <div key={p.name} className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer group">
                <div className="relative h-48 overflow-hidden">
                  <img src={p.img} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-xs font-bold bg-accent text-gray-900">{p.badge}</span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-0.5">{p.name}</h3>
                  <p className="text-sm text-gray-400 flex items-center gap-1 mb-3">
                    <i className="fas fa-map-marker-alt text-primary" style={{fontSize:10}} /> {p.location}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <div className="text-xs text-gray-400">Starting from</div>
                      <div className="font-bold text-primary">{p.price}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-400">Delivery</div>
                      <div className="font-semibold text-gray-700">{p.delivery}</div>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <i className="fas fa-bed text-gray-300 text-xs" /> {p.beds}
                    </span>
                    <button className="text-xs font-semibold text-primary hover:underline">More details</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXPLORE BY CITY ─────────────────────────────────────── */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Explore</div>
            <h2 className="font-display text-3xl font-bold text-gray-900">Properties by City</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {CITIES.map(c => (
              <Link key={c.name} to={`/search?location=${c.name}`}
                className="relative overflow-hidden rounded-2xl cursor-pointer group aspect-square">
                <img src={c.img} alt={c.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 p-3">
                  <h3 className="font-bold text-white text-sm">{c.name}</h3>
                  <p className="text-white/70 text-xs">{c.count} listings</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY HESTIA ──────────────────────────────────────────── */}
      <section className="py-14 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <div className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Why choose us</div>
            <h2 className="font-display text-3xl font-bold text-gray-900">The Smarter Way to Find Property</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon:'fa-shield-alt',      color:'bg-primary-soft text-primary',  title:'Verified Listings',     desc:'Every property is verified by our team before going live.' },
              { icon:'fa-map-marked-alt',  color:'bg-blue-50 text-blue-600',     title:'Interactive Map Search', desc:'Find properties by drawing your exact search zone on the map.' },
              { icon:'fa-bolt',            color:'bg-amber-50 text-amber-600',   title:'Instant Alerts',        desc:'Get notified the moment a matching property is listed.' },
              { icon:'fa-user-tie',        color:'bg-emerald-50 text-emerald-600',title:'Expert Agents',        desc:'180+ verified agents with proven track records across Tunisia.' },
            ].map(f => (
              <div key={f.title} className="bg-white rounded-2xl border border-gray-100 p-5 text-center hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 ${f.color}`}>
                  <i className={`fas ${f.icon} text-lg`} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-sm">{f.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AGENT SECTION ───────────────────────────────────────── */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 bg-primary-soft text-primary px-3 py-1.5 rounded-full text-sm font-semibold mb-4">
              <i className="fas fa-user-tie text-xs" /> For Real Estate Professionals
            </div>
            <h2 className="font-display text-3xl font-bold text-gray-900 mb-4">Powerful Tools for Agents</h2>
            <p className="text-gray-500 mb-6 leading-relaxed">
              Manage listings, track leads, and close deals faster with Hestia's dedicated agent dashboard — built specifically for Tunisia's real estate market.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                ['fa-chart-line','Lead Tracking','Never miss a buyer'],
                ['fa-bullhorn','Smart Marketing','Boost your listings'],
                ['fa-comments','Client Messaging','Real-time chat'],
                ['fa-coins','Commission Tracking','Track every deal'],
              ].map(([icon,title,sub]) => (
                <div key={title} className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary-soft flex items-center justify-center flex-shrink-0">
                    <i className={`fas ${icon} text-primary text-sm`} />
                  </div>
                  <div><p className="font-semibold text-sm text-gray-800">{title}</p><p className="text-xs text-gray-400">{sub}</p></div>
                </div>
              ))}
            </div>
            <Link to="/agent" className="btn-primary inline-flex gap-2">
              Access Agent Portal <i className="fas fa-arrow-right text-xs" />
            </Link>
          </div>

          {/* Dashboard mockup */}
          <div className="flex-1 max-w-md w-full">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-primary px-4 py-3 flex items-center gap-2">
                <div className="flex gap-1.5">
                  {['bg-red-400','bg-yellow-400','bg-green-400'].map(c => <div key={c} className={`w-2.5 h-2.5 rounded-full ${c}`} />)}
                </div>
                <span className="text-white/80 text-sm font-semibold ml-2">Agent Dashboard</span>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[['24','Active Listings'],['156','Total Leads'],['18.5%','Conversion']].map(([n,l]) => (
                    <div key={l} className="bg-gray-50 rounded-xl p-3 text-center">
                      <div className="font-bold text-primary text-lg">{n}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{l}</div>
                    </div>
                  ))}
                </div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Recent Leads</div>
                {[
                  {name:'Amir Kallel',      prop:'Villa Gammarth',  status:'New',      cls:'bg-blue-100 text-blue-700'},
                  {name:'Fatima Ben Salah', prop:'Apt Sousse',      status:'Viewing',  cls:'bg-amber-100 text-amber-700'},
                  {name:'Youssef Masmoudi', prop:'Penthouse Lac 2', status:'Closed',   cls:'bg-emerald-100 text-emerald-700'},
                ].map(l => (
                  <div key={l.name} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                    <div className="w-7 h-7 rounded-full bg-primary-soft text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">{l.name[0]}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-gray-800 truncate">{l.name}</div>
                      <div className="text-xs text-gray-400 truncate">{l.prop}</div>
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${l.cls}`}>{l.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────────────── */}
      <section className="py-14 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <div className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Trusted by thousands</div>
            <h2 className="font-display text-3xl font-bold text-gray-900">What Our Clients Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {text:'Hestia made finding our dream home in Gammarth so easy. Truly the best real estate platform in Tunisia!', name:'Nadia Ferchichi', role:'Bought a Villa in Gammarth', img:'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80'},
              {text:"The lead tracking is a game-changer. I've closed 40% more deals since joining Hestia as an agent.", name:'Ahmed Ben Ali', role:'Real Estate Agent, Tunis', img:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80'},
              {text:'Found the perfect apartment in Sousse within a week. Precise filters, high quality photos, great agents.', name:'Omar Drissi', role:'Rented in Sousse', img:'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80'},
            ].map(t => (
              <div key={t.name} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <div className="flex gap-0.5 mb-4">
                  {[1,2,3,4,5].map(i => <i key={i} className="fas fa-star text-amber-400" style={{fontSize:12}} />)}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.img} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  <div><p className="font-semibold text-sm text-gray-800">{t.name}</p><p className="text-xs text-gray-400">{t.role}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <section className="py-14 px-4 bg-primary">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-3xl font-bold text-white mb-3">Ready to Find Your Home?</h2>
          <p className="text-white/70 mb-8">Join thousands of satisfied clients on Tunisia's most trusted real estate platform.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/search" className="bg-accent hover:bg-amber-400 text-gray-900 font-bold px-8 py-3 rounded-xl transition-all inline-flex items-center gap-2">
              <i className="fas fa-search" /> Browse Properties
            </Link>
            <Link to="/agent" className="bg-white/15 hover:bg-white/25 text-white font-bold px-8 py-3 rounded-xl transition-all border border-white/20 inline-flex items-center gap-2">
              <i className="fas fa-user-tie" /> Agent Registration
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────── */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="font-display text-2xl mb-3 flex items-center gap-2">
              <i className="fas fa-home text-accent" style={{fontSize:16}} /> Hestia
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">Tunisia's premier real estate platform. Connecting people with their perfect properties.</p>
            <div className="flex gap-3">
              {[['fa-facebook-f','#'],['fa-instagram','#'],['fa-linkedin-in','#'],['fa-twitter','#']].map(([icon,href]) => (
                <a key={icon} href={href} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                  <i className={`fab ${icon} text-xs`} />
                </a>
              ))}
            </div>
          </div>
          {[
            {title:'Properties',links:['For Sale','For Rent','New Projects','Commercial','Land']},
            {title:'Company',   links:['About Us','Careers','Blog','Press','Contact']},
            {title:'Support',   links:['Help Center','Agent Support','Privacy Policy','Terms','Sitemap']},
          ].map(col => (
            <div key={col.title}>
              <h4 className="font-bold mb-3 text-xs uppercase tracking-widest text-gray-400">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map(l => <li key={l}><a href="#" className="text-gray-400 text-sm hover:text-white transition-colors">{l}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-sm">© 2026 Hestia Real Estate. All rights reserved.</p>
          <div className="flex gap-4">
            {['Privacy','Terms','Cookies'].map(l => <a key={l} href="#" className="text-gray-500 text-sm hover:text-white">{l}</a>)}
          </div>
        </div>
      </footer>
    </div>
  )
}
