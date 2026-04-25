import React from 'react'
import type { Dish } from '../../hooks/useDishes'
import { IMAGE_BASE_URL } from '../../api/apiClient'
import styles from './ProfileDishCard.module.scss'
import { MessageFilled } from '@ant-design/icons'

interface ProfileDishCardProps {
  dish: Dish
}

export const ProfileDishCard: React.FC<ProfileDishCardProps> = ({ dish }) => {
  const imageUrl = dish.imageUrl ? `${IMAGE_BASE_URL}/${dish.imageUrl}` : 'https://placehold.co/600x400/f2f7ff/904800?text=No+Image'

  const handleWhatsApp = () => {
    const message = `Hello ${dish.familyName}, I would like to order: ${dish.name} (Price: ₺${dish.price})`
    const url = `https://wa.me/${dish.whatsAppNumber}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  return (
    <div className={`surface-card card-hover ${styles.card}`}>
      <div className={styles.imageContainer}>
        <img src={imageUrl} alt={dish.name} className={styles.image} />
      </div>
      
      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.title}>{dish.name}</h3>
          <span className={styles.price}>₺{dish.price.toFixed(2)}</span>
        </div>
        
        {dish.description && <p className={styles.description}>{dish.description}</p>}
        
        <button onClick={handleWhatsApp} className={styles.orderBtn} aria-label="Order on WhatsApp">
          <MessageFilled /> Order on WhatsApp
        </button>
      </div>
    </div>
  )
}
