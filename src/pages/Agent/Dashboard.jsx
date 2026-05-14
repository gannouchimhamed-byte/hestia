import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useAgentData, scoreLeads, CALENDAR_EVENTS } from '../../hooks/useAgentData'
import MiniChart from './components/MiniChart'

function StatCard({ icon, iconBg, value, label, trend, trendUp }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
          <i className={`fas ${icon} text-sm`} />
        </div>
        {trend && (
          <span className={`text-xs font-bold flex items-center gap-1 ${trendUp ? 'text-emerald-600' : 'text-red-500'}`}>
            <i className={`fas fa-arrow-${trendUp ? 'up' : 'down'} text-xs`} />{trend}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-0.5">{value}</div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  )
}

export default function AgentDashboard() {
  const { user, profile } = useAuth()
  const { leads, listings, commissions } = useAgentData()
  const navigate = useNavigate()

  const today = new Date()
  const todayDay = today.getDate()
  const todayEvents = CALENDAR_EVENTS.filter(e => e.day === todayDay)
  const hotLeads = leads.filter(l => scoreLeads(l).tier === 'hot')

  const ytd = useMemo(() =>
    commissions.filter(c => c.status === 'paid').reduce((s, c) => s + c.amount, 0)
  , [commissions])

  const activeListings = listings.filter(l => l.status === 'active').length
  const totalViews = listings.reduce((s, l) => s + (l.views || 0), 0)
  const name = profile?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'Agent'

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Good morning, {name}</h1>
          <p className="text-gray-400 text-sm mt-0.5">{today.toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}</p>
        </div>
        <button onClick={() => navigate('/agent/listings')} className="btn-primary">
          <i className="fas fa-plus" /> Add Listing
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon="fa-users"         iconBg="bg-blue-50 text-blue-500"    value={leads.length}        label="Total Leads"       trend="12%" trendUp />
        <StatCard icon="fa-building"      iconBg="bg-primary-soft text-primary" value={activeListings}     label="Active Listings"   trend="8%"  trendUp />
        <StatCard icon="fa-coins"         iconBg="bg-amber-50 text-amber-500"  value={ytd.toLocaleString()+' TND'} label="YTD Commission" trend="15%" trendUp />
        <StatCard icon="fa-eye"           iconBg="bg-purple-50 text-purple-500" value={totalViews.toLocaleString()} label="Total Views"  trend="3%"  trendUp />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Hot leads */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <i className="fas fa-fire text-red-500 text-sm" /> Hot Leads
            </h3>
            <button onClick={() => navigate('/agent/leads')} className="text-xs text-primary font-semibold hover:underline">View all</button>
          </div>
          <div className="divide-y divide-gray-50">
            {hotLeads.slice(0,5).map(l => {
              const { tier } = scoreLeads(l)
              return (
                <div key={l.id} onClick={() => navigate('/agent/leads')}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className="w-9 h-9 rounded-full bg-primary-soft text-primary text-sm font-bold flex items-center justify-center flex-shrink-0">
                    {l.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-gray-800">{l.firstName} {l.lastName}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        tier === 'hot'  ? 'bg-red-100 text-red-700' :
                        tier === 'warm' ? 'bg-amber-100 text-amber-700' :
                                          'bg-blue-100 text-blue-700'
                      }`}>{tier === 'hot' ? 'Hot' : tier === 'warm' ? 'Warm' : 'Cold'}</span>
                    </div>
                    <div className="text-xs text-gray-400 truncate">{l.property}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      l.status === 'new' ? 'bg-blue-100 text-blue-700' :
                      l.status === 'contacted' ? 'bg-purple-100 text-purple-700' :
                      l.status === 'viewing' ? 'bg-amber-100 text-amber-700' :
                      l.status === 'negotiating' ? 'bg-orange-100 text-orange-700' :
                      l.status === 'closed' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-gray-100 text-gray-500'
                    }`}>{l.status}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{l.lastContact.split(' ')[0]}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Today's schedule */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <i className="fas fa-calendar-day text-primary text-sm" /> Today
            </h3>
            <button onClick={() => navigate('/agent/calendar')} className="text-xs text-primary font-semibold hover:underline">Calendar</button>
          </div>
          {todayEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-300">
              <i className="fas fa-calendar-check text-3xl mb-2" />
              <p className="text-sm">No events today</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {todayEvents.map((e, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    e.type === 'viewing' ? 'bg-primary' :
                    e.type === 'call'    ? 'bg-blue-500' :
                                          'bg-amber-500'
                  }`} />
                  <div>
                    <div className="text-sm font-semibold text-gray-800">{e.text}</div>
                    <div className="text-xs text-gray-400">{e.time}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Listing performance */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mt-6">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <i className="fas fa-chart-bar text-primary text-sm" /> Listing Performance
          </h3>
          <button onClick={() => navigate('/agent/listings')} className="text-xs text-primary font-semibold hover:underline">Manage listings</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                {['Property','City','Price','Views','Inquiries','Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {listings.slice(0,5).map(l => (
                <tr key={l.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={l.img} alt="" className="w-10 h-8 object-cover rounded-lg flex-shrink-0" />
                      <span className="text-sm font-semibold text-gray-800 truncate max-w-[160px]">{l.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{l.city}</td>
                  <td className="px-4 py-3 text-sm font-bold text-primary">{l.price.toLocaleString()} {l.type === 'rent' ? 'TND/mo' : 'TND'}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{l.views}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{l.inquiries}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      l.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                    }`}>{l.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
