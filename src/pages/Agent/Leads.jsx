import { useState } from 'react'
import { useAgentData, scoreLeads } from '../../hooks/useAgentData'

const STATUS_COLS = ['new', 'contacted', 'viewing', 'negotiating', 'closed']

const STATUS_STYLE = {
  new:         'bg-blue-100 text-blue-700',
  contacted:   'bg-purple-100 text-purple-700',
  viewing:     'bg-amber-100 text-amber-700',
  negotiating: 'bg-orange-100 text-orange-700',
  closed:      'bg-emerald-100 text-emerald-700',
  lost:        'bg-gray-100 text-gray-500',
}

const PRI_STYLE = {
  high:   'bg-red-50 text-red-600',
  medium: 'bg-amber-50 text-amber-600',
  low:    'bg-gray-50 text-gray-400',
}

export default function AgentLeads() {
  const { leads, setLeads } = useAgentData()
  const [view, setView]         = useState('table') // table | pipeline
  const [search, setSearch]     = useState('')
  const [filterStatus, setFS]   = useState('all')
  const [selected, setSelected] = useState(null)

  const filtered = leads.filter(l => {
    const q = search.toLowerCase()
    const matchQ = !q || `${l.firstName} ${l.lastName} ${l.property}`.toLowerCase().includes(q)
    const matchS = filterStatus === 'all' || l.status === filterStatus
    return matchQ && matchS
  })

  function updateStatus(id, status) {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l))
  }

  const ScoreBadge = ({ lead }) => {
    const { tier } = scoreLeads(lead)
    return (
      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
        tier === 'hot' ? 'bg-red-100 text-red-700' :
        tier === 'warm' ? 'bg-amber-100 text-amber-700' :
        'bg-blue-100 text-blue-700'
      }`}>
        {tier === 'hot' ? '🔥 Hot' : tier === 'warm' ? '✓ Warm' : '❄ Cold'}
      </span>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Leads & CRM</h1>
          <p className="text-gray-400 text-sm mt-0.5">{leads.length} total leads</p>
        </div>
        <div className="flex gap-2">
          <div className="flex rounded-xl overflow-hidden border border-gray-200">
            <button onClick={() => setView('table')} className={`px-4 py-2 text-sm font-semibold flex items-center gap-1.5 transition-all ${view==='table' ? 'bg-primary text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}>
              <i className="fas fa-list text-xs" /> Table
            </button>
            <button onClick={() => setView('pipeline')} className={`px-4 py-2 text-sm font-semibold flex items-center gap-1.5 transition-all border-l border-gray-200 ${view==='pipeline' ? 'bg-primary text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}>
              <i className="fas fa-columns text-xs" /> Pipeline
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search leads..."
            className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-primary bg-white" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {['all',...STATUS_COLS,'lost'].map(s => (
            <button key={s} onClick={() => setFS(s)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all capitalize ${
                filterStatus === s ? 'bg-primary text-white border-primary' : 'border-gray-200 text-gray-500 hover:border-primary hover:text-primary'
              }`}>{s}</button>
          ))}
        </div>
      </div>

      {/* TABLE VIEW */}
      {view === 'table' && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {['Lead','Property','Status','Priority','Score','Last Contact','Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(l => (
                  <tr key={l.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setSelected(l)}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-soft text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">{l.avatar}</div>
                        <div>
                          <div className="font-semibold text-sm text-gray-800">{l.firstName} {l.lastName}</div>
                          <div className="text-xs text-gray-400">{l.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 max-w-[160px] truncate">{l.property}</td>
                    <td className="px-4 py-3">
                      <select value={l.status} onClick={e => e.stopPropagation()}
                        onChange={e => updateStatus(l.id, e.target.value)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border-none outline-none cursor-pointer ${STATUS_STYLE[l.status]}`}>
                        {[...STATUS_COLS,'lost'].map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${PRI_STYLE[l.priority]}`}>{l.priority}</span>
                    </td>
                    <td className="px-4 py-3"><ScoreBadge lead={l} /></td>
                    <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{l.lastContact}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                        <a href={`https://wa.me/${l.phone.replace(/\D/g,'')}?text=${encodeURIComponent(`Hi ${l.firstName}, following up about ${l.property}.`)}`}
                          target="_blank" rel="noreferrer"
                          className="w-7 h-7 rounded-lg bg-[#25d366] text-white flex items-center justify-center hover:bg-[#128c7e] transition-colors">
                          <i className="fab fa-whatsapp text-xs" />
                        </a>
                        <a href={`tel:${l.phone}`}
                          className="w-7 h-7 rounded-lg bg-primary-soft text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                          <i className="fas fa-phone text-xs" />
                        </a>
                        <a href={`mailto:${l.email}`}
                          className="w-7 h-7 rounded-lg bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200 transition-colors">
                          <i className="fas fa-envelope text-xs" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <i className="fas fa-users text-3xl mb-3 block" />
                <p className="font-semibold">No leads found</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PIPELINE VIEW */}
      {view === 'pipeline' && (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {STATUS_COLS.map(col => {
            const colLeads = leads.filter(l => l.status === col)
            return (
              <div key={col} className="flex-shrink-0 w-64">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-gray-700 capitalize">{col}</span>
                  <span className="text-xs bg-gray-100 text-gray-500 font-bold px-2 py-0.5 rounded-full">{colLeads.length}</span>
                </div>
                <div className="space-y-2.5">
                  {colLeads.map(l => (
                    <div key={l.id} className="bg-white rounded-xl border border-gray-100 p-3.5 cursor-pointer hover:shadow-md hover:border-gray-200 transition-all"
                      onClick={() => setSelected(l)}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-7 h-7 rounded-full bg-primary-soft text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">{l.avatar}</div>
                        <div>
                          <div className="text-xs font-bold text-gray-800">{l.firstName} {l.lastName}</div>
                          <ScoreBadge lead={l} />
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 truncate mb-2">{l.property}</div>
                      <div className="flex gap-1">
                        <a href={`https://wa.me/${l.phone.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
                          className="w-6 h-6 rounded-lg bg-[#25d366] text-white flex items-center justify-center text-xs hover:bg-[#128c7e]">
                          <i className="fab fa-whatsapp" />
                        </a>
                        <a href={`tel:${l.phone}`} onClick={e => e.stopPropagation()}
                          className="w-6 h-6 rounded-lg bg-primary-soft text-primary flex items-center justify-center text-xs">
                          <i className="fas fa-phone" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Lead detail panel */}
      {selected && (
        <div className="fixed inset-0 z-50 flex" onClick={() => setSelected(null)}>
          <div className="flex-1 bg-black/40" />
          <div className="w-full max-w-md bg-white shadow-2xl overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Lead Details</h3>
              <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200">
                <i className="fas fa-times text-sm" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary text-white text-lg font-bold flex items-center justify-center">{selected.avatar}</div>
                <div>
                  <div className="font-bold text-gray-900">{selected.firstName} {selected.lastName}</div>
                  <ScoreBadge lead={selected} />
                </div>
              </div>
              {[['Property',selected.property,'fa-building'],['Phone',selected.phone,'fa-phone'],['Email',selected.email,'fa-envelope'],['Source',selected.source,'fa-globe'],['Last Contact',selected.lastContact,'fa-clock']].map(([l,v,ic]) => (
                <div key={l} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <i className={`fas ${ic} text-gray-400 text-xs`} />
                  </div>
                  <div><div className="text-xs text-gray-400">{l}</div><div className="text-sm font-semibold text-gray-800 mt-0.5">{v}</div></div>
                </div>
              ))}
              {selected.notes && (
                <div className="bg-amber-50 rounded-xl p-3">
                  <div className="text-xs text-amber-600 font-semibold mb-1">Notes</div>
                  <div className="text-sm text-amber-800">{selected.notes}</div>
                </div>
              )}
              <div>
                <div className="text-xs text-gray-400 mb-2">Update Status</div>
                <div className="flex flex-wrap gap-2">
                  {[...STATUS_COLS,'lost'].map(s => (
                    <button key={s} onClick={() => { updateStatus(selected.id, s); setSelected(prev => ({...prev, status:s})) }}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all capitalize ${selected.status === s ? STATUS_STYLE[s]+' border-transparent' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <a href={`https://wa.me/${selected.phone.replace(/\D/g,'')}?text=${encodeURIComponent(`Hi ${selected.firstName}, following up about ${selected.property}.`)}`}
                  target="_blank" rel="noreferrer" className="flex-1 btn-primary justify-center py-2.5 text-sm" style={{background:'#25d366'}}>
                  <i className="fab fa-whatsapp" /> WhatsApp
                </a>
                <a href={`tel:${selected.phone}`} className="flex-1 btn-outline justify-center py-2.5 text-sm">
                  <i className="fas fa-phone" /> Call
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
