import { useState, useRef } from 'react'
import { sb } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'
import { uploadPropertyImage } from '../../lib/useProperties'

const AMENITIES_LIST = [
  'Swimming Pool','Garage','Garden','Sea View','Balcony','Terrace',
  'Air Conditioning','Elevator','Security','Smart Home','Fully Furnished',
  'Gym','Storage Room','Solar Panels','Concierge',
]

const EMPTY = {
  title:'',description:'',price:'',listingType:'SALE',propertyType:'APARTMENT',
  city:'',address:'',bedrooms:'',bathrooms:'',area:'',rooms:'',
  condition:'good',furnished:'unfurnished',parking:false,elevator:false,
  whatsapp_phone:'',amenities:[],
}

const STATUS_CLS = {
  ACTIVE:'bg-emerald-100 text-emerald-700',
  PENDING:'bg-amber-100 text-amber-700',
  PAUSED:'bg-gray-100 text-gray-500',
  REJECTED:'bg-red-100 text-red-700',
}

export default function AgentListings() {
  const { user, profile } = useAuth()
  const toast = useToast()
  const [listings, setListings] = useState([])
  const [loading, setLoading]   = useState(false)
  const [loaded, setLoaded]     = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing]   = useState(null)
  const [form, setForm]         = useState(EMPTY)
  const [photos, setPhotos]     = useState([])
  const [floorPlan, setFloorPlan] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving]     = useState(false)
  const [filter, setFilter]     = useState('all')
  const [search, setSearch]     = useState('')

  async function load() {
    if (!user || loading) return
    setLoading(true)
    const { data } = await sb.from('Property').select('*').eq('agentId', user.id).order('createdAt', { ascending: false })
    setListings(data || [])
    setLoaded(true)
    setLoading(false)
  }
  if (!loaded && !loading) load()

  function openNew() { setEditing(null); setForm(EMPTY); setPhotos([]); setFloorPlan(null); setShowForm(true) }
  function openEdit(p) {
    setEditing(p.id)
    setForm({ title:p.title, description:p.description||'', price:p.price, listingType:p.listingType,
      propertyType:p.type||'APARTMENT', city:p.city, address:p.address||'', bedrooms:p.bedrooms||'',
      bathrooms:p.bathrooms||'', area:p.area, rooms:p.rooms||'', condition:p.condition||'good',
      furnished:p.furnished||'unfurnished', parking:p.parking||false, elevator:p.elevator||false,
      whatsapp_phone:p.whatsapp_phone||'', amenities:p.amenities||[] })
    setPhotos(p.images||[])
    setFloorPlan(p.floor_plan_url||null)
    setShowForm(true)
  }

  async function save() {
    if (!form.title || !form.price || !form.city) { toast('Title, price and city are required','error'); return }
    setSaving(true)
    // Upload new photo files
    setUploading(true)
    const imageUrls = []
    for (const img of photos) {
      if (typeof img === 'string') { imageUrls.push(img); continue }
      try { imageUrls.push(await uploadPropertyImage(img, user.id, 'property-images')) }
      catch(e) { toast('Photo upload failed','error') }
    }
    let fpUrl = typeof floorPlan === 'string' ? floorPlan : null
    if (floorPlan && typeof floorPlan !== 'string') {
      try { fpUrl = await uploadPropertyImage(floorPlan, user.id, 'property-docs') }
      catch(e) { toast('Floor plan upload failed','warning') }
    }
    setUploading(false)
    const payload = {
      title:form.title, description:form.description||'', price:parseFloat(form.price)||0,
      listingType:form.listingType, type:form.propertyType, city:form.city,
      address:form.address||form.city, bedrooms:parseInt(form.bedrooms)||0,
      bathrooms:parseInt(form.bathrooms)||0, area:parseFloat(form.area)||0,
      rooms:parseInt(form.rooms)||0, condition:form.condition, furnished:form.furnished,
      parking:form.parking, elevator:form.elevator,
      whatsapp_phone:form.whatsapp_phone||profile?.phone||'',
      amenities:form.amenities, images:imageUrls, floor_plan_url:fpUrl,
      agentId:user.id, updatedAt:new Date().toISOString(),
    }
    if (editing) {
      const { error } = await sb.from('Property').update(payload).eq('id', editing)
      if (error) { toast('Save failed: '+error.message,'error'); setSaving(false); return }
      setListings(prev => prev.map(p => p.id===editing ? {...p,...payload} : p))
      toast('Listing updated!','success')
    } else {
      const id = crypto.randomUUID()
      const { error } = await sb.from('Property').insert({...payload, id, status:'PENDING', createdAt:new Date().toISOString()})
      if (error) { toast('Save failed: '+error.message,'error'); setSaving(false); return }
      setListings(prev => [{...payload, id, status:'PENDING', createdAt:new Date().toISOString()}, ...prev])
      toast('Listing submitted for approval!','success')
    }
    setSaving(false); setShowForm(false)
  }

  async function toggleStatus(p) {
    const next = p.status==='ACTIVE' ? 'PAUSED' : 'ACTIVE'
    await sb.from('Property').update({status:next}).eq('id',p.id)
    setListings(prev => prev.map(l => l.id===p.id ? {...l,status:next} : l))
    toast(`Listing ${next.toLowerCase()}`)
  }

  async function del(p) {
    if (!window.confirm(`Delete "${p.title}"? Cannot be undone.`)) return
    await sb.from('Property').delete().eq('id',p.id)
    setListings(prev => prev.filter(l => l.id!==p.id))
    toast('Deleted','warning')
  }

  const toggleAmenity = a => setForm(f => ({...f, amenities: f.amenities.includes(a) ? f.amenities.filter(x=>x!==a) : [...f.amenities,a]}))

  const filtered = listings.filter(l => {
    const mF = filter==='all' || l.status?.toLowerCase()===filter
    const mS = !search || l.title.toLowerCase().includes(search.toLowerCase())
    return mF && mS
  })

  const F = ({label, children}) => (
    <div><label className="block text-xs font-bold text-gray-500 mb-1.5">{label}</label>{children}</div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">My Listings</h1>
          <p className="text-gray-400 text-sm mt-0.5">{listings.length} properties</p>
        </div>
        <button onClick={openNew} className="btn-primary"><i className="fas fa-plus" /> Add Listing</button>
      </div>

      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="relative">
          <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..."
            className="pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-primary bg-white w-44" />
        </div>
        <div className="flex gap-1.5">
          {[['all','All'],['active','Active'],['pending','Pending'],['paused','Paused'],['rejected','Rejected']].map(([v,l])=>(
            <button key={v} onClick={()=>setFilter(v)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all ${filter===v?'bg-primary text-white border-primary':'border-gray-200 text-gray-500 hover:border-primary hover:text-primary'}`}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12"><i className="fas fa-circle-notch fa-spin text-primary text-2xl" /></div>
      ) : filtered.length===0 ? (
        <div className="text-center py-16 text-gray-300">
          <i className="fas fa-building text-5xl mb-4 block" />
          <p className="font-semibold text-gray-500 text-lg mb-2">No listings yet</p>
          <p className="text-sm mb-5 text-gray-400">Add your first property to get started</p>
          <button onClick={openNew} className="btn-primary inline-flex gap-2"><i className="fas fa-plus" /> Add First Listing</button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(l => (
            <div key={l.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all">
              <div className="relative">
                <img src={l.images?.[0]||'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=70'}
                  alt={l.title} className="w-full h-40 object-cover" />
                <div className="absolute top-2 left-2 flex gap-1.5">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${l.listingType==='RENT'?'bg-accent text-gray-900':'bg-primary text-white'}`}>
                    {l.listingType==='RENT'?'For Rent':'For Sale'}
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${STATUS_CLS[l.status]||STATUS_CLS.PENDING}`}>{l.status}</span>
                </div>
                {l.images?.length>1 && (
                  <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
                    <i className="fas fa-images text-xs mr-1" />{l.images.length}
                  </span>
                )}
              </div>
              <div className="p-4">
                <div className="font-bold text-primary mb-0.5">{parseFloat(l.price).toLocaleString()} TND{l.listingType==='RENT'?'/mo':''}</div>
                <div className="font-semibold text-sm text-gray-800 mb-1 truncate">{l.title}</div>
                <div className="text-xs text-gray-400 flex items-center gap-1 mb-3">
                  <i className="fas fa-map-marker-alt text-primary" style={{fontSize:9}} /> {l.city}
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500 pb-3 border-b border-gray-100">
                  {l.bedrooms>0&&<span className="flex items-center gap-1"><i className="fas fa-bed text-gray-300 text-xs" />{l.bedrooms}</span>}
                  {l.bathrooms>0&&<span className="flex items-center gap-1"><i className="fas fa-bath text-gray-300 text-xs" />{l.bathrooms}</span>}
                  <span className="flex items-center gap-1"><i className="fas fa-ruler-combined text-gray-300 text-xs" />{l.area}m²</span>
                  <span className="ml-auto flex items-center gap-1"><i className="fas fa-eye text-gray-300 text-xs" />{l.viewCount||0}</span>
                </div>
                <div className="flex gap-2 pt-3">
                  <button onClick={()=>openEdit(l)} className="flex-1 btn-ghost text-xs py-1.5 justify-center"><i className="fas fa-edit" /> Edit</button>
                  <button onClick={()=>toggleStatus(l)} className="flex-1 btn-ghost text-xs py-1.5 justify-center">
                    <i className={`fas fa-${l.status==='ACTIVE'?'pause':'play'}`} /> {l.status==='ACTIVE'?'Pause':'Activate'}
                  </button>
                  <button onClick={()=>del(l)} className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 text-red-400 hover:bg-red-50 transition-colors">
                    <i className="fas fa-trash text-xs" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 overflow-y-auto">
          <div className="min-h-screen flex items-start justify-center p-4 pt-6 pb-10">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl z-10">
                <h2 className="font-semibold text-gray-900 text-lg">{editing?'Edit Listing':'New Listing'}</h2>
                <button onClick={()=>setShowForm(false)} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400"><i className="fas fa-times text-sm" /></button>
              </div>

              <div className="p-6 space-y-5">

                {/* PHOTOS */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    <i className="fas fa-camera text-primary mr-2" />Photos
                    <span className="text-gray-400 font-normal ml-1 text-xs">— First photo = cover</span>
                  </label>
                  <div
                    className="border-2 border-dashed border-gray-200 rounded-xl p-5 text-center cursor-pointer hover:border-primary hover:bg-primary-soft/20 transition-all"
                    onDrop={e=>{e.preventDefault();Array.from(e.dataTransfer.files).filter(f=>f.type.startsWith('image/')).forEach(f=>setPhotos(p=>[...p,f]))}}
                    onDragOver={e=>e.preventDefault()}
                    onClick={()=>document.getElementById('photoInput').click()}>
                    <i className="fas fa-cloud-upload-alt text-2xl text-gray-300 mb-1 block" />
                    <p className="text-sm font-semibold text-gray-500">Drag & drop or click to add photos</p>
                    <p className="text-xs text-gray-400">JPG, PNG, WEBP — up to 10MB each</p>
                    <input id="photoInput" type="file" accept="image/*" multiple className="hidden"
                      onChange={e=>Array.from(e.target.files).forEach(f=>setPhotos(p=>[...p,f]))} />
                  </div>
                  {photos.length>0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {photos.map((img,i)=>(
                        <div key={i} className="relative w-24 h-20 rounded-xl overflow-hidden border border-gray-200 group flex-shrink-0">
                          <img src={typeof img==='string'?img:URL.createObjectURL(img)} alt="" className="w-full h-full object-cover" />
                          {i===0&&<span className="absolute bottom-0 left-0 right-0 bg-primary text-white text-xs font-bold text-center py-0.5">Cover</span>}
                          {uploading&&typeof img!=='string'&&<div className="absolute inset-0 bg-black/40 flex items-center justify-center"><i className="fas fa-circle-notch fa-spin text-white text-sm" /></div>}
                          <button onClick={e=>{e.stopPropagation();setPhotos(p=>p.filter((_,j)=>j!==i))}}
                            className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs items-center justify-center hidden group-hover:flex">
                            <i className="fas fa-times" style={{fontSize:9}} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* FLOOR PLAN */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    <i className="fas fa-drafting-compass text-primary mr-2" />Floor Plan
                    <span className="text-gray-400 font-normal ml-1 text-xs">— Image or PDF</span>
                  </label>
                  {floorPlan ? (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <span className="flex items-center gap-2 text-sm flex-1">
                        <i className="fas fa-file-image text-primary" />
                        {typeof floorPlan==='string' ? <a href={floorPlan} target="_blank" rel="noreferrer" className="text-primary hover:underline">View floor plan</a> : floorPlan.name}
                      </span>
                      <button onClick={()=>setFloorPlan(null)} className="text-red-400 hover:text-red-600 text-xs font-semibold"><i className="fas fa-times" /> Remove</button>
                    </div>
                  ) : (
                    <label className="flex items-center gap-3 p-3 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-primary hover:bg-primary-soft/20 transition-all">
                      <i className="fas fa-cloud-upload-alt text-gray-300 text-xl" />
                      <div><p className="text-sm font-semibold text-gray-500">Upload floor plan</p><p className="text-xs text-gray-400">JPG, PNG or PDF</p></div>
                      <input type="file" accept="image/*,.pdf" className="hidden" onChange={e=>setFloorPlan(e.target.files[0]||null)} />
                    </label>
                  )}
                </div>

                {/* TITLE + DESCRIPTION */}
                <div className="space-y-3">
                  <F label="Property Title *">
                    <input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))}
                      placeholder="e.g. Modern Villa with Sea View, Gammarth" className="input" />
                  </F>
                  <F label="Description">
                    <textarea value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))}
                      placeholder="Describe the property, neighbourhood, what makes it special..." rows={3} className="input resize-none" />
                  </F>
                </div>

                {/* TYPE + PRICE */}
                <div className="grid grid-cols-2 gap-4">
                  <F label="Listing Type *">
                    <select value={form.listingType} onChange={e=>setForm(f=>({...f,listingType:e.target.value}))} className="input">
                      <option value="SALE">For Sale</option>
                      <option value="RENT">For Rent</option>
                    </select>
                  </F>
                  <F label={`Price (TND) ${form.listingType==='RENT'?'/ month':''} *`}>
                    <input type="number" value={form.price} onChange={e=>setForm(f=>({...f,price:e.target.value}))} placeholder="0" className="input" />
                  </F>
                </div>

                {/* PROPERTY TYPE + CITY */}
                <div className="grid grid-cols-2 gap-4">
                  <F label="Property Type">
                    <select value={form.propertyType} onChange={e=>setForm(f=>({...f,propertyType:e.target.value}))} className="input">
                      {['APARTMENT','VILLA','OFFICE','LAND','COMMERCIAL','STUDIO','PENTHOUSE'].map(t=>(
                        <option key={t} value={t}>{t.charAt(0)+t.slice(1).toLowerCase()}</option>
                      ))}
                    </select>
                  </F>
                  <F label="City *">
                    <select value={form.city} onChange={e=>setForm(f=>({...f,city:e.target.value}))} className="input">
                      <option value="">Select city</option>
                      {['Tunis','Sfax','Sousse','Hammamet','Monastir','Nabeul','Bizerte','Gabès','Ariana','Ben Arous','La Marsa','Carthage','Gammarth','Sidi Bou Saïd','Lac 1','Lac 2'].map(c=>(
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </F>
                </div>

                <F label="Address / Neighbourhood">
                  <input value={form.address} onChange={e=>setForm(f=>({...f,address:e.target.value}))}
                    placeholder="e.g. Avenue Habib Bourguiba, Gammarth Nord" className="input" />
                </F>

                {/* SPECS */}
                <div className="grid grid-cols-4 gap-3">
                  <F label="Beds"><input type="number" min="0" value={form.bedrooms} onChange={e=>setForm(f=>({...f,bedrooms:e.target.value}))} className="input" /></F>
                  <F label="Baths"><input type="number" min="0" value={form.bathrooms} onChange={e=>setForm(f=>({...f,bathrooms:e.target.value}))} className="input" /></F>
                  <F label="Area m² *"><input type="number" min="0" value={form.area} onChange={e=>setForm(f=>({...f,area:e.target.value}))} className="input" /></F>
                  <F label="S+"><input type="number" min="0" max="6" value={form.rooms} onChange={e=>setForm(f=>({...f,rooms:e.target.value}))} placeholder="2" className="input" /></F>
                </div>

                {/* CONDITION + FURNISHED */}
                <div className="grid grid-cols-2 gap-4">
                  <F label="Condition">
                    <select value={form.condition} onChange={e=>setForm(f=>({...f,condition:e.target.value}))} className="input">
                      {[['new','New'],['renovated','Renovated'],['good','Good'],['needs_work','Needs work']].map(([v,l])=><option key={v} value={v}>{l}</option>)}
                    </select>
                  </F>
                  <F label="Furnished">
                    <select value={form.furnished} onChange={e=>setForm(f=>({...f,furnished:e.target.value}))} className="input">
                      {[['furnished','Fully furnished'],['semi','Semi-furnished'],['unfurnished','Unfurnished']].map(([v,l])=><option key={v} value={v}>{l}</option>)}
                    </select>
                  </F>
                </div>

                <div className="flex gap-6">
                  {[['parking','Parking'],['elevator','Elevator']].map(([k,l])=>(
                    <label key={k} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.checked}))} className="w-4 h-4 accent-primary" />
                      <span className="text-sm font-medium text-gray-700">{l}</span>
                    </label>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2">Amenities</label>
                  <div className="flex flex-wrap gap-2">
                    {AMENITIES_LIST.map(a=>(
                      <button key={a} type="button" onClick={()=>toggleAmenity(a)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all ${form.amenities.includes(a)?'bg-primary text-white border-primary':'border-gray-200 text-gray-500 hover:border-primary hover:text-primary'}`}>
                        {a}
                      </button>
                    ))}
                  </div>
                </div>

                <F label="WhatsApp Contact Number">
                  <input value={form.whatsapp_phone} onChange={e=>setForm(f=>({...f,whatsapp_phone:e.target.value}))}
                    placeholder="+216 XX XXX XXX" className="input" />
                  <p className="text-xs text-gray-400 mt-1">Leave blank to use your profile phone</p>
                </F>

                {!editing && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5">
                    <i className="fas fa-info-circle text-amber-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-amber-800">Your listing will be reviewed by our team before going live — usually under 24 hours.</p>
                  </div>
                )}

                <div className="flex gap-3 pt-2 border-t border-gray-100">
                  <button onClick={()=>setShowForm(false)} className="btn-ghost flex-1 justify-center py-3">Cancel</button>
                  <button onClick={save} disabled={saving||uploading} className="btn-primary flex-1 justify-center py-3 disabled:opacity-50">
                    {saving||uploading
                      ? <><i className="fas fa-circle-notch fa-spin" /> {uploading?'Uploading...':'Saving...'}</>
                      : <><i className="fas fa-check" /> {editing?'Save Changes':'Submit Listing'}</>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function F({label,children}){return(<div><label className="block text-xs font-bold text-gray-500 mb-1.5">{label}</label>{children}</div>)}
