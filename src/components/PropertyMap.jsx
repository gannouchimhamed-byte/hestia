import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'

// Fix Leaflet icon paths
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({ iconRetinaUrl: null, iconUrl: null, shadowUrl: null })

export default function PropertyMap({ properties, hoveredId, onMarkerClick }) {
  const mapRef     = useRef(null)
  const mapInstance = useRef(null)
  const markersRef  = useRef({})
  const [activeId, setActiveId] = useState(null)

  // Init map
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return

    mapInstance.current = L.map(mapRef.current, {
      center: [36.8, 10.18],
      zoom: 7,
      zoomControl: false,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
    }).addTo(mapInstance.current)

    L.control.zoom({ position: 'bottomright' }).addTo(mapInstance.current)

    // Add markers
    properties.forEach(p => {
      if (!p.coords) return

      const el = document.createElement('div')
      el.className = 'map-marker-price'
      el.textContent = p.priceLabel
      el.style.cssText = `
        background: #1a5f4a; color: white; font-family: Inter, sans-serif;
        font-size: 11px; font-weight: 700; padding: 5px 9px; border-radius: 20px;
        border: 2px solid white; white-space: nowrap; cursor: pointer;
        box-shadow: 0 2px 8px rgba(0,0,0,0.25); transition: all 0.2s;
      `

      const icon = L.divIcon({ html: el, className: '', iconAnchor: [0, 0] })
      const marker = L.marker(p.coords, { icon }).addTo(mapInstance.current)

      marker.on('click', () => {
        onMarkerClick?.(p.id)
        setActiveId(p.id)
      })

      // Popup on click
      const popup = L.popup({ closeButton: false, offset: [0, -8], className: 'hestia-popup' })
      popup.setContent(`
        <div style="width:220px;font-family:Inter,sans-serif;overflow:hidden;">
          <img src="${p.images[0]}" style="width:100%;height:120px;object-fit:cover;" />
          <div style="padding:10px;">
            <div style="font-weight:700;color:#1a5f4a;font-size:13px;margin-bottom:2px;">${p.price}</div>
            <div style="font-weight:600;font-size:12px;margin-bottom:2px;color:#111;">${p.title}</div>
            <div style="font-size:11px;color:#888;">📍 ${p.location}</div>
            <div style="font-size:11px;color:#666;margin-top:4px;">🛏${p.beds} · 🚿${p.baths} · 📐${p.area}m²</div>
          </div>
        </div>
      `)
      marker.bindPopup(popup)
      markersRef.current[p.id] = { marker, el }
    })

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove()
        mapInstance.current = null
      }
    }
  }, [])

  // Sync hover state
  useEffect(() => {
    Object.entries(markersRef.current).forEach(([id, { el }]) => {
      const isActive = Number(id) === hoveredId || Number(id) === activeId
      el.style.background = isActive ? '#e8b931' : '#1a5f4a'
      el.style.color       = isActive ? '#111' : 'white'
      el.style.transform   = isActive ? 'scale(1.15)' : 'scale(1)'
      el.style.zIndex      = isActive ? '999' : '1'
    })
  }, [hoveredId, activeId])

  // Fit bounds when filtered
  useEffect(() => {
    if (!mapInstance.current || !properties.length) return
    const coords = properties.filter(p => p.coords).map(p => p.coords)
    if (coords.length) mapInstance.current.fitBounds(coords, { padding: [40, 40], maxZoom: 12 })
  }, [properties.length])

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full rounded-none" />
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-xl px-3 py-2 shadow-lg text-xs font-semibold text-gray-600 z-[500] flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-primary inline-block"></span> Click a price to preview
      </div>
    </div>
  )
}
