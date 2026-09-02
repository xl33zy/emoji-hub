import { useEffect, useState } from 'react'
import { apiClient } from '../api/client'

interface UseCategoriesResult {
    categories: string[]
    loading: boolean
}

export function useCategories(): UseCategoriesResult {
    const [categories, setCategories] = useState<string[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const controller = new AbortController()

        apiClient
            .get<string[]>('/api/categories', controller.signal)
            .then((data) => {
                if (!controller.signal.aborted) setCategories(data)
            })
            .catch((err: unknown) => {
                if (err instanceof DOMException && err.name === 'AbortError') return
                console.error('Failed to load categories:', err)
            })
            .finally(() => {
                if (!controller.signal.aborted) setLoading(false)
            })

        return () => controller.abort()
    }, [])

    return { categories, loading }
}