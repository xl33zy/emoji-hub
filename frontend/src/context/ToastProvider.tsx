import { useCallback, useRef, useState, type ReactNode } from 'react'
import { ToastContext } from './ToastContext'
import { Toast } from '../components/Toast'

const TOAST_DURATION_MS = 2000

export function ToastProvider({ children }: { children: ReactNode }) {
    const [message, setMessage] = useState<string | null>(null)
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const showToast = useCallback((text: string) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        setMessage(text)
        timeoutRef.current = setTimeout(() => setMessage(null), TOAST_DURATION_MS)
    }, [])

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <Toast message={message} />
        </ToastContext.Provider>
    )
}