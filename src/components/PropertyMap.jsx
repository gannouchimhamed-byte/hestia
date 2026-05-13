import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import L from 'leaflet'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({ iconRetinaUrl: null, iconUrl: null, shadowUrl: null })

// Mini property card shown in map popup — Bayut style
function PopupCard({ p, onClose, onView }) {
  return (
    <div style={{ width: 260, fontFamily: 'Inter, sans-serif', fontSize: 13 }}>
      <div style={{ position: 'relative' }}>
        <img src={p.images[0]} alt={p.title} style={{ width: '100%', height: 140, objectFit: 'cover', display: 'block' }} />
        <button onClick={onClose}
          style={{ position:'absolute', top:8, right:8, width:24, height:24, borderRadius:'50%', background:'rgba(0,0,0,0.5)', border:'none', color:'white', cursor:'pointer', fontSize:12, display:'flex', alignItems:'center', justifyContent:'center' }}>
          ✕
        </button>
        <div style={{ position:'absolute', top:8, left:8, background: p.type==='sale' ? '#1a5f4a' : '#e8b931', color: p.type==='sale' ? 'white' : '#111', padding:'3px 8px', borderRadius:4, fontSize:11, fontWeight:700 }}>
          {p.type === 'sale' ? 'For Sale' : 'For Rent'}
        </div>
      </div>
      <div style={{ padding: '12px' }}>
        <div style={{ fontWeight: 700, color: '#1a5f4a', fontSize: 15, marginBottom: 3 }}>{p.price}</div>
        <div style={{ fontWeight: 600, color: '#111', marginBottom: 4, lineHeight: 1.3 }}>{p.title}</div>
        <div style={{ color: '#888', fontSize: 12, marginBottom: 8 }}>
          <span style={{ color: '#1a5f4a', marginRight: 4 }}>&#9679;</span>{p.location}
        </div>
        <div style={{ display: 'flex', gap: 12, color: '#666', fontSize: 12, marginBottom: 12 }}>
          {p.beds > 0 && <span>{p.beds} Beds</span>}
          {p.baths > 0 && <span>{p.baths} Baths</span>}
          <span>{p.area} m²</span>
        </div>
        <button onClick={() => onView(p.id)}
          style={{ width:'100%', padding:'8px', background:'#1a5f4a', color:'white', border:'none', borderRadius:8, fontWeight:700, cursor:'pointer', fontSize:13 }}>
          View Property
        </button>
      </div>
    </div>
  )
}

export default function PropertyMap({ properties, hoveredId, onMarkerClick, className = '' }) {
  const navigate   = useNavigate()
  const mapRef     = useRef(null)
  const instance   = useRef(null)
  const markers    = useRef({})        // id → { marker, el }
  const popupRef   = useRef(null)
  const [activeId, setActiveId] = useState(null)

  const updateMarker = useCallback((id, active) => {
    const m = markers.current[id]
    if (!m) return
    m.el.style.background   = active ? '#e8b931' : '#ffffff'
    m.el.style.color         = active ? '#111'     : '#1a5f4a'
    m.el.style.borderColor   = active ? '#e8b931'  : '#1a5f4a'
    m.el.style.transform     = active ? 'scale(1.1) translateY(-2px)' : 'scale(1)'
    m.el.style.zIndex        = active ? '999'      : '1'
    m.el.style.boxShadow     = active
      ? '0 4px 16px rgba(232,185,49,0.5)'
      : '0 2px 8px rgba(0,0,0,0.2)'
  }, [])

  // Init map
  useEffect(() => {
    if (!mapRef.current || instance.current) return

    instance.current = L.map(mapRef.current, {
      center: [36.8, 10.18], zoom: 7, zoomControl: false,
    })

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap © Carto',
      maxZoom: 19,
    }).addTo(instance.current)

    L.control.zoom({ position: 'bottomright' }).addTo(instance.current)

    return () => {
      instance.current?.remove()
      instance.current = null
    }
  }, [])

  // Add/update markers when properties change
  useEffect(() => {
    if (!instance.current) return

    // Remove old markers not in current set
    Object.keys(markers.current).forEach(id => {
      if (!properties.find(p => p.id === parseInt(id))) {
        instance.current.removeLayer(markers.current[id].marker)
        delete markers.current[id]
      }
    })

    // Add new markers
    properties.forEach(p => {
      if (!p.coords || markers.current[p.id]) return

      const el = document.createElement('div')
      el.textContent = p.priceLabel
      Object.assign(el.style, {
        background: '#ffffff',
        color: '#1a5f4a',
        fontFamily: 'Inter, sans-serif',
        fontSize: '11px',
        fontWeight: '700',
        padding: '5px 10px',
        borderRadius: '20px',
        border: '2px solid #1a5f4a',
        whiteSpace: 'nowrap',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        transition: 'all 0.2s ease',
        pointerEvents: 'all',
      })

      const icon = L.divIcon({ html: el, className: '', iconAnchor: [0, 0] })
      const marker = L.marker(p.coords, { icon }).addTo(instance.current)

      marker.on('click', () => {
        setActiveId(p.id)
        onMarkerClick?.(p.id)

        // Remove old popup
        if (popupRef.current) {
          instance.current.closePopup(popupRef.current)
        }

        // Build popup with React-rendered content
        const div = document.createElement('div')
        const popup = L.popup({
          closeButton: false,
          offset: [60, 0],
          minWidth: 260,
          maxWidth: 260,
          className: 'hestia-prop-popup',
        }).setContent(div)

        popupRef.current = popup
        marker.bindPopup(popup).openPopup()

        // Render mini card into the div
        const { createRoot } = require('react-dom/client')
        const root = createRoot(div)
        root.render(
          <PopupCard
            p={p}
            onClose={() => { instance.current.closePopup(popup); setActiveId(null) }}
            onView={id => navigate(`/property/${id}`)}
          />
        )
      })

      markers.current[p.id] = { marker, el }
    })

    // Fit bounds
    const coords = properties.filter(p => p.coords).map(p => p.coords)
    if (coords.length > 1) {
      instance.current.fitBounds(coords, { padding: [60, 60], maxZoom: 13, animate: true })
    } else if (coords.length === 1) {
      instance.current.setView(coords[0], 13)
    }
  }, [properties, navigate, onMarkerClick])

  // Sync hover
  useEffect(() => {
    Object.keys(markers.current).forEach(id => {
      updateMarker(parseInt(id), parseInt(id) === hoveredId || parseInt(id) === activeId)
    })
  }, [hoveredId, activeId, updateMarker])

  return (
    <div className={`relative ${className}`}>
      <div ref={mapRef} className="w-full h-full" />
    </div>
  )
}
