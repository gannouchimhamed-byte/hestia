import { useState } from 'react'
import { useAgentData } from '../../hooks/useAgentData'
import { sb } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'

export default function AgentListings() {
  const { listings, setListings } = useAgentData()
  const { user } = useAuth()
  const toast = useToast()
  const [filter, setFilter]   = useState('all')
  const [search, setSearch]   = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [showCSV, setShowCSV] = useState(false)
  const [csvRows, setCsvRows] = useState([])
  const [form, setForm]       = useState({ title:'', price:'', type:'sale', city:'', beds:'', baths:'', area:'' })

  const filtered = listings.filter(l => {
    const matchF = filter === 'all' || l.status === filter || l.type === filter
    const matchS = !search || l.title.toLowerCase().includes(search.toLowerCase()) || l.city.toLowerCase().includes(search.toLowerCase())
    return matchF && matchS
  })

  async function handleAdd(e) {
    e.preventDefault()
    const row = {
      id: 'local-' + Date.now(),
      title: form.title, price: parseFloat(form.price) || 0,
      type: form.type, city: form.city,
      beds: parseInt(form.beds)||0, baths: parseInt(form.baths)||0,
      area: parseInt(form.area)||0, status:'active', views:0, inquiries:0,
      img:'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=70'
    }
    if (user) {
      await sb.from('Property').insert({
        id: crypto.randomUUID(), title: row.title, price: row.price,
        listingType: form.type.toUpperCase(), city: row.city,
        bedrooms: row.beds, bathrooms: row.baths, area: row.area,
        status:'ACTIVE', agentId: user.id,
        images:[], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
      })
    }
    setListings(prev => [row, ...prev])
    setShowAdd(false)
    setForm({ title:'', price:'', type:'sale', city:'', beds:'', baths:'', area:'' })
    toast('Listing added successfully', 'success')
  }

  function handleCSVUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const lines = ev.target.result.trim().split('\n')
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
      const rows = lines.slice(1).map(l => {
        const vals = l.split(',').map(v => v.trim())
        const obj = {}
        headers.forEach((h,i) => obj[h] = vals[i]||'')
        return obj
      }).filter(r => r.title)
      setCsvRows(rows)
    }
    reader.readAsText(file)
  }

  async function importCSV() {
    const newListings = csvRows.map(r => ({
      id:'csv-'+Date.now()+Math.random(), title:r.title, price:parseFloat(r.price)||0,
      type:(r.type||'sale').toLowerCase(), city:r.city||'',
      beds:parseInt(r.bedrooms||r.beds)||0, baths:parseInt(r.bathrooms||r.baths)||0,
      area:parseInt(r.area)||0, status:'active', views:0, inquiries:0,
      img:'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=70'
    }))
    setListings(prev => [...newListings, ...prev])
    setShowCSV(false); setCsvRows([])
    toast(`${newListings.length} listings imported`, 'success')
  }

  function downloadTemplate() {
    const blob = new Blob(['title,price,type,city,bedrooms,bathrooms,area\nVilla Example,450000,sale,Tunis,4,3,200\n'], {type:'text/csv'})
    const a = document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='hestia_template.csv'; a.click()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">My Listings</h1>
          <p className="text-gray-400 text-sm mt-0.5">{listings.length} total properties</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowCSV(true)} className="btn-ghost text-sm">
            <i className="fas fa-file-csv" /> Import CSV
          </button>
          <button onClick={() => setShowAdd(true)} className="btn-primary">
            <i className="fas fa-plus" /> Add Listing
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="relative">
          <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search listings..."
            className="pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-primary bg-white w-48" />
        </div>
        <div className="flex gap-1.5">
          {[['all','All'],['active','Active'],['paused','Paused'],['sale','For Sale'],['rent','For Rent']].map(([v,l]) => (
            <button key={v} onClick={() => setFilter(v)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all ${filter===v?'bg-primary text-white border-primary':'border-gray-200 text-gray-500 hover:border-primary hover:text-primary'}`}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(l => (
          <div key={l.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all group">
            <div className="relative">
              <img src={l.img} alt={l.title} className="w-full h-40 object-cover" />
              <div className="absolute top-2 left-2 flex gap-1.5">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${l.type==='sale'?'bg-primary text-white':'bg-accent text-gray-900'}`}>
                  {l.type==='sale'?'For Sale':'For Rent'}
                </span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${l.status==='active'?'bg-emerald-500 text-white':'bg-gray-400 text-white'}`}>
                  {l.status}
                </span>
              </div>
            </div>
            <div className="p-4">
              <div className="font-bold text-primary text-base mb-0.5">{l.price.toLocaleString()} {l.type==='rent'?'TND/mo':'TND'}</div>
              <div className="font-semibold text-gray-800 text-sm mb-1 truncate">{l.title}</div>
              <div className="text-xs text-gray-400 flex items-center gap-1 mb-3">
                <i className="fas fa-map-marker-alt text-primary" style={{fontSize:9}} /> {l.city}
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-500 mb-3 pb-3 border-b border-gray-100">
                {l.beds>0 && <span className="flex items-center gap-1"><i className="fas fa-bed text-gray-300 text-xs" />{l.beds}</span>}
                {l.baths>0 && <span className="flex items-center gap-1"><i className="fas fa-bath text-gray-300 text-xs" />{l.baths}</span>}
                <span className="flex items-center gap-1"><i className="fas fa-ruler-combined text-gray-300 text-xs" />{l.area}m²</span>
                <span className="ml-auto flex items-center gap-1"><i className="fas fa-eye text-gray-300 text-xs" />{l.views}</span>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 btn-ghost text-xs py-1.5 justify-center">
                  <i className="fas fa-edit" /> Edit
                </button>
                <button onClick={() => { setListings(prev => prev.map(p => p.id===l.id ? {...p, status:p.status==='active'?'paused':'active'} : p)) }}
                  className="flex-1 btn-ghost text-xs py-1.5 justify-center">
                  <i className={`fas fa-${l.status==='active'?'pause':'play'}`} /> {l.status==='active'?'Pause':'Activate'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowAdd(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Add New Listing</h3>
              <button onClick={() => setShowAdd(false)} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200">
                <i className="fas fa-times text-sm" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="p-5 space-y-3">
              <input required value={form.title} onChange={e => setForm(f => ({...f,title:e.target.value}))} placeholder="Property title *" className="input" />
              <div className="grid grid-cols-2 gap-3">
                <input required type="number" value={form.price} onChange={e => setForm(f => ({...f,price:e.target.value}))} placeholder="Price (TND) *" className="input" />
                <select value={form.type} onChange={e => setForm(f => ({...f,type:e.target.value}))} className="input">
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                </select>
              </div>
              <input required value={form.city} onChange={e => setForm(f => ({...f,city:e.target.value}))} placeholder="City *" className="input" />
              <div className="grid grid-cols-3 gap-3">
                <input type="number" value={form.beds} onChange={e => setForm(f => ({...f,beds:e.target.value}))} placeholder="Beds" className="input" />
                <input type="number" value={form.baths} onChange={e => setForm(f => ({...f,baths:e.target.value}))} placeholder="Baths" className="input" />
                <input type="number" value={form.area} onChange={e => setForm(f => ({...f,area:e.target.value}))} placeholder="Area m²" className="input" />
              </div>
              <div className="flex gap-2 pt-1">
                <button type="button" onClick={() => setShowAdd(false)} className="btn-ghost flex-1 justify-center">Cancel</button>
                <button type="submit" className="btn-primary flex-1 justify-center"><i className="fas fa-plus" /> Add Listing</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV Modal */}
      {showCSV && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowCSV(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Import CSV</h3>
              <button onClick={() => setShowCSV(false)} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400"><i className="fas fa-times text-sm" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">Columns: title, price, type, city, bedrooms, bathrooms, area</p>
                <button onClick={downloadTemplate} className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
                  <i className="fas fa-download text-xs" /> Template
                </button>
              </div>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-6 cursor-pointer hover:border-primary hover:bg-primary-soft/30 transition-all">
                <i className="fas fa-cloud-upload-alt text-2xl text-gray-300 mb-2" />
                <span className="text-sm font-medium text-gray-500">Click to select CSV file</span>
                <input type="file" accept=".csv" onChange={handleCSVUpload} className="hidden" />
              </label>
              {csvRows.length > 0 && (
                <div>
                  <div className="text-sm font-semibold text-gray-700 mb-2">{csvRows.length} listings found — preview:</div>
                  <div className="overflow-x-auto border border-gray-100 rounded-xl max-h-40">
                    <table className="w-full text-xs">
                      <thead><tr className="bg-gray-50">{Object.keys(csvRows[0]).slice(0,5).map(h => <th key={h} className="px-3 py-2 text-left font-semibold text-gray-400">{h}</th>)}</tr></thead>
                      <tbody>{csvRows.slice(0,3).map((r,i) => <tr key={i} className="border-t border-gray-100">{Object.values(r).slice(0,5).map((v,j) => <td key={j} className="px-3 py-2 text-gray-600">{v}</td>)}</tr>)}</tbody>
                    </table>
                  </div>
                </div>
              )}
              <div className="flex gap-2">
                <button onClick={() => setShowCSV(false)} className="btn-ghost flex-1 justify-center">Cancel</button>
                <button onClick={importCSV} disabled={!csvRows.length} className="btn-primary flex-1 justify-center disabled:opacity-50">
                  <i className="fas fa-upload" /> Import {csvRows.length > 0 ? csvRows.length + ' listings' : ''}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
