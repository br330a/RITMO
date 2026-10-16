const apiUrl = import.meta.env.VITE_API_URL?.trim()

if (!apiUrl) {
  throw new Error('VITE_API_URL n�o est� configurada.')
}

export const API_URL = apiUrl.replace(/\/+$/, '')
