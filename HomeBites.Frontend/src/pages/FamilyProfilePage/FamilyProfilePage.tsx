import React, { useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useFamilyProfile } from '../../hooks/useFamilyProfile'
import { ProfileDishCard } from '../../components/ProfileDishCard/ProfileDishCard'
import { IMAGE_BASE_URL } from '../../api/apiClient'
import { MessageOutlined, EnvironmentOutlined, ArrowLeftOutlined, ReloadOutlined } from '@ant-design/icons'
import styles from './FamilyProfilePage.module.scss'

const ALL_TAB = 'All'

const getCategoryEmoji = (category: string) => {
  switch (category.toLowerCase()) {
    case 'drinks': return '🥤';
    case 'appetizers': return '🥗';
    case 'mains': return '🍲';
    case 'desserts': return '🍰';
    case 'all': return '🍴';
    default: return '🍴';
  }
}

const FamilyProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const familyId = Number(id)

  const { family, loading, error } = useFamilyProfile(familyId)
  const [activeTab, setActiveTab] = useState<string>(ALL_TAB)

  // Always show all main categories as tabs
  const tabs = useMemo(() => {
    if (!family) return []
    return [ALL_TAB, 'Mains', 'Appetizers', 'Desserts', 'Drinks']
  }, [family])

  const filteredDishes = useMemo(() => {
    if (!family) return []
    if (activeTab === ALL_TAB) return family.dishes
    return family.dishes.filter(d => d.categoryName === activeTab)
  }, [family, activeTab])

  // Group filtered dishes by category for section headings
  const dishesByCategory = useMemo(() => {
    const map = new Map<string, typeof filteredDishes>()
    for (const dish of filteredDishes) {
      const existing = map.get(dish.categoryName) ?? []
      map.set(dish.categoryName, [...existing, dish])
    }
    return map
  }, [filteredDishes])

  const profileImageUrl = family?.profileImageUrl
    ? `${IMAGE_BASE_URL}/${family.profileImageUrl}`
    : 'https://placehold.co/160x160/ffc5ac/7d2f00?text=🍽'

  const handleWhatsAppContact = () => {
    if (!family) return
    const msg = `Hello ${family.name}! I found your kitchen on Home Bites and would love to learn more.`
    window.open(`https://wa.me/${family.whatsAppNumber}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  // ── Loading State ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className={styles.stateContainer}>
        <div className={styles.skeletonHero}>
          <div className={`${styles.skeletonCircle} ${styles.shimmer}`} />
          <div className={`${styles.skeletonLine} ${styles.shimmer}`} style={{ width: '200px' }} />
          <div className={`${styles.skeletonLine} ${styles.shimmer}`} style={{ width: '120px' }} />
          <div className={`${styles.skeletonLine} ${styles.shimmer}`} style={{ width: '80%', height: '2.5rem', borderRadius: '9999px', marginTop: '0.5rem' }} />
        </div>
        <div className={`container ${styles.skeletonGrid}`}>
          {[1, 2, 3].map(i => (
            <div key={i} className={`${styles.skeletonCard} ${styles.shimmer}`} />
          ))}
        </div>
      </div>
    )
  }

  // ── Error / Not Found State ────────────────────────────────────────────────
  if (error) {
    return (
      <div className={styles.stateContainer}>
        <div className={styles.errorState}>
          <span className={styles.errorEmoji}>🍽️</span>
          <h2 className="text-headline-lg">{error}</h2>
          <p className="text-body-lg text-muted">
            {error === 'Family not found.'
              ? "We couldn't find this kitchen. It may have moved or closed."
              : "Something went wrong while loading this page."}
          </p>
          <div className={styles.errorActions}>
            <button className={`btn-primary-gradient ${styles.errorBtn}`} onClick={() => navigate(-1)}>
              <ArrowLeftOutlined /> Go Back
            </button>
            {error !== 'Family not found.' && (
              <button className={`${styles.errorBtn} ${styles.retryBtn}`} onClick={() => window.location.reload()}>
                <ReloadOutlined /> Retry
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (!family) return null

  // ── Main Page ──────────────────────────────────────────────────────────────
  return (
    <div className={styles.page}>
      {/* ── Hero Section ── */}
      <header className={`surface-section ${styles.hero}`}>
        <div className={`container-narrow ${styles.heroInner}`}>

          {/* Back button */}
          <button
            className={styles.backBtn}
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <ArrowLeftOutlined />
          </button>

          {/* Avatar */}
          <div className={styles.avatarWrapper}>
            <img
              src={profileImageUrl}
              alt={`${family.name} profile`}
              className={styles.avatar}
            />
            <span className={styles.onlineDot} aria-label="Active kitchen" />
          </div>

          {/* Info */}
          <h1 className={`text-display-md ${styles.familyName}`}>{family.name}</h1>

          {family.location && (
            <p className={`text-body-md text-muted ${styles.location}`}>
              <EnvironmentOutlined className={styles.locationIcon} />
              {family.location}
            </p>
          )}

          {family.bio && (
            <p className={`text-body-lg ${styles.bio}`}>{family.bio}</p>
          )}

          {/* WhatsApp CTA */}
          <button
            id="family-profile-whatsapp-cta"
            className={`btn-whatsapp ${styles.whatsappCta}`}
            onClick={handleWhatsAppContact}
          >
            <MessageOutlined />
            Contact via WhatsApp
          </button>
        </div>
      </header>

      {/* ── Category Tabs ── */}
      {tabs.length > 0 && (
        <nav className={`surface ${styles.tabBar}`} aria-label="Dish categories">
          <div className="container-narrow">
            <ul className={styles.tabList} role="tablist">
              {tabs.map(tab => (
                <li key={tab} role="none">
                  <button
                    id={`tab-${tab.replace(/\s+/g, '-').toLowerCase()}`}
                    role="tab"
                    aria-selected={activeTab === tab}
                    className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      )}

      {/* ── Dish Sections ── */}
      <main className={`container-narrow ${styles.main}`}>
        {filteredDishes.length === 0 ? (
          <div className={styles.emptyState}>
            <span>🍳</span>
            <p className="text-headline-md text-muted">No dishes in this category yet.</p>
          </div>
        ) : activeTab === ALL_TAB ? (
          // "All" tab — grouped by category with section headings
          Array.from(dishesByCategory.entries()).map(([category, dishes]) => (
            <section key={category} className={styles.categorySection}>
              <h2 className={`text-headline-md ${styles.categoryTitle}`}>
                <span className={styles.categoryIcon}>{getCategoryEmoji(category)}</span>
                {category}
              </h2>
              <div className={styles.dishGrid}>
                {dishes.map(dish => (
                  <ProfileDishCard key={dish.id} dish={dish} />
                ))}
              </div>
            </section>
          ))
        ) : (
          // Specific tab — flat grid with a heading
          <section className={styles.categorySection}>
            <h2 className={`text-headline-md ${styles.categoryTitle}`}>
              <span className={styles.categoryIcon}>{getCategoryEmoji(activeTab)}</span>
              {activeTab}
            </h2>
            <div className={styles.dishGrid}>
              {filteredDishes.map(dish => (
                <ProfileDishCard key={dish.id} dish={dish} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

export default FamilyProfilePage
