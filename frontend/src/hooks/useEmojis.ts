import { useEffect, useState } from 'react'
import { apiClient } from '../api/client'
import type { Emoji, SortOption } from '../types/emoji'

interface UseEmojisParams {
    search?: string
    category?: string
    sort?: SortOption
}

interface UseEmojisResult {
    emojis: Emoji[]
    loading: boolean
    error: string | null
}

export function useEmojis({ search, category, sort }: UseEmojisParams): UseEmojisResult {
    const [emojis, setEmojis] = useState<Emoji[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const controller = new AbortController()

        const params = new URLSearchParams()
        if (search) params.set('search', search)
        if (category) params.set('category', category)
        if (sort) params.set('sort', sort)

        const query = params.toString()
        const path = query ? `/api/emojis?${query}` : '/api/emojis'

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoading(true)
        setError(null)

        apiClient
            .get<Emoji[]>(path, controller.signal)
            .then(setEmojis)
            .catch((err: unknown) => {
                if (err instanceof DOMException && err.name === 'AbortError') return
                setError(err instanceof Error ? err.message : 'Unknown error')
            })
            .finally(() => {
                if (!controller.signal.aborted) setLoading(false)
            })

        return () => controller.abort()
    }, [search, category, sort])

    return { emojis, loading, error }
}