import { useState, useEffect, useCallback } from 'react'
import { sb } from '../lib/supabase'
import { useAuth } from './useAuth'

export function useFavorites() {
  const { user } = useAuth()
  const [favIds, setFavIds] = useState(new Set())
  const [loading, setLoading] = useState(false)

  // Load favorites from Supabase when user logs in
  useEffect(() => {
    if (!user) { setFavIds(new Set()); return }
    setLoading(true)
    sb.from('favorites')
      .select('property_id')
      .eq('user_id', user.id)
      .then(({ data }) => {
        if (data) setFavIds(new Set(data.map(r => r.property_id)))
        setLoading(false)
      })
  }, [user])

  const toggle = useCallback(async (propertyId) => {
    const pid = String(propertyId)
    const isFav = favIds.has(pid)

    // Optimistic update
    setFavIds(prev => {
      const next = new Set(prev)
      isFav ? next.delete(pid) : next.add(pid)
      return next
    })

    if (!user) return // not logged in — just visual toggle

    if (isFav) {
      await sb.from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('property_id', pid)
    } else {
      await sb.from('favorites')
        .insert({ user_id: user.id, property_id: pid })
    }
  }, [user, favIds])

  return { favIds, toggle, loading }
}
