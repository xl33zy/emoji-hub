import { Link, useParams } from 'react-router-dom'
import { useEmoji } from '../hooks/useEmoji'
import { useMood } from '../hooks/useMood'
import { useCategories } from '../hooks/useCategories'
import { getCategoryAccent } from '../lib/categoryAccent'

export function EmojiDetailPage() {
    const { slug } = useParams<{ slug: string }>()
    const { emoji, loading, notFound, error } = useEmoji(slug)
    const { mood, loading: moodLoading, error: moodError } = useMood(slug)
    const { categories } = useCategories()

    if (loading) {
        return (
            <div className="mx-auto max-w-[720px] px-4 py-10 sm:px-8">
                <p className="text-ink-soft">Loading…</p>
            </div>
        )
    }

    if (notFound) {
        return (
            <div className="mx-auto max-w-[720px] px-4 py-10 text-center sm:px-8">
                <h1 className="font-display text-2xl text-ink">Emoji not found</h1>
                <p className="mt-2 text-ink-soft">There's no emoji at this address in the catalog.</p>
                <Link
                    to="/catalog"
                    className="mt-6 inline-block rounded-[8px] border border-ink px-5 py-2.5 font-body text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-paper"
                >
                    Back to catalog
                </Link>
            </div>
        )
    }

    if (error || !emoji) {
        return (
            <div className="mx-auto max-w-[720px] px-4 py-10 sm:px-8">
                <p className="text-accent-crimson">Failed to load emoji: {error ?? 'Unknown error'}</p>
            </div>
        )
    }

    const accent = getCategoryAccent(emoji.category, categories)

    return (
        <div className="mx-auto max-w-[720px] px-4 py-10 sm:px-8">
            <article
                style={{ '--card-accent': accent } as React.CSSProperties}
                className="rounded-[10px] border-[1.5px] border-line bg-paper-raised p-8"
            >
                <div className="mb-4 flex items-start justify-between">
                    <span
                        style={{ backgroundColor: accent }}
                        className="rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
                    >
                        {emoji.category}
                    </span>
                    {/* TODO(Срез 4): fav-btn, useFavorites вместо статичной заглушки — тот же паттерн, что в EmojiCard */}
                    <button type="button" aria-label={`Add to favorites: ${emoji.displayName}`} className="p-0.5 text-ink-soft">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
                        </svg>
                    </button>
                </div>

                <div className="mb-4 text-[96px] leading-none">{emoji.emoji}</div>

                <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">{emoji.displayName}</h1>
                <p className="mt-1 text-[13px] text-ink-soft">{emoji.group}</p>

                <div className="mt-4 flex items-center justify-between gap-2 border-t border-line pt-4">
                    <span className="font-mono text-xs tabular-nums text-ink-soft">{emoji.unicode}</span>
                    {/* TODO(Срез 4): copy-to-clipboard, вместе с toast-компонентом */}
                </div>
            </article>

            <section className="mt-6 rounded-[10px] border-[1.5px] border-line bg-paper-raised p-8">
                <h2 className="font-display text-lg font-semibold text-ink">Mood</h2>
                {moodLoading && <p className="mt-2 text-ink-soft">Generating mood description…</p>}
                {moodError && <p className="mt-2 text-accent-crimson">Failed to load mood description: {moodError}</p>}
                {!moodLoading && !moodError && mood && <p className="mt-2 text-ink-soft">{mood}</p>}
            </section>

            <Link to="/catalog" className="mt-6 inline-block text-sm text-ink-soft underline-offset-2 hover:underline">
                ← Back to catalog
            </Link>
        </div>
    )
}