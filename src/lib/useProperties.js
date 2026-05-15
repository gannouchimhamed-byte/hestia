import { useState, useEffect } from 'react'
import { sb } from './supabase'
import { properties as MOCK } from './data'

const SUPABASE_URL = 'https://cmxblqzulbgtlinmyqxl.supabase.co'

// Map a Supabase Property row → the shape our React components expect
export function mapProperty(row, agentProfile) {
  const isRent = row.listingType === 'RENT' || row.type === 'rent'
  const priceNum = parseFloat(row.price) || 0
  const priceStr = isRent
    ? `${priceNum.toLocaleString()} TND/mo`
    : `${priceNum.toLocaleString()} TND`

  return {
    id:           row.id,
    title:        row.title,
    description:  row.description || '',
    price:        priceStr,
    priceValue:   priceNum,
    originalPrice: row.originalPrice || null,
    type:         isRent ? 'rent' : 'sale',
    city:         row.city || '',
    location:     row.address || row.city || '',
    area:         parseFloat(row.area) || 0,
    beds:         row.bedrooms || 0,
    baths:        row.bathrooms || 0,
    rooms:        row.rooms || 0,
    featured:     row.featured || false,
    status:       row.status || 'ACTIVE',
    listedAt:     row.createdAt || new Date().toISOString(),
    priceReducedAt: row.priceReducedAt || null,
    images:       row.images?.length
      ? row.images
      : ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80'],
    floorPlan:    row.floor_plan_url || null,
    videoUrl:     row.video_url || null,
    amenities:    row.amenities || [],
    condition:    row.condition || 'good',
    furnished:    row.furnished || 'unfurnished',
    parking:      row.parking || false,
    elevator:     row.elevator || false,
    coordinates:  row.latitude && row.longitude
      ? [row.latitude, row.longitude]
      : [36.8, 10.18],
    viewCount:    row.viewCount || 0,
    agentId:      row.agentId,
    agent: agentProfile ? {
      id:       agentProfile.id,
      name:     agentProfile.name || 'Hestia Agent',
      phone:    agentProfile.phone || row.whatsapp_phone || '+216 00 000 000',
      image:    agentProfile.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
      verified: true,
      rating:   4.8,
      reviews:  12,
    } : {
      id:      row.agentId,
      name:    'Hestia Agent',
      phone:   row.whatsapp_phone || '+216 00 000 000',
      image:   'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
      verified: true,
      rating:  4.8,
      reviews: 12,
    },
    // neighborhood mock data (will be replaced when location data improves)
    neighborhood: [],
    priceHistory: [],
    reviews: [],
  }
}

// Cache agent profiles so we don't re-fetch them per listing
const agentCache = {}
async function fetchAgent(agentId) {
  if (agentCache[agentId]) return agentCache[agentId]
  const { data } = await sb.from('profiles').select('id,name,phone,avatar_url').eq('id', agentId).single()
  if (data) agentCache[agentId] = data
  return data
}

// Fetch all active properties
export async function fetchProperties({ limit = 50, featured, city, deal, type } = {}) {
  let q = sb.from('Property').select('*').eq('status', 'ACTIVE').order('createdAt', { ascending: false })
  if (limit)    q = q.limit(limit)
  if (featured) q = q.eq('featured', true)
  if (city)     q = q.ilike('city', `%${city}%`)
  if (deal)     q = q.eq('listingType', deal === 'rent' ? 'RENT' : 'SALE')

  const { data, error } = await q
  if (error || !data?.length) return null // signal: use mock

  // Fetch agent profiles in batch
  const agentIds = [...new Set(data.map(r => r.agentId).filter(Boolean))]
  await Promise.all(agentIds.map(fetchAgent))

  return data.map(row => mapProperty(row, agentCache[row.agentId]))
}

// Hook for components
export function useProperties(filters = {}) {
  const [properties, setProperties] = useState(MOCK) // start with mock
  const [loading, setLoading]       = useState(true)
  const [fromDB, setFromDB]         = useState(false)

  useEffect(() => {
    let cancelled = false
    fetchProperties(filters).then(data => {
      if (cancelled) return
      if (data?.length) {
        setProperties(data)
        setFromDB(true)
      }
      // else keep mock data
      setLoading(false)
    })
    return () => { cancelled = true }
  }, [JSON.stringify(filters)])

  return { properties, loading, fromDB }
}

// Upload image to Supabase storage, return public URL
export async function uploadPropertyImage(file, agentId, bucket = 'property-images') {
  const ext  = file.name.split('.').pop()
  const path = `${agentId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const { error } = await sb.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type,
  })
  if (error) throw error
  const { data: { publicUrl } } = sb.storage.from(bucket).getPublicUrl(path)
  return publicUrl
}

// Delete image from storage
export async function deletePropertyImage(url, bucket = 'property-images') {
  const path = url.split(`/storage/v1/object/public/${bucket}/`)[1]
  if (path) await sb.storage.from(bucket).remove([path])
}
