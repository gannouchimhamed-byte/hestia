import { useState, useEffect } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useFavCtx } from '../hooks/FavoritesContext'
import { sb } from '../lib/supabase'
import { properties as ALL } from '../lib/data'
import PropertyCard from '../components/PropertyCard'
import AuthModal from '../components/AuthModal'

const TABS = [
  { id: 'favorites',  icon: 'fa-heart',          label: 'Saved Properties' },
  { id: 'viewings',   icon: 'fa-calendar-check',  label: 'My Viewings'      },
  { id: 'searches',   icon: 'fa-bell',            label: 'Saved Searches'   },
  { id: 'profile',    icon: 'fa-user-cog',        label: 'Profile'          },
]

const STATUS_STYLE = {
  pending:   'bg-amber-100 text-amber-700',
  confirmed: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-700',
}

export default function Account() {
  const navigate = useNavigate()
  const { user, profile, loading, signOut } = useAuth()
  const favCtx = useFavCtx()
  const [urlParams] = useSearchParams()
  const [tab, setTab] = useState(urlParams.get('tab') || 'favorites')
  const [viewings, setViewings] = useState([])
  const [searches, setSearches] = useState([])
  const [showAuth, setShowAuth] = useState(false)
  const [loadingData, setLD]    = useState(false)
  const [profileForm, setPF]    = useState({ name: '', phone: '' })
  const [savingProfile, setSP]  = useState(false)

  useEffect(() => {
    if (!user) return
    setPF({ name: profile?.name || '', phone: profile?.phone || '' })
  }, [user, profile])

  useEffect(() => {
    if (!user) return
    setLD(true)
    Promise.all([
      sb.from('viewings').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      sb.from('saved_searches').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
    ]).then(([v, s]) => {
      if (v.data) setViewings(v.data)
      if (s.data) setSearches(s.data)
      setLD(false)
    })
  }, [user])

  async function cancelViewing(id) {
    await sb.from('viewings').update({ status: 'cancelled' }).eq('id', id)
    setViewings(prev => prev.map(v => v.id === id ? { ...v, status: 'cancelled' } : v))
  }

  async function deleteSearch(id) {
    await sb.from('saved_searches').delete().eq('id', id)
    setSearches(prev => prev.filter(s => s.id !== id))
  }

  async function saveProfile(e) {
    e.preventDefault()
    setSP(true)
    await sb.from('profiles').update({ name: profileForm.name, phone: profileForm.phone }).eq('id', user.id)
    setSP(false)
  }

  // Not logged in
  if (!loading && !user) return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 pt-20">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-sm p-8 text-center">
          <div className="w-14 h-14 bg-primary-soft rounded-2xl flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-user text-primary text-xl" />
          </div>
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-2">My Account</h2>
          <p className="text-gray-400 text-sm mb-6">Sign in to view your saved properties, viewings and alerts.</p>
          <button onClick={() => setShowAuth(true)} className="btn-primary w-full justify-center py-3 mb-3">
            <i className="fas fa-sign-in-alt" /> Sign In
          </button>
          <Link to="/" className="text-sm text-gray-400 hover:text-primary flex items-center gap-1.5 justify-center mt-2">
            <i className="fas fa-arrow-left text-xs" /> Back to listings
          </Link>
        </div>
      </div>
      <AuthModal open={showAuth} tab="login" onClose={() => setShowAuth(false)} />
    </>
  )

  const favProperties = ALL.filter(p => favCtx?.favIds.has(String(p.id)))
  const name = profile?.name || user?.email?.split('@')[0] || 'User'
  const initials = name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary text-white text-xl font-bold flex items-center justify-center flex-shrink-0">
              {initials}
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-gray-900">{name}</h1>
              <p className="text-gray-400 text-sm">{user?.email}</p>
            </div>
            <button onClick={signOut} className="ml-auto text-sm text-red-400 hover:text-red-600 flex items-center gap-1.5 font-semibold">
              <i className="fas fa-sign-out-alt text-xs" /> Sign Out
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-5 overflow-x-auto hide-scrollbar">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl whitespace-nowrap transition-all
                  ${tab === t.id ? 'bg-primary-soft text-primary' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`}>
                <i className={`fas ${t.icon} text-xs`} />
                {t.label}
                {t.id === 'favorites' && favCtx?.favIds.size > 0 && (
                  <span className="bg-primary text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {favCtx.favIds.size}
                  </span>
                )}
                {t.id === 'viewings' && viewings.filter(v => v.status !== 'cancelled').length > 0 && (
                  <span className="bg-amber-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {viewings.filter(v => v.status !== 'cancelled').length}
                  </span>
                )}
                {t.id === 'searches' && searches.length > 0 && (
                  <span className="bg-blue-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {searches.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* SAVED PROPERTIES */}
        {tab === 'favorites' && (
          <>
            {favProperties.length === 0 ? (
              <div className="text-center py-16">
                <i className="far fa-heart text-5xl text-gray-200 mb-4 block" />
                <h3 className="font-display text-xl font-bold text-gray-500 mb-2">No saved properties yet</h3>
                <p className="text-gray-400 text-sm mb-5">Click the heart icon on any property to save it here.</p>
                <Link to="/search" className="btn-primary inline-flex gap-2">
                  <i className="fas fa-search" /> Browse Properties
                </Link>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-400 mb-5">
                  <strong className="text-gray-700">{favProperties.length}</strong> saved {favProperties.length === 1 ? 'property' : 'properties'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {favProperties.map(p => <PropertyCard key={p.id} p={p} view="grid" />)}
                </div>
              </>
            )}
          </>
        )}

        {/* MY VIEWINGS */}
        {tab === 'viewings' && (
          <>
            {loadingData && <div className="text-center py-12"><i className="fas fa-circle-notch fa-spin text-primary text-2xl" /></div>}
            {!loadingData && viewings.length === 0 && (
              <div className="text-center py-16">
                <i className="fas fa-calendar-alt text-5xl text-gray-200 mb-4 block" />
                <h3 className="font-display text-xl font-bold text-gray-500 mb-2">No viewings booked</h3>
                <p className="text-gray-400 text-sm mb-5">Book a viewing on any property page.</p>
                <Link to="/search" className="btn-primary inline-flex gap-2">
                  <i className="fas fa-search" /> Browse Properties
                </Link>
              </div>
            )}
            {!loadingData && viewings.length > 0 && (
              <div className="space-y-4">
                {viewings.map(v => (
                  <div key={v.id} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary-soft rounded-xl flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-calendar-check text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-gray-900 truncate">{v.property_title}</h3>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_STYLE[v.status] || STATUS_STYLE.pending}`}>
                          {v.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-1.5 text-sm text-gray-400 flex-wrap">
                        <span className="flex items-center gap-1">
                          <i className="fas fa-calendar text-xs" />
                          {new Date(v.viewing_date).toLocaleDateString('en-GB', { weekday:'short', day:'numeric', month:'short', year:'numeric' })}
                        </span>
                        <span className="flex items-center gap-1">
                          <i className="fas fa-clock text-xs" /> {v.viewing_time}
                        </span>
                        {v.agent_name && (
                          <span className="flex items-center gap-1">
                            <i className="fas fa-user-tie text-xs" /> {v.agent_name}
                          </span>
                        )}
                      </div>
                    </div>
                    {v.status === 'pending' && (
                      <button onClick={() => cancelViewing(v.id)}
                        className="text-xs font-semibold text-red-400 hover:text-red-600 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-all flex-shrink-0">
                        Cancel
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* SAVED SEARCHES */}
        {tab === 'searches' && (
          <>
            {loadingData && <div className="text-center py-12"><i className="fas fa-circle-notch fa-spin text-primary text-2xl" /></div>}
            {!loadingData && searches.length === 0 && (
              <div className="text-center py-16">
                <i className="fas fa-bell text-5xl text-gray-200 mb-4 block" />
                <h3 className="font-display text-xl font-bold text-gray-500 mb-2">No saved searches</h3>
                <p className="text-gray-400 text-sm mb-5">Save a search from the listings page to get email alerts.</p>
                <Link to="/search" className="btn-primary inline-flex gap-2">
                  <i className="fas fa-search" /> Go to Search
                </Link>
              </div>
            )}
            {!loadingData && searches.length > 0 && (
              <div className="space-y-4">
                {searches.map(s => (
                  <div key={s.id} className="bg-white rounded-2xl border border-gray-100 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{s.name}</h3>
                          <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full capitalize">{s.freq}</span>
                          {s.alert_on && <span className="text-xs bg-primary-soft text-primary font-bold px-2 py-0.5 rounded-full"><i className="fas fa-bell text-xs mr-1" />Active</span>}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {Object.entries(s.filters || {}).map(([k, v]) => (
                            <span key={k} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium capitalize">{v}</span>
                          ))}
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                          Saved {new Date(s.created_at).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })}
                        </p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Link to={'/search?' + new URLSearchParams(s.filters || {}).toString()}
                          className="text-xs font-semibold text-primary border border-primary/30 px-3 py-1.5 rounded-lg hover:bg-primary-soft transition-all">
                          <i className="fas fa-search text-xs mr-1" /> Search
                        </Link>
                        <button onClick={() => deleteSearch(s.id)}
                          className="text-xs font-semibold text-red-400 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-all">
                          <i className="fas fa-trash text-xs" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* PROFILE */}
        {tab === 'profile' && (
          <div className="max-w-md">
            <form onSubmit={saveProfile} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
              <h3 className="font-semibold text-gray-900 mb-2">Personal Information</h3>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Full Name</label>
                <input value={profileForm.name} onChange={e => setPF(f => ({...f, name: e.target.value}))}
                  placeholder="Your full name" className="input" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Email</label>
                <input value={user?.email} disabled className="input bg-gray-50 text-gray-400 cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Phone</label>
                <input value={profileForm.phone} onChange={e => setPF(f => ({...f, phone: e.target.value}))}
                  placeholder="+216 XX XXX XXX" className="input" />
              </div>
              <button type="submit" disabled={savingProfile} className="btn-primary w-full justify-center py-3">
                {savingProfile ? <i className="fas fa-circle-notch fa-spin" /> : <i className="fas fa-save" />}
                Save Changes
              </button>
            </form>

            <div className="mt-4 bg-white rounded-2xl border border-red-100 p-5">
              <h3 className="font-semibold text-gray-800 mb-1 flex items-center gap-2">
                <i className="fas fa-sign-out-alt text-red-400 text-sm" /> Sign Out
              </h3>
              <p className="text-sm text-gray-400 mb-3">You'll be signed out of all devices.</p>
              <button onClick={signOut} className="text-sm font-semibold text-red-500 border border-red-200 px-4 py-2 rounded-xl hover:bg-red-50 transition-all">
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
