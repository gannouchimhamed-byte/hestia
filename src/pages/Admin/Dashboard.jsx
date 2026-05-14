import { useNavigate } from 'react-router-dom'
import { useAdminData, timeAgo } from '../../hooks/useAdminData'
import { sb } from '../../lib/supabase'
import { useToast } from '../../hooks/useToast'

const ACTIVITY = [
  { type:'signup',  icon:'fa-user-plus',     color:'bg-blue-50 text-blue-500',    text:'New agent registered: Karim Jaziri',              time:'2m ago' },
  { type:'listing', icon:'fa-building',      color:'bg-primary-soft text-primary',text:'New listing submitted: Villa Gammarth',            time:'15m ago' },
  { type:'payment', icon:'fa-coins',         color:'bg-emerald-50 text-emerald-500',text:'Boost payment confirmed: 29 TND',                time:'1h ago' },
  { type:'flag',    icon:'fa-flag',          color:'bg-red-50 text-red-500',      text:'Listing flagged as duplicate: Apt Sousse',         time:'2h ago' },
  { type:'listing', icon:'fa-check-circle',  color:'bg-primary-soft text-primary',text:'Listing approved: Sfax Commercial Building',       time:'4h ago' },
  { type:'payment', icon:'fa-coins',         color:'bg-emerald-50 text-emerald-500',text:'Subscription renewed — Professional plan',       time:'5h ago' },
]

export default function AdminDashboard() {
  const { listings, agents, users, flags, setListings } = useAdminData()
  const navigate = useNavigate()
  const toast = useToast()

  const pending   = listings.filter(l => l.status === 'PENDING')
  const openFlags = flags.filter(f => f.status === 'open')

  async function approveListing(id) {
    await sb.from('Property').update({ status:'ACTIVE' }).eq('id', id)
    setListings(prev => prev.map(l => l.id === id ? {...l, status:'ACTIVE'} : l))
    toast('Listing approved and live', 'success')
  }

  async function rejectListing(id) {
    await sb.from('Property').update({ status:'REJECTED' }).eq('id', id)
    setListings(prev => prev.map(l => l.id === id ? {...l, status:'REJECTED'} : l))
    toast('Listing rejected', 'warning')
  }

  const stats = [
    { icon:'fa-building', color:'bg-primary-soft text-primary', value:listings.length, label:'Total Listings', link:'/admin/listings' },
    { icon:'fa-users',    color:'bg-blue-50 text-blue-500',     value:agents.length + users.length, label:'Registered Users', link:'/admin/agents' },
    { icon:'fa-user-tie', color:'bg-emerald-50 text-emerald-500', value:agents.length, label:'Active Agents', link:'/admin/agents' },
    { icon:'fa-clock',    color:'bg-amber-50 text-amber-500',   value:pending.length, label:'Pending Approval', link:'/admin/listings' },
    { icon:'fa-flag',     color:'bg-red-50 text-red-500',       value:openFlags.length, label:'Open Flags', link:'/admin/flags' },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-gray-900">Platform Dashboard</h1>
        <p className="text-gray-400 text-sm mt-0.5">Overview of Hestia platform activity</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {stats.map(s => (
          <div key={s.label} onClick={() => navigate(s.link)}
            className="bg-white rounded-2xl border border-gray-100 p-4 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
              <i className={`fas ${s.icon} text-sm`} />
            </div>
            <div className="text-2xl font-bold text-gray-900">{s.value}</div>
            <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Pending approvals */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <i className="fas fa-hourglass-half text-amber-500 text-sm" /> Pending Approval
            </h3>
            <button onClick={() => navigate('/admin/listings')} className="text-xs text-primary font-semibold hover:underline">View all</button>
          </div>
          {pending.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-300">
              <i className="fas fa-check-circle text-3xl mb-2" />
              <p className="text-sm">All listings reviewed</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {pending.slice(0,3).map(l => (
                <div key={l.id} className="flex items-center gap-3 px-4 py-3.5">
                  <img src={l.img} alt="" className="w-12 h-10 object-cover rounded-xl flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-gray-800 truncate">{l.title}</div>
                    <div className="text-xs text-gray-400">{l.city} · {l.price?.toLocaleString()} TND · {timeAgo(l.createdAt)}</div>
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    <button onClick={() => approveListing(l.id)} className="w-8 h-8 bg-emerald-500 text-white rounded-xl flex items-center justify-center hover:bg-emerald-600 transition-colors">
                      <i className="fas fa-check text-xs" />
                    </button>
                    <button onClick={() => rejectListing(l.id)} className="w-8 h-8 bg-red-500 text-white rounded-xl flex items-center justify-center hover:bg-red-600 transition-colors">
                      <i className="fas fa-times text-xs" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Activity feed */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <i className="fas fa-stream text-primary text-sm" /> Recent Activity
            </h3>
            <button onClick={() => navigate('/admin/activity')} className="text-xs text-primary font-semibold hover:underline">View all</button>
          </div>
          <div className="divide-y divide-gray-50">
            {ACTIVITY.slice(0,5).map((a, i) => (
              <div key={i} className="flex items-start gap-3 px-4 py-3.5">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${a.color}`}>
                  <i className={`fas ${a.icon} text-xs`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-gray-700">{a.text}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Platform summary */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { title:'Listing Breakdown', items:[['Active',listings.filter(l=>l.status==='ACTIVE').length],['Pending',pending.length],['Total',listings.length]], color:'text-primary' },
          { title:'User Breakdown',   items:[['Agents',agents.length],['Buyers',users.length],['Total',agents.length+users.length]], color:'text-blue-500' },
          { title:'Content Quality',  items:[['With photos','92%'],['Verified agents','61%'],['Response <2h','78%']], color:'text-emerald-500' },
        ].map(card => (
          <div key={card.title} className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-semibold text-sm text-gray-800 mb-3">{card.title}</h3>
            <div className="space-y-2">
              {card.items.map(([k,v]) => (
                <div key={k} className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">{k}</span>
                  <span className={`font-bold ${card.color}`}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
