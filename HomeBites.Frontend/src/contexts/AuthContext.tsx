import { createContext, useCallback, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { AuthResponse } from '../api/auth'

// ── Types ──────────────────────────────────────────────────────────────────

export interface StoredUser {
  userId: string
  email: string
  name: string
  profileImageUrl?: string
}

interface AuthContextValue {
  token: string | null
  user: StoredUser | null
  isAuthenticated: boolean
  login: (response: AuthResponse) => void
  logout: () => void
}

// ── Context ────────────────────────────────────────────────────────────────

export const AuthContext = createContext<AuthContextValue>({
  token: null,
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
})

// ── Provider ───────────────────────────────────────────────────────────────

const TOKEN_KEY = 'hb_token'
const USER_KEY = 'hb_user'

function readToken() {
  return localStorage.getItem(TOKEN_KEY)
}

function readUser(): StoredUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? (JSON.parse(raw) as StoredUser) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(readToken)
  const [user, setUser] = useState<StoredUser | null>(readUser)

  const login = useCallback((response: AuthResponse) => {
    const stored: StoredUser = {
      userId: response.userId,
      email: response.email,
      name: response.name,
      profileImageUrl: response.profileImageUrl,
    }
    localStorage.setItem(TOKEN_KEY, response.token)
    localStorage.setItem(USER_KEY, JSON.stringify(stored))
    setToken(response.token)
    setUser(stored)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setToken(null)
    setUser(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({ token, user, isAuthenticated: !!token, login, logout }),
    [token, user, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
