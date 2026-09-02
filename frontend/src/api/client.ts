const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

async function request<T>(path: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`)

    if (!response.ok) {
        throw new Error(`Request to ${path} failed: ${response.status} ${response.statusText}`)
    }

    return response.json() as Promise<T>
}

export const apiClient = {
    get: request,
}