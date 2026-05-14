import { useState, useEffect } from 'react'
import { sb } from '../lib/supabase'

export const MOCK_ADMIN_LISTINGS = [
  { id:'al1', title:'Modern Villa Gammarth',  agentId:'agent-1', agentName:'Karim Jaziri',   city:'Tunis',    price:850000, listingType:'SALE', status:'ACTIVE',  createdAt:'2026-05-10T09:00:00Z', img:'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=200&q=60' },
  { id:'al2', title:'Downtown Apartment',      agentId:'agent-2', agentName:'Sana Mhenni',    city:'Tunis',    price:1200,   listingType:'RENT', status:'PENDING', createdAt:'2026-05-13T14:00:00Z', img:'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=200&q=60' },
  { id:'al3', title:'Family Villa Hammamet',   agentId:'agent-1', agentName:'Karim Jaziri',   city:'Hammamet', price:420000, listingType:'SALE', status:'ACTIVE',  createdAt:'2026-04-28T11:00:00Z', img:'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=200&q=60' },
  { id:'al4', title:'Penthouse Lac 2',         agentId:'agent-3', agentName:'Ahmed Ben Ali',  city:'Tunis',    price:1200000,listingType:'SALE', status:'PENDING', createdAt:'2026-05-14T08:00:00Z', img:'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=200&q=60' },
  { id:'al5', title:'Sfax Commercial Building',agentId:'agent-4', agentName:'Bilel Chaabane', city:'Sfax',     price:2400000,listingType:'SALE', status:'ACTIVE',  createdAt:'2026-05-05T10:00:00Z', img:'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&q=60' },
]

export const MOCK_AGENTS = [
  { id:'agent-1', name:'Karim Jaziri',    phone:'+216 98 123 456', role:'AGENT', created_at:'2026-03-01T00:00:00Z', listings:8, status:'active' },
  { id:'agent-2', name:'Sana Mhenni',     phone:'+216 92 456 789', role:'AGENT', created_at:'2026-03-15T00:00:00Z', listings:4, status:'active' },
  { id:'agent-3', name:'Ahmed Ben Ali',   phone:'+216 99 333 444', role:'AGENT', created_at:'2026-02-10T00:00:00Z', listings:12,status:'active' },
  { id:'agent-4', name:'Bilel Chaabane',  phone:'+216 74 456 789', role:'AGENT', created_at:'2026-04-01T00:00:00Z', listings:3, status:'active' },
  { id:'agent-5', name:'Leila Bouzid',    phone:'+216 95 777 888', role:'AGENT', created_at:'2026-04-20T00:00:00Z', listings:2, status:'suspended' },
]

export const MOCK_USERS = [
  { id:'u1', name:'Amir Kallel',     created_at:'2026-05-01T00:00:00Z', role:'USER' },
  { id:'u2', name:'Fatima Ben Salah',created_at:'2026-05-05T00:00:00Z', role:'USER' },
  { id:'u3', name:'Omar Drissi',     created_at:'2026-05-08T00:00:00Z', role:'USER' },
  { id:'u4', name:'Nadia Ferchichi', created_at:'2026-05-10T00:00:00Z', role:'USER' },
]

export const MOCK_FLAGS = [
  { id:'f1', target_type:'listing', target_id:'al2', reason:'Suspected duplicate', status:'open',     created_at:'2026-05-13T10:00:00Z' },
  { id:'f2', target_type:'agent',   target_id:'agent-5', reason:'Spam listings',   status:'resolved', created_at:'2026-05-10T14:00:00Z' },
]

export function useAdminData() {
  const [listings, setListings] = useState(MOCK_ADMIN_LISTINGS)
  const [agents, setAgents]     = useState(MOCK_AGENTS)
  const [users, setUsers]       = useState(MOCK_USERS)
  const [flags, setFlags]       = useState(MOCK_FLAGS)

  useEffect(() => {
    async function load() {
      const { data: props }   = await sb.from('Property').select('*').order('createdAt', { ascending:false })
      if (props?.length) setListings(props.map(p => ({
        id:p.id, title:p.title, agentId:p.agentId, agentName:'Agent',
        city:p.city, price:p.price, listingType:p.listingType,
        status:p.status, createdAt:p.createdAt,
        img: p.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=200&q=60'
      })))
      const { data: profs } = await sb.from('profiles').select('*').order('created_at', { ascending:false })
      if (profs?.length) {
        setAgents(profs.filter(p => p.role==='AGENT').map(p => ({ ...p, listings:0, status:'active' })))
        setUsers(profs.filter(p => p.role==='USER'))
      }
      const { data: fls } = await sb.from('admin_flags').select('*').order('created_at', { ascending:false })
      if (fls?.length) setFlags(fls)
    }
    load()
  }, [])

  return { listings, setListings, agents, setAgents, users, flags, setFlags }
}

export function timeAgo(ts) {
  if (!ts) return '—'
  const s = Math.floor((Date.now() - new Date(ts).getTime()) / 1000)
  if (s < 60) return s + 's ago'
  if (s < 3600) return Math.floor(s/60) + 'm ago'
  if (s < 86400) return Math.floor(s/3600) + 'h ago'
  return Math.floor(s/86400) + 'd ago'
}
