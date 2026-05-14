import { useState, useEffect } from 'react'
import { sb } from '../lib/supabase'
import { useAuth } from './useAuth'

export const MOCK_LEADS = [
  { id:1, firstName:'Amir',    lastName:'Kallel',      email:'amir@email.com',    phone:'+216 98 111 222', property:'Villa Gammarth',      status:'new',          priority:'high',   source:'Website',  lastContact:'2026-05-14 09:30', notes:'Interested in 4+ beds', avatar:'AK' },
  { id:2, firstName:'Fatima',  lastName:'Ben Salah',   email:'fatima@email.com',  phone:'+216 92 333 444', property:'Apt Sousse',           status:'contacted',    priority:'high',   source:'Referral', lastContact:'2026-05-13 14:20', notes:'Budget 300K TND',       avatar:'FB' },
  { id:3, firstName:'Youssef', lastName:'Masmoudi',    email:'youssef@email.com', phone:'+216 97 555 666', property:'Penthouse Lac 2',      status:'viewing',      priority:'medium', source:'Agent',    lastContact:'2026-05-12 11:00', notes:'Ready to sign',         avatar:'YM' },
  { id:4, firstName:'Nadia',   lastName:'Ferchichi',   email:'nadia@email.com',   phone:'+216 95 777 888', property:'Villa Hammamet',       status:'negotiating',  priority:'high',   source:'Website',  lastContact:'2026-05-11 16:45', notes:'Counter-offered 780K',  avatar:'NF' },
  { id:5, firstName:'Omar',    lastName:'Drissi',      email:'omar@email.com',    phone:'+216 91 999 000', property:'Studio Lac 2',         status:'closed',       priority:'low',    source:'Portal',   lastContact:'2026-05-10 10:30', notes:'Deal closed 650/mo',    avatar:'OD' },
  { id:6, firstName:'Leila',   lastName:'Bouzid',      email:'leila@email.com',   phone:'+216 94 112 233', property:'Sfax Commercial',      status:'lost',         priority:'low',    source:'Website',  lastContact:'2026-05-08 09:15', notes:'Went with competitor',  avatar:'LB' },
  { id:7, firstName:'Bilel',   lastName:'Chaabane',    email:'bilel@email.com',   phone:'+216 99 445 566', property:'Apt Sidi Bou Said',    status:'new',          priority:'medium', source:'Referral', lastContact:'2026-05-14 08:00', notes:'First inquiry',         avatar:'BC' },
  { id:8, firstName:'Rania',   lastName:'Hamdouni',    email:'rania@email.com',   phone:'+216 96 778 899', property:'Villa Gammarth',       status:'contacted',    priority:'high',   source:'Agent',    lastContact:'2026-05-13 13:30', notes:'Wants sea view',        avatar:'RH' },
]

export const MOCK_LISTINGS = [
  { id:'p1', title:'Modern Villa Gammarth',   price:850000,  type:'sale', city:'Tunis',    status:'active', beds:4, baths:3, area:320, views:312, inquiries:8,  img:'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&q=70' },
  { id:'p2', title:'Downtown Apartment',      price:1200,    type:'rent', city:'Tunis',    status:'active', beds:2, baths:1, area:95,  views:87,  inquiries:3,  img:'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=70' },
  { id:'p3', title:'Family Villa Hammamet',   price:420000,  type:'sale', city:'Hammamet', status:'active', beds:5, baths:3, area:280, views:143, inquiries:5,  img:'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=70' },
  { id:'p4', title:'Penthouse Lac 2',         price:1200000, type:'sale', city:'Tunis',    status:'active', beds:5, baths:4, area:450, views:524, inquiries:12, img:'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=70' },
  { id:'p5', title:'Studio Hammamet Nord',    price:650,     type:'rent', city:'Hammamet', status:'paused', beds:1, baths:1, area:55,  views:38,  inquiries:1,  img:'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&q=70' },
  { id:'p6', title:'Commercial Sfax Centre',  price:2400000, type:'sale', city:'Sfax',     status:'active', beds:0, baths:8, area:1200,views:91,  inquiries:4,  img:'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=70' },
]

export const MOCK_COMMISSIONS = [
  { id:'c1', property:'Villa Gammarth',    client:'Nadia Ferchichi',   salePrice:850000, rate:2.5, amount:21250, type:'sale', status:'paid',    date:'2026-04-15' },
  { id:'c2', property:'Penthouse Lac 2',   client:'Youssef Masmoudi',  salePrice:1200000,rate:2.5, amount:30000, type:'sale', status:'paid',    date:'2026-03-28' },
  { id:'c3', property:'Apt Sousse',        client:'Omar Drissi',       salePrice:1800,   rate:8,   amount:144,   type:'rent', status:'paid',    date:'2026-02-10' },
  { id:'c4', property:'Sfax Commercial',   client:'Bilel Chaabane',    salePrice:2300000,rate:2,   amount:46000, type:'sale', status:'pending', date:'2026-05-02' },
  { id:'c5', property:'Studio Hammamet',   client:'Rania Hamdouni',    salePrice:650,    rate:8,   amount:52,    type:'rent', status:'paid',    date:'2026-01-15' },
]

export const CALENDAR_EVENTS = [
  { day:14, text:'Viewing — Villa Gammarth',    type:'viewing', time:'10:00' },
  { day:14, text:'Call — Fatima Ben Salah',     type:'call',    time:'14:00' },
  { day:16, text:'Viewing — Apt Sousse',        type:'viewing', time:'11:00' },
  { day:18, text:'Meeting — New client',        type:'meeting', time:'09:30' },
  { day:19, text:'Viewing — Penthouse Lac 2',   type:'viewing', time:'15:00' },
  { day:21, text:'Notary — Villa Hammamet',     type:'meeting', time:'10:00' },
  { day:23, text:'Follow-up — Amir Kallel',     type:'call',    time:'11:30' },
  { day:26, text:'Viewing — Sfax Commercial',   type:'viewing', time:'14:00' },
]

export const MESSAGES = [
  { id:1, name:'Amir Kallel',     avatar:'AK', msg:'Can we schedule a viewing for Saturday?',      time:'09:32', unread:2, phone:'+216 98 111 222' },
  { id:2, name:'Fatima Ben Salah',avatar:'FB', msg:'What is the final price after negotiation?',   time:'08:15', unread:1, phone:'+216 92 333 444' },
  { id:3, name:'Youssef Masmoudi',avatar:'YM', msg:'I would like to move forward with the offer.', time:'Yesterday', unread:0, phone:'+216 97 555 666' },
  { id:4, name:'Nadia Ferchichi', avatar:'NF', msg:'Please send the contract documents.',           time:'Yesterday', unread:0, phone:'+216 95 777 888' },
]

export function scoreLeads(lead) {
  let score = 0
  const s = { closed:10, negotiating:8, viewing:6, contacted:4, new:2, lost:0 }
  score += s[lead.status] || 0
  score += lead.priority === 'high' ? 4 : lead.priority === 'medium' ? 2 : 0
  const daysAgo = (Date.now() - new Date(lead.lastContact).getTime()) / 86400000
  if (daysAgo < 1) score += 4
  else if (daysAgo < 3) score += 2
  else if (daysAgo > 7) score -= 2
  const tier = score >= 12 ? 'hot' : score >= 7 ? 'warm' : 'cold'
  return { score, tier }
}

export function useAgentData() {
  const { user } = useAuth()
  const [leads, setLeads] = useState(MOCK_LEADS)
  const [listings, setListings] = useState(MOCK_LISTINGS)
  const [commissions, setCommissions] = useState(MOCK_COMMISSIONS)
  const [commTarget, setCommTarget] = useState(60000)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) return
    // Load real data from Supabase if available
    async function loadReal() {
      const { data: props } = await sb.from('Property').select('*').eq('agentId', user.id).order('createdAt', { ascending: false })
      if (props?.length) {
        setListings(props.map(p => ({
          id: p.id, title: p.title, price: p.price, type: p.listingType?.toLowerCase() === 'rent' ? 'rent' : 'sale',
          city: p.city, status: p.status?.toLowerCase() || 'active',
          beds: p.bedrooms || 0, baths: p.bathrooms || 0, area: p.area || 0,
          views: p.viewCount || 0, inquiries: 0,
          img: p.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=70'
        })))
      }
      const { data: comms } = await sb.from('commissions').select('*').eq('agent_id', user.id).order('deal_date', { ascending: false })
      if (comms?.length) {
        setCommissions(comms.map(c => ({
          id: c.id, property: c.property_title, client: c.client_name || '—',
          salePrice: c.sale_price, rate: c.commission_rate, amount: c.commission_amount,
          type: c.deal_type, status: c.status, date: c.deal_date
        })))
      }
      const { data: target } = await sb.from('commission_targets').select('target_tnd').eq('agent_id', user.id).eq('month', new Date().toISOString().slice(0,7)).single()
      if (target) setCommTarget(target.target_tnd)
    }
    loadReal()
  }, [user])

  return { leads, setLeads, listings, setListings, commissions, setCommissions, commTarget, setCommTarget, loading }
}
