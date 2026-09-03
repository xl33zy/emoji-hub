import { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useFavorites } from '../hooks/useFavorites'
import { ThemeToggle } from './ThemeToggle'

export function Header() {
    const { count } = useFavorites()
    const [menuOpen, setMenuOpen] = useState(false)
    const headerRef = useRef<HTMLElement>(null)

    useEffect(() => {
        if (!menuOpen) return

        function handleClickOutside(event: MouseEvent) {
            if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
                setMenuOpen(false)
            }
        }
        function handleEscape(event: KeyboardEvent) {
            if (event.key === 'Escape') setMenuOpen(false)
        }

        document.addEventListener('mousedown', handleClickOutside)
        document.addEventListener('keydown', handleEscape)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('keydown', handleEscape)
        }
    }, [menuOpen])

    return (
        <header ref={headerRef} className="sticky top-0 z-20 border-b border-line bg-paper">
            <div className="relative mx-auto flex min-h-16 max-w-[1180px] items-center gap-6 px-4 sm:px-8">
                <a href="/" className="font-index whitespace-nowrap text-xl font-bold tracking-tight text-ink">
                    <span className="text-accent-crimson">emoji</span>hub
                </a>

                <nav className="hidden flex-1 gap-5 md:flex" aria-label="Main navigation">
                    <NavLink to="/" end className={navLinkClass}>Home</NavLink>
                    <NavLink to="/catalog" className={navLinkClass}>Catalog</NavLink>
                    <NavLink to="/mood-match" className={navLinkClass}>Mood Match</NavLink>
                </nav>

                <div className="ml-auto flex items-center gap-3">
                    <NavLink
                        to="/favorites"
                        aria-label="Favorites"
                        className={({ isActive }) =>
                            `inline-flex items-center gap-1.5 border-b-2 pb-1 text-sm ${
                                isActive ? 'border-accent-crimson text-ink' : 'border-transparent text-ink-soft'
                            }`
                        }
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4 text-accent-crimson"
                        >
                            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
                        </svg>
                        <span>{count}</span>
                    </NavLink>

                    <ThemeToggle />

                    <button
                        type="button"
                        onClick={() => setMenuOpen((open) => !open)}
                        aria-expanded={menuOpen}
                        aria-controls="mobile-nav"
                        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                        className="flex h-8 w-8 flex-none items-center justify-center md:hidden"
                    >
                        <span className="relative block h-4 w-5">
                            <span
                                className={`absolute left-0 top-0 h-[2px] w-5 bg-ink transition-transform duration-200 motion-reduce:transition-none ${
                                    menuOpen ? 'translate-y-[7px] rotate-45' : ''
                                }`}
                            />
                            <span
                                className={`absolute left-0 top-[7px] h-[2px] w-5 bg-ink transition-opacity duration-200 motion-reduce:transition-none ${
                                    menuOpen ? 'opacity-0' : 'opacity-100'
                                }`}
                            />
                            <span
                                className={`absolute left-0 top-[14px] h-[2px] w-5 bg-ink transition-transform duration-200 motion-reduce:transition-none ${
                                    menuOpen ? '-translate-y-[7px] -rotate-45' : ''
                                }`}
                            />
                        </span>
                    </button>
                </div>

                {menuOpen && (
                    <nav
                        id="mobile-nav"
                        aria-label="Mobile navigation"
                        className="absolute inset-x-0 top-full flex flex-col gap-1 border-b border-line bg-paper px-4 py-3 md:hidden"
                    >
                        <NavLink to="/" end onClick={() => setMenuOpen(false)} className={mobileNavLinkClass}>
                            Home
                        </NavLink>
                        <NavLink to="/catalog" onClick={() => setMenuOpen(false)} className={mobileNavLinkClass}>
                            Catalog
                        </NavLink>
                        <NavLink to="/mood-match" onClick={() => setMenuOpen(false)} className={mobileNavLinkClass}>
                            Mood Match
                        </NavLink>
                    </nav>
                )}
            </div>
        </header>
    )
}

function navLinkClass({ isActive }: { isActive: boolean }) {
    return `border-b-2 pb-1 text-[15px] ${
        isActive
            ? 'border-accent-crimson font-medium text-ink'
            : 'border-transparent text-ink-soft hover:text-ink'
    }`
}

function mobileNavLinkClass({ isActive }: { isActive: boolean }) {
    return `rounded-[6px] px-2 py-2 text-[15px] ${
        isActive ? 'bg-paper-raised font-medium text-ink' : 'text-ink-soft hover:text-ink'
    }`
}