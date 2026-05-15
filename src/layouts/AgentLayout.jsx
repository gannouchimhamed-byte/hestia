import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import AuthModal from '../components/AuthModal'

const NAV = [
  { to:'/agent',              icon:'fa-tachometer-alt',  label:'Dashboard',   exact:true  },
  { to:'/agent/leads',        icon:'fa-users',           label:'Leads & CRM'              },
  { to:'/agent/inquiries',    icon:'fa-inbox',           label:'Enquiries',   badge:'inq' },
  { to:'/agent/messages',     icon:'fa-comment-dots',    label:'Messages',    badge:3     },
  { to:'/agent/calendar',     icon:'fa-calendar-alt',    label:'Calendar'                 },
  { to:'/agent/listings',     icon:'fa-building',        label:'My Listings'              },
  { to:'/agent/commission',   icon:'fa-coins',           label:'Commission'               },
]

export default function AgentLayout() {
  const { user, profile, signOut, loading } = useAuth()
  const [showAuth, setShowAuth] = useState(false)
  const [sideOpen, setSideOpen] = useState(false)
  const navigate = useNavigate()

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <i className="fas fa-circle-notch fa-spin text-primary text-2xl" />
    </div>
  )

  if (!user) return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-soft to-white p-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-sm p-8 text-center">
          <div className="w-14 h-14 bg-primary-soft rounded-2xl flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-user-tie text-primary text-xl" />
          </div>
          <h2 className="font-display text-2xl font-bold text-primary mb-1">Agent Portal</h2>
          <p className="text-gray-400 text-sm mb-6">Sign in to manage your listings, leads and commissions</p>
          <button onClick={() => setShowAuth(true)} className="btn-primary w-full justify-center py-3 mb-3">
            <i className="fas fa-sign-in-alt" /> Sign In
          </button>
          <button onClick={() => { setShowAuth(true) }} className="btn-ghost w-full justify-center py-2.5 text-sm">
            <i className="fas fa-user-plus" /> Create Agent Account
          </button>
          <div className="border-t border-gray-100 mt-4 pt-4">
            <button onClick={() => navigate('/')} className="text-sm text-gray-400 hover:text-primary flex items-center gap-1.5 mx-auto">
              <i className="fas fa-arrow-left text-xs" /> Back to listings
            </button>
          </div>
        </div>
      </div>
      <AuthModal open={showAuth} tab="login" onClose={() => setShowAuth(false)} />
    </>
  )

  const name = profile?.name || user.email.split('@')[0]
  const initials = name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-60 bg-white border-r border-gray-100 flex flex-col transition-transform duration-300
        ${sideOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>

        {/* Brand */}
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="font-display text-xl text-primary flex items-center gap-2 mb-3">
            <i className="fas fa-home text-accent" style={{fontSize:16}} /> Hestia
            <span className="ml-auto text-xs font-sans font-bold text-primary bg-primary-soft px-2 py-0.5 rounded-full">Agent</span>
          </div>
          {/* Agent profile */}
          <div className="flex items-center gap-2.5 p-2.5 bg-gray-50 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-gray-800 truncate">{name}</div>
              <div className="text-xs text-gray-400 truncate">{user.email}</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <div className="space-y-0.5">
            {NAV.map(item => (
              <NavLink key={item.to} to={item.to} end={item.exact}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all
                  ${isActive ? 'bg-primary-soft text-primary' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`
                }
                onClick={() => setSideOpen(false)}>
                <i className={`fas ${item.icon} w-4 text-center`} style={{fontSize:14}} />
                {item.label}
                {item.badge && (
                  <span className="ml-auto bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="px-3 py-3 border-t border-gray-100 space-y-1">
          <NavLink to="/" className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-all">
            <i className="fas fa-search w-4 text-center" style={{fontSize:13}} /> View Site
          </NavLink>
          <button onClick={signOut} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-50 transition-all">
            <i className="fas fa-sign-out-alt w-4 text-center" style={{fontSize:13}} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Sidebar overlay (mobile) */}
      {sideOpen && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setSideOpen(false)} />}

      {/* Main content */}
      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-gray-100 flex items-center px-4 gap-3 sticky top-0 z-20">
          <button onClick={() => setSideOpen(s => !s)} className="lg:hidden text-gray-400 hover:text-gray-700">
            <i className="fas fa-bars" />
          </button>
          <div className="flex-1" />
          <button
            onClick={() => { /* navigate to messages */ window.location.href = '/agent/messages' }}
            className="relative text-gray-400 hover:text-gray-700 transition-colors">
            <i className="fas fa-bell" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
          </button>
          <div className="w-8 h-8 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center cursor-pointer" onClick={signOut} title="Sign out">
            {initials}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
