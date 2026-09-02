import { Link } from 'react-router-dom'
import type { Emoji } from '../types/emoji'
import { getCategoryAccent } from '../lib/categoryAccent'

interface EmojiCardProps {
    emoji: Emoji
    categories: string[]
}

export function EmojiCard({ emoji, categories }: EmojiCardProps) {
    const accent = getCategoryAccent(emoji.category, categories)

    return (
        <article
            style={{ '--card-accent': accent } as React.CSSProperties}
            className="group flex flex-col rounded-[10px] border-[1.5px] border-line bg-paper-raised p-4 transition-all hover:-translate-x-[3px] hover:-translate-y-[3px] hover:border-[var(--card-accent)] hover:shadow-[4px_4px_0_var(--card-accent)]"
        >
            <div className="mb-1.5 flex justify-end">
                {/* TODO(Срез 4): fav-btn, useFavorites вместо статичной заглушки */}
                <button type="button" aria-label={`Add to favorites: ${emoji.name}`} className="p-0.5 text-ink-soft">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]">
                        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
                    </svg>
                </button>
            </div>

            <Link to={`/emoji/${emoji.slug}`} className="mb-3 block text-left text-[42px] leading-none">
                {emoji.emoji}
            </Link>

            <h3 className="mb-2 font-display text-lg font-semibold tracking-tight text-ink">{emoji.name}</h3>

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
                {/* TODO(Срез 4): copy-to-clipboard, вместе с toast-компонентом */}
            </div>
        </article>
    )
}