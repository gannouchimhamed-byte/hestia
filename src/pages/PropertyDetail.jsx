import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'
import { properties } from '../lib/data'
import PropertyMap from '../components/PropertyMap'
import { useToast } from '../hooks/useToast'
import { useAuth } from '../hooks/useAuth'
import { useFavCtx } from '../hooks/FavoritesContext'
import { sb } from '../lib/supabase'
import { mapProperty } from '../lib/useProperties'

const POI_ICONS = { school: 'fa-graduation-cap', hospital: 'fa-hospital', transport: 'fa-bus', shop: 'fa-shopping-cart' }

// UUID detection — Supabase IDs look like f3a9b2c1-1234-...
const isUUID = id => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)

export default function PropertyDetail() {
  const { t } = useTranslation()
  const { id }    = useParams()
  const navigate  = useNavigate()
  const toast     = useToast()

  // For Supabase listings (UUID ids)
  const [dbProp, setDbProp]     = useState(null)
  const [dbLoading, setDBLoad]  = useState(false)
  const [dbError, setDbError]   = useState(false)

  useEffect(() => {
    if (!isUUID(id)) return  // mock property — no fetch needed
    setDBLoad(true)
    async function fetch() {
      const { data, error } = await sb.from('Property').select('*').eq('id', id).single()
      if (error || !data) { setDbError(true); setDBLoad(false); return }
      // Fetch agent profile
      let agentProfile = null
      if (data.agentId) {
        const { data: ap } = await sb.from('profiles').select('id,name,phone,avatar_url').eq('id', data.agentId).single()
        agentProfile = ap
      }
      setDbProp(mapProperty(data, agentProfile))
      setDBLoad(false)
    }
    fetch()
  }, [id])

  // Resolve the property — mock or DB
  const p = isUUID(id) ? dbProp : properties[parseInt(id)]
  const [photoIdx, setPhotoIdx] = useState(0)
  const [tab, setTab]           = useState('photos')
  const [msg, setMsg]           = useState("Hi, I'm interested in this property. Please contact me.")
  const [descOpen, setDescOpen] = useState(false)
  const [sending, setSending] = useState(false)
  const [viewingDate, setViewingDate] = useState('')
  const [viewingTime, setViewingTime] = useState('10:00')
  const [showViewingModal, setShowViewingModal] = useState(false)
  const { user } = useAuth()
  const favCtx = useFavCtx()
  const isFav = favCtx ? favCtx.favIds.has(String(p?.id)) : false

  if (dbLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <i className="fas fa-circle-notch fa-spin text-primary text-3xl" />
    </div>
  )

  if (!p || dbError) return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-4 bg-gray-50">
      <i className="fas fa-home text-6xl text-gray-200" />
      <h2 className="text-2xl font-bold text-gray-600">Property not found</h2>
      <button onClick={() => navigate('/search')} className="btn-primary">
        <i className="fas fa-arrow-left" /> Back to listings
      </button>
    </div>
  )

  // Dynamic page title + meta description
  useEffect(() => {
    if (!p) return
    document.title = `${p.title} — ${p.city} | Hestia`
    const desc = document.querySelector('meta[name="description"]')
    if (desc) desc.setAttribute('content', `${p.price} · ${p.beds} bed · ${p.area}m² · ${p.location}`)
  }, [p])

  const similar = properties
    .filter(s => String(s.id) !== String(p.id) && s.city === p.city && s.type === p.type)
    .sort((a,b) => Math.abs(a.priceValue-p.priceValue) - Math.abs(b.priceValue-p.priceValue))
    .slice(0,3)

  const daysOld = Math.floor((Date.now() - new Date(p.listedAt).getTime()) / 86400000)

  async function sendEnquiryToDb() {
    if (!msg.trim()) { toast('Please write a message first', 'error'); return }
    setSending(true)
    // Allow anonymous enquiries — just save what we have
    const payload = {
      id:             crypto.randomUUID(),
      message:        msg,
      propertyId:     String(p.id),
      property_title: p.title,
      agent_id:       p.agentId || p.agent?.id || null,
      userId:         user?.id || null,
      buyer_name:     user ? (profile?.name || null) : null,
      buyer_email:    user?.email || null,
      buyer_phone:    user ? (profile?.phone || null) : null,
      status:         'new',
      createdAt:      new Date().toISOString(),
    }
    const { error } = await sb.from('Inquiry').insert(payload)
    if (!error) {
      // Send email via edge function (best-effort)
      try {
        await fetch('https://cmxblqzulbgtlinmyqxl.supabase.co/functions/v1/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', apikey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNteGJscXp1bGJndGxpbm15cXhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5OTc5NjUsImV4cCI6MjA5MzU3Mzk2NX0.CKdqvB84ELBEro0rYMnAJxKu9a9OV5G5R9mDDHUmGm0' },
          body: JSON.stringify({
            to: [p.agent?.phone ? `${p.agent.name.toLowerCase().replace(/\s+/g,'.')}@hestia.tn` : 'contact@hestia.tn'],
            subject: `New enquiry: ${p.title}`,
            html: `<p><b>Property:</b> ${p.title}</p><p><b>From:</b> ${user?.email||'Anonymous'}</p><p><b>Message:</b><br>${msg}</p>`
          })
        })
      } catch(e) { /* best-effort */ }
    }
    setSending(false)
    toast('Enquiry sent! The agent will contact you shortly.', 'success')
    setMsg('')
  }

  async function bookViewingToDb() {
    if (!viewingDate || !viewingTime) { toast('Please select a date and time', 'error'); return }
    if (!user) { toast('Please sign in to book a viewing', 'error'); return }
    const { error } = await sb.from('viewings').insert({
      user_id: user.id,
      property_id: String(p.id),
      property_title: p.title,
      agent_name: p.agent.name,
      viewing_date: viewingDate,
      viewing_time: viewingTime,
      status: 'pending',
    })
    if (error) { toast('Error booking viewing', 'error'); return }
    setShowViewingModal(false)
    toast('Viewing booked! The agent will confirm shortly.', 'success')
  }

  function contactWhatsApp() {
    const clean = p.agent.phone.replace(/\D/g,'')
    window.open(`https://wa.me/${clean}?text=${encodeURIComponent(`Hi ${p.agent.name}, I'm interested in: ${p.title} — ${p.price}. (via Hestia)`)}`, '_blank')
  }

  function copyLink() {
    navigator.clipboard.writeText(window.location.href)
      .then(() => toast('Link copied!', 'success'))
      .catch(() => toast('Could not copy link', 'error'))
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({
        title: p.title,
        text: `${p.price} — ${p.title}`,
        url: window.location.href,
      }).catch(() => {}) // user cancelled — no error needed
    } else {
      copyLink()
    }
  }

  const TABS = [
    ['photos', 'fa-images', 'Photos'],
    ['tour',   'fa-vr-cardboard', '360°'],
    ['video',  'fa-play', 'Video'],
    ['floorplan', 'fa-drafting-compass', 'Floor Plan'],
  ]

  return (
    <div className="min-h-screen bg-gray-50">

      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 px-4 h-14 flex items-center justify-between shadow-sm">
        <button onClick={() => window.history.length > 1 ? navigate(-1) : navigate('/search')} className="flex items-center gap-2 text-gray-500 hover:text-primary font-semibold text-sm transition-colors">
          <i className="fas fa-arrow-left" /> Back to listings
        </button>
        <div className="font-display text-xl text-primary flex items-center gap-2">
          <i className="fas fa-home text-accent" style={{fontSize:14}} /> Hestia
        </div>
        <div className="flex gap-2">
          <button onClick={() => favCtx?.toggle(p.id)}
            className={`text-sm py-1.5 px-3 rounded-lg border flex items-center gap-1.5 font-semibold transition-all ${isFav ? 'bg-red-500 text-white border-red-500' : 'border-gray-200 text-gray-500 hover:border-red-400 hover:text-red-400'}`}>
            <i className={`${isFav ? 'fas' : 'far'} fa-heart text-xs`} /> {isFav ? 'Saved' : 'Save'}
          </button>
          <button onClick={handleShare} className="btn-ghost text-sm py-1.5 px-3">
            <i className="fas fa-share-alt" /> Share
          </button>
          <button onClick={contactWhatsApp} className="bg-[#25d366] hover:bg-[#128c7e] text-white font-semibold text-sm py-1.5 px-3 rounded-lg inline-flex items-center gap-1.5 transition-all">
            <i className="fab fa-whatsapp" /> WhatsApp
          </button>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-3 text-xs text-gray-400 flex items-center gap-1.5">
        <button onClick={() => navigate('/')} className="hover:text-primary">Home</button>
        <i className="fas fa-chevron-right" style={{fontSize:8}} />
        <span>{p.city}</span>
        <i className="fas fa-chevron-right" style={{fontSize:8}} />
        <span className="text-gray-700 font-medium truncate">{p.title}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-16 lg:pb-16 pb-32">
        <div className="grid lg:grid-cols-[1fr_380px] gap-6 items-start">

          {/* LEFT */}
          <div className="space-y-4">

            {/* Gallery */}
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
              <div className="relative">
                {/* Tabs */}
                <div className="absolute top-0 left-0 right-0 z-10 flex bg-black/50 backdrop-blur-sm">
                  {TABS.map(([t, icon, label]) => (
                    <button key={t} onClick={() => setTab(t)}
                      className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all
                        ${tab === t ? 'text-white border-b-2 border-accent' : 'text-white/50 hover:text-white'}`}>
                      <i className={`fas ${icon}`} /> {label}
                    </button>
                  ))}
                </div>

                {tab === 'photos' && (
                  <div className="relative h-64 sm:h-[440px] bg-gray-100">
                    <img src={p.images[photoIdx]} alt={p.title} className="w-full h-full object-cover" />
                    {p.images.length > 1 && (
                      <>
                        <button onClick={() => setPhotoIdx(i => (i-1+p.images.length)%p.images.length)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-white">
                          <i className="fas fa-chevron-left text-sm" />
                        </button>
                        <button onClick={() => setPhotoIdx(i => (i+1)%p.images.length)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-white">
                          <i className="fas fa-chevron-right text-sm" />
                        </button>
                        <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full">
                          {photoIdx+1} / {p.images.length}
                        </div>
                      </>
                    )}
                  </div>
                )}
                {tab === 'tour' && (
                  <div className="h-[440px] bg-gray-900 flex items-center justify-center flex-col gap-3">
                    <i className="fas fa-vr-cardboard text-5xl text-white/40" />
                    <p className="text-white/60 font-medium">360° Virtual Tour</p>
                    <button onClick={() => toast('Full VR tour launching...')} className="btn-primary mt-2">
                      <i className="fas fa-expand" /> Full Screen
                    </button>
                  </div>
                )}
                {tab === 'video' && (
                  <div className="h-[440px] bg-black">
                    {p.videoUrl
                      ? <iframe src={p.videoUrl} className="w-full h-full" allow="autoplay; fullscreen" allowFullScreen />
                      : <div className="h-full flex items-center justify-center flex-col gap-2 text-white/30"><i className="fas fa-play text-4xl" /><p>No video available</p></div>}
                  </div>
                )}
                {tab === 'floorplan' && (
                  <div className="h-[440px] bg-gray-100 flex items-center justify-center">
                    {p.floorPlan
                      ? <img src={p.floorPlan} alt="Floor plan" className="h-full object-contain p-6" />
                      : <div className="text-gray-400 flex flex-col items-center gap-2"><i className="fas fa-drafting-compass text-4xl" /><p>No floor plan uploaded</p></div>}
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {tab === 'photos' && p.images.length > 1 && (
                <div className="flex gap-2 p-3 bg-gray-900 overflow-x-auto hide-scrollbar">
                  {p.images.map((img, i) => (
                    <img key={i} src={img} alt="" onClick={() => setPhotoIdx(i)}
                      className={`w-16 h-11 object-cover rounded-md cursor-pointer border-2 transition-all
                        ${photoIdx === i ? 'border-accent opacity-100' : 'border-transparent opacity-50 hover:opacity-80'}`} />
                  ))}
                </div>
              )}
            </div>

            {/* Share bar */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-500">Share this listing</span>
              <div className="flex gap-2">
                {[
                  ['fab fa-whatsapp','WhatsApp', contactWhatsApp],
                  ['fab fa-facebook-f',t('detail.facebook'), () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`)],
                  ['fas fa-link',t('detail.copyLink'), copyLink],
                  ['fas fa-print',t('detail.print'), () => window.print()],
                ].map(([icon, label, fn]) => (
                  <button key={label} onClick={fn}
                    className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-primary border border-gray-200 hover:border-primary px-3 py-1.5 rounded-lg transition-all">
                    <i className={icon} />{label}
                  </button>
                ))}
              </div>
            </div>

            {/* Title & price */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className={p.type === 'sale' ? 'badge-sale' : 'badge-rent'}>
                  {p.type === 'sale' ? 'For Sale' : 'For Rent'}
                </span>
                {p.featured && <span className="badge-new"><i className="fas fa-crown text-xs" /> Featured</span>}
                {p.priceReduced && <span className="badge-reduced"><i className="fas fa-tag text-xs" /> Price Reduced</span>}
                {daysOld <= 3 && <span className="badge-new">New Listing</span>}
              </div>
              <h1 className="font-display text-2xl font-bold text-gray-900 mb-1">{p.title}</h1>
              <p className="text-gray-400 text-sm flex items-center gap-1.5 mb-4">
                <i className="fas fa-map-marker-alt text-primary" style={{fontSize:11}} /> {p.location}
              </p>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-primary">{p.price}</span>
                {p.originalPrice && <span className="text-lg text-gray-400 line-through">{p.originalPrice.toLocaleString()} TND</span>}
                {p.area > 0 && <span className="text-sm text-gray-400">{Math.round(p.priceValue/p.area).toLocaleString()} TND/m²</span>}
              </div>
            </div>

            {/* Key stats */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="grid grid-cols-5 divide-x divide-gray-100">
                {[
                  ['fa-bed',            p.beds||'—',                          'Beds'],
                  ['fa-bath',           p.baths||'—',                         'Baths'],
                  ['fa-ruler-combined', p.area+'m²',                          'Area'],
                  ['fa-calendar-alt',   daysOld===0?t('property.today'):`${daysOld}d`,    t('detail.listedLabel')],
                  ['fa-eye',            (p.viewCount||0).toLocaleString(),     t('detail.views')],
                ].map(([icon,val,lbl]) => (
                  <div key={lbl} className="flex flex-col items-center py-4 text-center">
                    <i className={`fas ${icon} text-gray-300 mb-1`} style={{fontSize:14}} />
                    <span className="font-bold text-gray-900 text-sm">{val}</span>
                    <span className="text-xs text-gray-400">{lbl}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <i className="fas fa-align-left text-primary" style={{fontSize:13}} /> Description
              </h2>
              <p className={`text-sm text-gray-600 leading-relaxed ${descOpen ? '' : 'line-clamp-4'}`}>{p.description}</p>
              <button onClick={() => setDescOpen(o=>!o)} className="mt-2 text-xs text-primary font-semibold flex items-center gap-1.5 hover:underline">
                <i className={`fas fa-chevron-${descOpen?'up':'down'} text-xs`} /> {descOpen ? 'Show less' : 'Read more'}
              </button>
            </div>

            {/* Details grid */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <i className="fas fa-list-ul text-primary" style={{fontSize:13}} /> Property Details
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {[
                  ['fa-home','Type',       p.type==='sale'?'For Sale':'For Rent'],
                  ['fa-couch','Furnished', (p.furnished||'—').charAt(0).toUpperCase()+(p.furnished||'').slice(1)],
                  ['fa-tools',t('detail.condition'), (p.condition||'—').charAt(0).toUpperCase()+(p.condition||'').slice(1)],
                  ['fa-layer-group','Floor',(p.floor||'—').charAt(0).toUpperCase()+(p.floor||'').slice(1)],
                  ['fa-car','Parking',     p.parking?t('detail.yes'):t('detail.no')],
                  ['fa-sort-amount-up','Elevator',p.elevator?'Yes':'No'],
                  ['fa-umbrella-beach','Terrace',p.terrace?'Yes':'No'],
                  ['fa-ruler-combined','Area',p.area+' m²'],
                  ['fa-hashtag',t('detail.reference'),'HESTIA-'+String(p.id).padStart(4,'0')],
                ].map(([icon,lbl,val]) => (
                  <div key={lbl} className="flex items-center gap-2.5 p-3 bg-gray-50 rounded-xl">
                    <div className="w-7 h-7 bg-primary-soft rounded-lg flex items-center justify-center flex-shrink-0">
                      <i className={`fas ${icon} text-primary`} style={{fontSize:11}} />
                    </div>
                    <div><div className="text-xs text-gray-400">{lbl}</div><div className="text-sm font-semibold text-gray-800">{val}</div></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <i className="fas fa-star text-primary" style={{fontSize:13}} /> Amenities
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {p.amenities.map(a => (
                  <div key={a} className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2.5">
                    <i className="fas fa-check text-primary" style={{fontSize:10}} /> {a}
                  </div>
                ))}
              </div>
            </div>

            {/* Price history */}
            {p.priceHistory?.length > 1 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <i className="fas fa-chart-line text-primary" style={{fontSize:13}} /> Price History
                </h2>
                {p.priceHistory.map((price, i) => {
                  const prev = p.priceHistory[i-1]
                  const pct  = prev ? (((price-prev)/prev)*100).toFixed(1) : null
                  const months = ['Nov 2025','Jan 2026','Mar 2026','Apr 2026','May 2026']
                  return (
                    <div key={i} className="flex items-center gap-4 py-2.5 border-b border-gray-100 last:border-0 text-sm">
                      <span className="text-gray-400 w-24">{months[i]||'Now'}</span>
                      <span className="font-bold text-gray-800 flex-1">{price.toLocaleString()} TND</span>
                      {pct !== null
                        ? <span className={`font-semibold text-xs flex items-center gap-0.5 ${parseFloat(pct)<0?'text-emerald-600':'text-red-500'}`}>
                            <i className={`fas fa-arrow-${parseFloat(pct)<0?'down':'up'} text-xs`} /> {Math.abs(pct)}%
                          </span>
                        : <span className="text-xs text-gray-300">Listed</span>}
                    </div>
                  )
                })}
              </div>
            )}

            {/* Neighborhood */}
            {p.neighborhood?.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <i className="fas fa-map-signs text-primary" style={{fontSize:13}} /> Neighborhood
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {p.neighborhood.map(poi => (
                    <div key={poi.name} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                        ${poi.type==='school'?'bg-blue-50':''}
                        ${poi.type==='hospital'?'bg-red-50':''}
                        ${poi.type==='transport'?'bg-amber-50':''}
                        ${poi.type==='shop'?'bg-emerald-50':''}`}>
                        <i className={`fas ${POI_ICONS[poi.type]||'fa-map-marker-alt'}
                          ${poi.type==='school'?'text-blue-500':''}
                          ${poi.type==='hospital'?'text-red-500':''}
                          ${poi.type==='transport'?'text-amber-500':''}
                          ${poi.type==='shop'?'text-emerald-500':''}`} style={{fontSize:12}} />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-gray-800">{poi.name}</div>
                        <div className="text-xs text-gray-400 flex items-center gap-1">
                          <i className="fas fa-walking" style={{fontSize:9}} /> {poi.dist}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Map */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <i className="fas fa-map-marker-alt text-primary" style={{fontSize:13}} /> Location
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">Exact address provided after booking a viewing</p>
              </div>
              {p.coords && (
                <div style={{height:280}}>
                  <PropertyMap properties={[p]} hoveredId={null} onMarkerClick={() => {}} className="w-full h-full" />
                </div>
              )}
            </div>

            {/* Reviews */}
            {p.reviews?.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <i className="fas fa-star text-amber-400" style={{fontSize:13}} /> Agent Reviews
                </h2>
                {p.reviews.map(r => (
                  <div key={r.author} className="py-4 border-b border-gray-100 last:border-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">{r.initials}</div>
                      <div>
                        <div className="text-sm font-semibold text-gray-800">{r.author}</div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <div className="flex gap-0.5 text-amber-400" style={{fontSize:11}}>
                            {Array.from({length:r.rating}).map((_,i) => <i key={i} className="fas fa-star" />)}
                          </div>
                          <span className="text-xs text-gray-400">{r.date}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{r.text}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Similar */}
            {similar.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <i className="fas fa-th-large text-primary" style={{fontSize:13}} /> Similar Properties
                </h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  {similar.map(s => (
                    <div key={s.id} onClick={() => navigate(`/property/${s.id}`)}
                      className="rounded-xl overflow-hidden border border-gray-100 hover:border-primary hover:shadow-md transition-all cursor-pointer">
                      <img src={s.images[0]} alt={s.title} className="w-full h-28 object-cover" />
                      <div className="p-3">
                        <div className="font-bold text-primary text-sm">{s.price}</div>
                        <div className="text-xs font-semibold text-gray-800 truncate mt-0.5">{s.title}</div>
                        <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                          <i className="fas fa-map-marker-alt text-primary" style={{fontSize:9}} /> {s.location}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SIDEBAR — desktop only */}
          <div className="hidden lg:block sticky top-14 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden">
              <div className="bg-primary px-5 py-4">
                <div className="text-2xl font-bold text-white">{p.price}</div>
                <div className="text-white/70 text-sm mt-0.5">
                  {p.type==='sale' ? `For Sale · ${p.area}m²` : 'For Rent · per month'}
                </div>
              </div>

              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <img src={p.agent.image} alt={p.agent.name} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-gray-900">{p.agent.name}</span>
                      {p.agent.verified && <i className="fas fa-check-circle text-emerald-500 text-xs" />}
                    </div>
                    <div className="flex items-center gap-0.5 text-amber-400 mt-0.5" style={{fontSize:11}}>
                      {Array.from({length:Math.floor(p.agent.rating)}).map((_,i) => <i key={i} className="fas fa-star" />)}
                      <span className="text-gray-400 ml-1">{p.agent.rating} ({p.agent.reviewCount})</span>
                    </div>
                    <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                      <i className="fas fa-bolt text-amber-400" style={{fontSize:9}} /> Replies {p.agent.responseTime}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {[['★'+p.agent.rating,'Rating'],[p.agent.reviewCount,'Reviews'],[p.agent.responseTime,'Resp.']].map(([v,l]) => (
                    <div key={l} className="bg-gray-50 rounded-lg p-2 text-center">
                      <div className="text-xs font-bold text-primary">{v}</div>
                      <div className="text-xs text-gray-400">{l}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 space-y-3">
                <textarea value={msg} onChange={e => setMsg(e.target.value)} rows={3}
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-primary resize-none" />
                <button onClick={sendEnquiryToDb} disabled={sending}
                  className="btn-primary w-full justify-center py-3">
                  <i className="fas fa-paper-plane" /> Send Enquiry
                </button>
                <button onClick={contactWhatsApp}
                  className="w-full justify-center py-2.5 bg-[#25d366] hover:bg-[#128c7e] text-white font-semibold rounded-lg transition-all flex items-center gap-2 text-sm">
                  <i className="fab fa-whatsapp" /> WhatsApp Agent
                </button>
                <button onClick={() => user ? setShowViewingModal(true) : toast('Please sign in to book a viewing', 'error')}
                  className="btn-ghost w-full justify-center py-2.5 text-sm">
                  <i className="fas fa-calendar-check" /> Book a Viewing
                </button>
              </div>
            </div>

            {/* Mortgage */}
            {p.type==='sale' && p.priceValue > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-4">
                <h3 className="font-semibold text-sm text-gray-800 mb-3 flex items-center gap-2">
                  <i className="fas fa-calculator text-primary" style={{fontSize:12}} /> Mortgage Estimate
                </h3>
                <p className="text-xs text-gray-400 mb-3">20% down, 25 years at 7.5%</p>
                <div className="bg-primary-soft rounded-xl p-3 text-center">
                  <div className="text-xs text-gray-500">Estimated monthly payment</div>
                  <div className="text-2xl font-bold text-primary mt-1">
                    {Math.round(p.priceValue*0.8*(0.075/12)*Math.pow(1+0.075/12,300)/(Math.pow(1+0.075/12,300)-1)).toLocaleString()} TND/mo
                  </div>
                </div>
              </div>
            )}

            {/* Quick facts */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4">
              <h3 className="font-semibold text-sm text-gray-800 mb-3 flex items-center gap-2">
                <i className="fas fa-info-circle text-primary" style={{fontSize:12}} /> Quick Facts
              </h3>
              {[
                ['Reference', 'HESTIA-'+String(p.id).padStart(4,'0')],
                ['Listed', new Date(p.listedAt||Date.now()).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})],
                ['Views', (p.viewCount||0).toLocaleString()],
                ['Condition', (p.condition||'—').charAt(0).toUpperCase()+(p.condition||'').slice(1)],
              ].map(([k,v]) => (
                <div key={k} className="flex justify-between text-sm py-2 border-b border-gray-100 last:border-0">
                  <span className="text-gray-400">{k}</span>
                  <span className="font-semibold text-gray-800">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky contact bar — hidden on desktop */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 shadow-xl px-4 py-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <div className="text-base font-bold text-primary truncate">{p.price}</div>
            <div className="text-xs text-gray-400 truncate">{p.title}</div>
          </div>
          <button
            onClick={() => favCtx?.toggle(p.id)}
            className={`w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0 transition-all
              ${isFav ? 'bg-red-500 text-white border-red-500' : 'border-gray-200 text-gray-400'}`}>
            <i className={`${isFav ? 'fas' : 'far'} fa-heart text-sm`} />
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => user ? setShowViewingModal(true) : toast('Please sign in to book a viewing', 'error')}
            className="flex-1 btn-primary justify-center py-2.5 text-sm">
            <i className="fas fa-calendar-check" /> Book Viewing
          </button>
          <a
            href={`https://wa.me/${p.agent.phone.replace(/\D/g,'')}?text=${encodeURIComponent(`Hi, I'm interested in: ${p.title}`)}`}
            target="_blank" rel="noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#25d366] hover:bg-[#128c7e] text-white font-bold text-sm rounded-xl transition-all">
            <i className="fab fa-whatsapp" /> WhatsApp
          </a>
        </div>
      </div>


      {/* Viewing booking modal */}
      {showViewingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowViewingModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <i className="fas fa-calendar-check text-primary" /> Book a Viewing
              </h3>
              <button onClick={() => setShowViewingModal(false)} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                <i className="fas fa-times text-sm" />
              </button>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 flex gap-3 mb-5">
              <img src={p.images[0]} alt="" className="w-14 h-12 object-cover rounded-lg flex-shrink-0" />
              <div className="min-w-0">
                <div className="font-semibold text-sm text-gray-800 truncate">{p.title}</div>
                <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                  <i className="fas fa-user-tie text-primary" style={{fontSize:10}} /> {p.agent.name}
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Preferred Date</label>
                <input type="date" value={viewingDate} onChange={e => setViewingDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="input" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Preferred Time</label>
                <select value={viewingTime} onChange={e => setViewingTime(e.target.value)} className="input">
                  {['09:00','10:00','11:00','12:00','14:00','15:00','16:00','17:00'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <p className="text-xs text-gray-400 flex items-start gap-1.5">
                <i className="fas fa-info-circle text-primary mt-0.5" style={{fontSize:11}} />
                The agent will confirm your viewing within 2 hours.
              </p>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setShowViewingModal(false)} className="btn-ghost flex-1 justify-center py-2.5 text-sm">Cancel</button>
              <button onClick={bookViewingToDb} className="btn-primary flex-1 justify-center py-2.5 text-sm">
                <i className="fas fa-calendar-check" /> Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
