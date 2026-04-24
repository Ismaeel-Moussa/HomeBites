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
