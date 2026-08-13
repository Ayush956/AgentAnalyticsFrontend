const TOKEN_KEY = 'access_token'
const USER_KEY = 'auth_user'

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthUser {
  id: string
  username: string
  email: string
  full_name: string
  role: string
  is_active: boolean
  created_at: string
}

export interface UserTicketSummary {
  total: number
  ticket_numbers: string[]
}

export interface LoginResponse {
  access_token: string
  token_type: string
  expires_in: number
  user: AuthUser
  tickets: UserTicketSummary
}

export function getAccessToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setAccessToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function getStoredUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

export function setStoredUser(user: AuthUser): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearAccessToken(): void {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function isAuthenticated(): boolean {
  return Boolean(getAccessToken())
}
