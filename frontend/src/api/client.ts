const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

export class ApiError extends Error {
    status: number

    constructor(status: number, message: string) {
        super(message)
        this.name = 'ApiError'
        this.status = status
    }
}

interface RequestOptions {
    method?: string
    body?: unknown
    signal?: AbortSignal
}

async function request<T>(path: string, options?: RequestOptions): Promise<T> {
    const hasBody = options?.body !== undefined
    const response = await fetch(`${API_BASE_URL}${path}`, {
        method: options?.method ?? 'GET',
        headers: hasBody ? { 'Content-Type': 'application/json' } : undefined,
        body: hasBody ? JSON.stringify(options.body) : undefined,
        signal: options?.signal,
    })

    if (!response.ok) {
        throw new ApiError(response.status, `Request to ${path} failed: ${response.status} ${response.statusText}`)
    }

    return response.json() as Promise<T>
}

export const apiClient = {
    get: <T>(path: string, signal?: AbortSignal) => request<T>(path, { signal }),
    post: <T>(path: string, body: unknown, signal?: AbortSignal) => request<T>(path, { method: 'POST', body, signal }),
}