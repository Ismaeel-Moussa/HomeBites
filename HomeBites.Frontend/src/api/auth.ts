import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5132/api'

const api = axios.create({ baseURL: BASE_URL })

// ── Types ──────────────────────────────────────────────────────────────────

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterFamilyRequest {
  name: string
  email: string
  password: string
  whatsAppNumber: string
  location?: string
  bio?: string
  kitchenCategory?: string
  profileImage?: File
}

export interface AuthResponse {
  token: string
  expiresAt: string
  userId: string
  familyId?: number
  email: string
  name: string
  profileImageUrl?: string
}

export interface RegisterSuccessResponse {
  message: string
}

export interface ApiError {
  code: string
  message?: string
  errors?: string[]
}

// ── Endpoints ──────────────────────────────────────────────────────────────

export const loginApi = async (data: LoginRequest): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>('auth/login', data)
  return res.data
}

export const registerFamilyApi = async (
  data: RegisterFamilyRequest,
): Promise<RegisterSuccessResponse> => {
  const form = new FormData()
  form.append('name', data.name)
  form.append('email', data.email)
  form.append('password', data.password)
  form.append('whatsAppNumber', data.whatsAppNumber)
  if (data.location) form.append('location', data.location)
  if (data.bio) form.append('bio', data.bio)
  if (data.kitchenCategory) form.append('kitchenCategory', data.kitchenCategory)
  if (data.profileImage) form.append('profileImage', data.profileImage)

  const res = await api.post<RegisterSuccessResponse>(
    'auth/register-family',
    form,
  )
  return res.data
}
