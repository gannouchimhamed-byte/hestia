import { createContext, useContext, useEffect, useState } from 'react'
import { sb } from '../lib/supabase'

const AuthCtx = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    sb.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) loadProfile(session.user.id)
      setLoading(false)
    })
    const { data: { subscription } } = sb.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
      if (session?.user) loadProfile(session.user.id)
      else setProfile(null)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function loadProfile(id) {
    const { data } = await sb.from('profiles').select('*').eq('id', id).single()
    setProfile(data)
  }

  async function signIn(email, password) {
    const { error } = await sb.auth.signInWithPassword({ email, password })
    return error
  }

  async function signUp(email, password, name, phone) {
    const { error } = await sb.auth.signUp({ email, password, options: { data: { name, phone, role: 'USER' } } })
    return error
  }

  async function signOut() {
    await sb.auth.signOut()
  }

  async function signInWithGoogle() {
    await sb.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } })
  }

  async function resetPassword(email) {
    const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + '?reset=1' })
    return error
  }

  return (
    <AuthCtx.Provider value={{ user, profile, loading, signIn, signUp, signOut, signInWithGoogle, resetPassword }}>
      {children}
    </AuthCtx.Provider>
  )
}

export const useAuth = () => useContext(AuthCtx)
