import { API_URL } from '../config/api'

export type ApiErrorPayload = {
  status?: number
  error?: string
  message?: string
  detail?: string
  fields?: Record<string, string>
}

export class ApiError extends Error {
  status: number
  payload: ApiErrorPayload | null

  constructor(
    status: number,
    payload: ApiErrorPayload | null,
  ) {
    super(
      payload?.message ??
        `Erro na requisição. Código HTTP: ${status}.`,
    )

    this.name = 'ApiError'
    this.status = status
    this.payload = payload
  }
}

type ApiRequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown
  token?: string | null
}

async function readResponse(
  response: Response,
): Promise<unknown> {
  if (response.status === 204) {
    return null
  }

  const contentType =
    response.headers.get('content-type') ?? ''

  if (contentType.includes('application/json')) {
    return response.json()
  }

  const text = await response.text()

  return text || null
}

function createErrorPayload(
  data: unknown,
): ApiErrorPayload | null {
  if (
    typeof data !== 'object' ||
    data === null ||
    Array.isArray(data)
  ) {
    return null
  }

  return data as ApiErrorPayload
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const {
    body: requestBody,
    token,
    headers: initialHeaders,
    ...requestOptions
  } = options

  const headers = new Headers(initialHeaders)

  headers.set('Accept', 'application/json')

  if (requestBody !== undefined) {
    headers.set('Content-Type', 'application/json')
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const normalizedPath = path.startsWith('/')
    ? path
    : `/${path}`

  const response = await fetch(
    `${API_URL}${normalizedPath}`,
    {
      ...requestOptions,
      headers,
      body:
        requestBody === undefined
          ? undefined
          : JSON.stringify(requestBody),
    },
  )

  const data = await readResponse(response)

  if (!response.ok) {
    throw new ApiError(
      response.status,
      createErrorPayload(data),
    )
  }

  return data as T
}