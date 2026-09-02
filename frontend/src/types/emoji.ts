export interface Emoji {
    slug: string
    name: string
    displayName: string
    category: string
    group: string
    emoji: string
    unicode: string
}

export type SortOption = 'name' | 'category'