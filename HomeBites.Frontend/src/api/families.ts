import { apiClient } from './apiClient'
import type { Dish } from '../hooks/useDishes'

// ── Types ──────────────────────────────────────────────────────────────────

export interface FamilyProfile {
  id: number
  name: string
  location?: string
  bio?: string
  profileImageUrl?: string
  whatsAppNumber: string
  dishes: Dish[]
}

export interface FamilyListItem {
  id: number
  name: string
  location?: string
  bio?: string
  profileImageUrl?: string
}

export interface UpdateProfilePayload {
  name?: string
  whatsAppNumber?: string
  location?: string
  bio?: string
  profileImage?: File
}

export interface UpdateFamilyResponse {
  id: number
  name: string
  location?: string
  bio?: string
  profileImageUrl?: string
  whatsAppNumber: string
}

// ── Endpoints ──────────────────────────────────────────────────────────────

/** Fetch a single family's full profile + dish list (public, no auth required). */
export const getFamilyProfile = async (id: number): Promise<FamilyProfile> => {
  const res = await apiClient.get<FamilyProfile>(`families/${id}`)
  return res.data
}

/** Fetch all families (used for browsing / search). */
export const getAllFamilies = async (): Promise<FamilyListItem[]> => {
  const res = await apiClient.get<FamilyListItem[]>('families')
  return res.data
}

/** Update the authenticated family's own profile (requires JWT). */
export const updateFamilyProfile = async (
  id: number,
  token: string,
  payload: UpdateProfilePayload,
): Promise<UpdateFamilyResponse> => {
  const form = new FormData()
  if (payload.name)           form.append('name',            payload.name)
  if (payload.whatsAppNumber) form.append('whatsAppNumber',  payload.whatsAppNumber)
  if (payload.location !== undefined) form.append('location', payload.location)
  if (payload.bio      !== undefined) form.append('bio',      payload.bio)
  if (payload.profileImage)  form.append('profileImage',    payload.profileImage)

  const res = await apiClient.put<UpdateFamilyResponse>(`families/${id}`, form, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
}
