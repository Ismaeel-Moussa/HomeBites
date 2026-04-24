import React, { useCallback, useEffect, useState } from 'react'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  MenuOutlined,
} from '@ant-design/icons'
import { useAuth } from '../../hooks/useAuth'
import { getMyDishes, deleteDish } from '../../api/dishes'
import type { Dish } from '../../hooks/useDishes'
import { IMAGE_BASE_URL } from '../../api/apiClient'
import { DishModal } from '../../components/DishModal/DishModal'
import styles from './MenuManagementPage.module.scss'

// ── Skeleton Card ──────────────────────────────────────────────────────────

const SkeletonCard: React.FC = () => (
  <div className={styles.skeletonCard}>
    <div className={styles.skeletonImage} />
    <div className={styles.skeletonBody}>
      <div className={`${styles.skeletonLine} ${styles.medium}`} />
      <div className={`${styles.skeletonLine} ${styles.short}`} />
    </div>
  </div>
)

// ── Delete Confirm Dialog ──────────────────────────────────────────────────

interface ConfirmDeleteProps {
  dishName: string
  onCancel: () => void
  onConfirm: () => void
  deleting: boolean
}

const ConfirmDelete: React.FC<ConfirmDeleteProps> = ({ dishName, onCancel, onConfirm, deleting }) => (
  <div className={styles.confirmOverlay} role="dialog" aria-modal="true">
    <div className={styles.confirmPanel}>
      <div className={styles.confirmIcon}>🗑️</div>
      <div>
        <h3>Delete Dish?</h3>
        <p>
          Are you sure you want to remove <strong>"{dishName}"</strong> from your
          menu? This action cannot be undone.
        </p>
      </div>
      <div className={styles.confirmActions}>
        <button className={styles.confirmCancel} onClick={onCancel} disabled={deleting}>
          Cancel
        </button>
        <button
          className={styles.confirmDelete}
          onClick={onConfirm}
          disabled={deleting}
          id="confirm-delete-btn"
        >
          {deleting ? 'Deleting…' : 'Yes, Delete'}
        </button>
      </div>
    </div>
  </div>
)

// ── Main Page ──────────────────────────────────────────────────────────────

export default function MenuManagementPage() {
  const { token } = useAuth()

  const [dishes, setDishes] = useState<Dish[]>([])
  const [loading, setLoading] = useState(true)

  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [editingDish, setEditingDish] = useState<Dish | null>(null)

  // Delete confirmation state
  const [deletingDish, setDeletingDish] = useState<Dish | null>(null)
  const [deleteInProgress, setDeleteInProgress] = useState(false)

  // ── Fetch my dishes ──────────────────────────────────────────────────────
  const fetchDishes = useCallback(async () => {
    if (!token) return
    setLoading(true)
    try {
      const data = await getMyDishes(token)
      setDishes(data)
    } catch (err) {
      console.error('Failed to fetch dishes:', err)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    fetchDishes()
  }, [fetchDishes])

  // ── Open Add modal ───────────────────────────────────────────────────────
  const handleAddNew = () => {
    setEditingDish(null)
    setModalOpen(true)
  }

  // ── Open Edit modal ──────────────────────────────────────────────────────
  const handleEdit = (dish: Dish) => {
    setEditingDish(dish)
    setModalOpen(true)
  }

  // ── Modal close ──────────────────────────────────────────────────────────
  const handleModalClose = () => {
    setModalOpen(false)
    setEditingDish(null)
  }

  // ── Confirm delete ────────────────────────────────────────────────────────
  const handleDeleteConfirm = async () => {
    if (!deletingDish || !token) return
    setDeleteInProgress(true)
    try {
      await deleteDish(token, deletingDish.id)
      setDishes(prev => prev.filter(d => d.id !== deletingDish.id))
      setDeletingDish(null)
    } catch (err) {
      console.error('Failed to delete dish:', err)
    } finally {
      setDeleteInProgress(false)
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className={styles.page}>
      {/* ── Page Header ── */}
      <header className={styles.pageHeader}>
        <div className={styles.pageTitle}>
          <h1>Menu Management</h1>
          <p>Curate and manage your signature dishes for the community.</p>
        </div>

        <button
          className={styles.addBtn}
          onClick={handleAddNew}
          id="add-new-dish-btn"
          type="button"
        >
          <PlusOutlined />
          Add New Dish
        </button>
      </header>

      {/* ── Current Menu Items ── */}
      <section aria-labelledby="menu-items-heading">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle} id="menu-items-heading">
            <MenuOutlined /> Current Menu Items
          </h2>
          {!loading && dishes.length > 0 && (
            <span className={styles.statBadge}>
              {dishes.length} {dishes.length === 1 ? 'Item' : 'Items'} Active
            </span>
          )}
        </div>

        <div className={styles.grid} style={{ marginTop: 'var(--space-5)' }}>
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          ) : dishes.length === 0 ? (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>🍽️</span>
              <h3>No dishes yet</h3>
              <p>
                Click <strong>"Add New Dish"</strong> to start building your
                menu and share your home cooking with the community.
              </p>
            </div>
          ) : (
            dishes.map(dish => {
              const imageUrl = dish.imageUrl
                ? `${IMAGE_BASE_URL}/${dish.imageUrl}`
                : 'https://placehold.co/600x400/f2f7ff/904800?text=No+Image'

              return (
                <article key={dish.id} className={styles.card}>
                  {/* Image */}
                  <div className={styles.cardImageWrapper}>
                    <img
                      src={imageUrl}
                      alt={dish.name}
                      className={styles.cardImage}
                      loading="lazy"
                    />
                    <span className={styles.priceBadge}>
                      ₺{dish.price.toFixed(2)}
                    </span>
                  </div>

                  {/* Body */}
                  <div className={styles.cardBody}>
                    <h3 className={styles.cardName}>{dish.name}</h3>
                    {dish.description && (
                      <p className={styles.cardDesc}>{dish.description}</p>
                    )}
                    <span className={styles.categoryTag}>{dish.categoryName}</span>
                  </div>

                  {/* Actions */}
                  <div className={styles.cardActions}>
                    <button
                      className={styles.editBtn}
                      onClick={() => handleEdit(dish)}
                      id={`edit-dish-${dish.id}`}
                      type="button"
                    >
                      <EditOutlined />
                      Edit
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => setDeletingDish(dish)}
                      id={`delete-dish-${dish.id}`}
                      type="button"
                      aria-label={`Delete ${dish.name}`}
                    >
                      <DeleteOutlined />
                    </button>
                  </div>
                </article>
              )
            })
          )}
        </div>
      </section>

      {/* ── DishModal (Add / Edit) ── */}
      {modalOpen && (
        <DishModal
          dish={editingDish}
          onClose={handleModalClose}
          onSuccess={fetchDishes}
        />
      )}

      {/* ── Delete Confirm Dialog ── */}
      {deletingDish && (
        <ConfirmDelete
          dishName={deletingDish.name}
          onCancel={() => setDeletingDish(null)}
          onConfirm={handleDeleteConfirm}
          deleting={deleteInProgress}
        />
      )}
    </div>
  )
}
