import React from 'react'
import { Link } from 'react-router-dom'
import type { Dish } from '../../hooks/useDishes'
import { IMAGE_BASE_URL } from '../../api/apiClient'
import styles from './DishCard.module.scss'
import { MessageOutlined } from '@ant-design/icons'

interface DishCardProps {
  dish: Dish
  /** Set to false on the Family Profile page to hide the family avatar row. Defaults to true. */
  showFamily?: boolean
}

export const DishCard: React.FC<DishCardProps> = ({ dish, showFamily = true }) => {
  const imageUrl = dish.imageUrl ? `${IMAGE_BASE_URL}/${dish.imageUrl}` : 'https://placehold.co/600x400/f2f7ff/904800?text=No+Image'
  const profileUrl = dish.familyProfileImageUrl ? `${IMAGE_BASE_URL}/${dish.familyProfileImageUrl}` : 'https://placehold.co/100x100/ffc5ac/7d2f00?text=F'

  const handleWhatsApp = () => {
    const message = `Hello ${dish.familyName}, I would like to order: ${dish.name} (Price: $${dish.price})`
    const url = `https://wa.me/${dish.whatsAppNumber}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  return (
    <div className={`surface-card card-hover ${styles.card}`}>
      <div className={styles.imageContainer}>
        <img src={imageUrl} alt={dish.name} className={styles.image} />
        <div className={`chip chip-warm ${styles.categoryChip}`}>
          {dish.categoryName}
        </div>
      </div>
      
      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className="text-headline-md">{dish.name}</h3>
          <span className={`text-headline-md gradient-text ${styles.price}`}>${dish.price.toFixed(2)}</span>
        </div>
        
        {dish.description && <p className={`text-body-md text-muted ${styles.description}`}>{dish.description}</p>}
        
        <div className={styles.footer}>
          {showFamily && (
            <Link
              to={`/family/${dish.familyId}`}
              className={styles.cookInfo}
              aria-label={`View ${dish.familyName}'s profile`}
            >
              <img src={profileUrl} alt={dish.familyName} className={styles.avatar} />
              <span className="text-label">{dish.familyName}</span>
            </Link>
          )}
          
          <button onClick={handleWhatsApp} className={`btn-whatsapp ${styles.orderBtn}`} aria-label="Order via WhatsApp">
            <MessageOutlined /> Order
          </button>
        </div>
      </div>
    </div>
  )
}
