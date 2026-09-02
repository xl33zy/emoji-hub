import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useEmojis } from '../hooks/useEmojis'
import { useCategories } from '../hooks/useCategories'
import { SearchBar } from '../components/SearchBar'
import { SortControls } from '../components/SortControls'
import { CategoryFilter } from '../components/CategoryFilter'
import { EmojiCard } from '../components/EmojiCard'
import type { SortOption } from '../types/emoji'
import { PageIntro } from '../components/PageIntro'

const PAGE_SIZE = 30

export function CatalogPage() {
    const [searchParams, setSearchParams] = useSearchParams()

    const search = searchParams.get('search') ?? ''
    const category = searchParams.get('category')
    const sort = (searchParams.get('sort') as SortOption) ?? 'name'

    const { emojis, loading, error } = useEmojis({ search, category: category ?? undefined, sort })
    const { categories } = useCategories()

    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setVisibleCount(PAGE_SIZE)
    }, [search, category, sort])

    function updateParam(key: string, value: string | null) {
        const next = new URLSearchParams(searchParams)
        if (value) next.set(key, value)
        else next.delete(key)
        setSearchParams(next, { replace: key === 'search' })
    }

    const visibleEmojis = emojis.slice(0, visibleCount)

    return (
        <div className="mx-auto max-w-[1180px] px-4 py-10 sm:px-8">
            <PageIntro title="Emoji Catalog">
                Over <span className="font-mono tabular-nums text-ink">{emojis.length}</span> emoji - search, sort, and save your favorites. Click any one to open its page.
            </PageIntro>

            <div className="flex flex-wrap items-end gap-4">
                <SearchBar value={search} onChange={(v) => updateParam('search', v || null)} />
                <SortControls
                    value={sort}
                    onChange={(v) => updateParam('sort', v === 'name' ? null : v)}
                    disableCategorySort={category !== null}
                />
            </div>
            <div className="mt-4">
                <CategoryFilter categories={categories} value={category} onChange={(v) => updateParam('category', v)} />
            </div>

            {error && <p className="mt-8 text-accent-crimson">Failed to load emojis: {error}</p>}

            {!error && (
                <div className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(228px,1fr))] gap-[18px]">
                    {visibleEmojis.map((emoji) => (
                        <EmojiCard key={emoji.slug} emoji={emoji} categories={categories} from="catalog" />
                    ))}
                </div>
            )}

            {loading && <p className="mt-6 text-ink-soft">Loading…</p>}

            {!loading && !error && visibleCount < emojis.length && (
                <div className="mt-8 flex flex-col items-center gap-3.5 text-center">
                    <p className="text-[13px] text-ink-soft">
                        Showing <strong className="text-ink">{visibleEmojis.length}</strong> of {emojis.length}
                    </p>
                    <button
                        type="button"
                        onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                        className="rounded-[8px] border border-ink px-5 py-2.5 font-body text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-paper"
                    >
                        Load more
                    </button>
                </div>
            )}
        </div>
    )
}