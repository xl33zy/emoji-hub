import { useEffect, useState } from 'react'
import { apiClient, ApiError } from '../api/client'
import type { Emoji } from '../types/emoji'

interface UseEmojiResult {
    emoji: Emoji | null
    loading: boolean
    notFound: boolean
    error: string | null
}

export function useEmoji(slug: string | undefined): UseEmojiResult {
    const [emoji, setEmoji] = useState<Emoji | null>(null)
    const [loading, setLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!slug) return

        const controller = new AbortController()

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoading(true)
        setNotFound(false)
        setError(null)

        apiClient
            .get<Emoji>(`/api/emojis/${slug}`, controller.signal)
            .then(setEmoji)
            .catch((err: unknown) => {
                if (err instanceof DOMException && err.name === 'AbortError') return
                if (err instanceof ApiError && err.status === 404) {
                    setNotFound(true)
                    return
                }
                setError(err instanceof Error ? err.message : 'Unknown error')
            })
            .finally(() => {
                if (!controller.signal.aborted) setLoading(false)
            })

        return () => controller.abort()
    }, [slug])

    return { emoji, loading, notFound, error }
}