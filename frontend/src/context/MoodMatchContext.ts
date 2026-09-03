import { createContext } from 'react'
import type { MoodMatchResult } from '../types/moodMatch'

export type MoodMatchStatus = 'idle' | 'loading' | 'success' | 'error' | 'rate-limited'

export interface MoodMatchContextValue {
    text: string
    setText: (text: string) => void
    status: MoodMatchStatus
    matches: MoodMatchResult[]
    query: string | null
    errorMessage: string | null
    submit: (text: string) => void
}

export const MoodMatchContext = createContext<MoodMatchContextValue | null>(null)