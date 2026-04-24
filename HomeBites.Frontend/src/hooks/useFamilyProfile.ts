import { useState, useEffect } from 'react'
import { getFamilyProfile } from '../api/families'
import type { FamilyProfile } from '../api/families'

export type { FamilyProfile }

export const useFamilyProfile = (familyId: number) => {
  const [family, setFamily] = useState<FamilyProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!familyId) return

    let cancelled = false

    const fetchProfile = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getFamilyProfile(familyId)
        if (!cancelled) setFamily(data)
      } catch (err: any) {
        if (!cancelled) {
          const status = err?.response?.status
          setError(status === 404 ? 'Family not found.' : 'Failed to load profile. Please try again.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchProfile()
    return () => { cancelled = true }
  }, [familyId])

  return { family, loading, error }
}
