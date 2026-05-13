import { useState, useRef } from 'react'
import { CITIES } from '../lib/data'

const SHORTCUTS = [
  { icon: 'fa-building',    label: 'Apartments', type: 'apartment' },
  { icon: 'fa-home',        label: 'Villas',     type: 'villa' },
  { icon: 'fa-briefcase',   label: 'Offices',    type: 'office' },
  { icon: 'fa-mountain',    label: 'Land',       type: 'land' },
  { icon: 'fa-store',       label: 'Commercial', type: 'commercial' },
]

export default function SearchBar({ onSearch }) {
  const [deal, setDeal]       = useState('sale')
  const [location, setLoc]    = useState('')
  const [type, setType]       = useState('')
  const [rooms, setRooms]     = useState('')
  const [price, setPrice]     = useState('')
  const [showSugg, setShowSugg] = useState(false)
  const [showAdv, setShowAdv]  = useState(false)
  const [adv, setAdv]         = useState({})
  const inputRef = useRef(null)

  const suggestions = location.trim()
    ? CITIES.filter(c => c.toLowerCase().includes(location.toLowerCase())).slice(0, 6)
    : []

  function search() {
    onSearch?.({ deal, location, type, rooms, price, ...adv })
    setShowSugg(false)
  }

  function shortcut(t) {
    setType(t)
    onSearch?.({ deal, location, type: t, rooms, price })
  }

  return (
    <div className="w-full max-w-3xl">
      {/* Deal tabs */}
      <div className="flex rounded-t-2xl overflow-hidden border border-white/20">
        {[['sale','Buy'],['rent','Rent'],['commercial','Commercial']].map(([v, l]) => (
          <button key={v} onClick={() => setDeal(v)}
            className={`flex-1 py-3 text-sm font-bold transition-all ${
              deal === v
                ? 'bg-white text-primary'
                : 'bg-white/10 text-white/80 hover:bg-white/20 backdrop-blur-sm'
            }`}>
            {l}
          </button>
        ))}
      </div>

      {/* Main row */}
      <div className="bg-white rounded-b-2xl shadow-2xl">
        <div className="flex items-stretch divide-x divide-gray-100">

          {/* Location */}
          <div className="flex-1 relative min-w-0">
            <div className="flex items-center h-14 px-4 gap-3">
              <i className="fas fa-map-marker-alt text-primary flex-shrink-0" style={{fontSize:14}} />
              <input
                ref={inputRef}
                value={location}
                onChange={e => { setLoc(e.target.value); setShowSugg(true) }}
                onFocus={() => setShowSugg(true)}
                onBlur={() => setTimeout(() => setShowSugg(false), 150)}
                onKeyDown={e => e.key === 'Enter' && search()}
                placeholder="City, neighbourhood or address..."
                className="flex-1 text-sm font-medium outline-none placeholder-gray-400 text-gray-800 bg-transparent"
              />
              {location && (
                <button onClick={() => setLoc('')} className="text-gray-300 hover:text-gray-400 flex-shrink-0">
                  <i className="fas fa-times text-xs" />
                </button>
              )}
            </div>
            {showSugg && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border-t border-gray-100 rounded-b-xl shadow-xl z-50 py-1">
                {suggestions.map(s => (
                  <button key={s} onMouseDown={() => { setLoc(s); setShowSugg(false) }}
                    className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 hover:bg-gray-50 text-gray-700">
                    <i className="fas fa-map-marker-alt text-primary" style={{fontSize:11}} />{s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Type */}
          <select value={type} onChange={e => setType(e.target.value)}
            className="h-14 px-4 text-sm font-medium text-gray-600 bg-transparent outline-none cursor-pointer">
            <option value="">All Types</option>
            <option value="apartment">Apartment</option>
            <option value="villa">Villa</option>
            <option value="office">Office</option>
            <option value="land">Land</option>
          </select>

          {/* Beds */}
          <select value={rooms} onChange={e => setRooms(e.target.value)}
            className="h-14 px-4 text-sm font-medium text-gray-600 bg-transparent outline-none cursor-pointer hidden sm:block">
            <option value="">Beds</option>
            <option value="1">S+1</option>
            <option value="2">S+2</option>
            <option value="3">S+3</option>
            <option value="4">S+4+</option>
          </select>

          {/* Price */}
          <select value={price} onChange={e => setPrice(e.target.value)}
            className="h-14 px-4 text-sm font-medium text-gray-600 bg-transparent outline-none cursor-pointer hidden md:block">
            <option value="">Price</option>
            <option value="0-200000">Under 200K</option>
            <option value="200000-500000">200K – 500K</option>
            <option value="500000-1000000">500K – 1M</option>
            <option value="1000000+">1M+</option>
          </select>

          {/* Search */}
          <button onClick={search}
            className="h-14 px-7 bg-primary hover:bg-primary-dark text-white font-bold text-sm flex items-center gap-2 transition-all rounded-br-2xl flex-shrink-0">
            <i className="fas fa-search" />
            <span className="hidden sm:inline">Search</span>
          </button>
        </div>

        {/* More filters row */}
        <div className="border-t border-gray-100 px-4 py-2.5 flex items-center gap-4">
          <button onClick={() => setShowAdv(a => !a)}
            className="text-xs font-semibold text-primary flex items-center gap-1.5 hover:underline">
            <i className={`fas fa-sliders-h text-xs`} />
            {showAdv ? 'Hide filters' : 'More filters'}
          </button>
          {(type || rooms || price || adv.condition) && (
            <button onClick={() => { setType(''); setRooms(''); setPrice(''); setAdv({}) }}
              className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1">
              <i className="fas fa-times text-xs" /> Clear all
            </button>
          )}
        </div>

        {/* Advanced */}
        {showAdv && (
          <div className="px-4 pb-4 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-gray-100 pt-4">
            {[
              { id:'condition', label:'Condition', opts:[['','Any'],['new','New'],['renovated','Renovated'],['good','Good']] },
              { id:'furnished', label:'Furnished', opts:[['','Any'],['furnished','Yes'],['semi','Semi'],['unfurnished','No']] },
              { id:'parking',   label:'Parking',   opts:[['','Any'],['yes','Yes'],['no','No']] },
              { id:'elevator',  label:'Elevator',  opts:[['','Any'],['yes','Yes'],['no','No']] },
            ].map(f => (
              <div key={f.id}>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">{f.label}</label>
                <select value={adv[f.id]||''} onChange={e => setAdv(a => ({...a,[f.id]:e.target.value}))}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-primary">
                  {f.opts.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Shortcuts */}
      <div className="flex gap-2 flex-wrap mt-4 justify-center">
        {SHORTCUTS.map(s => (
          <button key={s.type} onClick={() => shortcut(s.type)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all
              ${type === s.type
                ? 'bg-white text-primary border-white shadow-md'
                : 'bg-white/15 text-white border-white/30 hover:bg-white hover:text-primary hover:border-white backdrop-blur-sm'}`}>
            <i className={`fas ${s.icon} text-xs`} />{s.label}
          </button>
        ))}
      </div>
    </div>
  )
}
