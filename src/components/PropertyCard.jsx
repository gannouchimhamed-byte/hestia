import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getDaysOld, getFreshnessTier } from '../lib/data'
import { useFavCtx } from '../hooks/FavoritesContext'

export default function PropertyCard({ p, view = 'grid', onHover, highlighted }) {
  const navigate  = useNavigate()
  const { t }     = useTranslation()
  const favCtx    = useFavCtx()
  const fav       = favCtx ? favCtx.favIds.has(String(p.id)) : false
  const tier      = getFreshnessTier(p)
  const days      = getDaysOld(p.listedAt)
  const ageLabel  = days === 0 ? t('property.today') : days === 1 ? t('property.dayAgo', {count:1}) : t('property.daysAgo', {count:days})
  const showNew     = tier === 'new'
  const showReduced = tier === 'reduced'
  const isGrid    = view === 'grid'

  return (
    <div
      className={`bg-white rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer group
        ${highlighted
          ? 'border-primary ring-2 ring-primary/20 shadow-xl'
          : 'border-gray-100 hover:shadow-xl hover:border-gray-200 hover:-translate-y-0.5'}
        ${isGrid ? 'flex flex-col' : 'flex flex-row'}`}
      onClick={() => navigate(`/property/${p.id}`)}
      onMouseEnter={() => onHover?.(p.id)}
      onMouseLeave={() => onHover?.(null)}
    >
      {/* Image */}
      <div className={`relative overflow-hidden flex-shrink-0 ${isGrid ? 'h-48 w-full' : 'w-48 h-full min-h-[160px]'}`}>
        <img src={p.images[0]} alt={p.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />

        {/* Type + Featured — top left */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className={`px-2 py-0.5 rounded text-xs font-bold ${p.type === 'sale' ? 'bg-primary text-white' : 'bg-accent text-gray-900'}`}>
            {p.type === 'sale' ? t('property.forSale') : t('property.forRent')}
          </span>
          {p.featured && (
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-500 text-white">
              {t('property.featured')}
            </span>
          )}
        </div>

        {/* New / Reduced — bottom left */}
        {(showNew || showReduced) && (
          <div className="absolute bottom-3 left-3">
            {showReduced
              ? <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-500 text-white">{t('property.priceReduced')}</span>
              : <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-500 text-white">{t('property.new')}</span>
            }
          </div>
        )}

        {/* Actions — top right */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5">
          <button
            onClick={e => { e.stopPropagation(); favCtx?.toggle(p.id) }}
            className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all
              ${fav ? 'bg-red-500 text-white' : 'bg-white text-gray-400 hover:text-red-400'}`}>
            <i className={`${fav ? 'fas' : 'far'} fa-heart text-xs`} />
          </button>
          <button
            onClick={e => {
              e.stopPropagation()
              window.open(`https://wa.me/${p.agent.phone.replace(/\D/g,'')}?text=${encodeURIComponent(`Hi, interested in: ${p.title} — ${p.price}`)}`, '_blank')
            }}
            className="w-8 h-8 rounded-full bg-[#25d366] text-white flex items-center justify-center shadow-md hover:bg-[#128c7e] transition-all">
            <i className="fab fa-whatsapp text-sm" />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className={`flex flex-col ${isGrid ? 'p-4' : 'p-3 flex-1'}`}>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-lg font-bold text-primary">{p.price}</span>
          {p.originalPrice && (
            <span className="text-xs text-gray-400 line-through">{p.originalPrice.toLocaleString()} TND</span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1 group-hover:text-primary transition-colors">
          {p.title}
        </h3>

        {/* Location */}
        <p className="text-xs text-gray-400 flex items-center gap-1 mb-3">
          <i className="fas fa-map-marker-alt text-primary" style={{fontSize:9}} />
          {p.location}
        </p>

        {/* Features — icons only, no word labels */}
        <div className="flex items-center gap-3 text-sm text-gray-500 pb-3 border-b border-gray-100">
          {p.beds > 0 && (
            <span className="flex items-center gap-1.5">
              <i className="fas fa-bed text-gray-300" style={{fontSize:12}} />
              <span className="text-xs font-medium text-gray-600">{p.beds}</span>
            </span>
          )}
          {p.baths > 0 && (
            <span className="flex items-center gap-1.5">
              <i className="fas fa-bath text-gray-300" style={{fontSize:12}} />
              <span className="text-xs font-medium text-gray-600">{p.baths}</span>
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <i className="fas fa-ruler-combined text-gray-300" style={{fontSize:12}} />
            <span className="text-xs font-medium text-gray-600">{p.area} m²</span>
          </span>
          {p.rooms > 0 && (
            <span className="text-xs font-semibold text-gray-400 border border-gray-200 px-1.5 py-0.5 rounded ml-auto">
              S+{p.rooms}
            </span>
          )}
        </div>

        {/* Agent — name + verified only, listing age on right */}
        <div className="flex items-center gap-2 pt-3 mt-auto">
          <img src={p.agent.image} alt={p.agent.name}
            className="w-6 h-6 rounded-full object-cover flex-shrink-0" />
          <span className="text-xs font-semibold text-gray-600 truncate flex-1">{p.agent.name}</span>
          {p.agent.verified && (
            <i className="fas fa-check-circle text-emerald-500 flex-shrink-0" style={{fontSize:11}} />
          )}
          <span className="text-xs text-gray-300 flex-shrink-0">{ageLabel}</span>
        </div>
      </div>
    </div>
  )
}
