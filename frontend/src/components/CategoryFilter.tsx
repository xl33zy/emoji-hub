import { getCategoryAccent } from '../lib/categoryAccent'

interface CategoryFilterProps {
    categories: string[]
    value: string | null
    onChange: (category: string | null) => void
}

export function CategoryFilter({ categories, value, onChange }: CategoryFilterProps) {
    return (
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
            <button
                type="button"
                aria-pressed={value === null}
                onClick={() => onChange(null)}
                style={value === null ? { backgroundColor: 'var(--color-ink)', borderColor: 'var(--color-ink)', color: 'var(--color-paper)' } : undefined}
                className={chipClass(value === null)}
            >
                All categories
            </button>
            {categories.map((category) => {
                const active = value === category
                return (
                    <button
                        key={category}
                        type="button"
                        aria-pressed={active}
                        onClick={() => onChange(active ? null : category)}
                        style={active ? { backgroundColor: getCategoryAccent(category, categories), borderColor: getCategoryAccent(category, categories), color: '#fff' } : undefined}
                        className={chipClass(active)}
                    >
                        {category}
                    </button>
                )
            })}
        </div>
    )
}

function chipClass(active: boolean) {
    return `rounded-full border px-3.5 py-1.5 font-body text-[13.5px] transition-colors ${
        active ? 'border-transparent' : 'border-line text-ink-soft hover:border-ink-soft hover:text-ink'
    }`
}