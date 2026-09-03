import type { Emoji } from './emoji'

export interface MoodMatchResult {
    emoji: Emoji
    reason: string
}

export interface MoodMatchResponse {
    matches: MoodMatchResult[]
}