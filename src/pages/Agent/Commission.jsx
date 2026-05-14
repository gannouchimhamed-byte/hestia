import { useState, useMemo } from 'react'
import { useAgentData } from '../../hooks/useAgentData'
import { useAuth } from '../../hooks/useAuth'
import { sb } from '../../lib/supabase'
import { useToast } from '../../hooks/useToast'

export default function AgentCommission() {
  const { commissions, setCommissions, commTarget, setCommTarget } = useAgentData()
  const { user } = useAuth()
  const toast = useToast()
  const [showAdd, setShowAdd] = useState(false)
  const [targetInput, setTargetInput] = useState(commTarget)
  const [calcPrice, setCalcPrice] = useState('')
  const [calcRate, setCalcRate] = useState(2.5)
  const [form, setForm] = useState({ property:'', client:'', price:'', rate:'2.5', type:'sale', date: new Date().toISOString().split('T')[0], notes:'' })

  const paid = useMemo(() => commissions.filter(c => c.status === 'paid'), [commissions])
  const ytd  = useMemo(() => paid.reduce((s,c) => s+c.amount, 0), [paid])
  const avg  = paid.length ? Math.round(ytd / paid.length) : 0
  const month = new Date().toISOString().slice(0,7)
  const monthEarned = paid.filter(c => c.date?.startsWith(month)).reduce((s,c) => s+c.amount, 0)
  const goalPct = commTarget > 0 ? Math.min(100, Math.round(monthEarned / commTarget * 100)) : 0

  const calcResult = calcPrice && calcRate ? Math.round(parseFloat(calcPrice) * parseFloat(calcRate) / 100) : 0

  async function handleAdd(e) {
    e.preventDefault()
    const amount = Math.round(parseFloat(form.price||0) * parseFloat(form.rate||0) / 100)
    const row = { id:'c-'+Date.now(), property:form.property, client:form.client, salePrice:parseFloat(form.price), rate:parseFloat(form.rate), amount, type:form.type, status:'pending', date:form.date, notes:form.notes }
    if (user) {
      await sb.from('commissions').insert({ agent_id:user.id, property_title:form.property, client_name:form.client, sale_price:row.salePrice, commission_rate:row.rate, commission_amount:amount, deal_type:form.type, status:'pending', deal_date:form.date, notes:form.notes })
    }
    setCommissions(prev => [row, ...prev])
    setShowAdd(false)
    setForm({ property:'', client:'', price:'', rate:'2.5', type:'sale', date:new Date().toISOString().split('T')[0], notes:'' })
    toast('Deal recorded — ' + amount.toLocaleString() + ' TND commission', 'success')
  }

  async function saveTarget() {
    setCommTarget(targetInput)
    if (user) await sb.from('commission_targets').upsert({ agent_id:user.id, month, target_tnd:targetInput })
    toast('Target saved — ' + targetInput.toLocaleString() + ' TND')
  }

  function markPaid(id) {
    setCommissions(prev => prev.map(c => c.id===id ? {...c, status:'paid'} : c))
    toast('Marked as paid', 'success')
  }

  function exportCSV() {
    const header = 'Property,Client,Sale Price,Rate %,Commission,Type,Date,Status\n'
    const rows = commissions.map(c => `"${c.property}","${c.client||''}",${c.salePrice},${c.rate},${c.amount},"${c.type}","${c.date}","${c.status}"`).join('\n')
    const blob = new Blob([header+rows], {type:'text/csv'})
    const a = document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='commissions.csv'; a.click()
    toast('Report exported')
  }

  const STATUS_STYLE = { paid:'bg-emerald-100 text-emerald-700', pending:'bg-amber-100 text-amber-700', disputed:'bg-red-100 text-red-700' }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Commission Tracking</h1>
          <p className="text-gray-400 text-sm mt-0.5">Track and manage your deal commissions</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="btn-ghost text-sm"><i className="fas fa-download" /> Export</button>
          <button onClick={() => setShowAdd(true)} className="btn-primary"><i className="fas fa-plus" /> Add Deal</button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label:'YTD Earned', value:ytd.toLocaleString()+' TND', icon:'fa-coins', color:'bg-amber-50 text-amber-500' },
          { label:'Deals Closed', value:paid.length, icon:'fa-handshake', color:'bg-emerald-50 text-emerald-500' },
          { label:'Avg Commission', value:avg.toLocaleString()+' TND', icon:'fa-chart-line', color:'bg-blue-50 text-blue-500' },
          { label:'Monthly Goal', value:goalPct+'%', icon:'fa-bullseye', color:'bg-primary-soft text-primary' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
              <i className={`fas ${s.icon} text-sm`} />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-0.5">{s.value}</div>
            <div className="text-sm text-gray-400">{s.label}</div>
            {s.label==='Monthly Goal' && (
              <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all" style={{width:goalPct+'%'}} />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Monthly target setter */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <i className="fas fa-bullseye text-primary text-sm" /> Monthly Target
          </h3>
          <input type="number" value={targetInput} onChange={e => setTargetInput(parseInt(e.target.value)||0)}
            placeholder="e.g. 5000" className="input mb-3" />
          <button onClick={saveTarget} className="btn-primary w-full justify-center">
            <i className="fas fa-save" /> Save Target
          </button>
          <div className="mt-3 text-xs text-gray-400 text-center">
            {monthEarned.toLocaleString()} / {commTarget.toLocaleString()} TND this month
          </div>
        </div>

        {/* Rate calculator */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <i className="fas fa-calculator text-primary text-sm" /> Commission Calculator
          </h3>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">Sale / Rent Price (TND)</label>
              <input type="number" value={calcPrice} onChange={e => setCalcPrice(e.target.value)} placeholder="e.g. 450,000" className="input" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">Commission Rate (%)</label>
              <input type="number" value={calcRate} onChange={e => setCalcRate(e.target.value)} step="0.1" min="0" max="20" className="input" />
            </div>
          </div>
          <div className="bg-primary-soft rounded-xl p-4 text-center">
            <div className="text-xs text-gray-500 mb-1">Your commission</div>
            <div className="text-3xl font-bold text-primary">{calcResult ? calcResult.toLocaleString() + ' TND' : '—'}</div>
            {calcPrice > 0 && <div className="text-xs text-gray-400 mt-1">{calcRate}% of {parseFloat(calcPrice).toLocaleString()} TND</div>}
          </div>
        </div>
      </div>

      {/* Deal history */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <i className="fas fa-list text-primary text-sm" /> Deal History
          </h3>
          <span className="text-xs text-gray-400">{commissions.length} deals</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Property','Client','Sale Price','Rate','Commission','Date','Status',''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {commissions.map(c => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-semibold text-gray-800 max-w-[160px] truncate">{c.property}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{c.client || '—'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{c.salePrice?.toLocaleString()} TND</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{c.rate}%</td>
                  <td className="px-4 py-3 text-sm font-bold text-primary">{c.amount?.toLocaleString()} TND</td>
                  <td className="px-4 py-3 text-sm text-gray-400 whitespace-nowrap">{c.date}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_STYLE[c.status]||STATUS_STYLE.pending}`}>{c.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    {c.status !== 'paid' && (
                      <button onClick={() => markPaid(c.id)} className="text-xs font-semibold text-emerald-600 hover:underline flex items-center gap-1">
                        <i className="fas fa-check text-xs" /> Mark paid
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add deal modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowAdd(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Record Deal Commission</h3>
              <button onClick={() => setShowAdd(false)} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400"><i className="fas fa-times text-sm" /></button>
            </div>
            <form onSubmit={handleAdd} className="p-5 space-y-3">
              <input required value={form.property} onChange={e => setForm(f=>({...f,property:e.target.value}))} placeholder="Property title *" className="input" />
              <input value={form.client} onChange={e => setForm(f=>({...f,client:e.target.value}))} placeholder="Client name" className="input" />
              <div className="grid grid-cols-2 gap-3">
                <input required type="number" value={form.price} onChange={e => setForm(f=>({...f,price:e.target.value}))} placeholder="Sale price (TND) *" className="input" />
                <input type="number" value={form.rate} onChange={e => setForm(f=>({...f,rate:e.target.value}))} step="0.1" placeholder="Rate %" className="input" />
              </div>
              {form.price && form.rate && (
                <div className="bg-primary-soft rounded-xl p-3 text-center">
                  <div className="text-xs text-gray-500">Commission amount</div>
                  <div className="text-xl font-bold text-primary">{Math.round(parseFloat(form.price)*parseFloat(form.rate)/100).toLocaleString()} TND</div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <select value={form.type} onChange={e => setForm(f=>({...f,type:e.target.value}))} className="input">
                  <option value="sale">Sale</option>
                  <option value="rent">Rental</option>
                </select>
                <input type="date" value={form.date} onChange={e => setForm(f=>({...f,date:e.target.value}))} className="input" />
              </div>
              <textarea value={form.notes} onChange={e => setForm(f=>({...f,notes:e.target.value}))} placeholder="Notes (optional)" rows={2} className="input resize-none" />
              <div className="flex gap-2 pt-1">
                <button type="button" onClick={() => setShowAdd(false)} className="btn-ghost flex-1 justify-center">Cancel</button>
                <button type="submit" className="btn-primary flex-1 justify-center"><i className="fas fa-save" /> Record Deal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
