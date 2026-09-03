interface ThinkingDotsProps {
    label: string
}

export function ThinkingDots({ label }: ThinkingDotsProps) {
    return (
        <span className="inline-flex items-center gap-2">
            {label}
            <span className="flex gap-1" aria-hidden="true">
                <span
                    className="h-1 w-1 rounded-full bg-current motion-safe:animate-thinking-dot"
                    style={{ animationDelay: '0ms' }}
                />
                <span
                    className="h-1 w-1 rounded-full bg-current motion-safe:animate-thinking-dot"
                    style={{ animationDelay: '150ms' }}
                />
                <span
                    className="h-1 w-1 rounded-full bg-current motion-safe:animate-thinking-dot"
                    style={{ animationDelay: '300ms' }}
                />
            </span>
        </span>
    )
}