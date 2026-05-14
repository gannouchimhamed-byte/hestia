import { useState } from 'react'
import { useAdminData, timeAgo } from '../../hooks/useAdminData'
import { sb } from '../../lib/supabase'
import { useToast } from '../../hooks/useToast'

export default function AdminListings() {
  const { listings, setListings } = useAdminData()
  const toast = useToast()
  const [filter, setFilter]   = useState('all')
  const [search, setSearch]   = useState('')
  const [rejectId, setRejectId] = useState(null)
  const [rejectReason, setRR] = useState('Incomplete information')

  const filtered = listings.filter(l => {
    const matchF = filter === 'all' || l.status === filter
    const matchS = !search || l.title.toLowerCase().includes(search.toLowerCase()) || l.city?.toLowerCase().includes(search.toLowerCase())
    return matchF && matchS
  })

  async function approve(id) {
    await sb.from('Property').update({ status:'ACTIVE' }).eq('id', id)
    setListings(prev => prev.map(l => l.id===id ? {...l, status:'ACTIVE'} : l))
    toast('Listing approved and live', 'success')
  }

  async function reject(id) {
    await sb.from('Property').update({ status:'REJECTED' }).eq('id', id)
    setListings(prev => prev.map(l => l.id===id ? {...l, status:'REJECTED'} : l))
    setRejectId(null)
    toast('Listing rejected — reason: ' + rejectReason, 'warning')
  }

  async function pause(id) {
    await sb.from('Property').update({ status:'PAUSED' }).eq('id', id)
    setListings(prev => prev.map(l => l.id===id ? {...l, status:'PAUSED'} : l))
    toast('Listing paused')
  }

  const STATUS_STYLE = { ACTIVE:'bg-emerald-100 text-emerald-700', PENDING:'bg-amber-100 text-amber-700', REJECTED:'bg-red-100 text-red-700', PAUSED:'bg-gray-100 text-gray-500' }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Listings Moderation</h1>
          <p className="text-gray-400 text-sm mt-0.5">{listings.filter(l=>l.status==='PENDING').length} pending approval</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="relative">
          <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search listings..."
            className="pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-primary bg-white w-52" />
        </div>
        <div className="flex gap-1.5">
          {[['all','All'],['PENDING','Pending'],['ACTIVE','Active'],['REJECTED','Rejected'],['PAUSED','Paused']].map(([v,l]) => (
            <button key={v} onClick={() => setFilter(v)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all ${filter===v?'bg-primary text-white border-primary':'border-gray-200 text-gray-500 hover:border-primary hover:text-primary'}`}>
              {l} {v==='PENDING' && <span className="ml-1 bg-amber-400 text-white rounded-full px-1.5">{listings.filter(l=>l.status==='PENDING').length}</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Property','Agent','City','Price','Status','Listed','Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(l => (
                <tr key={l.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={l.img} alt="" className="w-12 h-9 object-cover rounded-lg flex-shrink-0" />
                      <span className="text-sm font-semibold text-gray-800 truncate max-w-[140px]">{l.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{l.agentName}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{l.city}</td>
                  <td className="px-4 py-3 text-sm font-bold text-primary whitespace-nowrap">{l.price?.toLocaleString()} TND</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_STYLE[l.status]||STATUS_STYLE.ACTIVE}`}>{l.status}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{timeAgo(l.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      {l.status === 'PENDING' && (
                        <>
                          <button onClick={() => approve(l.id)} className="h-7 px-3 text-xs font-semibold bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-1">
                            <i className="fas fa-check" /> Approve
                          </button>
                          <button onClick={() => setRejectId(l.id)} className="h-7 px-3 text-xs font-semibold bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-1">
                            <i className="fas fa-times" /> Reject
                          </button>
                        </>
                      )}
                      {l.status === 'ACTIVE' && (
                        <button onClick={() => pause(l.id)} className="h-7 px-3 text-xs font-semibold border border-gray-200 text-gray-500 rounded-lg hover:border-amber-400 hover:text-amber-600 transition-colors flex items-center gap-1">
                          <i className="fas fa-pause" /> Pause
                        </button>
                      )}
                      {(l.status === 'REJECTED' || l.status === 'PAUSED') && (
                        <button onClick={() => approve(l.id)} className="h-7 px-3 text-xs font-semibold border border-gray-200 text-gray-500 rounded-lg hover:border-emerald-400 hover:text-emerald-600 transition-colors flex items-center gap-1">
                          <i className="fas fa-undo" /> Restore
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-300">
              <i className="fas fa-building text-3xl mb-3 block" />
              <p className="text-sm font-semibold">No listings found</p>
            </div>
          )}
        </div>
      </div>

      {/* Reject modal */}
      {rejectId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setRejectId(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-5" onClick={e => e.stopPropagation()}>
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <i className="fas fa-times-circle text-red-500" /> Reject Listing
            </h3>
            <p className="text-sm text-gray-500 mb-3">Provide a reason so the agent can correct and resubmit.</p>
            <select value={rejectReason} onChange={e => setRR(e.target.value)} className="input mb-4">
              {['Incomplete information','Photos too low quality','Incorrect pricing','Duplicate listing','Suspected fraud','Other'].map(r => <option key={r}>{r}</option>)}
            </select>
            <div className="flex gap-2">
              <button onClick={() => setRejectId(null)} className="btn-ghost flex-1 justify-center">Cancel</button>
              <button onClick={() => reject(rejectId)} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
                <i className="fas fa-times-circle" /> Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
