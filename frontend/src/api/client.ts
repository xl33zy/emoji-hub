const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

export class ApiError extends Error {
    status: number

    constructor(status: number, message: string) {
        super(message)
        this.name = 'ApiError'
        this.status = status
    }
}

async function request<T>(path: string, signal?: AbortSignal): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`, { signal })

    if (!response.ok) {
        throw new ApiError(response.status, `Request to ${path} failed: ${response.status} ${response.statusText}`)
    }

    return response.json() as Promise<T>
}

export const apiClient = {
    get: request,
}