import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { FavoritesContext } from './FavoritesContext'

const STORAGE_KEY = 'emojihub:favorites'

function readFavorites(): Set<string> {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return new Set()
        return new Set(JSON.parse(raw) as string[])
    } catch {
        return new Set()
    }
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
    const [favorites, setFavorites] = useState<Set<string>>(readFavorites)

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...favorites]))
    }, [favorites])

    useEffect(() => {
        function handleStorage(event: StorageEvent) {
            if (event.key !== STORAGE_KEY) return
            try {
                setFavorites(new Set(JSON.parse(event.newValue ?? '[]') as string[]))
            } catch {
                //
            }
        }
        window.addEventListener('storage', handleStorage)
        return () => window.removeEventListener('storage', handleStorage)
    }, [])

    const toggleFavorite = useCallback((slug: string) => {
        setFavorites((prev) => {
            const next = new Set(prev)
            if (next.has(slug)) next.delete(slug)
            else next.add(slug)
            return next
        })
    }, [])

    const isFavorite = useCallback((slug: string) => favorites.has(slug), [favorites])

    return (
        <FavoritesContext.Provider value={{ isFavorite, toggleFavorite, count: favorites.size }}>
            {children}
        </FavoritesContext.Provider>
    )
}