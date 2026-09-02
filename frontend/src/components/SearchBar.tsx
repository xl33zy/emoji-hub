import { useEffect, useState } from 'react'
import { useDebouncedValue } from '../hooks/useDebouncedValue'

interface SearchBarProps {
    value: string
    onChange: (value: string) => void
}

const DEBOUNCE_MS = 300

export function SearchBar({ value, onChange }: SearchBarProps) {
    const [inputValue, setInputValue] = useState(value)
    const debouncedValue = useDebouncedValue(inputValue, DEBOUNCE_MS)

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setInputValue(value)
    }, [value])

    useEffect(() => {
        if (debouncedValue !== value) onChange(debouncedValue)
    }, [debouncedValue, value, onChange])

    return (
        <div className="flex min-w-[280px] flex-1 flex-col gap-1.5">
            <label htmlFor="search" className="text-xs text-ink-soft">Search by name</label>
            <div className="relative">
                <svg
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                    strokeLinecap="round" strokeLinejoin="round"
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft"
                >
                    <circle cx="11" cy="11" r="7" />
                    <path d="m21 21-4.3-4.3" />
                </svg>
                <input
                    type="search"
                    id="search"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="e.g. face, pizza, turkey…"
                    className="w-full rounded-[8px] border border-line bg-paper-raised py-2.5 pl-9 pr-3 font-body text-[15px] text-ink placeholder:text-ink-soft focus-visible:border-ink-soft focus-visible:outline-none"
                />
            </div>
        </div>
    )
}