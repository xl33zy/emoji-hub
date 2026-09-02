import { createContext } from 'react'

export interface ToastContextValue {
    showToast: (text: string) => void
}

export const ToastContext = createContext<ToastContextValue | undefined>(undefined)