import React from 'react'
import type { Category } from '../../hooks/useCategories'
import styles from './CategoryFilter.module.scss'

interface CategoryFilterProps {
  categories: Category[]
  selectedCategoryId: number | null
  onSelectCategory: (id: number | null) => void
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory
}) => {
  return (
    <div className={styles.container}>
      <button
        className={`${styles.chip} ${selectedCategoryId === null ? styles.active : ''}`}
        onClick={() => onSelectCategory(null)}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          className={`${styles.chip} ${selectedCategoryId === cat.id ? styles.active : ''}`}
          onClick={() => onSelectCategory(cat.id)}
        >
          {cat.name}
        </button>
      ))}
    </div>
  )
}
