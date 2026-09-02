import { createContext } from 'react'

export interface FavoritesContextValue {
    isFavorite: (slug: string) => boolean
    toggleFavorite: (slug: string) => void
    count: number
}

export const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined)