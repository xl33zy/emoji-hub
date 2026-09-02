interface CopyButtonProps {
    value: string
    ariaLabel: string
    onCopied: () => void
    className: string
    children: React.ReactNode
}

export function CopyButton({ value, ariaLabel, onCopied, className, children }: CopyButtonProps) {
    const handleClick = async () => {
        try {
            await navigator.clipboard.writeText(value)
            onCopied()
        } catch {
            //
        }
    }

    return (
        <button type="button" onClick={handleClick} aria-label={ariaLabel} className={className}>
            {children}
        </button>
    )
}