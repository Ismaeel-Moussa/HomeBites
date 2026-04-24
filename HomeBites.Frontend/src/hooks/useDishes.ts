import { useState, useEffect } from 'react'
import { apiClient } from '../api/apiClient'

export interface Dish {
  id: number
  name: string
  description?: string
  price: number
  imageUrl?: string
  categoryId: number
  categoryName: string
  familyId: number
  familyName: string
  familyProfileImageUrl?: string
  whatsAppNumber: string
}

export const useDishes = (searchQuery?: string, categoryId?: number | null) => {
  const [dishes, setDishes] = useState<Dish[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchDishes = async () => {
      setLoading(true)
      try {
        const params: any = {}
        if (searchQuery) params.q = searchQuery
        if (categoryId) params.category = categoryId

        const endpoint = (searchQuery || categoryId) ? 'dishes/search' : 'dishes'
        const res = await apiClient.get<Dish[]>(endpoint, { params })
        setDishes(res.data)
      } catch (err) {
        console.error('Failed to fetch dishes:', err)
      } finally {
        setLoading(false)
      }
    }
    
    // Simple debounce for search
    const timer = setTimeout(() => {
        fetchDishes()
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery, categoryId])

  return { dishes, loading }
}
