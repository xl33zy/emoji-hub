import { useEffect, useState } from 'react'

const STORAGE_KEY = 'emojihub:theme'

type Theme = 'light' | 'dark'

function getStoredTheme(): Theme {
    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
}

export function ThemeToggle() {
    const [theme, setTheme] = useState<Theme>(getStoredTheme)

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
    }, [theme])

    useEffect(() => {
        function handleStorage(event: StorageEvent) {
            if (event.key === STORAGE_KEY && (event.newValue === 'light' || event.newValue === 'dark')) {
                setTheme(event.newValue)
            }
        }
        window.addEventListener('storage', handleStorage)
        return () => window.removeEventListener('storage', handleStorage)
    }, [])

    function toggleTheme() {
        const next: Theme = theme === 'dark' ? 'light' : 'dark'
        setTheme(next)
        localStorage.setItem(STORAGE_KEY, next)
    }

    const dark = theme === 'dark'

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-line text-ink"
        >
            {dark ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                </svg>
            ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]">
                    <path d="M20.8 14.2A8.5 8.5 0 1 1 9.8 3.2a7 7 0 0 0 11 11Z" />
                </svg>
            )}
        </button>
    )
}
