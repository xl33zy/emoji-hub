import { useEffect, useState } from 'react'
import { apiClient } from '../api/client'

interface MoodResponse {
    mood: string
}

interface UseMoodResult {
    mood: string | null
    loading: boolean
    error: string | null
}

export function useMood(slug: string | undefined): UseMoodResult {
    const [mood, setMood] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!slug) return

        const controller = new AbortController()

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoading(true)
        setError(null)

        apiClient
            .get<MoodResponse>(`/api/mood/${slug}`, controller.signal)
            .then((data) => setMood(data.mood))
            .catch((err: unknown) => {
                if (err instanceof DOMException && err.name === 'AbortError') return
                setError(err instanceof Error ? err.message : 'Unknown error')
            })
            .finally(() => {
                if (!controller.signal.aborted) setLoading(false)
            })

        return () => controller.abort()
    }, [slug])

    return { mood, loading, error }
}