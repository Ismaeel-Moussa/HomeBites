import { apiClient } from './apiClient'
import type { Dish } from '../hooks/useDishes'

// ── Types ──────────────────────────────────────────────────────────────────

export interface CreateDishPayload {
  name: string
  description?: string
  price: number
  categoryId: number
  file: File
}

export interface UpdateDishPayload {
  name?: string
  description?: string
  price?: number
  categoryId?: number
  file?: File
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function authHeader(token: string) {
  return { Authorization: `Bearer ${token}` }
}

// ── Endpoints ──────────────────────────────────────────────────────────────

/** Returns only the logged-in family's dishes (requires auth). */
export const getMyDishes = async (token: string): Promise<Dish[]> => {
  const res = await apiClient.get<Dish[]>('dishes/mine', {
    headers: authHeader(token),
  })
  return res.data
}

/** Create a new dish. Image is required. */
export const createDish = async (
  token: string,
  payload: CreateDishPayload,
): Promise<Dish> => {
  const form = new FormData()
  form.append('name', payload.name)
  if (payload.description) form.append('description', payload.description)
  form.append('price', String(payload.price))
  form.append('categoryId', String(payload.categoryId))
  form.append('file', payload.file)

  const res = await apiClient.post<Dish>('dishes', form, {
    headers: {
      ...authHeader(token),
    },
  })
  return res.data
}

/** Update an existing dish. All fields are optional; image is only sent when replacing. */
export const updateDish = async (
  token: string,
  id: number,
  payload: UpdateDishPayload,
): Promise<Dish> => {
  const form = new FormData()
  if (payload.name !== undefined) form.append('name', payload.name)
  if (payload.description !== undefined) form.append('description', payload.description)
  if (payload.price !== undefined) form.append('price', String(payload.price))
  if (payload.categoryId !== undefined) form.append('categoryId', String(payload.categoryId))
  if (payload.file) form.append('file', payload.file)

  const res = await apiClient.put<Dish>(`dishes/${id}`, form, {
    headers: {
      ...authHeader(token),
    },
  })
  return res.data
}

/** Permanently delete a dish by id. */
export const deleteDish = async (token: string, id: number): Promise<void> => {
  await apiClient.delete(`dishes/${id}`, {
    headers: authHeader(token),
  })
}
