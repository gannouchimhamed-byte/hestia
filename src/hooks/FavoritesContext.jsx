import { createContext, useContext } from 'react'
import { useFavorites } from '../hooks/useFavorites'

const FavCtx = createContext(null)

export function FavoritesProvider({ children }) {
  const fav = useFavorites()
  return <FavCtx.Provider value={fav}>{children}</FavCtx.Provider>
}

export const useFavCtx = () => useContext(FavCtx)
