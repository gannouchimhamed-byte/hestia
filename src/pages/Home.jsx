import { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import PropertyCard from '../components/PropertyCard'
import PropertyMap from '../components/PropertyMap'
import { properties as ALL, getDaysOld } from '../lib/data'

const CITIES_SHOWCASE = [
  { name:'Tunis',    count:'1,240', img:'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=600&q=80' },
  { name:'Sfax',     count:'486',   img:'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&q=80' },
  { name:'Sousse',   count:'352',   img:'https://images.unsplash.com/photo-1559628233-100c798642d4?w=600&q=80' },
  { name:'Hammamet', count:'215',   img:'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80' },
]

function filterProps(props, f) {
  return props.filter(p => {
    if (f.deal && p.type !== f.deal) return false
    if (f.location && !p.city.toLowerCase().includes(f.location.toLowerCase()) && !p.location.toLowerCase().includes(f.location.toLowerCase())) return false
    if (f.type && !p.title.toLowerCase().includes(f.type)) return false
    if (f.rooms && p.rooms < parseInt(f.rooms)) return false
    if (f.price) {
      if (f.price.endsWith('+') && p.priceValue < parseInt(f.price)) return false
      else {
        const [mn,mx] = f.price.split('-').map(Number)
        if (!f.price.endsWith('+') && (p.priceValue < mn || p.priceValue > mx)) return false
      }
    }
    if (f.condition && p.condition !== f.condition) return false
    if (f.furnished && p.furnished !== f.furnished) return false
    if (f.parking === 'yes' && !p.parking) return false
    if (f.parking === 'no' && p.parking) return false
    if (f.elevator === 'yes' && !p.elevator) return false
    if (f.elevator === 'no' && p.elevator) return false
    return true
  })
}

export default function Home() {
  const navigate = useNavigate()
  const [filtered, setFiltered] = useState(ALL)
  const [view, setView]         = useState('list')   // 'list' | 'map'
  const [dealTab, setDealTab]   = useState('all')
  const [cityTab, setCityTab]   = useState('all')
  const [hoveredId, setHoveredId] = useState(null)
  const listRef = useRef(null)

  function handleSearch(filters) {
    setFiltered(filterProps(ALL, filters))
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
    if (id !== null && listRef.current) {
      const el = listRef.current.querySelector(`[data-pid="${id}"]`)
      el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [])

  return (
    <div className="min-h-screen">

      {/* ── HERO ── */}
      <div className="relative flex flex-col" style={{minHeight:'100vh'}}>
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=1800&q=85" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/80 via-primary/70 to-primary-dark/75" />
        </div>

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pt-24 pb-8">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white px-4 py-1.5 rounded-full text-sm font-semibold mb-5 backdrop-blur-sm">
            <i className="fas fa-award text-accent" />
            Tunisia&apos;s No.1 Real Estate Platform
          </div>
          <h1 className="font-display text-5xl md:text-6xl text-white text-center font-bold leading-tight mb-3">
            Find Your <span className="text-accent">Dream Property</span>
          </h1>
          <p className="text-white/70 text-center text-lg mb-8 max-w-xl">
            2,500+ properties across Tunisia. Buy, rent, or invest with confidence.
          </p>
          <SearchBar onSearch={handleSearch} />
        </div>

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

      {/* ── LISTINGS ── */}
      <div id="listings">

        {/* Sticky filter bar */}
        <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-screen-2xl mx-auto px-4">
            <div className="flex items-center gap-2 py-3 overflow-x-auto hide-scrollbar">

              {/* Deal tabs */}
              <div className="flex bg-gray-100 rounded-lg p-0.5 flex-shrink-0">
                {[['all','All'],['sale','For Sale'],['rent','For Rent']].map(([v,l]) => (
                  <button key={v} onClick={() => handleDealTab(v)}
                    className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-all whitespace-nowrap
                      ${dealTab === v ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                    {l}
                  </button>
                ))}
              </div>

              {/* City pills */}
              {['all','Tunis','Sfax','Sousse','Hammamet'].map(c => (
                <button key={c} onClick={() => handleCityTab(c)}
                  className={`px-3 py-1.5 text-sm font-semibold rounded-full border whitespace-nowrap transition-all flex-shrink-0
                    ${cityTab === c ? 'bg-primary text-white border-primary' : 'border-gray-200 text-gray-600 hover:border-primary hover:text-primary'}`}>
                  {c === 'all' ? 'All Tunisia' : c}
                </button>
              ))}

              <div className="ml-auto flex items-center gap-3 flex-shrink-0">
                <span className="text-sm text-gray-400">
                  <strong className="text-gray-800">{filtered.length}</strong> results
                </span>

                {/* List / Map toggle — Bayut style */}
                <div className="flex rounded-lg overflow-hidden border border-gray-200">
                  <button onClick={() => setView('list')}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-all
                      ${view === 'list' ? 'bg-primary text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}>
                    <i className="fas fa-th-large text-xs" /> List
                  </button>
                  <button onClick={() => setView('map')}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-all border-l border-gray-200
                      ${view === 'map' ? 'bg-primary text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}>
                    <i className="fas fa-map text-xs" /> Map
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BAYUT MAP VIEW — full screen map + floating side panel */}
        {view === 'map' && (
          <div className="relative" style={{height:'calc(100vh - 113px)'}}>
            {/* Full map */}
            <PropertyMap
              properties={filtered}
              hoveredId={hoveredId}
              onMarkerClick={handleMarkerClick}
              className="absolute inset-0 w-full h-full"
            />

            {/* Floating results panel — right side, Bayut-style */}
            <div
              ref={listRef}
              className="absolute top-4 right-4 bottom-4 w-80 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100"
            >
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
                <span className="font-semibold text-sm text-gray-800">
                  {filtered.length} properties
                </span>
                <button onClick={() => setView('list')}
                  className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
                  <i className="fas fa-th-large text-xs" /> Grid view
                </button>
              </div>
              <div className="flex-1 overflow-y-auto hide-scrollbar p-3 space-y-3">
                {filtered.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <i className="fas fa-search text-3xl mb-3 block" />
                    <p className="font-semibold text-sm">No properties found</p>
                    <button onClick={() => { setFiltered(ALL); setDealTab('all'); setCityTab('all') }}
                      className="mt-3 text-primary text-xs font-semibold hover:underline">Clear filters</button>
                  </div>
                ) : (
                  filtered.map(p => (
                    <div key={p.id} data-pid={p.id}>
                      <PropertyCard p={p} view="list" onHover={handleHover} highlighted={hoveredId === p.id} />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* GRID / LIST VIEW */}
        {view === 'list' && (
          <div className="max-w-7xl mx-auto px-4 py-6">
            {filtered.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <i className="fas fa-search text-4xl mb-4 block" />
                <p className="font-semibold text-lg mb-2">No properties match your search</p>
                <button onClick={() => { setFiltered(ALL); setDealTab('all'); setCityTab('all') }}
                  className="btn-outline mt-2">Clear filters</button>
              </div>
            ) : (
              <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map(p => <PropertyCard key={p.id} p={p} view="grid" />)}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── CITIES ── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-bold text-gray-900 mb-2">Explore by City</h2>
            <p className="text-gray-400 text-sm">Find properties in Tunisia's most sought-after locations</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CITIES_SHOWCASE.map(c => (
              <div key={c.name} onClick={() => handleCityTab(c.name)}
                className="relative overflow-hidden rounded-2xl cursor-pointer group aspect-[4/3]">
                <img src={c.img} alt={c.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4">
                  <h3 className="font-display text-xl font-bold text-white">{c.name}</h3>
                  <p className="text-white/70 text-sm">{c.count} properties</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AGENT SECTION ── */}
      <section className="py-16 px-4 bg-gradient-to-br from-primary-soft to-white">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 bg-primary-soft text-primary px-3 py-1.5 rounded-full text-sm font-semibold mb-4">
              <i className="fas fa-user-tie text-xs" /> For Real Estate Professionals
            </div>
            <h2 className="font-display text-3xl font-bold text-gray-900 mb-4">Powerful Tools for Agents</h2>
            <p className="text-gray-500 mb-6 leading-relaxed">
              Manage listings, track leads, and close deals faster with Hestia's dedicated agent dashboard.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                ['fa-chart-line','Lead Tracking','Never miss a buyer'],
                ['fa-bullhorn','Smart Marketing','Promote listings'],
                ['fa-comments','Messaging','Real-time chat'],
                ['fa-file-contract','Documents','Digital contracts'],
              ].map(([icon,title,sub]) => (
                <div key={title} className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary-soft flex items-center justify-center flex-shrink-0">
                    <i className={`fas ${icon} text-primary text-sm`} />
                  </div>
                  <div><p className="font-semibold text-sm text-gray-800">{title}</p><p className="text-xs text-gray-400">{sub}</p></div>
                </div>
              ))}
            </div>
            <a href="/agent" className="btn-primary inline-flex">
              Access Agent Portal <i className="fas fa-arrow-right text-xs" />
            </a>
          </div>

          {/* Dashboard mockup */}
          <div className="flex-1 max-w-md w-full">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-primary px-4 py-3 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
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
                  { name:'Amir Kallel',       prop:'Villa Gammarth',  status:'New',       cls:'bg-blue-100 text-blue-700' },
                  { name:'Fatima Ben Salah',  prop:'Apt Sousse',      status:'Contacted', cls:'bg-amber-100 text-amber-700' },
                  { name:'Youssef Masmoudi',  prop:'Penthouse Lac 2', status:'Closed',    cls:'bg-emerald-100 text-emerald-700' },
                ].map(l => (
                  <div key={l.name} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                    <div className="w-7 h-7 rounded-full bg-primary-soft text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {l.name[0]}
                    </div>
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
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-bold text-gray-900 mb-2">What Our Clients Say</h2>
            <p className="text-gray-400 text-sm">Trusted by thousands across Tunisia</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { text:'Hestia made finding our dream home in Gammarth so easy. The best real estate platform in Tunisia.', name:'Nadia Ferchichi', role:'Bought a Villa in Gammarth', img:'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80', rating:5 },
              { text:"The lead tracking is a game-changer. I've closed 40% more deals since joining Hestia.", name:'Ahmed Ben Ali', role:'Real Estate Agent, Tunis', img:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80', rating:5 },
              { text:'Found the perfect apartment in Sousse within a week. Precise filters, high quality photos.', name:'Omar Drissi', role:'Rented in Sousse', img:'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80', rating:5 },
            ].map(t => (
              <div key={t.name} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({length: t.rating}).map((_,i) => <i key={i} className="fas fa-star text-amber-400" style={{fontSize:13}} />)}
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

      {/* ── CTA ── */}
      <section className="py-16 px-4 bg-primary">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-3xl font-bold text-white mb-3">Ready to Find Your Home?</h2>
          <p className="text-white/70 mb-8">Join thousands of satisfied clients on Tunisia's most trusted real estate platform.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button onClick={() => document.getElementById('listings')?.scrollIntoView({ behavior:'smooth' })}
              className="bg-accent hover:bg-amber-400 text-gray-900 font-bold px-8 py-3 rounded-xl transition-all inline-flex items-center gap-2">
              <i className="fas fa-search" /> Browse Properties
            </button>
            <a href="/agent" className="bg-white/15 hover:bg-white/25 text-white font-bold px-8 py-3 rounded-xl transition-all border border-white/20 inline-flex items-center gap-2">
              <i className="fas fa-user-tie" /> Agent Registration
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="font-display text-2xl mb-3 flex items-center gap-2">
              <i className="fas fa-home text-accent" style={{fontSize:16}} /> Hestia
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">Tunisia's premier real estate platform. Connecting people with their perfect properties.</p>
            <div className="flex gap-3">
              {[['fa-facebook-f','#'],['fa-instagram','#'],['fa-linkedin-in','#'],['fa-twitter','#']].map(([icon, href]) => (
                <a key={icon} href={href} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                  <i className={`fab ${icon} text-xs`} />
                </a>
              ))}
            </div>
          </div>
          {[
            { title:'Properties', links:['For Sale','For Rent','New Projects','Commercial','Land'] },
            { title:'Company',    links:['About Us','Careers','Blog','Press','Contact'] },
            { title:'Support',    links:['Help Center','Agent Support','Privacy Policy','Terms','Sitemap'] },
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
