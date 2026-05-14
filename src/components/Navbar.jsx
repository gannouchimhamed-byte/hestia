import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../hooks/useAuth'
import AuthModal from './AuthModal'

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const { user, profile, signOut } = useAuth()
  const [showAuth, setShowAuth]   = useState(false)
  const [authTab, setAuthTab]     = useState('login')
  const [ddOpen, setDdOpen]       = useState(false)
  const [langOpen, setLangOpen]   = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled]   = useState(false)
  const ddRef   = useRef(null)
  const langRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()

  // Navbar is transparent only on homepage hero
  const isHome = location.pathname === '/'
  const transparent = isHome && !scrolled

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  useEffect(() => {
    const h = e => {
      if (ddRef.current && !ddRef.current.contains(e.target)) setDdOpen(false)
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  // Close mobile menu on navigate
  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  const openAuth = (tab = 'login') => { setAuthTab(tab); setShowAuth(true) }
  const initials = profile?.name
    ? profile.name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()
    : (user?.email?.[0]?.toUpperCase() ?? '?')
  const displayName = profile?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'Account'

  const text  = transparent ? 'text-white/90' : 'text-gray-600'
  const hover = 'hover:text-primary transition-colors'
  const bg    = transparent ? 'bg-transparent' : 'bg-white border-b border-gray-100 shadow-sm'

  const LANGS = [['en','English','EN'],['fr','Français','FR'],['ar','العربية','ع']]

  const NAV_LINKS = [
    { label: t('search.buy'),        path: '/search?deal=sale',       icon: 'fa-home' },
    { label: t('search.rent'),       path: '/search?deal=rent',       icon: 'fa-key' },
    { label: t('home.newProjectsTitle'), path: '/search?type=new',    icon: 'fa-building' },
    { label: t('nav.forAgents'),     path: '/agent',                  icon: 'fa-user-tie', external: true },
  ]

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-16 ${bg}`}>
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center gap-4">

          {/* Logo */}
          <Link to="/" className={`font-display text-xl font-bold flex items-center gap-2 flex-shrink-0 mr-2
            ${transparent ? 'text-white' : 'text-primary'}`}>
            <i className="fas fa-home" style={{color:'#e8b931', fontSize:17}} />
            Hestia
          </Link>

          {/* Nav links — desktop */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(l => (
              l.external
                ? <a key={l.path} href={l.path}
                    className={`px-3 py-2 rounded-lg text-sm font-semibold ${text} ${hover} hover:bg-primary/10 transition-all`}>
                    {l.label}
                  </a>
                : <button key={l.path}
                    onClick={() => navigate(l.path)}
                    className={`px-3 py-2 rounded-lg text-sm font-semibold ${text} ${hover} hover:bg-primary/10 transition-all`}>
                    {l.label}
                  </button>
            ))}
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Right side actions */}
          <div className="flex items-center gap-1.5">

            {/* Saved / Favorites — only when signed in */}
            {user && (
              <button
                title="Saved properties"
                onClick={() => navigate('/account?tab=favorites')}
                className={`hidden sm:flex w-9 h-9 items-center justify-center rounded-lg
                  ${text} hover:bg-primary/10 hover:text-primary transition-all relative`}>
                <i className="far fa-heart text-sm" />
              </button>
            )}

            {/* List property — primary CTA */}
            <button
              onClick={() => { if (!user) { openAuth('register') } else { window.location.href = '/agent' } }}
              className={`hidden sm:flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl transition-all
                ${transparent
                  ? 'bg-white/15 text-white border border-white/30 hover:bg-white hover:text-primary backdrop-blur-sm'
                  : 'bg-primary text-white hover:bg-primary-dark'}`}>
              <i className="fas fa-plus text-xs" />
              {i18n.language === 'ar' ? 'أضف إعلان' : i18n.language === 'fr' ? 'Publier' : 'List Property'}
            </button>

            {/* Auth — user dropdown or sign in */}
            {user ? (
              <div className="relative" ref={ddRef}>
                <button
                  onClick={() => setDdOpen(d => !d)}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border transition-all
                    ${transparent ? 'border-white/30 hover:bg-white/10' : 'border-gray-200 hover:border-primary/50'}`}>
                  <div className="w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {initials}
                  </div>
                  <span className={`text-sm font-semibold hidden sm:block ${transparent ? 'text-white' : 'text-gray-700'}`}>
                    {displayName}
                  </span>
                  <i className={`fas fa-chevron-down text-xs ${transparent ? 'text-white/60' : 'text-gray-400'}`} />
                </button>

                {ddOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                    <div className="px-4 py-2.5 border-b border-gray-100">
                      <p className="font-semibold text-sm text-gray-900">{profile?.name || displayName}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{user.email}</p>
                    </div>
                    <div className="py-1">
                      {[
                        ['fa-heart',         'Saved Properties',  () => navigate('/account?tab=favorites')],
                        ['fa-calendar-check','My Viewings',        () => navigate('/account?tab=viewings')],
                        ['fa-bell',          'My Alerts',          () => navigate('/account?tab=searches')],
                        ['fa-user-cog',      'Profile Settings',   () => navigate('/account?tab=profile')],
                      ].map(([icon, label, action]) => (
                        <button key={label} onClick={() => { action(); setDdOpen(false) }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                          <i className={`fas ${icon} text-gray-400 w-4 text-center`} style={{fontSize:13}} />
                          {label}
                        </button>
                      ))}
                      {profile?.role === 'ADMIN' && (
                        <button onClick={() => { navigate('/admin'); setDdOpen(false) }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                          <i className="fas fa-shield-alt text-gray-400 w-4 text-center" style={{fontSize:13}} />
                          Admin Panel
                        </button>
                      )}
                    </div>
                    <div className="border-t border-gray-100 pt-1">
                      <a href="/agent"
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-primary font-semibold hover:bg-primary-soft transition-colors">
                        <i className="fas fa-user-tie w-4 text-center" style={{fontSize:13}} />
                        Agent Dashboard
                      </a>
                      <button onClick={() => { signOut(); setDdOpen(false) }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                        <i className="fas fa-sign-out-alt w-4 text-center" style={{fontSize:13}} />
                        {i18n.language === 'ar' ? 'تسجيل الخروج' : i18n.language === 'fr' ? 'Se déconnecter' : 'Sign Out'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button onClick={() => openAuth('login')}
                  className={`text-sm font-semibold px-3 py-2 rounded-lg transition-all
                    ${transparent ? 'text-white hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100'}`}>
                  {t('nav.signIn')}
                </button>
                <button onClick={() => openAuth('register')}
                  className={`text-sm font-semibold px-3 py-2 rounded-lg transition-all
                    ${transparent
                      ? 'bg-white/15 text-white border border-white/30 hover:bg-white hover:text-primary backdrop-blur-sm'
                      : 'bg-primary text-white hover:bg-primary-dark'}`}>
                  {t('nav.register')}
                </button>
              </div>
            )}

            {/* Language switcher */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangOpen(l => !l)}
                className={`flex items-center gap-1 text-xs font-bold px-2.5 py-2 rounded-lg transition-all
                  ${transparent ? 'text-white/80 hover:bg-white/10' : 'text-gray-500 hover:bg-gray-100'}`}>
                <i className="fas fa-globe" style={{fontSize:12}} />
                <span>{LANGS.find(l => l[0] === i18n.language)?.[2] || 'EN'}</span>
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 min-w-[130px]">
                  {LANGS.map(([code, label, short]) => (
                    <button key={code}
                      onClick={() => { i18n.changeLanguage(code); setLangOpen(false) }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors
                        ${i18n.language === code ? 'text-primary font-bold bg-primary-soft' : 'text-gray-700 hover:bg-gray-50'}`}>
                      <span className="w-5 text-center font-bold text-xs">{short}</span>
                      <span>{label}</span>
                      {i18n.language === code && <i className="fas fa-check text-primary text-xs ml-auto" style={{fontSize:10}} />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(o => !o)}
              className={`md:hidden w-9 h-9 flex items-center justify-center rounded-lg transition-all
                ${transparent ? 'text-white hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100'}`}>
              <i className={`fas ${mobileOpen ? 'fa-times' : 'fa-bars'}`} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-xl">
            <div className="px-4 py-3 space-y-1">
              {NAV_LINKS.map(l => (
                l.external
                  ? <a key={l.path} href={l.path}
                      className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-primary-soft hover:text-primary transition-all">
                      <i className={`fas ${l.icon} text-primary w-4 text-center`} style={{fontSize:13}} />
                      {l.label}
                    </a>
                  : <button key={l.path}
                      onClick={() => navigate(l.path)}
                      className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-primary-soft hover:text-primary transition-all">
                      <i className={`fas ${l.icon} text-primary w-4 text-center`} style={{fontSize:13}} />
                      {l.label}
                    </button>
              ))}
              <div className="border-t border-gray-100 pt-2 mt-2">
                {user ? (
                  <>
                    <a href="/agent"
                      className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-primary hover:bg-primary-soft transition-all">
                      <i className="fas fa-user-tie w-4 text-center" style={{fontSize:13}} />
                      Agent Dashboard
                    </a>
                    <button onClick={signOut}
                      className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-all">
                      <i className="fas fa-sign-out-alt w-4 text-center" style={{fontSize:13}} />
                      {i18n.language === 'ar' ? 'تسجيل الخروج' : i18n.language === 'fr' ? 'Se déconnecter' : 'Sign Out'}
                    </button>
                  </>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={() => openAuth('login')} className="flex-1 py-2.5 text-sm font-semibold border border-gray-200 rounded-xl text-gray-600 hover:border-primary hover:text-primary transition-all">
                      {t('nav.signIn')}
                    </button>
                    <button onClick={() => openAuth('register')} className="flex-1 py-2.5 text-sm font-semibold bg-primary text-white rounded-xl hover:bg-primary-dark transition-all">
                      {t('nav.register')}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      <AuthModal open={showAuth} tab={authTab} onClose={() => setShowAuth(false)} />
    </>
  )
}
