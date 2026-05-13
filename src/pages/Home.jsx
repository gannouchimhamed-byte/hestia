import { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import PropertyCard from '../components/PropertyCard'
import PropertyMap from '../components/PropertyMap'
import { properties as ALL, getDaysOld } from '../lib/data'

const CITIES_SHOWCASE = [
  { name: 'Tunis',     count: '1,240', img: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=600&q=80' },
  { name: 'Sfax',      count: '486',   img: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&q=80' },
  { name: 'Sousse',    count: '352',   img: 'https://images.unsplash.com/photo-1559628233-100c798642d4?w=600&q=80' },
  { name: 'Hammamet',  count: '215',   img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80' },
]

function filterProperties(props, filters) {
  return props.filter(p => {
    const { deal, location, type, rooms, price, condition, furnished, parking, elevator, minArea, maxArea } = filters
    if (deal && p.type !== deal) return false
    if (location && !p.city.toLowerCase().includes(location.toLowerCase()) && !p.location.toLowerCase().includes(location.toLowerCase())) return false
    if (type && !p.title.toLowerCase().includes(type) && p.type !== type) return false
    if (rooms && p.rooms < parseInt(rooms)) return false
    if (price) {
      const [min, max] = price.split('-').map(v => v === '' ? Infinity : Number(v.replace('+', '')))
      if (price.endsWith('+') && p.priceValue < min) return false
      if (!price.endsWith('+') && (p.priceValue < min || p.priceValue > max)) return false
    }
    if (condition && p.condition !== condition) return false
    if (furnished && p.furnished !== furnished) return false
    if (parking === 'yes' && !p.parking) return false
    if (parking === 'no' && p.parking) return false
    if (elevator === 'yes' && !p.elevator) return false
    if (elevator === 'no' && p.elevator) return false
    if (minArea && p.area < parseInt(minArea)) return false
    if (maxArea && p.area > parseInt(maxArea)) return false
    return true
  })
}

export default function Home() {
  const navigate = useNavigate()
  const [filtered, setFiltered] = useState(ALL)
  const [view, setView]         = useState('split') // split | grid | list
  const [dealTab, setDealTab]   = useState('all')
  const [cityTab, setCityTab]   = useState('all')
  const [hoveredId, setHoveredId] = useState(null)
  const listRef = useRef(null)

  function handleSearch(filters) {
    const result = filterProperties(ALL, filters)
    setFiltered(result)
    document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth' })
  }

  function handleDealTab(tab) {
    setDealTab(tab)
    setFiltered(tab === 'all' ? ALL : ALL.filter(p => p.type === tab))
  }

  function handleCityTab(city) {
    setCityTab(city)
    setFiltered(city === 'all' ? ALL : ALL.filter(p => p.city === city))
  }

  const handleMarkerClick = useCallback((id) => {
    navigate(`/property/${id}`)
  }, [navigate])

  const handleHover = useCallback((id) => {
    setHoveredId(id)
    if (id !== null) {
      const el = listRef.current?.querySelector(`[data-pid="${id}"]`)
      el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [])

  const isMapView  = view === 'split'
  const isGridView = view === 'grid'

  return (
    <div className="min-h-screen">

      {/* ── HERO ────────────────────────────────────────────────── */}
      <div className="relative min-h-screen flex flex-col">
        {/* Background */}
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=1800&q=85"
            alt="Tunisia real estate" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/80 via-primary/70 to-primary-dark/75" />
        </div>

        {/* Hero content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pt-24 pb-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-accent/20 border border-accent/40 text-accent px-4 py-1.5 rounded-full text-sm font-semibold mb-5 backdrop-blur-sm">
            🏆 Tunisia's #1 Real Estate Platform
          </div>

          {/* Headline */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-white text-center font-bold leading-tight mb-3">
            Find Your <span className="text-accent">Dream Property</span>
          </h1>
          <p className="text-white/70 text-center text-lg mb-8 max-w-xl">
            2,500+ properties across Tunisia. Buy, rent, or invest with confidence.
          </p>

          {/* Search */}
          <SearchBar onSearch={handleSearch} className="w-full max-w-3xl" />
        </div>

        {/* Stats bar */}
        <div className="relative z-10 bg-black/20 backdrop-blur-sm border-t border-white/10">
          <div className="max-w-4xl mx-auto flex items-center justify-around py-5 px-4">
            {[['2,500+','Properties'],['180+','Verified Agents'],['4,000+','Happy Clients'],['12','Governorates']].map(([n,l]) => (
              <div key={l} className="text-center">
                <div className="text-2xl font-bold text-white">{n}</div>
                <div className="text-xs text-white/60 uppercase tracking-wide mt-0.5">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── LISTINGS + MAP (ImmScout style) ──────────────────────── */}
      <div id="listings" className="bg-gray-50">

        {/* Sticky filter bar */}
        <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-screen-2xl mx-auto px-4">
            <div className="flex items-center gap-2 py-3 overflow-x-auto hide-scrollbar">
              {/* Deal tabs */}
              <div className="flex bg-gray-100 rounded-lg p-0.5 flex-shrink-0">
                {[['all','All'],['sale','For Sale'],['rent','For Rent']].map(([v,l]) => (
                  <button key={v} onClick={() => handleDealTab(v)}
                    className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-all whitespace-nowrap ${dealTab === v ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                    {l}
                  </button>
                ))}
              </div>

              {/* City tags */}
              {['all','Tunis','Sfax','Sousse','Hammamet'].map(c => (
                <button key={c} onClick={() => handleCityTab(c)}
                  className={`px-3 py-1.5 text-sm font-semibold rounded-full border whitespace-nowrap transition-all flex-shrink-0
                    ${cityTab === c ? 'bg-primary text-white border-primary' : 'border-gray-200 text-gray-600 hover:border-primary hover:text-primary'}`}>
                  {c === 'all' ? '🇹🇳 All Tunisia' : c}
                </button>
              ))}

              {/* Results count */}
              <div className="ml-auto flex-shrink-0 text-sm text-gray-500">
                <strong className="text-gray-900">{filtered.length}</strong> results
              </div>

              {/* View toggle */}
              <div className="flex gap-1 flex-shrink-0 border border-gray-200 rounded-lg p-0.5">
                {[['split','⊞ Map','Split'],['grid','⊟','Grid'],['list','☰','List']].map(([v, icon, label]) => (
                  <button key={v} onClick={() => setView(v)} title={label}
                    className={`px-2.5 py-1 text-sm rounded-md transition-all ${view === v ? 'bg-primary text-white' : 'text-gray-400 hover:text-gray-700'}`}>
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Split layout or full grid */}
        {isMapView ? (
          <div className="flex max-w-screen-2xl mx-auto" style={{ height: 'calc(100vh - 113px)' }}>
            {/* Left: scrollable cards */}
            <div ref={listRef} className="w-full lg:w-[480px] xl:w-[520px] flex-shrink-0 overflow-y-auto hide-scrollbar p-4 space-y-3">
              {filtered.length === 0 && (
                <div className="text-center py-16 text-gray-400">
                  <div className="text-4xl mb-3">🔍</div>
                  <p className="font-semibold">No properties match your search</p>
                  <button onClick={() => { setFiltered(ALL); setDealTab('all'); setCityTab('all') }}
                    className="mt-3 text-primary text-sm font-semibold hover:underline">Clear filters</button>
                </div>
              )}
              {filtered.map(p => (
                <div key={p.id} data-pid={p.id}>
                  <PropertyCard p={p} view="list" onHover={handleHover} highlighted={hoveredId === p.id} />
                </div>
              ))}
            </div>

            {/* Right: sticky map */}
            <div className="flex-1 sticky top-[113px] h-[calc(100vh-113px)] hidden lg:block">
              <PropertyMap
                properties={filtered}
                hoveredId={hoveredId}
                onMarkerClick={handleMarkerClick}
              />
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 py-6">
            {filtered.length === 0 && (
              <div className="text-center py-16 text-gray-400">
                <div className="text-4xl mb-3">🔍</div>
                <p className="font-semibold">No properties match your search</p>
                <button onClick={() => { setFiltered(ALL); setDealTab('all'); setCityTab('all') }}
                  className="mt-3 text-primary text-sm font-semibold hover:underline">Clear filters</button>
              </div>
            )}
            <div className={`grid gap-5 ${isGridView ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {filtered.map(p => (
                <PropertyCard key={p.id} p={p} view={isGridView ? 'grid' : 'list'} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── EXPLORE BY CITY ─────────────────────────────────────── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-bold text-gray-900 mb-2">Explore by City</h2>
            <p className="text-gray-500">Find properties in Tunisia's most sought-after locations</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CITIES_SHOWCASE.map(c => (
              <div key={c.name} onClick={() => handleCityTab(c.name)}
                className="relative overflow-hidden rounded-2xl cursor-pointer group aspect-[4/3]">
                <img src={c.img} alt={c.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4">
                  <h3 className="font-display text-xl font-bold text-white">{c.name}</h3>
                  <p className="text-white/70 text-sm">{c.count} properties</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AGENT CRM PREVIEW ───────────────────────────────────── */}
      <section className="py-16 px-4 bg-gradient-to-br from-primary/5 to-primary-soft">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 bg-primary-soft text-primary px-3 py-1.5 rounded-full text-sm font-semibold mb-4">
              🏆 For Real Estate Professionals
            </div>
            <h2 className="font-display text-3xl font-bold text-gray-900 mb-4">Powerful Tools for Agents</h2>
            <p className="text-gray-500 mb-6 leading-relaxed">
              Manage listings, track leads, book viewings and close deals faster. Built specifically for the Tunisian real estate market.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[['📊','Lead Tracking','Never miss a buyer'],['📢','Smart Marketing','Boost your listings'],['💬','Client Messaging','Real-time chat'],['📄','Documents','Handle contracts digitally']].map(([icon,title,sub]) => (
                <div key={title} className="flex gap-3">
                  <span className="text-2xl">{icon}</span>
                  <div><p className="font-semibold text-sm text-gray-800">{title}</p><p className="text-xs text-gray-400">{sub}</p></div>
                </div>
              ))}
            </div>
            <a href="/agent" className="btn-primary inline-flex">
              → Access Agent Portal
            </a>
          </div>

          {/* Dashboard mockup */}
          <div className="flex-1 max-w-md w-full">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-primary px-4 py-3 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
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
                <div className="text-xs font-bold text-gray-400 uppercase mb-2">Recent Leads</div>
                {[
                  { name: 'Amir Kallel',      prop: 'Villa Gammarth',    status: 'New',        color: 'bg-blue-100 text-blue-700' },
                  { name: 'Fatima Ben Salah', prop: 'Apt Sousse',        status: 'Contacted',  color: 'bg-amber-100 text-amber-700' },
                  { name: 'Youssef Masmoudi', prop: 'Penthouse Lac 2',   status: 'Closed',     color: 'bg-emerald-100 text-emerald-700' },
                ].map(l => (
                  <div key={l.name} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                    <div className="w-7 h-7 rounded-full bg-primary-soft text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {l.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-gray-800 truncate">{l.name}</div>
                      <div className="text-xs text-gray-400 truncate">{l.prop}</div>
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${l.color}`}>{l.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-bold text-gray-900 mb-2">What Our Clients Say</h2>
            <p className="text-gray-500">Trusted by thousands across Tunisia</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { text: 'Hestia made finding our dream home in Gammarth so easy. Truly the best real estate platform in Tunisia!', name: 'Nadia Ferchichi', role: 'Bought a Villa in Gammarth', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80' },
              { text: "As an agent, the lead tracking is a game-changer. I've closed 40% more deals since joining Hestia.", name: 'Ahmed Ben Ali', role: 'Real Estate Agent, Tunis', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80' },
              { text: 'Found the perfect apartment in Sousse within a week. The filters are precise and the photos are high quality.', name: 'Omar Drissi', role: 'Rented in Sousse', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80' },
            ].map(t => (
              <div key={t.name} className="card p-6">
                <div className="text-amber-400 text-sm mb-3">★★★★★</div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">"{t.text}"</p>
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
      <section className="py-16 px-4 bg-primary">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-3xl font-bold text-white mb-3">Ready to Find Your Home?</h2>
          <p className="text-white/70 mb-8">Join thousands of satisfied clients and agents on Tunisia's most trusted real estate platform.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button onClick={() => document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-accent hover:bg-amber-400 text-gray-900 font-bold px-8 py-3 rounded-xl transition-all">
              🔍 Browse Properties
            </button>
            <a href="/agent" className="bg-white/20 hover:bg-white/30 text-white font-bold px-8 py-3 rounded-xl transition-all border border-white/30">
              👔 Agent Registration
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────── */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="font-display text-2xl mb-3"><span className="text-accent">⌂</span> Hestia</div>
            <p className="text-gray-400 text-sm leading-relaxed">Tunisia's premier real estate platform. Connecting people with their perfect properties through technology and trust.</p>
          </div>
          {[
            { title: 'Properties', links: ['For Sale','For Rent','New Projects','Commercial','Land'] },
            { title: 'Company',    links: ['About Us','Careers','Blog','Press','Contact'] },
            { title: 'Support',    links: ['Help Center','Agent Support','Privacy Policy','Terms','Sitemap'] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="font-bold mb-3 text-sm uppercase tracking-wide text-gray-300">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map(l => <li key={l}><a href="#" className="text-gray-400 text-sm hover:text-white transition-colors">{l}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-sm">© 2026 Hestia Real Estate. Made with ❤️ in Tunisia.</p>
          <div className="flex gap-4">
            {['Privacy','Terms','Cookies'].map(l => <a key={l} href="#" className="text-gray-500 text-sm hover:text-white transition-colors">{l}</a>)}
          </div>
        </div>
      </footer>
    </div>
  )
}
