import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useEmojis } from '../hooks/useEmojis'
import { useCategories } from '../hooks/useCategories'
import { useRandomEmoji } from '../hooks/useRandomEmoji'
import { EmojiCard } from '../components/EmojiCard'
import { getCategoryAccent } from '../lib/categoryAccent'

export function HomePage() {
    const { emojis } = useEmojis({})
    const { categories } = useCategories()
    const { emoji: specimen, loading: specimenLoading, error: specimenError, reroll } = useRandomEmoji()

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
                <div className="mx-auto flex max-w-[1180px] flex-wrap-reverse items-center gap-12 px-4 py-12 sm:px-6 lg:px-8">
                    <div className="flex-[1_1_380px]">
                        <p className="mb-3 font-mono text-[13px] text-ink-soft">
                            <span className="text-ink">{stats.total > 0 ? stats.total.toLocaleString('en-US') : '—'}</span>
                            {' '}specimens · {stats.categories > 0 ? stats.categories : '—'} categories · open EmojiHub data
                        </p>
                        <h1 className="mb-4 max-w-[14ch] font-index text-[clamp(30px,4vw,46px)] font-bold leading-[1.08] tracking-tight text-ink">
                            A field guide to every emoji
                        </h1>
                        <p className="mb-5 max-w-[48ch] text-base text-ink-soft">
                            Emoji Hub catalogs, tags, and cross-references every specimen from the open EmojiHub library —
                            search it directly, or just tell us how you feel.
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

                    <div className="w-[300px] flex-none">
                        <div className="mb-2 flex items-center justify-between">
                            <span className="font-mono text-[11px] uppercase tracking-wide text-ink-soft">
                                Specimen of the day
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
                                    className="h-4 w-4"
                                >
                                    <path d="M17 2.1l4 4-4 4" />
                                    <path d="M3 12.7V12a9 9 0 0 1 15-6.7l3-.2" />
                                    <path d="M7 21.9l-4-4 4-4" />
                                    <path d="M21 11.3V12a9 9 0 0 1-15 6.7l-3 .2" />
                                </svg>
                            </button>
                        </div>

                        {specimenLoading && <p className="text-sm text-ink-soft">Loading…</p>}
                        {specimenError && (
                            <p className="text-sm text-accent-crimson">Failed to load: {specimenError}</p>
                        )}
                        {!specimenLoading && !specimenError && specimen && (
                            <EmojiCard emoji={specimen} categories={categories} size="large" from="home" />
                        )}
                    </div>
                </div>
            </section>

            <div className="mx-auto max-w-[1180px] border-y border-line px-4 sm:px-8">
                <div className="flex divide-x divide-line">
                    <Fact value={stats.total} label="catalogued specimens" />
                    <Fact value={stats.categories} label="categories" />
                    <Fact value={stats.groups} label="groups" />
                    <Fact value={stats.multiCodepoint} label="multi-codepoint variants" />
                </div>
            </div>

            <section className="mx-auto max-w-[1180px] px-4 py-8 sm:px-8">
                <p className="mb-3 text-xs text-ink-soft">Browse by category</p>
                <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                        <Link
                            key={cat}
                            to={`/catalog?category=${encodeURIComponent(cat)}`}
                            style={{ borderColor: getCategoryAccent(cat, categories) }}
                            className="rounded-full border px-3.5 py-1.5 text-[13.5px] text-ink-soft transition-colors hover:text-ink"
                        >
                            {cat}
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    )
}

function Fact({ value, label }: { value: number; label: string }) {
    return (
        <div className="flex-1 px-5 py-4">
            <span className="block font-mono text-2xl tabular-nums text-ink">
                {value > 0 ? value.toLocaleString('en-US') : '—'}
            </span>
            <span className="mt-0.5 block text-[12.5px] text-ink-soft">{label}</span>
        </div>
    )
}