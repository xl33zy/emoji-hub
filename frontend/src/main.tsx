import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { FavoritesProvider } from './context/FavoritesProvider'
import { ToastProvider } from './context/ToastProvider'
import { MoodMatchProvider } from './context/MoodMatchProvider'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <FavoritesProvider>
                <ToastProvider>
                    <MoodMatchProvider>
                        <App />
                    </MoodMatchProvider>
                </ToastProvider>
            </FavoritesProvider>
        </BrowserRouter>
    </StrictMode>,
)