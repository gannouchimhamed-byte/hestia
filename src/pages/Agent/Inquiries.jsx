import { useState, useEffect } from 'react'
import { sb } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'

const STATUS_STYLE = {
  new:      'bg-blue-100 text-blue-700',
  read:     'bg-gray-100 text-gray-500',
  replied:  'bg-emerald-100 text-emerald-700',
  archived: 'bg-gray-100 text-gray-400',
}

export default function AgentInquiries() {
  const { user } = useAuth()
  const toast = useToast()
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading]     = useState(true)
  const [selected, setSelected]   = useState(null)
  const [filter, setFilter]       = useState('all')

  useEffect(() => {
    if (!user) return
    async function load() {
      setLoading(true)
      // Fetch inquiries for all properties owned by this agent
      const { data: props } = await sb.from('Property').select('id,title').eq('agentId', user.id)
      const propIds = (props||[]).map(p => p.id)
      const propMap = Object.fromEntries((props||[]).map(p => [p.id, p.title]))

      if (propIds.length === 0) { setLoading(false); return }

      const { data } = await sb.from('Inquiry')
        .select('*')
        .in('propertyId', propIds)
        .order('createdAt', { ascending: false })

      setInquiries((data||[]).map(i => ({
        ...i,
        property_title: i.property_title || propMap[i.propertyId] || 'Unknown property',
      })))
      setLoading(false)
    }
    load()
  }, [user])

  async function markRead(id) {
    await sb.from('Inquiry').update({ status: 'read' }).eq('id', id)
    setInquiries(prev => prev.map(i => i.id===id ? {...i, status:'read'} : i))
  }

  async function archive(id) {
    await sb.from('Inquiry').update({ status: 'archived' }).eq('id', id)
    setInquiries(prev => prev.map(i => i.id===id ? {...i, status:'archived'} : i))
    if (selected?.id === id) setSelected(null)
    toast('Archived')
  }

  function openInquiry(inq) {
    setSelected(inq)
    if (inq.status === 'new') markRead(inq.id)
  }

  const unread = inquiries.filter(i => i.status === 'new').length
  const filtered = inquiries.filter(i => filter === 'all' || i.status === filter)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Enquiries</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            {unread > 0
              ? <span className="text-primary font-semibold">{unread} new</span>
              : 'All caught up'
            } · {inquiries.length} total
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1.5 mb-5">
        {[['all','All'],['new','New'],['read','Read'],['replied','Replied'],['archived','Archived']].map(([v,l]) => (
          <button key={v} onClick={() => setFilter(v)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all ${filter===v?'bg-primary text-white border-primary':'border-gray-200 text-gray-500 hover:border-primary hover:text-primary'}`}>
            {l}
            {v==='new' && unread > 0 && (
              <span className="ml-1.5 bg-blue-500 text-white rounded-full px-1.5">{unread}</span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12"><i className="fas fa-circle-notch fa-spin text-primary text-2xl" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-300">
          <i className="fas fa-inbox text-5xl mb-4 block" />
          <p className="font-semibold text-gray-500 text-lg mb-1">
            {filter === 'all' ? 'No enquiries yet' : `No ${filter} enquiries`}
          </p>
          <p className="text-sm text-gray-400">
            {filter === 'all' ? 'Buyer messages will appear here when they contact you.' : 'Try changing the filter above.'}
          </p>
        </div>
      ) : (
        <div className="flex gap-5">
          {/* List */}
          <div className="flex-1 bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="divide-y divide-gray-50">
              {filtered.map(inq => (
                <div key={inq.id}
                  onClick={() => openInquiry(inq)}
                  className={`flex items-start gap-3 px-4 py-4 cursor-pointer hover:bg-gray-50 transition-colors
                    ${selected?.id === inq.id ? 'bg-primary-soft/30 border-r-2 border-primary' : ''}
                    ${inq.status === 'new' ? 'bg-blue-50/30' : ''}`}>
                  <div className="w-9 h-9 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                    {(inq.buyer_name || inq.buyer_email || 'B').charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span className={`text-sm font-semibold ${inq.status==='new'?'text-gray-900':'text-gray-700'}`}>
                        {inq.buyer_name || inq.buyer_email?.split('@')[0] || 'Anonymous'}
                      </span>
                      <span className="text-xs text-gray-400 flex-shrink-0">
                        {new Date(inq.createdAt).toLocaleDateString('en-GB', {day:'numeric',month:'short'})}
                      </span>
                    </div>
                    <div className="text-xs text-primary font-medium truncate mb-1">{inq.property_title}</div>
                    <div className="text-xs text-gray-400 truncate">{inq.message}</div>
                  </div>
                  {inq.status === 'new' && (
                    <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-2" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Detail panel */}
          {selected ? (
            <div className="w-80 flex-shrink-0 hidden lg:block">
              <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Enquiry Detail</h3>
                  <button onClick={() => setSelected(null)} className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200">
                    <i className="fas fa-times text-xs" />
                  </button>
                </div>

                <div className="space-y-3 mb-4">
                  {[
                    ['fa-user','Buyer', selected.buyer_name || 'Anonymous'],
                    ['fa-envelope','Email', selected.buyer_email || '—'],
                    ['fa-phone','Phone', selected.buyer_phone || '—'],
                    ['fa-building','Property', selected.property_title],
                    ['fa-clock','Received', new Date(selected.createdAt).toLocaleString('en-GB',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'})],
                  ].map(([icon, label, val]) => (
                    <div key={label} className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <i className={`fas ${icon} text-gray-400 text-xs`} />
                      </div>
                      <div>
                        <div className="text-xs text-gray-400">{label}</div>
                        <div className="text-sm font-medium text-gray-800 mt-0.5">{val}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-50 rounded-xl p-3 mb-4">
                  <div className="text-xs font-semibold text-gray-400 mb-1.5">Message</div>
                  <p className="text-sm text-gray-700 leading-relaxed">{selected.message}</p>
                </div>

                <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full mb-4 ${STATUS_STYLE[selected.status]||STATUS_STYLE.new}`}>
                  {selected.status}
                </span>

                <div className="space-y-2">
                  {selected.buyer_phone && (
                    <a href={`https://wa.me/${selected.buyer_phone.replace(/\D/g,'')}?text=${encodeURIComponent(`Hi, I'm following up on your enquiry about ${selected.property_title}.`)}`}
                      target="_blank" rel="noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#25d366] hover:bg-[#128c7e] text-white font-bold text-sm rounded-xl transition-all">
                      <i className="fab fa-whatsapp" /> WhatsApp
                    </a>
                  )}
                  {selected.buyer_email && (
                    <a href={`mailto:${selected.buyer_email}?subject=Re: ${selected.property_title}&body=Hi, thank you for your enquiry about ${selected.property_title}.`}
                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary hover:bg-primary-dark text-white font-bold text-sm rounded-xl transition-all">
                      <i className="fas fa-reply" /> Reply by Email
                    </a>
                  )}
                  {selected.buyer_phone && (
                    <a href={`tel:${selected.buyer_phone}`}
                      className="w-full flex items-center justify-center gap-2 py-2.5 border border-gray-200 text-gray-700 font-semibold text-sm rounded-xl hover:bg-gray-50 transition-all">
                      <i className="fas fa-phone" /> Call
                    </a>
                  )}
                  <button onClick={() => archive(selected.id)}
                    className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-gray-400 hover:text-gray-600 transition-all">
                    <i className="fas fa-archive" /> Archive
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}
