import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react'
import { apiClient, ApiError } from '../api/client'
import type { MoodMatchResponse, MoodMatchResult } from '../types/moodMatch'
import { MoodMatchContext, type MoodMatchStatus } from './MoodMatchContext'

export function MoodMatchProvider({ children }: { children: ReactNode }) {
    const [text, setText] = useState('')
    const [status, setStatus] = useState<MoodMatchStatus>('idle')
    const [matches, setMatches] = useState<MoodMatchResult[]>([])
    const [query, setQuery] = useState<string | null>(null)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const controllerRef = useRef<AbortController | null>(null)

    const submit = useCallback((submittedText: string) => {
        controllerRef.current?.abort()
        const controller = new AbortController()
        controllerRef.current = controller

        setStatus('loading')
        setErrorMessage(null)
        setQuery(submittedText)

        apiClient
            .post<MoodMatchResponse>('/api/mood-match', { text: submittedText }, controller.signal)
            .then((data) => {
                setMatches(data.matches)
                setStatus('success')
            })
            .catch((err: unknown) => {
                if (err instanceof DOMException && err.name === 'AbortError') return
                if (err instanceof ApiError && err.status === 429) {
                    setStatus('rate-limited')
                    return
                }
                if (err instanceof ApiError && err.status === 503) {
                    setStatus('unavailable')
                    return
                }
                setErrorMessage(err instanceof Error ? err.message : 'Unknown error')
                setStatus('error')
            })
    }, [])

    const value = useMemo(
        () => ({ text, setText, status, matches, query, errorMessage, submit }),
        [text, status, matches, query, errorMessage, submit],
    )

    return <MoodMatchContext.Provider value={value}>{children}</MoodMatchContext.Provider>
}