import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import AuthModal from './AuthModal'

export default function Navbar() {
  const { user, profile, signOut } = useAuth()
  const [showAuth, setShowAuth]   = useState(false)
  const [authTab, setAuthTab]     = useState('login')
  const [ddOpen, setDdOpen]       = useState(false)
  const [scrolled, setScrolled]   = useState(false)
  const ddRef  = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  useEffect(() => {
    const h = e => { if (ddRef.current && !ddRef.current.contains(e.target)) setDdOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const openAuth = (tab = 'login') => { setAuthTab(tab); setShowAuth(true) }
  const initials = profile?.name
    ? profile.name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()
    : (user?.email?.[0]?.toUpperCase() ?? '?')
  const displayName = profile?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'Account'

  const textColor = scrolled ? 'text-gray-600' : 'text-white/90'

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-16 flex items-center
        ${scrolled ? 'bg-white shadow-md border-b border-gray-100' : 'bg-transparent'}`}>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">

          <Link to="/" className={`font-display text-2xl font-bold flex items-center gap-2 ${scrolled ? 'text-primary' : 'text-white'}`}>
            <i className="fas fa-home" style={{color: '#e8b931', fontSize: 18}} />
            Hestia
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {['Properties','Cities','For Agents','About'].map(l => (
              <button key={l}
                className={`text-sm font-semibold hover:text-primary transition-colors ${textColor}`}
                onClick={() => l === 'Properties' ? document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth' }) : null}>
                {l}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <div className="relative" ref={ddRef}>
                <button onClick={() => setDdOpen(d => !d)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all
                    ${scrolled ? 'border-gray-200 hover:border-primary' : 'border-white/30 hover:border-white/60'}`}>
                  <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                    {initials}
                  </div>
                  <span className={`text-sm font-semibold hidden sm:block ${scrolled ? 'text-gray-700' : 'text-white'}`}>
                    {displayName}
                  </span>
                  <i className={`fas fa-chevron-down text-xs ${scrolled ? 'text-gray-400' : 'text-white/60'}`} />
                </button>

                {ddOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50">
                    <div className="px-4 py-2 border-b border-gray-100 mb-1">
                      <p className="font-semibold text-sm text-gray-900">{profile?.name || 'User'}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                    <button onClick={() => setDdOpen(false)} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2.5">
                      <i className="fas fa-heart text-gray-400 w-4 text-center" />Favourites
                    </button>
                    <button onClick={() => setDdOpen(false)} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2.5">
                      <i className="fas fa-calendar-check text-gray-400 w-4 text-center" />My Viewings
                    </button>
                    <button onClick={() => setDdOpen(false)} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2.5">
                      <i className="fas fa-user-cog text-gray-400 w-4 text-center" />Profile Settings
                    </button>
                    {profile?.role === 'ADMIN' && (
                      <button onClick={() => { navigate('/admin'); setDdOpen(false) }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2.5">
                        <i className="fas fa-shield-alt text-gray-400 w-4 text-center" />Admin Panel
                      </button>
                    )}
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button onClick={() => { signOut(); setDdOpen(false) }} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2.5">
                        <i className="fas fa-sign-out-alt w-4 text-center" />Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button onClick={() => openAuth('login')}
                  className={`text-sm font-semibold px-4 py-2 rounded-lg transition-all ${scrolled ? 'text-gray-600 hover:bg-gray-100' : 'text-white/90 hover:bg-white/10'}`}>
                  Sign In
                </button>
                <button onClick={() => openAuth('register')}
                  className="text-sm font-semibold px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition-all">
                  Register
                </button>
              </>
            )}
            <a href="/agent"
              className={`hidden md:inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg border transition-all
                ${scrolled
                  ? 'border-primary text-primary hover:bg-primary hover:text-white'
                  : 'border-white/40 text-white hover:bg-white hover:text-primary'}`}>
              <i className="fas fa-user-tie text-xs" /> Agent Portal
            </a>
          </div>
        </div>
      </nav>

      <AuthModal open={showAuth} tab={authTab} onClose={() => setShowAuth(false)} />
    </>
  )
}
