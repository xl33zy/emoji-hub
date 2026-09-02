interface ToastProps {
    message: string | null
}

export function Toast({ message }: ToastProps) {
    return (
        <div
            className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-[8px] bg-ink px-[18px] py-2.5 text-[13.5px] text-paper transition-all duration-150 ${
                message ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
            }`}
        >
            {message}
        </div>
    )
}