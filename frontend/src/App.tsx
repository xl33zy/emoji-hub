import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { CatalogPage } from './pages/CatalogPage'
import { EmojiDetailPage } from './pages/EmojiDetailPage'
import { FavoritesPage } from './pages/FavoritesPage'
import { MoodMatchPage } from './pages/MoodMatchPage'

function App() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/catalog" element={<CatalogPage />} />
                <Route path="/emoji/:slug" element={<EmojiDetailPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/mood-match" element={<MoodMatchPage />} />
            </Route>
        </Routes>
    )
}

export default App