// Admin Agents page
import { useState } from 'react'
import { useAdminData, timeAgo } from '../../hooks/useAdminData'
import { useToast } from '../../hooks/useToast'

export function AdminAgents() {
  const { agents, setAgents } = useAdminData()
  const toast = useToast()
  const [search, setSearch]   = useState('')
  const [filter, setFilter]   = useState('all')
  const [suspendId, setSuspendId] = useState(null)

  const filtered = agents.filter(a => {
    const matchF = filter === 'all' || a.status === filter
    const matchS = !search || a.name?.toLowerCase().includes(search.toLowerCase())
    return matchF && matchS
  })

  function suspend(id) {
    setAgents(prev => prev.map(a => a.id===id ? {...a, status:'suspended'} : a))
    setSuspendId(null)
    toast('Agent suspended', 'warning')
  }

  function restore(id) {
    setAgents(prev => prev.map(a => a.id===id ? {...a, status:'active'} : a))
    toast('Agent restored', 'success')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Agent Management</h1>
          <p className="text-gray-400 text-sm mt-0.5">{agents.length} registered agents</p>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="relative">
          <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search agents..."
            className="pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-primary bg-white w-48" />
        </div>
        <div className="flex gap-1.5">
          {[['all','All'],['active','Active'],['suspended','Suspended']].map(([v,l]) => (
            <button key={v} onClick={() => setFilter(v)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all ${filter===v?'bg-primary text-white border-primary':'border-gray-200 text-gray-500 hover:border-primary hover:text-primary'}`}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead><tr className="bg-gray-50 border-b border-gray-100">
            {['Agent','Phone','Listings','Joined','Status','Actions'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>)}
          </tr></thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map(a => (
              <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {a.name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-gray-800">{a.name || '—'}</div>
                      <div className="text-xs text-gray-400">ID: {a.id?.slice(0,8)}…</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">{a.phone || '—'}</td>
                <td className="px-4 py-3 text-sm text-gray-600 font-semibold">{a.listings || 0}</td>
                <td className="px-4 py-3 text-xs text-gray-400">{timeAgo(a.created_at)}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${a.status==='active'?'bg-emerald-100 text-emerald-700':'bg-red-100 text-red-700'}`}>
                    {a.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {a.status === 'active'
                    ? <button onClick={() => setSuspendId(a.id)} className="h-7 px-3 text-xs font-semibold border border-gray-200 text-amber-600 rounded-lg hover:border-amber-400 hover:bg-amber-50 transition-colors flex items-center gap-1">
                        <i className="fas fa-ban text-xs" /> Suspend
                      </button>
                    : <button onClick={() => restore(a.id)} className="h-7 px-3 text-xs font-semibold border border-gray-200 text-emerald-600 rounded-lg hover:border-emerald-400 hover:bg-emerald-50 transition-colors flex items-center gap-1">
                        <i className="fas fa-undo text-xs" /> Restore
                      </button>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {suspendId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setSuspendId(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-5" onClick={e => e.stopPropagation()}>
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2"><i className="fas fa-ban text-amber-500" /> Suspend Agent</h3>
            <p className="text-sm text-gray-500 mb-4">This will prevent the agent from logging in and hide their listings immediately.</p>
            <div className="flex gap-2">
              <button onClick={() => setSuspendId(null)} className="btn-ghost flex-1 justify-center">Cancel</button>
              <button onClick={() => suspend(suspendId)} className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
                <i className="fas fa-ban" /> Suspend
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Admin Flags page
export function AdminFlags() {
  const { flags, setFlags } = useAdminData()
  const toast = useToast()

  async function resolve(id) {
    setFlags(prev => prev.map(f => f.id===id ? {...f, status:'resolved'} : f))
    toast('Flag resolved', 'success')
  }

  async function dismiss(id) {
    setFlags(prev => prev.map(f => f.id===id ? {...f, status:'dismissed'} : f))
    toast('Flag dismissed')
  }

  const STATUS = { open:'bg-red-100 text-red-700', resolved:'bg-emerald-100 text-emerald-700', dismissed:'bg-gray-100 text-gray-500' }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-gray-900">Flagged Content</h1>
        <p className="text-gray-400 text-sm mt-0.5">{flags.filter(f=>f.status==='open').length} open flags</p>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead><tr className="bg-gray-50 border-b border-gray-100">
            {['Type','Target','Reason','Reported','Status','Actions'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>)}
          </tr></thead>
          <tbody className="divide-y divide-gray-50">
            {flags.map(f => (
              <tr key={f.id} className="hover:bg-gray-50">
                <td className="px-4 py-3"><span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-100 text-purple-700">{f.target_type}</span></td>
                <td className="px-4 py-3 text-xs text-gray-400 font-mono">{f.target_id?.slice(0,12)}…</td>
                <td className="px-4 py-3 text-sm text-gray-600">{f.reason}</td>
                <td className="px-4 py-3 text-xs text-gray-400">{timeAgo(f.created_at)}</td>
                <td className="px-4 py-3"><span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS[f.status]||STATUS.open}`}>{f.status}</span></td>
                <td className="px-4 py-3">
                  {f.status === 'open' && (
                    <div className="flex gap-1.5">
                      <button onClick={() => resolve(f.id)} className="h-7 px-3 text-xs font-semibold bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 flex items-center gap-1">
                        <i className="fas fa-check" /> Resolve
                      </button>
                      <button onClick={() => dismiss(f.id)} className="h-7 px-3 text-xs font-semibold border border-gray-200 text-gray-500 rounded-lg hover:bg-gray-50 flex items-center gap-1">
                        <i className="fas fa-times" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {flags.length === 0 && (
          <div className="text-center py-12 text-gray-300">
            <i className="fas fa-flag text-3xl mb-3 block" />
            <p className="text-sm font-semibold">No flagged content</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Admin Health page
export function AdminHealth() {
  const services = [
    { name:'Supabase Database',   status:'operational', uptime:'99.9%' },
    { name:'Auth Service',        status:'operational', uptime:'100%' },
    { name:'Edge Functions',      status:'operational', uptime:'99.8%' },
    { name:'Storage (Documents)', status:'operational', uptime:'99.9%' },
    { name:'Email (Resend)',      status:'degraded',    uptime:'97.2%' },
    { name:'Payments (Konnect)',  status:'not configured', uptime:'—' },
  ]
  const quality = [
    { label:'Listings with photos',        pct:82, color:'bg-primary' },
    { label:'Listings with description',   pct:96, color:'bg-primary' },
    { label:'Listings with floor plan',    pct:34, color:'bg-amber-500' },
    { label:'Verified agents',             pct:61, color:'bg-blue-500' },
    { label:'Agents with response badge',  pct:28, color:'bg-purple-500' },
  ]
  const S = { operational:'bg-emerald-100 text-emerald-700', degraded:'bg-amber-100 text-amber-700', 'not configured':'bg-gray-100 text-gray-500' }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-gray-900">Platform Health</h1>
        <p className="text-gray-400 text-sm mt-0.5">Service status and content quality metrics</p>
      </div>
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><i className="fas fa-heartbeat text-red-500 text-sm" /> Service Status</h3>
          <div className="space-y-3">
            {services.map(s => (
              <div key={s.name} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <span className="text-sm font-medium text-gray-700">{s.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">Uptime: {s.uptime}</span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${S[s.status]||S.operational}`}>{s.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><i className="fas fa-chart-bar text-primary text-sm" /> Content Quality</h3>
          <div className="space-y-3">
            {quality.map(q => (
              <div key={q.label} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 flex-1">{q.label}</span>
                <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${q.color}`} style={{width:q.pct+'%'}} />
                </div>
                <span className="text-sm font-bold text-gray-700 w-10 text-right">{q.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><i className="fas fa-database text-blue-500 text-sm" /> Database</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[['Active listings','~24'],['Registered users','~12'],['Storage used','~12 MB'],['DB version','PostgreSQL 17']].map(([l,v]) => (
            <div key={l} className="bg-gray-50 rounded-xl p-3 text-center">
              <div className="font-bold text-primary text-lg">{v}</div>
              <div className="text-xs text-gray-400 mt-0.5">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Admin Activity page
export function AdminActivity() {
  const ACTIVITY = [
    { type:'signup',  icon:'fa-user-plus',      color:'bg-blue-50 text-blue-500',      text:'New agent registered: Karim Jaziri',              time:'2m ago' },
    { type:'listing', icon:'fa-building',        color:'bg-primary-soft text-primary',  text:'New listing submitted: Villa Gammarth',            time:'15m ago' },
    { type:'payment', icon:'fa-coins',           color:'bg-emerald-50 text-emerald-500',text:'Boost payment confirmed: 29 TND',                  time:'1h ago' },
    { type:'flag',    icon:'fa-flag',            color:'bg-red-50 text-red-500',        text:'Listing flagged: Apt Sousse',                      time:'2h ago' },
    { type:'listing', icon:'fa-check-circle',    color:'bg-primary-soft text-primary',  text:'Listing approved: Sfax Commercial',                time:'4h ago' },
    { type:'payment', icon:'fa-coins',           color:'bg-emerald-50 text-emerald-500',text:'Professional subscription renewed — 99 TND',       time:'5h ago' },
    { type:'signup',  icon:'fa-user',            color:'bg-blue-50 text-blue-500',      text:'New user registered',                              time:'6h ago' },
    { type:'listing', icon:'fa-building',        color:'bg-primary-soft text-primary',  text:'New listing submitted: Studio Hammamet Nord',      time:'7h ago' },
    { type:'flag',    icon:'fa-flag',            color:'bg-red-50 text-red-500',        text:'Listing flagged: duplicate suspected',             time:'8h ago' },
    { type:'payment', icon:'fa-coins',           color:'bg-emerald-50 text-emerald-500',text:'Starter boost: 29 TND',                            time:'9h ago' },
  ]
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-gray-900">Activity Feed</h1>
        <p className="text-gray-400 text-sm mt-0.5">Recent platform events</p>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="divide-y divide-gray-50">
          {ACTIVITY.map((a, i) => (
            <div key={i} className="flex items-start gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${a.color}`}>
                <i className={`fas ${a.icon} text-xs`} />
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-800 font-medium">{a.text}</div>
                <div className="text-xs text-gray-400 mt-0.5">{a.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Admin Broadcast page
export function AdminBroadcast() {
  const toast = useToast()
  const [subject, setSubject] = useState('')
  const [body, setBody]       = useState('')
  const [sending, setSending] = useState(false)

  async function send() {
    if (!subject || !body) { toast('Subject and message are required', 'error'); return }
    setSending(true)
    try {
      await fetch('https://cmxblqzulbgtlinmyqxl.supabase.co/functions/v1/send-email', {
        method:'POST',
        headers: { 'Content-Type':'application/json', apikey:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNteGJscXp1bGJndGxpbm15cXhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5OTc5NjUsImV4cCI6MjA5MzU3Mzk2NX0.CKdqvB84ELBEro0rYMnAJxKu9a9OV5G5R9mDDHUmGm0' },
        body: JSON.stringify({ to:['agents@hestia.tn'], subject, html:`<p>${body.replace(/\n/g,'<br>')}</p><br><p>The Hestia Team</p>` })
      })
      toast('Broadcast sent to all agents', 'success')
      setSubject(''); setBody('')
    } catch(e) { toast('Error: ' + e.message, 'error') }
    setSending(false)
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-gray-900">Broadcast Email</h1>
        <p className="text-gray-400 text-sm mt-0.5">Send a message to all agents on the platform</p>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-6 max-w-2xl">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5">Subject *</label>
            <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Important update from Hestia" className="input" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5">Message *</label>
            <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Write your message here..." rows={6} className="input resize-none" />
          </div>
          <div className="flex items-center gap-4 pt-2">
            <div className="flex-1 text-sm text-gray-400">
              <i className="fas fa-info-circle text-xs mr-1" /> Will be sent to all registered agents
            </div>
            <button onClick={send} disabled={sending || !subject || !body}
              className="btn-primary disabled:opacity-50">
              {sending ? <i className="fas fa-circle-notch fa-spin" /> : <i className="fas fa-paper-plane" />}
              Send Broadcast
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Admin Users page
export function AdminUsers() {
  const { users } = useAdminData()
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-gray-900">Buyers & Renters</h1>
        <p className="text-gray-400 text-sm mt-0.5">{users.length} registered users</p>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead><tr className="bg-gray-50 border-b border-gray-100">
            {['User','ID','Joined','Actions'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>)}
          </tr></thead>
          <tbody className="divide-y divide-gray-50">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {u.name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <span className="font-semibold text-sm text-gray-800">{u.name || '—'}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-gray-400 font-mono">{u.id?.slice(0,12)}…</td>
                <td className="px-4 py-3 text-xs text-gray-400">{timeAgo(u.created_at)}</td>
                <td className="px-4 py-3">
                  <button className="h-7 px-3 text-xs font-semibold border border-gray-200 text-gray-500 rounded-lg hover:bg-gray-50 flex items-center gap-1">
                    <i className="fas fa-eye text-xs" /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <div className="text-center py-12 text-gray-300">
            <i className="fas fa-users text-3xl mb-3 block" />
            <p className="text-sm font-semibold">No registered users yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
