import { Link } from 'react-router-dom'
import { useEmojis } from '../hooks/useEmojis'
import { useCategories } from '../hooks/useCategories'
import { useFavorites } from '../hooks/useFavorites'
import { EmojiCard } from '../components/EmojiCard'
import { PageIntro } from '../components/PageIntro'

export function FavoritesPage() {
    const { emojis, loading, error } = useEmojis({})
    const { categories } = useCategories()
    const { isFavorite, count } = useFavorites()

    const favoriteEmojis = emojis.filter((e) => isFavorite(e.slug))

    return (
        <div className="mx-auto max-w-[1180px] px-4 py-10 sm:px-8">
            <PageIntro title="Your favorites">
                Emoji you've pinned for later, kept right here on this device. <span className="font-mono tabular-nums text-ink">{count}</span> saved so far.
            </PageIntro>

            {loading && <p className="text-ink-soft">Loading…</p>}
            {error && <p className="text-accent-crimson">Failed to load emojis: {error}</p>}

            {!loading && !error && favoriteEmojis.length === 0 && (
                <div className="flex flex-col items-center gap-3 rounded-[10px] border border-dashed border-line py-16 text-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-ink-soft">
                        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
                    </svg>
                    <h2 className="font-display text-lg text-ink">No specimens pinned yet</h2>
                    <p className="max-w-[38ch] text-[13.5px] text-ink-soft">
                        Save any emoji from the catalog or a specimen page — click the heart — to find it here.
                    </p>
                    <Link
                        to="/catalog"
                        className="mt-2 inline-block rounded-[8px] border border-ink px-5 py-2.5 font-body text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-paper"
                    >
                        Browse the catalog
                    </Link>
                </div>
            )}

            {!loading && !error && favoriteEmojis.length > 0 && (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(228px,1fr))] gap-[18px]">
                    {favoriteEmojis.map((emoji) => (
                        <EmojiCard key={emoji.slug} emoji={emoji} categories={categories} from="favorites" />
                    ))}
                </div>
            )}
        </div>
    )
}