const ACCENT_VARS = [
    'var(--color-accent-crimson)',
    'var(--color-accent-teal)',
    'var(--color-accent-ochre)',
    'var(--color-accent-indigo)',
    'var(--color-accent-rose)',
]

export function getCategoryAccent(category: string, categories: string[]): string {
    const index = categories.indexOf(category)
    return ACCENT_VARS[index < 0 ? 0 : index % ACCENT_VARS.length]
}