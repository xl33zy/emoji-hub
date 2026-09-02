import { NavLink } from 'react-router-dom'
import { useFavorites } from '../hooks/useFavorites'
import { ThemeToggle } from './ThemeToggle'

export function Header() {
    const { count } = useFavorites()
    return (
        <header className="sticky top-0 z-20 border-b border-line bg-paper">
            <div className="mx-auto flex min-h-16 max-w-[1180px] items-center gap-6 px-4 sm:px-8">
                <a href="/" className="font-index whitespace-nowrap text-xl font-bold tracking-tight text-ink">
                    <span className="text-accent-crimson">emoji</span>hub
                </a>

                <nav className="flex flex-1 gap-5" aria-label="Main navigation">
                    <NavLink to="/" end className={navLinkClass}>Home</NavLink>
                    <NavLink to="/catalog" className={navLinkClass}>Catalog</NavLink>
                    <NavLink to="/mood-match" className={navLinkClass}>Mood Match</NavLink>
                </nav>

                <div className="flex items-center gap-3">
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
                </div>
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