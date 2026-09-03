import { useEffect, useState } from 'react'
import { apiClient } from '../api/client'
import type { Emoji } from '../types/emoji'

const STORAGE_KEY = 'emojihub:specimenOfTheDay'

function readCached(): Emoji | null {
    try {
        const raw = sessionStorage.getItem(STORAGE_KEY)
        return raw ? (JSON.parse(raw) as Emoji) : null
    } catch {
        return null
    }
}

const MIN_SPIN_MS = 500

interface UseRandomEmojiResult {
    emoji: Emoji | null
    loading: boolean
    spinning: boolean
    error: string | null
    reroll: () => void
}

export function useRandomEmoji(): UseRandomEmojiResult {
    const [emoji, setEmoji] = useState<Emoji | null>(readCached)
    const [loading, setLoading] = useState(emoji === null)
    const [spinning, setSpinning] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [requestId, setRequestId] = useState(0)

    useEffect(() => {
        if (requestId === 0 && emoji !== null) return

        const controller = new AbortController()
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoading(true)
        setSpinning(true)
        setError(null)

        const minSpinDelay = new Promise<void>((resolve) => setTimeout(resolve, MIN_SPIN_MS))
        const fetchEmoji = apiClient.get<Emoji>('/api/emojis/random', controller.signal)

        Promise.all([fetchEmoji, minSpinDelay])
            .then(([result]) => {
                setEmoji(result)
                sessionStorage.setItem(STORAGE_KEY, JSON.stringify(result))
            })
            .catch((err: unknown) => {
                if (err instanceof DOMException && err.name === 'AbortError') return
                setError(err instanceof Error ? err.message : 'Unknown error')
            })
            .finally(() => {
                if (!controller.signal.aborted) {
                    setLoading(false)
                    setSpinning(false)
                }
            })
        return () => controller.abort()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [requestId])

    function reroll() {
        setRequestId((id) => id + 1)
    }

    return { emoji, loading, spinning, error, reroll }
}