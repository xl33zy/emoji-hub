import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useEmojis } from '../hooks/useEmojis'
import { useCategories } from '../hooks/useCategories'
import { useRandomEmoji } from '../hooks/useRandomEmoji'
import { EmojiCard } from '../components/EmojiCard'
import { EmojiCardSkeleton } from '../components/EmojiCardSkeleton'
import { Skeleton } from '../components/Skeleton'
import { getCategoryAccent } from '../lib/categoryAccent'

export function HomePage() {
    const { emojis, loading: emojisLoading } = useEmojis({})
    const { categories, loading: categoriesLoading } = useCategories()
    const { emoji: specimen, loading: specimenLoading, error: specimenError, spinning, reroll } = useRandomEmoji()

    const catalogLoading = emojisLoading || categoriesLoading

    const stats = useMemo(() => {
        return {
            total: emojis.length,
            categories: categories.length,
            groups: new Set(emojis.map((e) => e.group)).size,
            multiCodepoint: emojis.filter((e) => e.unicode.includes(' ')).length,
        }
    }, [emojis, categories])

    return (
        <div>
            <section>
                <div className="mx-auto flex max-w-[1180px] flex-wrap-reverse items-center gap-8 px-4 py-12 sm:gap-12 sm:px-6 lg:px-8">
                    <div className="flex-[1_1_380px]">
                        <p className="mb-3 font-mono text-[13px] text-ink-soft">
                            <span className="text-ink">{stats.total > 0 ? stats.total.toLocaleString('en-US') : '—'}</span>
                            {' '}entries · {stats.categories > 0 ? stats.categories : '—'} categories
                        </p>
                        <h1 className="mb-4 max-w-[14ch] font-index text-[clamp(30px,4vw,46px)] font-bold leading-[1.08] tracking-tight text-ink">
                            A field guide to every emoji
                        </h1>
                        <p className="mb-5 max-w-[48ch] text-base text-ink-soft">
                            Every emoji, catalogued, tagged, and ready to search. Browse the collection, or tell us
                            how you're feeling and we'll point you to the one that fits.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <Link
                                to="/catalog"
                                className="inline-block rounded-[8px] border border-accent-crimson bg-accent-crimson px-5 py-2.5 font-body text-sm font-medium text-white transition-opacity hover:opacity-90"
                            >
                                Browse the catalog
                            </Link>
                            <Link
                                to="/mood-match"
                                className="inline-block rounded-[8px] border border-ink px-5 py-2.5 font-body text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-paper"
                            >
                                Describe your mood instead
                            </Link>
                        </div>
                    </div>

                    <div className="mx-auto w-[300px] shrink">
                        <div className="mb-2 flex items-center justify-between">
                            <span className="font-mono text-[11px] uppercase tracking-wide text-ink-soft">
                                Emoji of the day
                            </span>
                            <button
                                type="button"
                                onClick={reroll}
                                aria-label="Show another specimen"
                                className="inline-flex h-8 w-8 items-center justify-center rounded-[8px] border border-line text-ink-soft transition-colors hover:border-ink-soft hover:text-ink"
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className={`h-4 w-4 ${spinning ? 'motion-safe:animate-spin' : ''}`}
                                >
                                    <path d="M17 2.1l4 4-4 4" />
                                    <path d="M3 12.7V12a9 9 0 0 1 15-6.7l3-.2" />
                                    <path d="M7 21.9l-4-4 4-4" />
                                    <path d="M21 11.3V12a9 9 0 0 1-15 6.7l-3 .2" />
                                </svg>
                            </button>
                        </div>

                        {specimenLoading && <EmojiCardSkeleton size="large" />}
                        {specimenError && (
                            <p className="text-sm text-accent-crimson">Failed to load: {specimenError}</p>
                        )}
                        {!specimenLoading && !specimenError && specimen && (
                            <div key={specimen.slug} className="motion-safe:animate-fade-in">
                                <EmojiCard emoji={specimen} categories={categories} size="large" from="home" />
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <div className="mx-auto max-w-[1180px] border-y border-line px-4 sm:px-8">
                <div className="grid grid-cols-2 gap-px bg-line sm:grid-cols-4">
                    <Fact value={stats.total} label="catalogued emoji" loading={catalogLoading} />
                    <Fact value={stats.categories} label="categories" loading={catalogLoading} />
                    <Fact value={stats.groups} label="groups" loading={catalogLoading} />
                    <Fact value={stats.multiCodepoint} label="tone & gender variants" loading={catalogLoading} />
                </div>
            </div>

            <section className="mx-auto max-w-[1180px] px-4 py-8 sm:px-8">
                <p className="mb-3 text-xs text-ink-soft">Browse by category</p>
                {categoriesLoading ? (
                    <div className="flex flex-wrap gap-2">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <Skeleton key={i} className="h-[34px] w-24 rounded-full" />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-2 motion-safe:animate-fade-in">
                        {categories.map((cat) => (
                            <Link
                                key={cat}
                                to={`/catalog?category=${encodeURIComponent(cat)}`}
                                style={{ borderColor: getCategoryAccent(cat, categories) }}
                                className="rounded-full border bg-paper-raised px-3.5 py-1.5 text-[13.5px] text-ink-soft transition-colors hover:text-ink"
                            >
                                {cat}
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </div>
    )
}

function Fact({ value, label, loading }: { value: number; label: string; loading: boolean }) {
    if (loading) {
        return (
            <div className="bg-paper px-5 py-4">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="mt-2 h-3 w-24" />
            </div>
        )
    }

    return (
        <div className="bg-paper px-5 py-4 motion-safe:animate-fade-in">
            <span className="block font-mono text-2xl tabular-nums text-ink">
                {value.toLocaleString('en-US')}
            </span>
            <span className="mt-0.5 block text-[12.5px] text-ink-soft">{label}</span>
        </div>
    )
}