import { useState, useRef, useEffect } from 'react'
import { CITIES } from '../lib/data'

const SHORTCUTS = [
  { icon: '🏢', label: 'Apartments', type: 'apartment' },
  { icon: '🏠', label: 'Villas',     type: 'villa' },
  { icon: '🏗',  label: 'New Build',  type: 'new' },
  { icon: '🏢', label: 'Offices',    type: 'office' },
  { icon: '🌍', label: 'Land',       type: 'land' },
]

export default function SearchBar({ onSearch, className = '' }) {
  const [deal, setDeal]           = useState('sale')
  const [location, setLocation]   = useState('')
  const [type, setType]           = useState('')
  const [rooms, setRooms]         = useState('')
  const [price, setPrice]         = useState('')
  const [showSuggestions, setSugg] = useState(false)
  const [showAdvanced, setAdv]    = useState(false)
  const [advanced, setAdvanced]   = useState({})
  const inputRef = useRef(null)

  const suggestions = location.trim()
    ? CITIES.filter(c => c.toLowerCase().includes(location.toLowerCase())).slice(0, 6)
    : []

  function doSearch() {
    onSearch?.({ deal, location, type, rooms, price, ...advanced })
    setSugg(false)
  }

  function shortcut(t) {
    setType(t)
    onSearch?.({ deal, location, type: t, rooms, price })
  }

  return (
    <div className={`w-full max-w-3xl ${className}`}>
      {/* Deal tabs */}
      <div className="flex bg-black/20 backdrop-blur-sm rounded-t-2xl overflow-hidden border border-white/20">
        {[['sale','🏠 Buy'],['rent','🔑 Rent'],['commercial','🏢 Commercial']].map(([val, label]) => (
          <button key={val} onClick={() => setDeal(val)}
            className={`flex-1 py-3 text-sm font-bold transition-all ${deal === val ? 'bg-white text-primary' : 'text-white/80 hover:bg-white/10'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Main search row */}
      <div className="bg-white rounded-b-2xl shadow-2xl overflow-visible">
        <div className="flex items-stretch">
          {/* Location input */}
          <div className="flex-1 relative min-w-0">
            <div className="flex items-center h-14 pl-4 gap-2">
              <span className="text-primary text-lg flex-shrink-0">📍</span>
              <input
                ref={inputRef}
                value={location}
                onChange={e => { setLocation(e.target.value); setSugg(true) }}
                onFocus={() => setSugg(true)}
                onBlur={() => setTimeout(() => setSugg(false), 150)}
                onKeyDown={e => e.key === 'Enter' && doSearch()}
                placeholder="City, neighbourhood, or landmark..."
                className="flex-1 text-sm font-medium outline-none placeholder-gray-400 text-gray-800 bg-transparent"
              />
              {location && (
                <button onClick={() => setLocation('')} className="text-gray-300 hover:text-gray-500 pr-3 text-sm">✕</button>
              )}
            </div>

            {/* Autocomplete */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-100 rounded-xl shadow-xl z-50 py-1 mt-1">
                {suggestions.map(s => (
                  <button key={s} className="w-full text-left px-4 py-2.5 text-sm hover:bg-primary-soft hover:text-primary flex items-center gap-2 transition-colors"
                    onMouseDown={() => { setLocation(s); setSugg(false) }}>
                    <span className="text-primary text-xs">📍</span>{s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="w-px bg-gray-200 self-stretch my-3"></div>

          {/* Type */}
          <select value={type} onChange={e => setType(e.target.value)}
            className="h-14 px-3 text-sm font-medium text-gray-600 bg-transparent border-none outline-none cursor-pointer">
            <option value="">All Types</option>
            <option value="apartment">Apartment</option>
            <option value="villa">Villa</option>
            <option value="office">Office</option>
            <option value="land">Land</option>
          </select>

          <div className="w-px bg-gray-200 self-stretch my-3"></div>

          {/* Beds */}
          <select value={rooms} onChange={e => setRooms(e.target.value)}
            className="h-14 px-3 text-sm font-medium text-gray-600 bg-transparent border-none outline-none cursor-pointer hidden sm:block">
            <option value="">Beds (Any)</option>
            <option value="1">S+1</option>
            <option value="2">S+2</option>
            <option value="3">S+3</option>
            <option value="4">S+4+</option>
          </select>

          <div className="w-px bg-gray-200 self-stretch my-3 hidden sm:block"></div>

          {/* Price */}
          <select value={price} onChange={e => setPrice(e.target.value)}
            className="h-14 px-3 text-sm font-medium text-gray-600 bg-transparent border-none outline-none cursor-pointer hidden md:block">
            <option value="">Price (Any)</option>
            <option value="0-200000">Under 200K</option>
            <option value="200000-500000">200K–500K</option>
            <option value="500000-1000000">500K–1M</option>
            <option value="1000000+">1M+</option>
          </select>

          {/* Search button */}
          <button onClick={doSearch}
            className="h-14 px-6 bg-primary hover:bg-primary-dark text-white font-bold flex items-center gap-2 transition-all text-sm rounded-br-2xl">
            🔍 <span className="hidden sm:inline">Search</span>
          </button>
        </div>

        {/* More filters toggle */}
        <div className="border-t border-gray-100 px-4 py-2 flex items-center gap-3">
          <button onClick={() => setAdv(a => !a)}
            className="text-xs font-semibold text-primary flex items-center gap-1 hover:underline">
            {showAdvanced ? '▲' : '▼'} More filters
          </button>
          {(type || rooms || price || advanced.condition) && (
            <button onClick={() => { setType(''); setRooms(''); setPrice(''); setAdvanced({}) }}
              className="text-xs text-gray-400 hover:text-gray-600">✕ Clear</button>
          )}
        </div>

        {/* Advanced filters */}
        {showAdvanced && (
          <div className="px-4 pb-4 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-gray-100 pt-3">
            {[
              { id: 'condition', label: 'Condition', opts: [['','Any'],['new','New'],['renovated','Renovated'],['good','Good']] },
              { id: 'furnished', label: 'Furnished', opts: [['','Any'],['furnished','Yes'],['semi','Semi'],['unfurnished','No']] },
              { id: 'parking',   label: 'Parking',   opts: [['','Any'],['yes','Yes'],['no','No']] },
              { id: 'elevator',  label: 'Elevator',  opts: [['','Any'],['yes','Yes'],['no','No']] },
            ].map(f => (
              <div key={f.id}>
                <label className="block text-xs font-semibold text-gray-400 mb-1">{f.label}</label>
                <select value={advanced[f.id] || ''} onChange={e => setAdvanced(a => ({ ...a, [f.id]: e.target.value }))}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-primary">
                  {f.opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
            ))}
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Min Area (m²)</label>
              <input type="number" placeholder="e.g. 80" value={advanced.minArea || ''}
                onChange={e => setAdvanced(a => ({ ...a, minArea: e.target.value }))}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Max Area (m²)</label>
              <input type="number" placeholder="e.g. 300" value={advanced.maxArea || ''}
                onChange={e => setAdvanced(a => ({ ...a, maxArea: e.target.value }))}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-primary" />
            </div>
          </div>
        )}
      </div>

      {/* Category shortcuts */}
      <div className="flex gap-2 flex-wrap mt-4 justify-center">
        {SHORTCUTS.map(s => (
          <button key={s.type} onClick={() => shortcut(s.type)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border backdrop-blur-sm transition-all
              ${type === s.type ? 'bg-white text-primary border-white' : 'bg-white/15 text-white border-white/30 hover:bg-white hover:text-primary hover:border-white'}`}>
            <span>{s.icon}</span>{s.label}
          </button>
        ))}
      </div>
    </div>
  )
}
