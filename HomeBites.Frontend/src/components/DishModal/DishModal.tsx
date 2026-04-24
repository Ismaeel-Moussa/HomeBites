import React, { useCallback, useEffect, useRef, useState } from 'react'
import { CloudUploadOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons'
import type { Dish } from '../../hooks/useDishes'
import { useCategories } from '../../hooks/useCategories'
import { useAuth } from '../../hooks/useAuth'
import { createDish, updateDish } from '../../api/dishes'
import { IMAGE_BASE_URL } from '../../api/apiClient'
import styles from './DishModal.module.scss'

// ── Types ──────────────────────────────────────────────────────────────────

interface DishModalProps {
  /** Pass a dish to enter Edit mode; omit (or pass null) for Add mode. */
  dish?: Dish | null
  onClose: () => void
  /** Called after a successful create or update so the parent can refresh. */
  onSuccess: () => void
}

interface FormState {
  name: string
  description: string
  price: string
  categoryId: string
}

// ── Component ──────────────────────────────────────────────────────────────

export const DishModal: React.FC<DishModalProps> = ({ dish, onClose, onSuccess }) => {
  const isEditMode = !!dish
  const { token } = useAuth()
  const { categories } = useCategories()

  const [form, setForm] = useState<FormState>({
    name: dish?.name ?? '',
    description: dish?.description ?? '',
    price: dish?.price != null ? String(dish.price) : '',
    categoryId: dish?.categoryId != null ? String(dish.categoryId) : '',
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    dish?.imageUrl ? `${IMAGE_BASE_URL}/${dish.imageUrl}` : null,
  )
  const [dragOver, setDragOver] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // ── Sync form when dish prop changes ───────────────────────────────────
  useEffect(() => {
    setForm({
      name: dish?.name ?? '',
      description: dish?.description ?? '',
      price: dish?.price != null ? String(dish.price) : '',
      categoryId: dish?.categoryId != null ? String(dish.categoryId) : '',
    })
    setPreviewUrl(dish?.imageUrl ? `${IMAGE_BASE_URL}/${dish.imageUrl}` : null)
    setImageFile(null)
    setError(null)
  }, [dish])

  // ── Close on Escape ─────────────────────────────────────────────────────
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  // ── Image helpers ───────────────────────────────────────────────────────
  const applyFile = (file: File) => {
    setImageFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) applyFile(file)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) applyFile(file)
  }, [])

  // ── Form helpers ────────────────────────────────────────────────────────
  const setField = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => setForm(prev => ({ ...prev, [field]: e.target.value }))

  // ── Submit ──────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (!form.name.trim()) return setError('Dish name is required.')
    const price = parseFloat(form.price)
    if (isNaN(price) || price <= 0) return setError('Please enter a valid price greater than 0.')
    if (!form.categoryId) return setError('Please select a category.')
    if (!isEditMode && !imageFile) return setError('Please upload a dish image.')

    if (!token) return setError('You must be logged in.')

    setLoading(true)
    try {
      if (isEditMode && dish) {
        await updateDish(token, dish.id, {
          name: form.name.trim(),
          description: form.description.trim() || undefined,
          price,
          categoryId: parseInt(form.categoryId),
          file: imageFile ?? undefined,
        })
      } else {
        await createDish(token, {
          name: form.name.trim(),
          description: form.description.trim() || undefined,
          price,
          categoryId: parseInt(form.categoryId),
          file: imageFile!,
        })
      }
      onSuccess()
      onClose()
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        err?.message ||
        'Something went wrong. Please try again.'
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg))
    } finally {
      setLoading(false)
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dish-modal-title"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className={styles.panel}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerText}>
            <h2 id="dish-modal-title">
              {isEditMode ? 'Edit Dish' : 'Add New Dish'}
            </h2>
            <p>
              {isEditMode
                ? 'Update the details for this dish.'
                : 'Fill in the details to add a new dish to your menu.'}
            </p>
          </div>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close modal"
            type="button"
          >
            <CloseOutlined />
          </button>
        </div>

        {/* Form */}
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {/* Dish Name */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="dish-name">
              Dish Name <span className={styles.required}>*</span>
            </label>
            <input
              id="dish-name"
              className={styles.input}
              type="text"
              placeholder="e.g. Grandma's Famous Lasagna"
              value={form.name}
              onChange={setField('name')}
              disabled={loading}
            />
          </div>

          {/* Description */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="dish-description">
              Description
            </label>
            <textarea
              id="dish-description"
              className={styles.textarea}
              placeholder="Describe the ingredients, taste, and story..."
              value={form.description}
              onChange={setField('description')}
              disabled={loading}
            />
          </div>

          {/* Category + Price row */}
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="dish-category">
                Category <span className={styles.required}>*</span>
              </label>
              <select
                id="dish-category"
                className={styles.select}
                value={form.categoryId}
                onChange={setField('categoryId')}
                disabled={loading}
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="dish-price">
                Price ($) <span className={styles.required}>*</span>
              </label>
              <input
                id="dish-price"
                className={styles.input}
                type="number"
                min="0.01"
                step="0.01"
                placeholder="15.00"
                value={form.price}
                onChange={setField('price')}
                disabled={loading}
              />
            </div>
          </div>

          {/* Image Upload / Preview */}
          <div className={styles.field}>
            <label className={styles.label}>
              Dish Image {!isEditMode && <span className={styles.required}>*</span>}
            </label>

            {previewUrl ? (
              /* ── Preview mode ── */
              <div className={styles.previewWrapper}>
                <img src={previewUrl} alt="Preview" className={styles.previewImg} />
                <div className={styles.previewOverlay}>
                  <EditOutlined />
                  Replace Image
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={loading}
                    aria-label="Replace dish image"
                  />
                </div>
              </div>
            ) : (
              /* ── Upload zone ── */
              <div
                className={`${styles.uploadZone} ${dragOver ? styles.dragOver : ''}`}
                onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={loading}
                  aria-label="Upload dish image"
                />
                <span className={styles.uploadIcon}>
                  <CloudUploadOutlined />
                </span>
                <span className={styles.uploadText}>
                  Click to upload or drag and drop
                </span>
                <span className={styles.uploadHint}>PNG, JPG up to 10MB</span>
              </div>
            )}
          </div>

          {/* Error */}
          {error && <div className={styles.errorBanner} role="alert">{error}</div>}

          {/* Footer */}
          <div className={styles.footer}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
              id="dish-modal-submit"
            >
              {loading && <span className={styles.spinner} />}
              {loading
                ? isEditMode ? 'Saving…' : 'Adding…'
                : isEditMode ? 'Save Changes' : 'Add to Menu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
