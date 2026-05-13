import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDaysOld, getFreshnessTier } from '../lib/data'

const FRESHNESS = {
  new:     { label: '★ New',          cls: 'bg-blue-500 text-white' },
  reduced: { label: '🏷 Price Reduced', cls: 'bg-emerald-500 text-white' },
  hot:     { label: '🔥 Hot',          cls: 'bg-red-500 text-white' },
  stale:   { label: '⏱ 45+ days',     cls: 'bg-gray-400 text-white' },
}

export default function PropertyCard({ p, view = 'grid', onHover, highlighted }) {
  const navigate = useNavigate()
  const [fav, setFav] = useState(false)
  const tier = getFreshnessTier(p)
  const days = getDaysOld(p.listedAt)
  const ageLabel = days === 0 ? 'Today' : days === 1 ? '1 day ago' : `${days} days ago`

  const isGrid = view === 'grid'

  return (
    <div
      className={`card cursor-pointer group overflow-hidden transition-all duration-300
        ${highlighted ? 'ring-2 ring-primary ring-offset-2 shadow-card-hover' : 'hover:shadow-card-hover hover:-translate-y-0.5'}
        ${isGrid ? 'flex flex-col' : 'flex flex-row'}`}
      onClick={() => navigate(`/property/${p.id}`)}
      onMouseEnter={() => onHover?.(p.id)}
      onMouseLeave={() => onHover?.(null)}
    >
      {/* Image */}
      <div className={`relative overflow-hidden flex-shrink-0 ${isGrid ? 'h-48 w-full' : 'w-56 h-auto min-h-[160px]'}`}>
        <img
          src={p.images[0]}
          alt={p.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${p.type === 'sale' ? 'bg-primary text-white' : 'bg-accent text-gray-900'}`}>
            {p.type === 'sale' ? 'For Sale' : 'For Rent'}
          </span>
          {p.featured && <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500 text-white">★ Featured</span>}
        </div>

        {/* Freshness badge */}
        {tier !== 'fresh' && FRESHNESS[tier] && (
          <div className={`absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold backdrop-blur-sm ${FRESHNESS[tier].cls}`}>
            {FRESHNESS[tier].label}
          </div>
        )}

        {/* Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
          <button
            onClick={e => { e.stopPropagation(); setFav(f => !f) }}
            className={`w-8 h-8 rounded-full flex items-center justify-center shadow transition-all ${fav ? 'bg-red-500 text-white' : 'bg-white text-gray-400 hover:text-red-500'}`}
          >
            {fav ? '♥' : '♡'}
          </button>
          <button
            onClick={e => { e.stopPropagation(); window.open(`https://wa.me/${p.agent.phone.replace(/\D/g,'')}?text=${encodeURIComponent(`Hi, interested in: ${p.title} — ${p.price}`)}`, '_blank') }}
            className="w-8 h-8 rounded-full bg-[#25d366] text-white flex items-center justify-center shadow hover:bg-[#128c7e] transition-all text-sm"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.549 4.103 1.508 5.836L.057 23.571A.5.5 0 00.5 24l5.913-1.549A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.5a9.46 9.46 0 01-4.923-1.376l-.354-.21-3.656.957.975-3.565-.232-.368A9.46 9.46 0 012.5 12C2.5 6.71 6.71 2.5 12 2.5S21.5 6.71 21.5 12 17.29 21.5 12 21.5z"/></svg>
          </button>
        </div>
      </div>

      {/* Info */}
      <div className={`flex flex-col ${isGrid ? 'p-4' : 'p-4 flex-1'}`}>
        {/* Price */}
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-xl font-bold text-primary">{p.price}</span>
          {p.originalPrice && (
            <span className="text-sm text-gray-400 line-through">{p.originalPrice.toLocaleString()} TND</span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1 group-hover:text-primary transition-colors">
          {p.title}
        </h3>

        {/* Location */}
        <p className="text-sm text-gray-400 flex items-center gap-1 mb-3">
          <span className="text-primary text-xs">📍</span> {p.location}
        </p>

        {/* Features */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3 border-t border-gray-100 pt-3">
          {p.beds > 0 && <span className="flex items-center gap-1"><span>🛏</span>{p.beds}</span>}
          {p.baths > 0 && <span className="flex items-center gap-1"><span>🚿</span>{p.baths}</span>}
          <span className="flex items-center gap-1"><span>📐</span>{p.area} m²</span>
          <span className="ml-auto text-xs text-gray-300">{ageLabel}</span>
        </div>

        {/* Agent */}
        <div className="flex items-center gap-2 mt-auto pt-2 border-t border-gray-100">
          <img src={p.agent.image} alt={p.agent.name} className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-xs font-semibold text-gray-700 truncate">{p.agent.name}</span>
              {p.agent.verified && <span className="text-emerald-500 text-xs">✓</span>}
            </div>
            <div className="flex items-center gap-0.5 text-amber-400 text-xs">
              {'★'.repeat(Math.floor(p.agent.rating))}
              <span className="text-gray-400 ml-1">{p.agent.rating}</span>
            </div>
          </div>
          <span className="text-xs text-gray-300">{p.type === 'rent' ? 'S+' + p.rooms : 'S+' + p.rooms}</span>
        </div>
      </div>
    </div>
  )
}
