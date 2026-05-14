import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'

export default function AuthModal({ open, tab: initialTab, onClose }) {
  const { t } = useTranslation()
  const { signIn, signUp, resetPassword, signInWithGoogle } = useAuth()
  const toast = useToast()
  const [tab, setTab]         = useState(initialTab || 'login')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState('')
  const [email, setEmail]     = useState('')
  const [password, setPass]   = useState('')
  const [name, setName]       = useState('')
  const [phone, setPhone]     = useState('')
  const [showPwd, setShowPwd] = useState(false)

  useEffect(() => { setTab(initialTab || 'login') }, [initialTab])
  useEffect(() => { setError(''); setSuccess('') }, [tab])
  if (!open) return null

  async function handleLogin(e) {
    e.preventDefault()
    if (!email || !password) { setError(t('auth.email') + ' / ' + t('auth.password')); return }
    setLoading(true); setError('')
    const err = await signIn(email, password)
    setLoading(false)
    if (err) setError(err.message === 'Invalid login credentials' ? 'Incorrect email or password.' : err.message)
    else { toast(t('auth.welcomeBack'), 'success'); onClose() }
  }

  async function handleRegister(e) {
    e.preventDefault()
    if (!name || !email || !password) { setError('Please fill in all required fields.'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    setLoading(true); setError('')
    const err = await signUp(email, password, name, phone)
    setLoading(false)
    if (err) setError(err.message)
    else setSuccess('Account created! Check your email to confirm, then sign in.')
  }

  async function handleReset(e) {
    e.preventDefault()
    if (!email) { setError('Please enter your email.'); return }
    setLoading(true); setError('')
    const err = await resetPassword(email)
    setLoading(false)
    if (err) setError(err.message)
    else setSuccess('Reset link sent! Check your inbox.')
  }

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="p-6 pb-0">
          <div className="flex items-center justify-between mb-1">
            <div className="font-display text-2xl font-bold text-primary flex items-center gap-2">
              <i className="fas fa-home text-accent" style={{fontSize:18}} /> Hestia
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 text-sm">
              <i className="fas fa-times" />
            </button>
          </div>
          <p className="text-sm text-gray-400 mb-4">{t('auth.tagline')}</p>
          {tab !== 'forgot' && (
            <div className="flex bg-gray-100 rounded-xl p-1 mb-4">
              {[['login', t('auth.signIn')], ['register', t('auth.createAccount')]].map(([v, l]) => (
                <button key={v} onClick={() => setTab(v)}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${tab === v ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                  {l}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 pt-2">
          {tab !== 'forgot' && (
            <>
              <button onClick={signInWithGoogle}
                className="w-full flex items-center justify-center gap-3 py-3 border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50 mb-3">
                <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.2l6.7-6.7C35.6 2.2 30.2 0 24 0 14.6 0 6.6 5.4 2.6 13.3l7.8 6.1C12.3 13.1 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4 7.1-10 7.1-17z"/><path fill="#FBBC05" d="M10.4 28.6A14.6 14.6 0 0 1 9.5 24c0-1.6.3-3.2.9-4.6L2.6 13.3A23.9 23.9 0 0 0 0 24c0 3.9.9 7.5 2.6 10.7l7.8-6.1z"/><path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.5-5.8c-2 1.4-4.6 2.2-7.7 2.2-6.3 0-11.7-3.6-13.6-9.2l-7.8 6.1C6.6 42.6 14.6 48 24 48z"/></svg>
                {t('auth.continueGoogle')}
              </button>
              <div className="flex items-center gap-3 text-xs text-gray-300 mb-3">
                <div className="flex-1 h-px bg-gray-200"></div>{t('auth.orContinue')}<div className="flex-1 h-px bg-gray-200"></div>
              </div>
            </>
          )}

          {error   && <div className="mb-3 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">{error}</div>}
          {success && <div className="mb-3 p-3 bg-emerald-50 text-emerald-700 text-sm rounded-xl border border-emerald-100">✓ {success}</div>}

          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-3">
              <input className="input" type="email" placeholder={t('auth.email')} value={email} onChange={e => setEmail(e.target.value)} />
              <div className="relative">
                <input className="input pr-11" type={showPwd ? 'text' : 'password'} placeholder={t('auth.password')} value={password} onChange={e => setPass(e.target.value)} />
                <button type="button" onClick={() => setShowPwd(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <i className={`fas ${showPwd ? 'fa-eye-slash' : 'fa-eye'} text-sm`} />
                </button>
              </div>
              <div className="text-right">
                <button type="button" className="text-xs text-primary font-semibold hover:underline" onClick={() => setTab('forgot')}>
                  {t('auth.forgotPassword')}
                </button>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
                {loading ? <i className="fas fa-circle-notch fa-spin" /> : <i className="fas fa-sign-in-alt" />}
                {t('auth.signIn')}
              </button>
              <p className="text-xs text-center text-gray-400">
                {t('auth.noAccount')}{' '}
                <button type="button" className="text-primary font-semibold hover:underline" onClick={() => setTab('register')}>
                  {t('auth.createFree')}
                </button>
              </p>
            </form>
          )}

          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3">
              <input className="input" type="text"  placeholder={t('auth.fullName') + ' *'} value={name}  onChange={e => setName(e.target.value)} />
              <input className="input" type="email" placeholder={t('auth.email') + ' *'}    value={email} onChange={e => setEmail(e.target.value)} />
              <input className="input" type="tel"   placeholder={t('auth.phone')}            value={phone} onChange={e => setPhone(e.target.value)} />
              <div className="relative">
                <input className="input pr-11" type={showPwd ? 'text' : 'password'} placeholder={t('auth.minPassword')} value={password} onChange={e => setPass(e.target.value)} />
                <button type="button" onClick={() => setShowPwd(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <i className={`fas ${showPwd ? 'fa-eye-slash' : 'fa-eye'} text-sm`} />
                </button>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
                {loading ? <i className="fas fa-circle-notch fa-spin" /> : <i className="fas fa-user-plus" />}
                {t('auth.createAccount')}
              </button>
              <p className="text-xs text-center text-gray-400">
                {t('auth.haveAccount')}{' '}
                <button type="button" className="text-primary font-semibold hover:underline" onClick={() => setTab('login')}>{t('auth.signIn')}</button>
              </p>
            </form>
          )}

          {tab === 'forgot' && (
            <form onSubmit={handleReset} className="space-y-3">
              <p className="text-sm text-gray-500 mb-2">{t('auth.resetDesc')}</p>
              <input className="input" type="email" placeholder={t('auth.email')} value={email} onChange={e => setEmail(e.target.value)} />
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
                {loading ? <i className="fas fa-circle-notch fa-spin" /> : <i className="fas fa-paper-plane" />}
                {t('auth.sendReset')}
              </button>
              <button type="button" className="w-full text-sm text-primary font-semibold hover:underline" onClick={() => setTab('login')}>
                <i className="fas fa-arrow-left text-xs mr-1" /> {t('auth.backToSignIn')}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
