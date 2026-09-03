import { Link } from 'react-router-dom'
import type { Emoji } from '../types/emoji'
import { getCategoryAccent } from '../lib/categoryAccent'
import type { DetailOrigin } from '../types/navigation'
import { useFavorites } from '../hooks/useFavorites'
import { useToast } from '../hooks/useToast'
import { CopyButton } from './CopyButton'

interface EmojiCardProps {
    emoji: Emoji
    categories: string[]
    size?: 'default' | 'large'
    from?: DetailOrigin
    reason?: string
}

export function EmojiCard({ emoji, categories, size = 'default', from, reason }: EmojiCardProps) {
    const accent = getCategoryAccent(emoji.category, categories)
    const isLarge = size === 'large'
    const { isFavorite, toggleFavorite } = useFavorites()
    const { showToast } = useToast()
    const favorited = isFavorite(emoji.slug)

    return (
        <article
            style={{ '--card-accent': accent } as React.CSSProperties}
            className={`group flex flex-col rounded-[10px] border-[1.5px] border-line bg-paper-raised transition-all hover:-translate-x-[3px] hover:-translate-y-[3px] hover:border-[var(--card-accent)] hover:shadow-[4px_4px_0_var(--card-accent)] ${isLarge ? 'p-5' : 'p-4'}`}
        >
            <div className="mb-1.5 flex items-center justify-end gap-2">
                <CopyButton
                    value={emoji.emoji}
                    ariaLabel={`Copy emoji: ${emoji.displayName}`}
                    onCopied={() => showToast('Emoji copied')}
                    className="p-0.5 text-ink-soft transition-colors hover:text-ink"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]">
                        <rect x="9" y="9" width="11" height="11" rx="2" />
                        <path d="M5 15V5a2 2 0 0 1 2-2h10" />
                    </svg>
                </CopyButton>
                <button
                    type="button"
                    onClick={() => toggleFavorite(emoji.slug)}
                    aria-pressed={favorited}
                    aria-label={`${favorited ? 'Remove from favorites' : 'Add to favorites'}: ${emoji.displayName}`}
                    className={`p-0.5 transition-colors hover:text-accent-crimson ${favorited ? 'text-accent-crimson' : 'text-ink-soft'}`}
                >
                    <svg
                        viewBox="0 0 24 24"
                        fill={favorited ? 'currentColor' : 'none'}
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-[18px] w-[18px]"
                    >
                        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
                    </svg>
                </button>
            </div>

            <Link
                to={`/emoji/${emoji.slug}`}
                state={from ? { from } : undefined}
                className={`mb-3 block text-left leading-none ${isLarge ? 'text-[72px]' : 'text-[42px]'}`}
            >
                {emoji.emoji}
            </Link>

            <h3 className="mb-2 font-display text-lg font-semibold capitalize tracking-tight text-ink">{emoji.displayName}</h3>

            {reason && <p className="mb-2.5 text-[12.5px] leading-snug text-ink-soft">{reason}</p>}

            <div className="mb-3.5 flex flex-col gap-1">
                <span
                    style={{ backgroundColor: accent }}
                    className="self-start rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
                >
                    {emoji.category}
                </span>
                <span className="text-[12.5px] text-ink-soft">{emoji.group}</span>
            </div>

            <div className="mt-auto flex items-center justify-between gap-2 border-t border-line pt-3">
                <span className="font-mono text-xs tabular-nums text-ink-soft">{emoji.unicode}</span>
                <CopyButton
                    value={emoji.unicode}
                    ariaLabel={`Copy code ${emoji.unicode}`}
                    onCopied={() => showToast('Code copied')}
                    className="inline-flex items-center gap-1 text-[12.5px] text-ink-soft transition-colors hover:text-ink"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                        <rect x="9" y="9" width="11" height="11" rx="2" />
                        <path d="M5 15V5a2 2 0 0 1 2-2h10" />
                    </svg>
                    Code
                </CopyButton>
            </div>
        </article>
    )
}