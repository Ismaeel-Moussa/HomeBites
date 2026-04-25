import React, { useCallback, useEffect, useRef, useState } from 'react'
import { SaveOutlined, CameraOutlined, EnvironmentOutlined } from '@ant-design/icons'
import { useAuth } from '../../hooks/useAuth'
import { getFamilyProfile } from '../../api/families'
import { updateFamilyProfile } from '../../api/families'
import type { UpdateProfilePayload } from '../../api/families'
import { IMAGE_BASE_URL } from '../../api/apiClient'
import styles from './ProfileManagementPage.module.scss'

// ── Constants ──────────────────────────────────────────────────────────────
const MAX_BIO_CHARS = 500
const MAX_PHOTO_BYTES = 5 * 1024 * 1024 // 5 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

// ── Types ──────────────────────────────────────────────────────────────────
interface FormValues {
  name: string
  whatsAppNumber: string
  bio: string
  location: string
  kitchenCategory: string
}

type ToastState = { message: string; type: 'success' | 'error' } | null

// ── Loading skeleton ───────────────────────────────────────────────────────
const Skeleton: React.FC = () => (
  <div className={styles.skeleton}>
    <div className={styles.skeletonPhotoRow}>
      <div className={styles.skeletonCircle} />
      <div>
        <div className={`${styles.skeletonLine} ${styles.lg}`} />
        <div className={`${styles.skeletonLine} ${styles.sm}`} />
      </div>
    </div>
    <div className={styles.skeletonGrid}>
      {[0, 1, 2, 3].map(i => (
        <div key={i} className={styles.skeletonField}>
          <div className={styles.skeletonLabel} />
          <div className={styles.skeletonInput} />
        </div>
      ))}
      <div className={`${styles.skeletonField} ${styles.fieldFull}`}>
        <div className={styles.skeletonLabel} />
        <div className={styles.skeletonTextarea} />
      </div>
    </div>
  </div>
)

// ── Main Page ──────────────────────────────────────────────────────────────
export default function ProfileManagementPage() {
  const { user, token, updateUser } = useAuth()
  const familyId = user?.familyId

  // ── Loading / server state ─────────────────────────────────────────────
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<ToastState>(null)

  // ── Form values ────────────────────────────────────────────────────────
  const emptyForm: FormValues = { name: '', whatsAppNumber: '', bio: '', location: '', kitchenCategory: '' }
  const [form, setForm] = useState<FormValues>(emptyForm)
  const [initialForm, setInitialForm] = useState<FormValues>(emptyForm)

  // ── Photo state ────────────────────────────────────────────────────────
  const [serverImageUrl, setServerImageUrl] = useState<string | undefined>()
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [photoError, setPhotoError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ── Toast helper ───────────────────────────────────────────────────────
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3100)
  }

  // ── Fetch profile on mount ─────────────────────────────────────────────
  const fetchProfile = useCallback(async () => {
    if (!familyId) { setLoading(false); return }
    setLoading(true)
    try {
      const data = await getFamilyProfile(familyId)
      const values: FormValues = {
        name:           data.name           ?? '',
        whatsAppNumber: data.whatsAppNumber  ?? '',
        bio:            data.bio             ?? '',
        location:       data.location        ?? '',
        kitchenCategory: data.kitchenCategory ?? '',
      }
      setForm(values)
      setInitialForm(values)
      setServerImageUrl(data.profileImageUrl)
    } catch {
      showToast('Failed to load your profile.', 'error')
    } finally {
      setLoading(false)
    }
  }, [familyId])

  useEffect(() => { fetchProfile() }, [fetchProfile])

  // ── Photo selection ────────────────────────────────────────────────────
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!ALLOWED_TYPES.includes(file.type)) {
      setPhotoError('Only JPEG, PNG, or WebP images are allowed.')
      return
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setPhotoError('Image must be smaller than 5 MB.')
      return
    }
    setPhotoError(null)
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  // ── Field change ───────────────────────────────────────────────────────
  const handleChange = (field: keyof FormValues) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = field === 'bio'
        ? e.target.value.slice(0, MAX_BIO_CHARS)
        : e.target.value
      setForm(prev => ({ ...prev, [field]: value }))
    }

  // ── Discard ────────────────────────────────────────────────────────────
  const handleDiscard = () => {
    setForm(initialForm)
    setPhotoFile(null)
    setPhotoPreview(null)
    setPhotoError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // ── Save ───────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!familyId || !token) return
    setSaving(true)
    try {
      const payload: UpdateProfilePayload = {
        name:           form.name           || undefined,
        whatsAppNumber: form.whatsAppNumber  || undefined,
        location:       form.location,
        bio:            form.bio,
        kitchenCategory: form.kitchenCategory || undefined,
        profileImage:   photoFile ?? undefined,
      }
      const updated = await updateFamilyProfile(familyId, token, payload)

      // Update cached user in AuthContext so sidebar / header reflects changes
      updateUser({
        name: updated.name,
        profileImageUrl: updated.profileImageUrl,
      })

      const newValues: FormValues = {
        name:           updated.name           ?? '',
        whatsAppNumber: updated.whatsAppNumber  ?? '',
        bio:            updated.bio             ?? '',
        location:       updated.location        ?? '',
        kitchenCategory: updated.kitchenCategory ?? '',
      }
      setForm(newValues)
      setInitialForm(newValues)
      setServerImageUrl(updated.profileImageUrl)
      setPhotoFile(null)
      setPhotoPreview(null)
      if (fileInputRef.current) fileInputRef.current.value = ''

      showToast('Profile saved successfully!', 'success')
    } catch {
      showToast('Failed to save profile. Please try again.', 'error')
    } finally {
      setSaving(false)
    }
  }

  // ── Computed avatar src ────────────────────────────────────────────────
  const avatarSrc = photoPreview
    ?? (serverImageUrl ? `${IMAGE_BASE_URL}/${serverImageUrl}` : null)

  const bioCharsLeft = MAX_BIO_CHARS - form.bio.length
  const isDirty =
    JSON.stringify(form) !== JSON.stringify(initialForm) || photoFile !== null

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className={styles.page}>
      {/* Page header */}
      <header className={styles.pageHeader}>
        <h1>Profile Management</h1>
        <p>Personalize your kitchen storefront to attract more customers.</p>
      </header>

      {loading ? (
        <Skeleton />
      ) : (
        <div className={styles.card}>

          {/* ── Photo section ── */}
          <div className={styles.photoSection}>
            <div className={styles.avatarWrapper}>
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt="Kitchen profile photo"
                  className={styles.avatar}
                />
              ) : (
                <div className={styles.avatarPlaceholder} aria-hidden="true">🍳</div>
              )}
              <span className={styles.cameraBadge} aria-hidden="true">
                <CameraOutlined />
              </span>
            </div>

            <div className={styles.photoInfo}>
              <strong>Kitchen Profile Photo</strong>
              <p>
                Upload a high‑quality photo of your kitchen or a professional headshot.
                JPEG or PNG, max 5MB.
              </p>
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                id="profile-photo-input"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                style={{ display: 'none' }}
                onChange={handlePhotoChange}
              />
              <button
                type="button"
                className={styles.changePhotoBtn}
                onClick={() => fileInputRef.current?.click()}
                id="change-photo-btn"
                disabled={saving}
              >
                <CameraOutlined /> Change Photo
              </button>
              {photoError && (
                <p className={styles.photoError} role="alert">{photoError}</p>
              )}
            </div>
          </div>

          {/* ── Form fields ── */}
          <div className={styles.formGrid}>
            {/* Kitchen Name */}
            <div className={styles.field}>
              <label className={styles.label} htmlFor="field-name">
                Kitchen Name
              </label>
              <input
                id="field-name"
                type="text"
                className={styles.input}
                placeholder="e.g. Maria's Mediterranean Kitchen"
                value={form.name}
                onChange={handleChange('name')}
                disabled={saving}
              />
            </div>

            {/* WhatsApp Number */}
            <div className={styles.field}>
              <label className={styles.label} htmlFor="field-whatsapp">
                WhatsApp Number
              </label>
              <div className={styles.inputWithPrefix}>
                <span className={styles.prefix}>+1</span>
                <input
                  id="field-whatsapp"
                  type="tel"
                  className={styles.prefixInput}
                  placeholder="202-555-0143"
                  value={form.whatsAppNumber}
                  onChange={handleChange('whatsAppNumber')}
                  disabled={saving}
                />
              </div>
            </div>

            {/* Kitchen Category */}
            <div className={styles.field}>
              <label className={styles.label} htmlFor="field-category">
                Kitchen Category
              </label>
              <select
                id="field-category"
                className={styles.input}
                value={form.kitchenCategory}
                onChange={(e) => setForm(prev => ({ ...prev, kitchenCategory: e.target.value }))}
                disabled={saving}
              >
                <option value="" disabled>Select a category</option>
                <option value="Traditional">Traditional</option>
                <option value="Arabian">Arabian</option>
                <option value="Turkish">Turkish</option>
                <option value="Bakery">Bakery</option>
                <option value="Dessert">Dessert</option>
                <option value="Vegan">Vegan</option>
                <option value="Grill">Grill</option>
                <option value="Italian">Italian</option>
                <option value="Seafood">Seafood</option>
              </select>
            </div>

            {/* Bio — full width */}
            <div className={`${styles.field} ${styles.fieldFull}`}>
              <label className={styles.label} htmlFor="field-bio">
                Bio / Description
              </label>
              <textarea
                id="field-bio"
                className={styles.textarea}
                placeholder="Tell customers about your kitchen story, specialties, and what makes your cooking unique…"
                value={form.bio}
                onChange={handleChange('bio')}
                disabled={saving}
                rows={4}
              />
              <span
                className={`${styles.charCount} ${bioCharsLeft < 50 ? styles.warn : ''}`}
                aria-live="polite"
              >
                {MAX_BIO_CHARS - form.bio.length} / {MAX_BIO_CHARS} characters
              </span>
            </div>

            {/* Kitchen Location — full width */}
            <div className={`${styles.field} ${styles.fieldFull}`}>
              <label className={styles.label} htmlFor="field-location">
                Kitchen Location
              </label>
              <div className={styles.locationInputWrapper}>
                <span className={styles.locationPin} aria-hidden="true">
                  <EnvironmentOutlined />
                </span>
                <input
                  id="field-location"
                  type="text"
                  className={styles.locationInput}
                  placeholder="e.g. 123 Olive Grove Avenue, Sunnyvale, CA 94087"
                  value={form.location}
                  onChange={handleChange('location')}
                  disabled={saving}
                />
              </div>
            </div>
          </div>

          {/* ── Footer actions ── */}
          <div className={styles.footer}>
            <button
              type="button"
              className={styles.discardBtn}
              onClick={handleDiscard}
              disabled={saving || !isDirty}
              id="discard-changes-btn"
            >
              Discard Changes
            </button>
            <button
              type="button"
              className={styles.saveBtn}
              onClick={handleSave}
              disabled={saving || !isDirty}
              id="save-profile-btn"
            >
              <SaveOutlined />
              {saving ? 'Saving…' : 'Save Profile'}
            </button>
          </div>

        </div>
      )}

      {/* ── Toast ── */}
      {toast && (
        <div
          className={`${styles.toast} ${styles[toast.type]}`}
          role="status"
          aria-live="polite"
        >
          {toast.type === 'success' ? '✓ ' : '✕ '}{toast.message}
        </div>
      )}
    </div>
  )
}
