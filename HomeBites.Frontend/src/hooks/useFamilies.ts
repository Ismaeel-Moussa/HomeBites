import { useState, useEffect } from 'react'
import { getAllFamilies } from '../api/families'
import type { FamilyListItem } from '../api/families'
import { message } from 'antd'

export const useFamilies = (category?: string) => {
  const [families, setFamilies] = useState<FamilyListItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFamilies = async () => {
      try {
        setLoading(true)
        const data = await getAllFamilies(category)
        setFamilies(data)
      } catch (err) {
        console.error('Failed to fetch families:', err)
        message.error('Could not load kitchens. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchFamilies()
  }, [category])

  return { families, loading }
}
