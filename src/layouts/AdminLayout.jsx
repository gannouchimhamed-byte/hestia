import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import AuthModal from '../components/AuthModal'

const NAV = [
  { to:'/admin',            icon:'fa-chart-pie',         label:'Dashboard',        exact:true },
  { to:'/admin/listings',   icon:'fa-building',          label:'Listings',         badge:'pending' },
  { to:'/admin/flags',      icon:'fa-flag',              label:'Flagged Content',  badge:'flags' },
  { to:'/admin/agents',     icon:'fa-user-tie',          label:'Agents'            },
  { to:'/admin/users',      icon:'fa-users',             label:'Buyers & Renters'  },
  { to:'/admin/activity',   icon:'fa-stream',            label:'Activity Feed'     },
  { to:'/admin/health',     icon:'fa-heartbeat',         label:'Platform Health'   },
  { to:'/admin/broadcast',  icon:'fa-envelope-open-text',label:'Broadcast Email'   },
]

export default function AdminLayout() {
  const { user, profile, signOut, loading } = useAuth()
  const [showAuth, setShowAuth] = useState(false)
  const [sideOpen, setSideOpen] = useState(false)
  const navigate = useNavigate()

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <i className="fas fa-circle-notch fa-spin text-primary text-2xl" />
    </div>
  )

  // Not logged in
  if (!user) return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-soft to-white p-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-sm p-8 text-center">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-shield-alt text-red-500 text-xl" />
          </div>
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-1">Admin Panel</h2>
          <p className="text-gray-400 text-sm mb-6">Restricted access — admins only</p>
          <button onClick={() => setShowAuth(true)} className="btn-primary w-full justify-center py-3 mb-3">
            <i className="fas fa-sign-in-alt" /> Sign In
          </button>
          <button onClick={() => navigate('/')} className="text-sm text-gray-400 hover:text-primary flex items-center gap-1.5 mx-auto mt-2">
            <i className="fas fa-arrow-left text-xs" /> Back to listings
          </button>
        </div>
      </div>
      <AuthModal open={showAuth} tab="login" onClose={() => setShowAuth(false)} />
    </>
  )

  // Logged in but not admin
  if (profile && profile.role !== 'ADMIN') return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-sm p-8 text-center">
        <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-ban text-red-500 text-xl" />
        </div>
        <h2 className="font-display text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-400 text-sm mb-6">You do not have admin privileges. Contact support if you believe this is an error.</p>
        <button onClick={() => { signOut(); navigate('/') }} className="btn-primary w-full justify-center">
          <i className="fas fa-sign-out-alt" /> Sign Out
        </button>
      </div>
    </div>
  )

  // Still loading profile — show spinner
  if (!profile) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <i className="fas fa-circle-notch fa-spin text-primary text-2xl" />
    </div>
  )

  const name = profile.name || user.email.split('@')[0]
  const initials = name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-60 bg-white border-r border-gray-100 flex flex-col transition-transform duration-300
        ${sideOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="font-display text-xl text-primary flex items-center gap-2 mb-3">
            <i className="fas fa-shield-alt text-red-500" style={{fontSize:16}} /> Admin
            <span className="ml-auto text-xs font-sans font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">ADMIN</span>
          </div>
          <div className="flex items-center gap-2.5 p-2.5 bg-gray-50 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{initials}</div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-gray-800 truncate">{name}</div>
              <div className="text-xs text-gray-400 truncate">{user.email}</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <div className="space-y-0.5">
            {NAV.map(item => (
              <NavLink key={item.to} to={item.to} end={item.exact}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all
                  ${isActive ? 'bg-primary-soft text-primary' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`
                }
                onClick={() => setSideOpen(false)}>
                <i className={`fas ${item.icon} w-4 text-center`} style={{fontSize:13}} />
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="px-3 py-3 border-t border-gray-100 space-y-1">
          <NavLink to="/" className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-all">
            <i className="fas fa-external-link-alt w-4 text-center" style={{fontSize:12}} /> View Site
          </NavLink>
          <NavLink to="/agent" className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-all">
            <i className="fas fa-user-tie w-4 text-center" style={{fontSize:12}} /> Agent Portal
          </NavLink>
          <button onClick={signOut} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-50 transition-all">
            <i className="fas fa-sign-out-alt w-4 text-center" style={{fontSize:12}} /> Sign Out
          </button>
        </div>
      </aside>

      {sideOpen && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setSideOpen(false)} />}

      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">
        <header className="h-14 bg-white border-b border-gray-100 flex items-center px-4 gap-3 sticky top-0 z-20">
          <button onClick={() => setSideOpen(s => !s)} className="lg:hidden text-gray-400 hover:text-gray-700">
            <i className="fas fa-bars" />
          </button>
          <div className="flex items-center gap-2 px-3 py-1 bg-red-50 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-red-600">Live</span>
          </div>
          <div className="flex-1" />
          <div className="w-8 h-8 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">{initials}</div>
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
