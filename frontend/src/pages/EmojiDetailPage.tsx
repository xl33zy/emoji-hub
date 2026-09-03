import { useState } from 'react'
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom'
import { useEmoji } from '../hooks/useEmoji'
import { useMood } from '../hooks/useMood'
import { useCategories } from '../hooks/useCategories'
import { useEmojis } from '../hooks/useEmojis'
import { useToast } from '../hooks/useToast'
import { useFavorites } from '../hooks/useFavorites'
import { getCategoryAccent } from '../lib/categoryAccent'
import { CopyButton } from '../components/CopyButton'
import { ThinkingDots } from '../components/ThinkingDots'
import type { DetailOrigin } from '../types/navigation'

const BACK_NAV: Record<DetailOrigin, { label: string; path: string }> = {
    home: { label: 'Back to home', path: '/' },
    catalog: { label: 'Back to catalog', path: '/catalog' },
    favorites: { label: 'Back to favorites', path: '/favorites' },
    'mood-match': { label: 'Back to Mood Match', path: '/mood-match' },
}

export function EmojiDetailPage() {
    const { slug } = useParams<{ slug: string }>()
    const { emoji, loading, notFound, error } = useEmoji(slug)
    const { mood, loading: moodLoading, error: moodError } = useMood(slug)
    const { categories } = useCategories()
    const { emojis: sameCategoryEmojis } = useEmojis({
        category: emoji?.category,
        enabled: Boolean(emoji),
    })
    const { showToast } = useToast()
    const { isFavorite, toggleFavorite } = useFavorites()
    const [popping, setPopping] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()

    const from: DetailOrigin = (location.state as { from?: DetailOrigin } | null)?.from ?? 'catalog'
    const backLabel = BACK_NAV[from].label
    const backFallbackPath = BACK_NAV[from].path

    function handleBack() {
        if (location.key === 'default') {
            navigate(backFallbackPath)
        } else {
            navigate(-1)
        }
    }

    if (loading) {
        return (
            <div className="mx-auto max-w-[1180px] px-4 py-10 sm:px-6 lg:px-8">
                <p className="text-ink-soft">Loading…</p>
            </div>
        )
    }

    if (notFound) {
        return (
            <div className="mx-auto max-w-[1180px] px-4 py-10 text-center sm:px-6 lg:px-8">
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
            <div className="mx-auto max-w-[1180px] px-4 py-10 sm:px-6 lg:px-8">
                <p className="text-accent-crimson">Failed to load emoji: {error ?? 'Unknown error'}</p>
            </div>
        )
    }

    const currentEmoji = emoji

    function handleFavClick() {
        toggleFavorite(currentEmoji.slug)
        setPopping(true)
    }

    const accent = getCategoryAccent(emoji.category, categories)
    const favorited = isFavorite(emoji.slug)
    const related = sameCategoryEmojis.filter((e) => e.slug !== emoji.slug).slice(0, 4)

    return (
        <div className="mx-auto max-w-[1180px] px-4 py-8 sm:px-6 lg:px-8">
            <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-1.5 py-4 text-[13.5px] text-ink-soft transition-colors hover:text-ink"
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                    <path d="M15 18l-6-6 6-6" />
                </svg>
                {backLabel}
            </button>

            <div className="flex flex-wrap gap-8 pb-12 sm:gap-12">
                <div className="mx-auto w-[300px] shrink">
                    <div
                        style={{ '--card-accent': accent } as React.CSSProperties}
                        className="rounded-[10px] border-[1.5px] border-line bg-paper-raised p-8 text-center"
                    >
                        <div className="flex items-center justify-between">
                            <CopyButton
                                value={emoji.emoji}
                                ariaLabel="Copy emoji"
                                onCopied={() => showToast('Emoji copied')}
                                className="p-1 text-ink-soft transition-colors hover:text-ink"
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-[19px] w-[19px]">
                                    <rect x="9" y="9" width="11" height="11" rx="2" />
                                    <path d="M5 15V5a2 2 0 0 1 2-2h10" />
                                </svg>
                            </CopyButton>
                            <button
                                type="button"
                                onClick={handleFavClick}
                                onAnimationEnd={() => setPopping(false)}
                                aria-pressed={favorited}
                                aria-label={`${favorited ? 'Remove from favorites' : 'Add to favorites'}: ${emoji.displayName}`}
                                className={`p-1 transition-colors hover:text-accent-crimson ${popping ? 'motion-safe:animate-fav-pop' : ''} ${favorited ? 'text-accent-crimson' : 'text-ink-soft'}`}
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    fill={favorited ? 'currentColor' : 'none'}
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-[19px] w-[19px]"
                                >
                                    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
                                </svg>
                            </button>
                        </div>

                        <div className="mt-3 mb-4 text-[112px] leading-none">{emoji.emoji}</div>

                        <div className="flex items-center justify-center gap-2 border-t border-line pt-4">
                            <span className="font-mono text-xs tabular-nums text-ink-soft">{emoji.unicode}</span>
                            <CopyButton
                                value={emoji.unicode}
                                ariaLabel="Copy unicode code"
                                onCopied={() => showToast('Code copied')}
                                className="inline-flex items-center gap-1 text-[12.5px] text-ink-soft transition-colors hover:text-ink"
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                                    <rect x="9" y="9" width="11" height="11" rx="2" />
                                    <path d="M5 15V5a2 2 0 0 1 2-2h10" />
                                </svg>
                                Copy code
                            </CopyButton>
                        </div>
                    </div>
                </div>

                <div className="min-w-0 flex-[1_1_380px]">
                    <p className="mb-1 font-mono text-xs text-ink-soft">{emoji.slug}</p>
                    <h1 className="mb-3 font-display text-[clamp(26px,3vw,34px)] font-semibold capitalize tracking-tight text-ink">
                        {emoji.displayName}
                    </h1>
                    <div className="mb-6 flex flex-row items-center gap-2.5">
                        <span
                            style={{ backgroundColor: accent }}
                            className="rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
                        >
                            {emoji.category}
                        </span>
                        <span className="text-[12.5px] text-ink-soft">{emoji.group}</span>
                    </div>

                    <div
                        style={{ borderColor: accent }}
                        className="mb-8 rounded-r-[8px] border-l-[3px] bg-paper p-4"
                    >
                        <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-soft">Mood</p>
                        {moodLoading && (
                            <p className="text-[15px] text-ink-soft">
                                <ThinkingDots label="Generating mood description" />
                            </p>
                        )}
                        {moodError && <p className="text-[15px] text-accent-crimson">Failed to load mood description: {moodError}</p>}
                        {!moodLoading && !moodError && mood && <p className="text-[15px] text-ink">{mood}</p>}
                    </div>

                    <div>
                        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-soft">
                            More from {emoji.category}
                        </h2>
                        {related.length === 0 ? (
                            <p className="text-[13.5px] text-ink-soft">You've found the only cataloged specimen in this category for now.</p>
                        ) : (
                            <div className="flex flex-wrap gap-2.5">
                                {related.map((e) => (
                                    <Link
                                        key={e.slug}
                                        to={`/emoji/${e.slug}`}
                                        state={{ from }}
                                        className="flex items-center gap-2 rounded-full border border-line bg-paper-raised py-1.5 pl-2 pr-3.5 text-[13.5px] text-ink capitalize transition-colors hover:border-ink-soft"
                                    >
                                        <span className="text-xl leading-none">{e.emoji}</span>
                                        {e.displayName}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}