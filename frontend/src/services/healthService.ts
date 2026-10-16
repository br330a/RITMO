import { apiRequest } from './apiClient'

export type HealthResponse = {
  status: string
  service: string
}

export function getHealth() {
  return apiRequest<HealthResponse>('/api/health')
}