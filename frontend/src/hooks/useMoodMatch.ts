import { useContext } from 'react'
import { MoodMatchContext } from '../context/MoodMatchContext'

export function useMoodMatch() {
    const ctx = useContext(MoodMatchContext)
    if (!ctx) {
        throw new Error('useMoodMatch must be used within a MoodMatchProvider')
    }
    return ctx
}