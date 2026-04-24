import { useState, useEffect } from 'react'
import { apiClient } from '../api/apiClient'

export interface Category {
  id: number
  name: string
}

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true)
      try {
        const res = await apiClient.get<Category[]>('categories')
        setCategories(res.data)
      } catch (err) {
        console.error('Failed to fetch categories:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  return { categories, loading }
}
