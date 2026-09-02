import type { ReactNode } from 'react'

interface PageIntroProps {
    title: string
    children: ReactNode
}

export function PageIntro({ title, children }: PageIntroProps) {
    return (
        <div className="mb-6 border-b border-line pb-5">
            <h1 className="mb-1.5 font-index text-[clamp(28px,3.4vw,40px)] font-bold tracking-tight text-ink">
                {title}
            </h1>
            <p className="max-w-[56ch] text-sm text-ink-soft">{children}</p>
        </div>
    )
}