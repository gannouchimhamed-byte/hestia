import { useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import PropertyCard from '../components/PropertyCard'
import { useProperties } from '../lib/useProperties'

// ── Data — fetched from Supabase, fallback to mock ─────────────────

const NEW_PROJECTS = [
  {
    name: 'Les Jardins de Carthage',
    developer: 'Carthage Premium Invest',
    devInitials: 'CP',
    location: 'Carthage, Tunis',
    priceFrom: '280,000 TND',
    beds: '2 – 3 Bedrooms',
    floors: '12 floors · 84 units',
    delivery: 'Q4 2027',
    badge: 'New Launch',
    badgeCls: 'bg-accent text-gray-900',
    img: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=900&q=85',
    completionPct: 15,
  },
  {
    name: 'Marina Bay Residences',
    developer: 'Sousse Development Group',
    devInitials: 'SD',
    location: 'Sousse Nord',
    priceFrom: '195,000 TND',
    beds: '1 – 2 Bedrooms',
    floors: '8 floors · 56 units',
    delivery: 'Q2 2027',
    badge: 'Off-Plan',
    badgeCls: 'bg-blue-500 text-white',
    img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&q=85',
    completionPct: 40,
  },
  {
    name: 'Hammamet Hills Estate',
    developer: 'Nabeul Realty Partners',
    devInitials: 'NR',
    location: 'Hammamet Nord',
    priceFrom: '320,000 TND',
    beds: '3 – 4 Bedrooms',
    floors: 'Ground + 2 · 24 villas',
    delivery: 'Q1 2028',
    badge: 'Pre-Launch',
    badgeCls: 'bg-primary text-white',
    img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&q=85',
    completionPct: 5,
  },
]

const CITIES = [
  { name:'Tunis',    count:'1,240', img:'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800&q=80' },
  { name:'Sfax',     count:'486',   img:'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80' },
  { name:'Sousse',   count:'352',   img:'https://images.unsplash.com/photo-1559628233-100c798642d4?w=800&q=80' },
  { name:'Hammamet', count:'215',   img:'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80' },
]

// ── Horizontal scroll strip ───────────────────────────────────────
function ScrollStrip({ items, renderCard, title, subtitle, linkTo, linkLabel }) {
  const ref = useRef(null)
  const scroll = dir => {
    ref.current?.scrollBy({ left: dir * 320, behavior: 'smooth' })
  }
  return (
    <div>
      {/* Header */}
      <div className="flex items-end justify-between mb-5">
        <div>
          {subtitle && <div className="text-xs font-bold text-primary uppercase tracking-widest mb-1">{subtitle}</div>}
          <h2 className="font-display text-2xl font-bold text-gray-900">{title}</h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            <button onClick={() => scroll(-1)}
              className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-primary hover:text-primary transition-all">
              <i className="fas fa-chevron-left" style={{fontSize:12}} />
            </button>
            <button onClick={() => scroll(1)}
              className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-primary hover:text-primary transition-all">
              <i className="fas fa-chevron-right" style={{fontSize:12}} />
            </button>
          </div>
          {linkTo && (
            <Link to={linkTo} className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
              {linkLabel} <i className="fas fa-arrow-right text-xs" />
            </Link>
          )}
        </div>
      </div>
      {/* Scrollable row */}
      <div ref={ref}
        className="flex gap-4 overflow-x-auto pb-2"
        style={{scrollbarWidth:'none', msOverflowStyle:'none'}}>
        <style>{`div::-webkit-scrollbar{display:none}`}</style>
        {items.map((item, i) => (
          <div key={i} className="flex-shrink-0 w-80">
            {renderCard(item, i)}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── New Project card ──────────────────────────────────────────────
function ProjectCard({ p }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer group h-full flex flex-col">
      {/* Image */}
      <div className="relative h-48 overflow-hidden flex-shrink-0">
        <img src={p.img} alt={p.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        {/* Badge */}
        <span className={`absolute top-3 left-3 px-2.5 py-1 rounded text-xs font-bold ${p.badgeCls}`}>
          {p.badge}
        </span>
        {/* Delivery pill */}
        <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5">
          <i className="fas fa-calendar-check" style={{fontSize:10}} />
          {p.delivery}
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        {/* Developer */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-primary-soft flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
            {p.devInitials}
          </div>
          <span className="text-xs text-gray-400 truncate">{p.developer}</span>
        </div>

        <h3 className="font-bold text-gray-900 mb-1 leading-snug">{p.name}</h3>
        <p className="text-xs text-gray-400 flex items-center gap-1 mb-3">
          <i className="fas fa-map-marker-alt text-primary" style={{fontSize:9}} />
          {p.location}
        </p>

        {/* Details row */}
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3 pb-3 border-b border-gray-100">
          <span className="flex items-center gap-1">
            <i className="fas fa-bed text-gray-300" style={{fontSize:10}} />{p.beds}
          </span>
          <span className="flex items-center gap-1">
            <i className="fas fa-building text-gray-300" style={{fontSize:10}} />{p.floors}
          </span>
        </div>

        {/* Completion */}
        <div className="mb-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-400">Construction progress</span>
            <span className="font-bold text-primary">{p.completionPct}%</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all"
              style={{width: p.completionPct + '%'}} />
          </div>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-auto pt-1">
          <div>
            <div className="text-xs text-gray-400">Starting from</div>
            <div className="font-bold text-primary">{p.priceFrom}</div>
          </div>
          <button className="text-xs font-bold bg-primary text-white px-3 py-2 rounded-xl hover:bg-primary-dark transition-all flex items-center gap-1.5">
            <i className="fas fa-info-circle" style={{fontSize:10}} /> Get Details
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────
export default function Home() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { properties } = useProperties()
  const FEATURED    = properties.filter(p => p.featured)
  const JUST_LISTED = [...properties].sort((a,b) => new Date(b.listedAt) - new Date(a.listedAt)).slice(0,6)
  const FOR_RENT    = properties.filter(p => p.type === 'rent')

  return (
    <div className="min-h-screen bg-white">

      {/* ── HERO ── */}
      <div className="relative" style={{minHeight:'88vh', display:'flex', flexDirection:'column'}}>
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=1800&q=85"
            alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/80 via-primary/70 to-primary-dark/75" />
        </div>

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pt-24 pb-8">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white px-4 py-1.5 rounded-full text-sm font-semibold mb-5 backdrop-blur-sm">
            <i className="fas fa-award text-accent" style={{fontSize:12}} />
            {t('hero.badge')}
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-white text-center font-bold leading-tight mb-3">
            {t('hero.headline')} <span className="text-accent">{t('hero.highlight')}</span>
          </h1>
          <p className="text-white/70 text-center text-lg mb-8 max-w-xl">{t('hero.sub')}</p>

          {/* Inline search bar */}
          <div className="w-full max-w-3xl">
            <div className="flex rounded-2xl overflow-hidden bg-white shadow-2xl">
              <div className="flex bg-gray-50 border-b border-gray-100">
                {[['sale', t('search.buy')],['rent', t('search.rent')]].map(([v,l]) => (
                  <button key={v}
                    onClick={() => navigate(`/search?deal=${v}`)}
                    className="px-6 py-4 text-sm font-bold text-gray-500 hover:text-primary hover:bg-white transition-all">
                    {l}
                  </button>
                ))}
              </div>
              <button
                onClick={() => navigate('/search')}
                className="flex-1 flex items-center gap-3 px-5 py-4 text-left hover:bg-gray-50 transition-colors">
                <i className="fas fa-search text-gray-300" />
                <span className="text-gray-400 text-sm">{t('search.placeholder')}</span>
              </button>
              <button
                onClick={() => navigate('/search')}
                className="m-2 px-6 bg-primary hover:bg-primary-dark text-white font-bold text-sm rounded-xl transition-all flex items-center gap-2">
                <i className="fas fa-search" />
                <span className="hidden sm:inline">{t('search.button')}</span>
              </button>
            </div>

            {/* Quick type pills */}
            <div className="flex gap-2 flex-wrap mt-4 justify-center">
              {[
                ['fa-building','Apartments','apartment'],
                ['fa-home','Villas','villa'],
                ['fa-store','Commercial','commercial'],
                ['fa-mountain','Land','land'],
              ].map(([icon, label, type]) => (
                <button key={type}
                  onClick={() => navigate(`/search?type=${type}`)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-white/15 text-white border border-white/30 hover:bg-white hover:text-primary hover:border-white backdrop-blur-sm transition-all">
                  <i className={`fas ${icon} text-xs`} />{label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="relative z-10 bg-black/20 backdrop-blur-sm border-t border-white/10">
          <div className="max-w-4xl mx-auto grid grid-cols-4 py-4 px-2">
            {[['2,500+',t('hero.stats.properties')],['180+',t('hero.stats.agents')],['4,000+',t('hero.stats.clients')],['12',t('hero.stats.governorates')]].map(([n,l]) => (
              <div key={l} className="text-center px-1">
                <div className="text-lg sm:text-2xl font-bold text-white">{n}</div>
                <div className="text-xs text-white/60 uppercase tracking-wide mt-0.5 leading-tight">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── JUST LISTED strip ── */}
      <section className="py-12 px-4 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <ScrollStrip
            items={JUST_LISTED}
            subtitle="Fresh on Hestia"
            title="Just Listed"
            linkTo="/search?sort=newest"
            linkLabel="See all new"
            renderCard={(p) => <PropertyCard p={p} view="grid" />}
          />
        </div>
      </section>

      {/* ── NEW PROJECTS — warm cream Option A ── */}
      <section className="py-12 px-4" style={{background:'#fef9e8'}}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-6">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{color:'#b45309'}}>Off-plan &amp; new launch</div>
              <h2 className="font-display text-2xl font-bold text-gray-900">{t('home.newProjectsTitle')}</h2>
              <p className="text-sm mt-1 text-gray-400">Invest early, save more — direct from developers</p>
            </div>
            <Link to="/search?type=new"
              className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
              View all <i className="fas fa-arrow-right text-xs" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {NEW_PROJECTS.map((p, i) => <ProjectCard key={i} p={p} />)}
          </div>

          <div className="mt-8 pt-6 flex items-center gap-8 flex-wrap" style={{borderTop:'1px solid #e8b93133'}}>
            {[
              ['fa-shield-alt','Verified developers only'],
              ['fa-file-contract','Secure payment handling'],
              ['fa-headset','Dedicated project advisors'],
            ].map(([icon, label]) => (
              <div key={label} className="flex items-center gap-2 text-sm text-gray-400">
                <i className={`fas ${icon}`} style={{fontSize:13, color:'#b45309'}} />
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED LISTINGS strip ── */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <ScrollStrip
            items={properties}
            subtitle={t('home.featuredTag')}
            title={t('home.featuredTitle')}
            linkTo="/search"
            linkLabel={t('home.viewAll')}
            renderCard={(p) => <PropertyCard p={p} view="grid" />}
          />
        </div>
      </section>

      {/* ── CITIES — 4 large banner tiles ── */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-6">
            <div>
              <div className="text-xs font-bold text-primary uppercase tracking-widest mb-1">{t('home.citiesTag')}</div>
              <h2 className="font-display text-2xl font-bold text-gray-900">{t('home.citiesTitle')}</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {CITIES.map((c) => (
              <Link key={c.name} to={`/search?location=${c.name}`}
                className="relative overflow-hidden rounded-2xl cursor-pointer group" style={{aspectRatio:'4/3'}}>
                <img src={c.img} alt={c.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4">
                  <h3 className="font-display text-xl font-bold text-white">{c.name}</h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-white font-bold text-sm">{c.count}</span>
                    <span className="text-white/70 text-xs">{t('home.listings')}</span>
                  </div>
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                  <i className="fas fa-arrow-right text-primary" style={{fontSize:12}} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOR RENT strip ── */}
      {FOR_RENT.length > 0 && (
        <section className="py-12 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <ScrollStrip
              items={FOR_RENT}
              subtitle="Monthly rentals"
              title="For Rent"
              linkTo="/search?deal=rent"
              linkLabel="View all rentals"
              renderCard={(p) => <PropertyCard p={p} view="grid" />}
            />
          </div>
        </section>
      )}

      {/* ── WHY HESTIA ── */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <div className="text-xs font-bold text-primary uppercase tracking-widest mb-1">{t('home.whyTag')}</div>
            <h2 className="font-display text-3xl font-bold text-gray-900">{t('home.whyTitle')}</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              ['fa-shield-alt','bg-primary-soft text-primary',  t('home.features.verifiedTitle'),  t('home.features.verifiedDesc')],
              ['fa-map-marked-alt','bg-blue-50 text-blue-600',  t('home.features.mapTitle'),       t('home.features.mapDesc')],
              ['fa-bolt','bg-amber-50 text-amber-600',          t('home.features.alertsTitle'),    t('home.features.alertsDesc')],
              ['fa-user-tie','bg-emerald-50 text-emerald-600',  t('home.features.agentsTitle'),    t('home.features.agentsDesc')],
            ].map(([icon, cls, title, desc]) => (
              <div key={title} className="text-center group">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${cls} transition-transform group-hover:scale-110`}>
                  <i className={`fas ${icon} text-xl`} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-sm">{title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AGENT CTA banner ── */}
      <section className="relative overflow-hidden py-16 px-4">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1400&q=80"
            alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-primary/90" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-white/15 text-white px-3 py-1.5 rounded-full text-sm font-semibold mb-4">
              <i className="fas fa-user-tie text-xs" /> {t('home.agentTag')}
            </div>
            <h2 className="font-display text-3xl font-bold text-white mb-4">{t('home.agentTitle')}</h2>
            <p className="text-white/70 mb-6 leading-relaxed max-w-lg">{t('home.agentDesc')}</p>
          <div className="grid grid-cols-2 gap-3 mb-8 max-w-sm mx-auto lg:mx-0">
              {[
                ['fa-chart-line','Lead Tracking'],
                ['fa-bullhorn','Smart Marketing'],
                ['fa-comments','Messaging'],
                ['fa-coins','Commission Tracking'],
              ].map(([icon, title]) => (
                <div key={title} className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0">
                    <i className={`fas ${icon} text-white text-xs`} />
                  </div>
                  <span className="text-white/80 text-sm font-medium">{title}</span>
                </div>
              ))}
            </div>
            <a href="/agent"
              className="inline-flex items-center gap-2 bg-accent hover:bg-amber-400 text-gray-900 font-bold px-6 py-3 rounded-xl transition-all">
              Access Agent Portal <i className="fas fa-arrow-right text-xs" />
            </a>
          </div>

          {/* Dashboard mockup */}
          <div className="flex-1 max-w-md w-full hidden lg:block">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="bg-primary-dark px-4 py-3 flex items-center gap-2">
                <div className="flex gap-1.5">
                  {['bg-red-400','bg-yellow-400','bg-green-400'].map(c => <div key={c} className={`w-2.5 h-2.5 rounded-full ${c}`} />)}
                </div>
                <span className="text-white/70 text-sm font-semibold ml-2">Agent Dashboard</span>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[['24','Active Listings'],['156','Total Leads'],['18.5K','Commission TND']].map(([n,l]) => (
                    <div key={l} className="bg-gray-50 rounded-xl p-3 text-center">
                      <div className="font-bold text-primary text-lg">{n}</div>
                      <div className="text-xs text-gray-400 mt-0.5 leading-tight">{l}</div>
                    </div>
                  ))}
                </div>
                {[
                  {name:'Amir Kallel',      prop:'Villa Gammarth',  status:'New',      cls:'bg-blue-100 text-blue-700'},
                  {name:'Fatima Ben Salah', prop:'Apt Sousse',      status:'Viewing',  cls:'bg-amber-100 text-amber-700'},
                  {name:'Youssef Masmoudi', prop:'Penthouse Lac 2', status:'Closed',   cls:'bg-emerald-100 text-emerald-700'},
                ].map(l => (
                  <div key={l.name} className="flex items-center gap-3 py-2.5 border-b border-gray-100 last:border-0">
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

      {/* ── TESTIMONIALS ── */}
      <section className="py-14 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <div className="text-xs font-bold text-primary uppercase tracking-widest mb-1">{t('home.testimonialsTag')}</div>
            <h2 className="font-display text-3xl font-bold text-gray-900">{t('home.testimonialsTitle')}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {text:'Hestia made finding our dream home in Gammarth so easy. Truly the best real estate platform in Tunisia!', name:'Nadia Ferchichi', role:'Bought a Villa in Gammarth', img:'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80'},
              {text:"The lead tracking is a game-changer. I've closed 40% more deals since joining Hestia as an agent.", name:'Ahmed Ben Ali', role:'Real Estate Agent, Tunis', img:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80'},
              {text:'Found the perfect apartment in Sousse within a week. Precise filters, high quality photos, great agents.', name:'Omar Drissi', role:'Rented in Sousse', img:'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80'},
            ].map(t => (
              <div key={t.name} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <div className="flex gap-0.5 mb-4">
                  {[1,2,3,4,5].map(i => <i key={i} className="fas fa-star text-accent" style={{fontSize:13}} />)}
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

      {/* ── FINAL CTA ── */}
      <section className="py-14 px-4 bg-primary">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-3xl font-bold text-white mb-3">{t('home.ctaTitle')}</h2>
          <p className="text-white/70 mb-8">{t('home.ctaSub')}</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/search" className="bg-accent hover:bg-amber-400 text-gray-900 font-bold px-8 py-3 rounded-xl transition-all inline-flex items-center gap-2">
              <i className="fas fa-search" /> {t('home.ctaBrowse')}
            </Link>
            <a href="/agent" className="bg-white/15 hover:bg-white/25 text-white font-bold px-8 py-3 rounded-xl transition-all border border-white/20 inline-flex items-center gap-2">
              <i className="fas fa-user-tie" /> {t('home.ctaAgent')}
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="font-display text-2xl mb-3 flex items-center gap-2">
              <i className="fas fa-home text-accent" style={{fontSize:16}} /> Hestia
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">Tunisia's premier real estate platform.</p>
            <div className="flex gap-3">
              {[['fa-facebook-f','#'],['fa-instagram','#'],['fa-linkedin-in','#'],['fa-twitter','#']].map(([icon,href]) => (
                <a key={icon} href={href} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                  <i className={`fab ${icon} text-xs`} />
                </a>
              ))}
            </div>
          </div>
          {[
            {title:t('footer.properties'), links:[t('footer.forSale'),t('footer.forRent'),t('footer.newProjects'),t('footer.commercial'),t('footer.land')]},
            {title:t('footer.company'),    links:[t('footer.aboutUs'),t('footer.careers'),t('footer.blog'),t('footer.press'),t('footer.contact')]},
            {title:t('footer.support'),    links:[t('footer.helpCenter'),t('footer.agentSupport'),t('footer.privacy'),t('footer.terms'),t('footer.sitemap')]},
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
          <p className="text-gray-500 text-sm">{t('footer.copyright')}</p>
          <div className="flex gap-4">
            {[[t('footer.privacyShort'),'/privacy'],[t('footer.termsShort'),'/terms'],[t('footer.cookiesShort'),'#']].map(([l,href]) => (
              <a key={l} href={href} className="text-gray-500 text-sm hover:text-white transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
