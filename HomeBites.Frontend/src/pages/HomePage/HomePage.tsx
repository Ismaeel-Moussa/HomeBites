import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFamilies } from '../../hooks/useFamilies'
import { UserOutlined, ShopOutlined } from '@ant-design/icons'
import styles from './HomePage.module.scss'

const KITCHEN_CATEGORIES = [
  'Traditional',
  'Arabian',
  'Turkish',
  'Bakery',
  'Dessert',
  'Vegan',
  'Grill',
  'Italian',
  'Seafood',
]

const HomePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const { families, loading } = useFamilies(selectedCategory || undefined)
  const navigate = useNavigate()

  // Helper to resolve profile image URL
  const apiBase = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000'
  const getFullUrl = (url?: string) => {
    if (!url) return undefined
    if (url.startsWith('http')) return url
    return `${apiBase}/${url}`
  }

  return (
    <div className={styles.pageContainer}>
      {/* Hero Section */}
      <header className={`surface-section ${styles.heroSection}`}>
        <div className="container">
          <div className={styles.heroContent}>
            <h1 className="text-display-lg">
              Explore Our <span className="gradient-text">Kitchens</span>
            </h1>
            <p className="text-body-lg text-muted">
              Discover authentic culinary experiences crafted by local home cooks.
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={`container ${styles.mainContent}`}>
        {/* Category Pills */}
        <section className={styles.filterSection}>
          <div className={styles.categoryPills}>
            <button
              className={`${styles.pill} ${!selectedCategory ? styles.activePill : ''}`}
              onClick={() => setSelectedCategory(null)}
            >
              All
            </button>
            {KITCHEN_CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`${styles.pill} ${selectedCategory === cat ? styles.activePill : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Kitchens Grid */}
        <section className={styles.kitchensSection}>
          <div className={styles.sectionHeader}>
            <h2 className="text-headline-md">
              {selectedCategory ? `${selectedCategory} Kitchens` : 'All Kitchens'}
            </h2>
            <span className="text-muted">{families.length} kitchens</span>
          </div>

          {loading ? (
            <div className={styles.loadingState}>
              <span className="text-headline-md">Loading kitchens...</span>
            </div>
          ) : families.length > 0 ? (
            <div className={styles.kitchensGrid}>
              {families.map(family => (
                <div 
                  key={family.id} 
                  className={styles.kitchenCard}
                  onClick={() => navigate(`/family/${family.id}`)}
                >
                  <div className={styles.cardHeader}>
                    {family.profileImageUrl ? (
                      <img 
                        src={getFullUrl(family.profileImageUrl)} 
                        alt={family.name} 
                        className={styles.profileImage}
                      />
                    ) : (
                      <div className={styles.avatarPlaceholder}>
                        <UserOutlined className={styles.avatarIcon} />
                      </div>
                    )}
                  </div>
                  
                  <div className={styles.cardBody}>
                    <h3 className={styles.kitchenName}>{family.name}</h3>
                    
                    {family.kitchenCategory && (
                      <div className={styles.categoryBadge}>
                        <ShopOutlined /> {family.kitchenCategory}
                      </div>
                    )}
                    
                    <p className={styles.kitchenBio}>
                      {family.bio || 'This home cook is busy preparing delicious meals!'}
                    </p>
                    
                    {family.location && (
                      <p className={styles.kitchenLocation}>📍 {family.location}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p className="text-headline-md text-muted">No kitchens found.</p>
              <p className="text-body-lg text-muted">Try selecting a different category.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default HomePage
