import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { properties } from '../lib/data'
import PropertyMap from '../components/PropertyMap'
import { useToast } from '../hooks/useToast'

const POI_ICONS = { school: '🎓', hospital: '🏥', transport: '🚌', shop: '🛒' }

export default function PropertyDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const p = properties[parseInt(id)]

  const [photoIdx, setPhotoIdx] = useState(0)
  const [tab, setTab]           = useState('photos')
  const [msg, setMsg]           = useState("Hi, I'm interested in this property. Please contact me.")
  const [descOpen, setDescOpen] = useState(false)

  if (!p) return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-4">
      <div className="text-6xl">🏚</div>
      <h2 className="text-2xl font-bold text-gray-700">Property not found</h2>
      <button onClick={() => navigate('/')} className="btn-primary">← Back to listings</button>
    </div>
  )

  const similar = properties.filter(s => s.id !== p.id && s.city === p.city && s.type === p.type)
    .sort((a,b) => Math.abs(a.priceValue - p.priceValue) - Math.abs(b.priceValue - p.priceValue)).slice(0,3)

  function contactWhatsApp() {
    const clean = p.agent.phone.replace(/\D/g,'')
    const text = encodeURIComponent(`Hi ${p.agent.name}, I'm interested in: ${p.title} — ${p.price}. Please contact me. (via Hestia)`)
    window.open(`https://wa.me/${clean}?text=${text}`, '_blank')
  }

  function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => toast('Link copied!', 'success'))
  }

  const daysOld = Math.floor((Date.now() - new Date(p.listedAt).getTime()) / 86400000)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 h-14 flex items-center justify-between shadow-sm">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-500 hover:text-primary font-semibold text-sm transition-colors">
          ← Back to listings
        </button>
        <div className="font-display text-xl text-primary"><span className="text-accent">⌂</span> Hestia</div>
        <div className="flex gap-2">
          <button onClick={copyLink} className="btn-ghost text-sm py-1.5 px-3">🔗 Share</button>
          <button onClick={contactWhatsApp} className="btn-whatsapp text-sm py-1.5 px-3">WhatsApp</button>
        </div>
      </nav>

      {/* BREADCRUMB */}
      <div className="max-w-7xl mx-auto px-4 py-3 text-xs text-gray-400 flex items-center gap-1.5">
        <button onClick={() => navigate('/')} className="hover:text-primary">Home</button>
        <span>›</span><span>{p.city}</span>
        <span>›</span><span className="text-gray-700 font-medium truncate">{p.title}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid lg:grid-cols-[1fr_380px] gap-6 items-start">

          {/* LEFT COLUMN */}
          <div className="space-y-4">

            {/* GALLERY */}
            <div className="card overflow-hidden">
              <div className="relative">
                {/* Tab bar */}
                <div className="absolute top-0 left-0 right-0 z-10 flex bg-black/40 backdrop-blur-sm">
                  {[['photos','📷 Photos'],['tour','🥽 360°'],['video','▶ Video'],['floorplan','📐 Floor Plan']].map(([t,l]) => (
                    <button key={t} onClick={() => setTab(t)}
                      className={`flex-1 py-2 text-xs font-semibold transition-all ${tab === t ? 'text-white border-b-2 border-accent' : 'text-white/60 hover:text-white'}`}>
                      {l}
                    </button>
                  ))}
                </div>

                {/* Main image */}
                {tab === 'photos' && (
                  <div className="relative h-[420px] bg-gray-100">
                    <img src={p.images[photoIdx]} alt={p.title} className="w-full h-full object-cover" />
                    {p.images.length > 1 && (
                      <>
                        <button onClick={() => setPhotoIdx(i => (i - 1 + p.images.length) % p.images.length)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-white transition-all">‹</button>
                        <button onClick={() => setPhotoIdx(i => (i + 1) % p.images.length)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-white transition-all">›</button>
                        <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">{photoIdx+1}/{p.images.length}</div>
                      </>
                    )}
                  </div>
                )}
                {tab === 'tour' && (
                  <div className="h-[420px] flex items-center justify-center bg-gray-900 flex-col gap-3">
                    <div className="text-5xl">🥽</div>
                    <p className="text-white font-semibold">360° Virtual Tour</p>
                    <button onClick={() => toast('Full VR tour launching...')} className="btn-primary mt-2">↗ Full Screen</button>
                  </div>
                )}
                {tab === 'video' && (
                  <div className="h-[420px] bg-black">
                    {p.videoUrl
                      ? <iframe src={p.videoUrl} className="w-full h-full" allow="autoplay; fullscreen" allowFullScreen />
                      : <div className="h-full flex items-center justify-center text-white/40 flex-col gap-2"><span className="text-4xl">▶</span><p>No video available</p></div>}
                  </div>
                )}
                {tab === 'floorplan' && (
                  <div className="h-[420px] bg-gray-100 flex items-center justify-center">
                    {p.floorPlan
                      ? <img src={p.floorPlan} alt="Floor plan" className="h-full object-contain p-4" />
                      : <div className="text-gray-400 flex flex-col items-center gap-2"><span className="text-4xl">📐</span><p>No floor plan uploaded</p></div>}
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {tab === 'photos' && p.images.length > 1 && (
                <div className="flex gap-2 p-3 bg-gray-900 overflow-x-auto hide-scrollbar">
                  {p.images.map((img, i) => (
                    <img key={i} src={img} alt="" onClick={() => setPhotoIdx(i)}
                      className={`w-16 h-12 object-cover rounded-md cursor-pointer flex-shrink-0 border-2 transition-all ${photoIdx === i ? 'border-accent opacity-100' : 'border-transparent opacity-60 hover:opacity-90'}`} />
                  ))}
                </div>
              )}
            </div>

            {/* SHARE */}
            <div className="card p-4 flex items-center justify-between gap-4">
              <span className="text-sm font-semibold text-gray-500">Share this listing</span>
              <div className="flex gap-2">
                {[['📱 WhatsApp', contactWhatsApp], ['📘 Facebook', () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`)], ['🔗 Copy link', copyLink], ['🖨 Print', () => window.print()]].map(([l, fn]) => (
                  <button key={l} onClick={fn} className="text-xs font-semibold text-gray-500 hover:text-primary border border-gray-200 hover:border-primary px-2.5 py-1.5 rounded-lg transition-all">{l}</button>
                ))}
              </div>
            </div>

            {/* TITLE & PRICE */}
            <div className="card p-5">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className={p.type === 'sale' ? 'badge-sale' : 'badge-rent'}>{p.type === 'sale' ? 'For Sale' : 'For Rent'}</span>
                {p.featured && <span className="badge-new">★ Featured</span>}
                {p.priceReduced && <span className="badge-reduced">🏷 Price Reduced</span>}
                {daysOld <= 3 && <span className="badge-new">★ New Listing</span>}
              </div>
              <h1 className="font-display text-2xl font-bold text-gray-900 mb-1">{p.title}</h1>
              <p className="text-gray-400 text-sm flex items-center gap-1 mb-4">📍 {p.location}</p>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-primary">{p.price}</span>
                {p.originalPrice && <span className="text-lg text-gray-400 line-through">{p.originalPrice.toLocaleString()} TND</span>}
                <span className="text-sm text-gray-400">{p.area > 0 ? `· ${Math.round(p.priceValue/p.area).toLocaleString()} TND/m²` : ''}</span>
              </div>
            </div>

            {/* KEY STATS */}
            <div className="card overflow-hidden">
              <div className="grid grid-cols-5 divide-x divide-gray-100">
                {[
                  ['🛏', p.beds || '—', 'Beds'],
                  ['🚿', p.baths || '—', 'Baths'],
                  ['📐', p.area + 'm²', 'Area'],
                  ['📅', daysOld === 0 ? 'Today' : daysOld + 'd', 'Listed'],
                  ['👁', (p.viewCount||0).toLocaleString(), 'Views'],
                ].map(([icon, val, lbl]) => (
                  <div key={lbl} className="flex flex-col items-center py-4 text-center">
                    <span className="text-lg mb-0.5">{icon}</span>
                    <span className="font-bold text-gray-900 text-sm">{val}</span>
                    <span className="text-xs text-gray-400">{lbl}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="card p-5">
              <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">📝 Description</h2>
              <p className={`text-sm text-gray-600 leading-relaxed ${descOpen ? '' : 'line-clamp-4'}`}>{p.description}</p>
              <button onClick={() => setDescOpen(o => !o)} className="mt-2 text-xs text-primary font-semibold flex items-center gap-1">
                {descOpen ? '▲ Show less' : '▼ Read more'}
              </button>
            </div>

            {/* DETAILS */}
            <div className="card p-5">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">📋 Property Details</h2>
              <div className="grid grid-cols-3 gap-3">
                {[
                  ['🏠', 'Type', p.type === 'sale' ? 'For Sale' : 'For Rent'],
                  ['🛋', 'Furnished', (p.furnished||'—').charAt(0).toUpperCase()+(p.furnished||'').slice(1)],
                  ['🔧', 'Condition', (p.condition||'—').charAt(0).toUpperCase()+(p.condition||'').slice(1)],
                  ['🏢', 'Floor', (p.floor||'—').charAt(0).toUpperCase()+(p.floor||'').slice(1)],
                  ['🚗', 'Parking', p.parking ? 'Yes' : 'No'],
                  ['⬆', 'Elevator', p.elevator ? 'Yes' : 'No'],
                  ['🌿', 'Terrace', p.terrace ? 'Yes' : 'No'],
                  ['📐', 'Area', p.area + ' m²'],
                  ['🔑', 'Ref', 'HESTIA-' + String(p.id).padStart(4,'0')],
                ].map(([icon, lbl, val]) => (
                  <div key={lbl} className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                    <span className="text-base">{icon}</span>
                    <div><div className="text-xs text-gray-400">{lbl}</div><div className="text-sm font-semibold text-gray-800">{val}</div></div>
                  </div>
                ))}
              </div>
            </div>

            {/* AMENITIES */}
            <div className="card p-5">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">✨ Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {p.amenities.map(a => (
                  <div key={a} className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2">
                    <span className="text-primary text-xs">✓</span> {a}
                  </div>
                ))}
              </div>
            </div>

            {/* PRICE HISTORY */}
            {p.priceHistory?.length > 1 && (
              <div className="card p-5">
                <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">📈 Price History</h2>
                {p.priceHistory.map((price, i) => {
                  const prev = p.priceHistory[i-1]
                  const pct = prev ? (((price-prev)/prev)*100).toFixed(1) : null
                  const months = ['Nov 2025','Jan 2026','Mar 2026','Apr 2026','May 2026']
                  return (
                    <div key={i} className="flex items-center gap-4 py-2 border-b border-gray-100 last:border-0 text-sm">
                      <span className="text-gray-400 w-24">{months[i] || 'Now'}</span>
                      <span className="font-bold text-gray-800 flex-1">{price.toLocaleString()} TND</span>
                      {pct !== null ? (
                        <span className={`font-semibold text-xs ${parseFloat(pct) < 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                          {parseFloat(pct) < 0 ? '▼' : '▲'} {Math.abs(pct)}%
                        </span>
                      ) : <span className="text-xs text-gray-300">Listed</span>}
                    </div>
                  )
                })}
              </div>
            )}

            {/* NEIGHBORHOOD */}
            {p.neighborhood?.length > 0 && (
              <div className="card p-5">
                <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">🏘 Neighborhood</h2>
                <div className="grid grid-cols-2 gap-3">
                  {p.neighborhood.map(poi => (
                    <div key={poi.name} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <span className="text-xl">{POI_ICONS[poi.type] || '📍'}</span>
                      <div><div className="text-xs font-semibold text-gray-800">{poi.name}</div><div className="text-xs text-gray-400">🚶 {poi.dist}</div></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MAP */}
            <div className="card overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">🗺 Location</h2>
                <p className="text-xs text-gray-400 mt-0.5">Exact address available after booking a viewing</p>
              </div>
              {p.coords && (
                <div style={{ height: 280 }}>
                  <PropertyMap properties={[p]} hoveredId={p.id} onMarkerClick={() => {}} />
                </div>
              )}
            </div>

            {/* REVIEWS */}
            {p.reviews?.length > 0 && (
              <div className="card p-5">
                <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">⭐ Agent Reviews</h2>
                {p.reviews.map(r => (
                  <div key={r.author} className="py-3 border-b border-gray-100 last:border-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">{r.initials}</div>
                      <div><div className="text-sm font-semibold text-gray-800">{r.author}</div>
                      <div className="text-amber-400 text-xs">{'★'.repeat(r.rating)}<span className="text-gray-300 ml-1">{r.date}</span></div></div>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{r.text}</p>
                  </div>
                ))}
              </div>
            )}

            {/* SIMILAR */}
            {similar.length > 0 && (
              <div className="card p-5">
                <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">🏠 Similar Properties</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {similar.map(s => (
                    <div key={s.id} onClick={() => navigate(`/property/${s.id}`)}
                      className="rounded-xl overflow-hidden border border-gray-100 hover:border-primary hover:shadow-md transition-all cursor-pointer">
                      <img src={s.images[0]} alt={s.title} className="w-full h-28 object-cover" />
                      <div className="p-3">
                        <div className="font-bold text-primary text-sm">{s.price}</div>
                        <div className="text-xs font-semibold text-gray-800 truncate mt-0.5">{s.title}</div>
                        <div className="text-xs text-gray-400 mt-0.5">📍 {s.location}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SIDEBAR */}
          <div className="sticky top-14 space-y-4">
            <div className="card overflow-hidden shadow-xl">
              {/* Price header */}
              <div className="bg-primary px-5 py-4">
                <div className="text-2xl font-bold text-white">{p.price}</div>
                <div className="text-white/70 text-sm mt-0.5">{p.type === 'sale' ? `For Sale · ${p.area}m²` : 'For Rent · per month'}</div>
              </div>

              {/* Agent */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <img src={p.agent.image} alt={p.agent.name} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-gray-900">{p.agent.name}</span>
                      {p.agent.verified && <span className="text-emerald-500 text-xs">✓ Verified</span>}
                    </div>
                    <div className="text-amber-400 text-xs mt-0.5">{'★'.repeat(Math.floor(p.agent.rating))} <span className="text-gray-400">{p.agent.rating} ({p.agent.reviewCount})</span></div>
                    <div className="text-xs text-gray-400 mt-0.5">⚡ Replies {p.agent.responseTime}</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {[['★'+p.agent.rating,'Rating'],[(p.agent.reviewCount),'Reviews'],[p.agent.responseTime,'Response']].map(([v,l]) => (
                    <div key={l} className="bg-gray-50 rounded-lg p-2 text-center">
                      <div className="text-sm font-bold text-primary">{v}</div>
                      <div className="text-xs text-gray-400">{l}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact form */}
              <div className="p-4 space-y-3">
                <textarea value={msg} onChange={e => setMsg(e.target.value)} rows={3}
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-primary resize-none" />
                <button onClick={() => toast('Enquiry sent! Agent will contact you soon.', 'success')}
                  className="btn-primary w-full justify-center py-3">
                  ✉ Send Enquiry
                </button>
                <button onClick={contactWhatsApp} className="btn-whatsapp w-full justify-center py-3">
                  WhatsApp Agent
                </button>
                <button onClick={() => toast('Book a viewing — sign in first')} className="btn-ghost w-full justify-center py-2.5 text-sm">
                  📅 Book a Viewing
                </button>
              </div>
            </div>

            {/* Mortgage */}
            {p.type === 'sale' && p.priceValue > 0 && (
              <div className="card p-4">
                <h3 className="font-semibold text-sm text-gray-800 mb-3 flex items-center gap-2">🧮 Mortgage Estimate</h3>
                <div className="text-xs text-gray-400 mb-3">Based on 20% down, 25 years at 7.5%</div>
                <div className="bg-primary-soft rounded-xl p-3 text-center">
                  <div className="text-xs text-gray-500">Estimated monthly payment</div>
                  <div className="text-2xl font-bold text-primary mt-1">
                    {Math.round(p.priceValue * 0.8 * (0.075/12) * Math.pow(1+0.075/12,300) / (Math.pow(1+0.075/12,300)-1)).toLocaleString()} TND/mo
                  </div>
                </div>
              </div>
            )}

            {/* Quick facts */}
            <div className="card p-4">
              <h3 className="font-semibold text-sm text-gray-800 mb-3">📋 Quick Facts</h3>
              {[['Reference','HESTIA-'+String(p.id).padStart(4,'0')],['Listed',new Date(p.listedAt||Date.now()).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})],['Views',(p.viewCount||0).toLocaleString()],['Condition',(p.condition||'—').charAt(0).toUpperCase()+(p.condition||'').slice(1)]].map(([k,v]) => (
                <div key={k} className="flex justify-between text-sm py-2 border-b border-gray-100 last:border-0">
                  <span className="text-gray-400">{k}</span>
                  <span className="font-semibold text-gray-800">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
