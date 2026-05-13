import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import AuthModal from './AuthModal'

export default function Navbar() {
  const { user, profile, signOut } = useAuth()
  const [showAuth, setShowAuth]     = useState(false)
  const [authTab, setAuthTab]       = useState('login')
  const [ddOpen, setDdOpen]         = useState(false)
  const [scrolled, setScrolled]     = useState(false)
  const ddRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handler = e => { if (ddRef.current && !ddRef.current.contains(e.target)) setDdOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const openAuth = (tab = 'login') => { setAuthTab(tab); setShowAuth(true) }
  const initials = profile?.name ? profile.name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase() : user?.email?.[0]?.toUpperCase() ?? '?'
  const displayName = profile?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'Account'

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

          {/* Brand */}
          <Link to="/" className="flex items-center gap-2 font-display text-2xl text-primary">
            <span className="text-accent">⌂</span>
            <span className={scrolled ? 'text-primary' : 'text-white'}>Hestia</span>
          </Link>

          {/* Nav links (desktop) */}
          <div className="hidden md:flex items-center gap-6">
            {['Properties', 'Cities', 'For Agents', 'About'].map(l => (
              <button key={l} className={`text-sm font-semibold hover:text-accent transition-colors ${scrolled ? 'text-gray-600' : 'text-white/90'}`}
                onClick={() => l === 'Properties' ? document.getElementById('properties')?.scrollIntoView({ behavior: 'smooth' }) : null}>
                {l}
              </button>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Language */}
            <button className={`hidden md:flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-lg ${scrolled ? 'text-gray-500 hover:bg-gray-100' : 'text-white/80 hover:bg-white/10'}`}>
              🌐 EN
            </button>

            {user ? (
              <div className="relative" ref={ddRef}>
                <button onClick={() => setDdOpen(d => !d)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all">
                  <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">{initials}</div>
                  <span className={`text-sm font-semibold hidden sm:block ${scrolled ? 'text-gray-700' : 'text-white'}`}>{displayName}</span>
                </button>

                {ddOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100 mb-1">
                      <p className="font-semibold text-sm text-gray-900">{profile?.name || 'User'}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                    {[
                      { label: '❤️  My Favorites', action: () => {} },
                      { label: '📅  My Viewings', action: () => {} },
                      { label: '⚙️  Profile', action: () => {} },
                      ...(profile?.role === 'ADMIN' ? [{ label: '🛡️  Admin Panel', action: () => navigate('/admin') }] : []),
                    ].map(item => (
                      <button key={item.label} onClick={() => { item.action(); setDdOpen(false) }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-gray-700 transition-colors">
                        {item.label}
                      </button>
                    ))}
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button onClick={() => { signOut(); setDdOpen(false) }}
                        className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors">
                        🚪 Sign Out
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

            <Link to="/agent"
              className="hidden md:flex text-sm font-semibold px-4 py-2 rounded-lg border border-white/30 bg-white/10 text-white hover:bg-white hover:text-primary transition-all backdrop-blur-sm"
              style={{ color: scrolled ? '#1a5f4a' : undefined, borderColor: scrolled ? '#1a5f4a' : undefined, backgroundColor: scrolled ? 'transparent' : undefined }}>
              Agent Portal
            </Link>
          </div>
        </div>
      </nav>

      <AuthModal open={showAuth} tab={authTab} onClose={() => setShowAuth(false)} />
    </>
  )
}
