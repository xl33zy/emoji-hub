import { useState } from 'react'

interface ToastProps {
    message: string | null
}

export function Toast({ message }: ToastProps) {
    const [displayedMessage, setDisplayedMessage] = useState(message)

    if (message !== null && message !== displayedMessage) {
        setDisplayedMessage(message)
    }

    return (
        <div
            className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-[8px] bg-ink px-[18px] py-2.5 text-[13.5px] text-paper transition-[transform,opacity] duration-300 ease-out motion-reduce:transition-none ${
                message ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
            }`}
        >
            {displayedMessage}
        </div>
    )
}