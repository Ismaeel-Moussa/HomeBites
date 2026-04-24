import React, { useState } from 'react'
import { useDishes } from '../../hooks/useDishes'
import { useCategories } from '../../hooks/useCategories'
import { DishCard } from '../../components/DishCard/DishCard'
import { CategoryFilter } from '../../components/CategoryFilter/CategoryFilter'
import styles from './HomePage.module.scss'
import { SearchOutlined } from '@ant-design/icons'

const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)

  const { categories, loading: catsLoading } = useCategories()
  const { dishes, loading: dishesLoading } = useDishes(searchQuery, selectedCategory)

  return (
    <div className={styles.pageContainer}>
      {/* Header Section */}
      <header className={`surface-section ${styles.headerSection}`}>
        <div className="container">
          <div className={styles.heroContent}>
            <h1 className="text-display-md">
              Discover <span className="gradient-text">Home Cooked</span> Meals
            </h1>
            <p className="text-body-lg text-muted">
              Authentic flavors from local families, straight to your table.
            </p>
            
            <div className={styles.searchBar}>
              <SearchOutlined className={styles.searchIcon} />
              <input 
                type="text" 
                placeholder="Search dishes, ingredients, or families..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={`container ${styles.mainContent}`}>
        <section className={styles.filterSection}>
          <h2 className="text-headline-md">Categories</h2>
          {!catsLoading && (
            <CategoryFilter 
              categories={categories} 
              selectedCategoryId={selectedCategory} 
              onSelectCategory={setSelectedCategory} 
            />
          )}
        </section>

        <section className={styles.dishesSection}>
          <div className={styles.sectionHeader}>
            <h2 className="text-headline-md">
              {searchQuery ? 'Search Results' : 'Featured Dishes'}
            </h2>
            <span className="text-muted">{dishes.length} dishes</span>
          </div>

          {dishesLoading ? (
            <div className={styles.loadingState}>
              <span className="text-headline-md">Loading dishes...</span>
            </div>
          ) : dishes.length > 0 ? (
            <div className={styles.dishesGrid}>
              {dishes.map(dish => (
                <DishCard key={dish.id} dish={dish} />
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p className="text-headline-md text-muted">No dishes found.</p>
              <p className="text-body-lg text-muted">Try adjusting your search or category filter.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default HomePage
