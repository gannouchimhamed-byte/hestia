import { useState, useRef, useCallback } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { sb } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import PropertyCard from '../components/PropertyCard'
import PropertyMap from '../components/PropertyMap'
import { properties as ALL, getDaysOld } from '../lib/data'

function filterProps(props, f) {
  return props.filter(p => {
    if (f.deal && f.deal !== 'all' && p.type !== f.deal) return false
    if (f.location && !p.city.toLowerCase().includes(f.location.toLowerCase()) && !p.location.toLowerCase().includes(f.location.toLowerCase())) return false
    if (f.type && !p.title.toLowerCase().includes(f.type) && p.type !== f.type) return false
    if (f.rooms && p.rooms < parseInt(f.rooms)) return false
    if (f.price) {
      if (f.price.endsWith('+') && p.priceValue < parseInt(f.price)) return false
      else { const [mn,mx] = f.price.split('-').map(Number); if (!f.price.endsWith('+') && (p.priceValue < mn || p.priceValue > mx)) return false }
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

function sortProps(props, sort) {
  const arr = [...props]
  if (sort === 'price_asc')  return arr.sort((a,b) => a.priceValue - b.priceValue)
  if (sort === 'price_desc') return arr.sort((a,b) => b.priceValue - a.priceValue)
  if (sort === 'newest')     return arr.sort((a,b) => getDaysOld(a.listedAt) - getDaysOld(b.listedAt))
  if (sort === 'area_desc')  return arr.sort((a,b) => b.area - a.area)
  return arr
}

function NewProjectAd() {
  return (
    <div className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl overflow-hidden shadow-sm">
      <img src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&q=80" alt="" className="w-full h-36 object-cover opacity-70" />
      <div className="p-4">
        <div className="text-xs font-bold text-accent uppercase tracking-widest mb-1">New Project</div>
        <div className="font-display text-base font-bold text-white mb-1">Les Jardins de Carthage</div>
        <div className="text-white/70 text-xs mb-3 leading-relaxed">Premium residences from 280,000 TND. 2 &amp; 3 bedroom apartments with sea views.</div>
        <div className="flex items-center justify-between mb-3">
          <div><div className="text-white/60 text-xs">Starting from</div><div className="text-white font-bold text-sm">280,000 TND</div></div>
          <div className="text-right"><div className="text-white/60 text-xs">Delivery</div><div className="text-white font-bold text-sm">Q4 2027</div></div>
        </div>
        <button className="w-full py-2 bg-accent hover:bg-amber-400 text-gray-900 font-bold text-xs rounded-xl transition-all">Learn More</button>
      </div>
    </div>
  )
}

function FeaturedAgentAd() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
      <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Featured Agent</div>
      <div className="flex items-center gap-3 mb-3">
        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80" className="w-12 h-12 rounded-full object-cover flex-shrink-0" alt="Agent" />
        <div>
          <div className="font-bold text-sm text-gray-900">Ahmed Ben Ali</div>
          <div className="text-xs text-gray-400">Premium Agent · Tunis</div>
          <div className="flex items-center gap-0.5 text-amber-400 mt-0.5" style={{fontSize:11}}>{'★'.repeat(5)}<span className="text-gray-400 ml-1 text-xs">5.0 (63)</span></div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-3">
        {[['12','Active listings'],['63','Reviews']].map(([v,l]) => (
          <div key={l} className="bg-gray-50 rounded-xl p-2 text-center"><div className="font-bold text-primary text-sm">{v}</div><div className="text-xs text-gray-400">{l}</div></div>
        ))}
      </div>
      <a href="https://wa.me/21699333444" target="_blank" rel="noreferrer"
        className="w-full flex items-center justify-center gap-2 py-2 bg-[#25d366] hover:bg-[#128c7e] text-white font-bold text-xs rounded-xl transition-all">
        <i className="fab fa-whatsapp" /> Contact Agent
      </a>
    </div>
  )
}

function MortgageAd() {
  const [price, setPrice] = useState(450000)
  const monthly = Math.round(price * 0.8 * (0.075/12) * Math.pow(1+0.075/12,300) / (Math.pow(1+0.075/12,300)-1))
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
      <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Mortgage Calculator</div>
      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-500 mb-1"><span>Property price</span><span className="font-semibold text-gray-700">{price.toLocaleString()} TND</span></div>
        <input type="range" min={50000} max={2000000} step={10000} value={price} onChange={e => setPrice(parseInt(e.target.value))} className="w-full" />
      </div>
      <div className="bg-primary-soft rounded-xl p-3 text-center">
        <div className="text-xs text-gray-500">Est. monthly payment</div>
        <div className="text-xl font-bold text-primary mt-0.5">{monthly.toLocaleString()} TND</div>
        <div className="text-xs text-gray-400 mt-0.5">20% down · 25yr · 7.5%</div>
      </div>
    </div>
  )
}

export default function Search() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const listRef  = useRef(null)

  const [view, setView]               = useState('list')
  const [sort, setSort]               = useState('relevance')
  const [hoveredId, setHoveredId]     = useState(null)
  const [showSaveSearch, setShowSS]   = useState(false)
  const [searchName, setSearchName]   = useState('')
  const [saveFreq, setSaveFreq]       = useState('daily')
  const [saving, setSaving]           = useState(false)
  const [saved, setSaved]             = useState(false)

  const filters = {
    deal:      searchParams.get('deal')      || 'sale',
    location:  searchParams.get('location')  || '',
    type:      searchParams.get('type')      || '',
    rooms:     searchParams.get('rooms')     || '',
    price:     searchParams.get('price')     || '',
    condition: searchParams.get('condition') || '',
    furnished: searchParams.get('furnished') || '',
    parking:   searchParams.get('parking')   || '',
    elevator:  searchParams.get('elevator')  || '',
  }

  const filtered = sortProps(filterProps(ALL, filters), sort)

  function updateFilter(key, value) {
    const p = new URLSearchParams(searchParams)
    value ? p.set(key, value) : p.delete(key)
    setSearchParams(p)
  }

  function clearAll() { setSearchParams(new URLSearchParams({ deal: filters.deal })) }

  async function saveSearch() {
    if (!searchName.trim() || !user) return
    setSaving(true)
    await sb.from('saved_searches').insert({ user_id: user.id, name: searchName, filters: Object.fromEntries(searchParams.entries()), freq: saveFreq, alert_on: true })
    setSaving(false); setSaved(true)
    setTimeout(() => { setShowSS(false); setSaved(false); setSearchName('') }, 1500)
  }

  const handleMarkerClick = useCallback((id) => navigate(`/property/${id}`), [navigate])
  const handleHover = useCallback((id) => {
    setHoveredId(id)
    if (id !== null && listRef.current) listRef.current.querySelector(`[data-pid="${id}"]`)?.scrollIntoView({ behavior:'smooth', block:'nearest' })
  }, [])

  const activeFilters = [filters.location,filters.type,filters.rooms,filters.price,filters.condition,filters.furnished,filters.parking==='yes'&&'parking',filters.elevator==='yes'&&'elevator'].filter(Boolean)
  const crumbs = ['Properties', filters.location, filters.type, filters.deal === 'rent' ? 'For Rent' : 'For Sale'].filter(Boolean)

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Filter bar */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
        <div className="max-w-screen-2xl mx-auto">

          <div className="flex items-center gap-2 px-3 py-2.5 border-b border-gray-100">
            <Link to="/" className="font-display text-base font-bold text-primary flex items-center gap-1.5 flex-shrink-0">
              <i className="fas fa-home text-accent" style={{fontSize:14}} />
              <span className="hidden sm:inline">Hestia</span>
            </Link>
            <button onClick={() => navigate('/')}
              className="flex-1 flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-xl text-sm text-gray-500 hover:bg-gray-200 transition-colors text-left">
              <i className="fas fa-search text-gray-400 text-xs flex-shrink-0" />
              <span className="truncate text-xs sm:text-sm">
                {filters.location || t('search_page.allTunisia')}
                {filters.type ? ` · ${filters.type}` : ''}
                {filters.rooms ? ` · ${filters.rooms}+` : ''}
              </span>
              {activeFilters.length > 0 && <i className="fas fa-times text-gray-400 text-xs ml-auto flex-shrink-0" onClick={e => { e.stopPropagation(); clearAll() }} />}
            </button>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className="text-xs text-gray-400 hidden sm:block font-medium">
                <strong className="text-gray-800">{filtered.length}</strong> {t('search_page.results')}
              </span>
              {user && (
                <button onClick={() => setShowSS(true)}
                  className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-primary border border-primary/30 px-3 py-1.5 rounded-full hover:bg-primary-soft transition-all">
                  <i className="fas fa-bell text-xs" /> Save
                </button>
              )}
              <select value={sort} onChange={e => setSort(e.target.value)}
                className="text-xs border border-gray-200 rounded-lg px-2 py-2 outline-none focus:border-primary bg-white font-medium text-gray-600 max-w-[90px] sm:max-w-none sm:text-sm sm:px-3">
                <option value="relevance">{t('search_page.sortRelevance')}</option>
                <option value="newest">{t('search_page.sortNewest')}</option>
                <option value="price_asc">{t('search_page.sortPriceAsc')}</option>
                <option value="price_desc">{t('search_page.sortPriceDesc')}</option>
                <option value="area_desc">{t('search_page.sortAreaDesc')}</option>
              </select>
              <div className="flex rounded-lg overflow-hidden border border-gray-200">
                <button onClick={() => setView('list')} className={`px-2.5 py-2 text-sm font-semibold transition-all ${view==='list'?'bg-primary text-white':'bg-white text-gray-500'}`}><i className="fas fa-th-large text-xs" /></button>
                <button onClick={() => setView('map')}  className={`px-2.5 py-2 text-sm font-semibold transition-all border-l border-gray-200 ${view==='map'?'bg-primary text-white':'bg-white text-gray-500'}`}><i className="fas fa-map text-xs" /></button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 overflow-x-auto hide-scrollbar">
            <div className="flex bg-gray-100 rounded-lg p-0.5 flex-shrink-0">
              {[['sale',t('search_page.buy')],['rent',t('search_page.rent')]].map(([v,l]) => (
                <button key={v} onClick={() => updateFilter('deal',v)}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${filters.deal===v?'bg-white text-primary shadow-sm':'text-gray-500'}`}>{l}</button>
              ))}
            </div>
            {[
              {label:'City',  key:'location', opts:['Tunis','Sfax','Sousse','Hammamet','Monastir','Nabeul']},
              {label:'Type',  key:'type',     opts:['apartment','villa','office','land','commercial']},
              {label:'Beds',  key:'rooms',    opts:[['1','S+1'],['2','S+2'],['3','S+3'],['4','S+4+']]},
              {label:'Price', key:'price',    opts:[['0-200000','<200K'],['200000-500000','200-500K'],['500000-1000000','500K-1M'],['1000000+','1M+']]},
              {label:'Furnished',key:'furnished',opts:[['furnished','Furnished'],['unfurnished','Unfurnished']]},
              {label:'Parking',  key:'parking',  opts:[['yes','With parking']]},
              {label:'Elevator', key:'elevator', opts:[['yes','With elevator']]},
            ].map(f => (
              <select key={f.key} value={filters[f.key]||''} onChange={e => updateFilter(f.key, e.target.value)}
                className={`flex-shrink-0 text-xs font-semibold border rounded-full px-3 py-1.5 outline-none cursor-pointer transition-all ${filters[f.key]?'border-primary bg-primary-soft text-primary':'border-gray-200 bg-white text-gray-600 hover:border-primary hover:text-primary'}`}>
                <option value="">{f.label}</option>
                {f.opts.map(o => Array.isArray(o) ? <option key={o[0]} value={o[0]}>{o[1]}</option> : <option key={o} value={o}>{o.charAt(0).toUpperCase()+o.slice(1)}</option>)}
              </select>
            ))}
            {activeFilters.length > 0 && (
              <button onClick={clearAll} className="flex-shrink-0 flex items-center gap-1 text-xs font-semibold text-red-400 hover:text-red-600 border border-red-200 rounded-full px-3 py-1.5 hover:bg-red-50 transition-all">
                <i className="fas fa-times text-xs" /> {t('search_page.clearAll')}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* List view */}
      {view === 'list' && (
        <div className="max-w-screen-2xl mx-auto px-4 py-5">
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
            <Link to="/" className="hover:text-primary">Home</Link>
            {crumbs.map((c,i) => <span key={i} className="flex items-center gap-1.5"><i className="fas fa-chevron-right" style={{fontSize:8}} /><span className={i===crumbs.length-1?'text-gray-700 font-medium':''}>{c.charAt(0).toUpperCase()+c.slice(1)}</span></span>)}
          </div>
          <div className="flex gap-6">
            <div className="w-72 flex-shrink-0 hidden lg:flex flex-col gap-4 self-start sticky top-36">
              <NewProjectAd /><FeaturedAgentAd /><MortgageAd />
            </div>
            <div className="flex-1 min-w-0">
              {filtered.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                  <i className="fas fa-search text-5xl mb-4 block text-gray-200" />
                  <p className="font-display text-xl font-bold text-gray-600 mb-2">{t('search_page.noResults')}</p>
                  <p className="text-sm mb-4">{t('search_page.noResultsSub')}</p>
                  <button onClick={clearAll} className="btn-outline">{t('search_page.clearFilters')}</button>
                </div>
              ) : (
                <>
                  <div className="text-sm text-gray-500 mb-4">
                    <strong className="text-gray-900">{filtered.length}</strong> {t('search_page.results')}
                    {filters.location && <span> {t('search_page.propertiesIn')} <strong className="text-gray-900">{filters.location}</strong></span>}
                  </div>
                  <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                    {filtered.map(p => <PropertyCard key={p.id} p={p} view="grid" />)}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Map view */}
      {view === 'map' && (
        <div className="flex max-w-screen-2xl mx-auto" style={{height:'calc(100vh - 113px)'}}>
          <div ref={listRef} className="w-full lg:w-[460px] flex-shrink-0 overflow-y-auto hide-scrollbar p-4 space-y-3">
            {filtered.map(p => <div key={p.id} data-pid={p.id}><PropertyCard p={p} view="list" onHover={handleHover} highlighted={hoveredId===p.id} /></div>)}
          </div>
          <div className="flex-1 hidden lg:block sticky top-[113px] h-[calc(100vh-113px)]">
            <PropertyMap properties={filtered} hoveredId={hoveredId} onMarkerClick={handleMarkerClick} className="w-full h-full" />
          </div>
        </div>
      )}

      {/* Save Search Modal */}
      {showSaveSearch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowSS(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
            {saved ? (
              <div className="text-center py-4">
                <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3"><i className="fas fa-check text-emerald-600 text-xl" /></div>
                <p className="font-semibold text-gray-900">Search saved!</p>
                <p className="text-sm text-gray-400 mt-1">We'll alert you when new properties match.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2"><i className="fas fa-bell text-primary" /> Save this Search</h3>
                  <button onClick={() => setShowSS(false)} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400"><i className="fas fa-times text-sm" /></button>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 mb-4 text-xs text-gray-500 flex flex-wrap gap-1.5">
                  {Array.from(searchParams.entries()).map(([k,v]) => <span key={k} className="bg-primary-soft text-primary px-2 py-0.5 rounded-full font-semibold capitalize">{v}</span>)}
                  {!searchParams.toString() && <span className="text-gray-400">All properties in Tunisia</span>}
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5">Search name *</label>
                    <input value={searchName} onChange={e => setSearchName(e.target.value)} placeholder="e.g. 3-bed villas in Tunis" className="input" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5">Alert frequency</label>
                    <div className="flex gap-2">
                      {[['instant','Instant'],['daily','Daily'],['weekly','Weekly']].map(([v,l]) => (
                        <button key={v} onClick={() => setSaveFreq(v)}
                          className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition-all ${saveFreq===v?'bg-primary text-white border-primary':'border-gray-200 text-gray-500 hover:border-primary hover:text-primary'}`}>{l}</button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-5">
                  <button onClick={() => setShowSS(false)} className="btn-ghost flex-1 justify-center py-2.5 text-sm">Cancel</button>
                  <button onClick={saveSearch} disabled={saving || !searchName.trim()} className="btn-primary flex-1 justify-center py-2.5 text-sm disabled:opacity-50">
                    {saving ? <i className="fas fa-circle-notch fa-spin" /> : <i className="fas fa-bell" />} Save &amp; Alert
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
