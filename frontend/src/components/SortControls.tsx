import type { SortOption } from '../types/emoji'

interface SortControlsProps {
    value: SortOption
    onChange: (value: SortOption) => void
}

const CHEVRON =
    `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="%2363665A" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>')`

export function SortControls({ value, onChange }: SortControlsProps) {
    return (
        <div className="flex flex-col gap-1.5">
            <label htmlFor="sort" className="text-xs text-ink-soft">Sort by</label>
            <select
                id="sort"
                value={value}
                onChange={(e) => onChange(e.target.value as SortOption)}
                style={{ backgroundImage: CHEVRON, backgroundPosition: 'right 10px center', backgroundRepeat: 'no-repeat' }}
                className="appearance-none rounded-[8px] border border-line bg-paper-raised py-2.5 pl-3 pr-8 font-body text-[15px] text-ink"
            >
                <option value="name">Name, A→Z</option>
                <option value="category">Category</option>
            </select>
        </div>
    )
}