import { Outlet, Link } from 'react-router-dom'
import { Header } from './Header'

export function Layout() {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
                <Outlet />
            </main>
            <footer className="border-t border-line">
                <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-8">
                    <p className="text-[13px] text-ink-soft">
                        <span className="font-medium text-ink">emojihub</span> — a learning project built on the open EmojiHub API
                    </p>
                    <nav className="flex gap-5 text-[13px] text-ink-soft" aria-label="Footer navigation">
                        <Link to="/catalog" className="hover:text-ink">Catalog</Link>
                        <Link to="/mood-match" className="hover:text-ink">Mood Match</Link>
                        <a href="https://github.com/xl33zy/emoji-hub" target="_blank" rel="noreferrer" className="hover:text-ink">Source</a>
                    </nav>
                </div>
            </footer>
        </div>
    )
}