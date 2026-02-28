import { useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { Testimonials } from './components/Testimonials'

type Business = {
  id: string
  name: string
  logo?: string
  description?: string
  rating?: number
  phone?: string
  email?: string
  website?: string
  category?: string
  location?: string
  featured?: boolean
  badges?: string[]
  coordinates?: { lat: number; lng: number }
}

type Deal = {
  id: string
  title: string
  description: string
  expiresAt?: string
}

type RippleState = {
  x: number
  y: number
  key: number
}

const PER_PAGE = 6

function safeFetch<T>(path: string, fallback: T): Promise<T> {
  return fetch(path)
    .then((res) => (res.ok ? res.json() : fallback))
    .catch(() => fallback)
}

function useCountUp(target: number) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    const start = performance.now()
    const duration = 1100

    let frame = 0
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(target * eased))
      if (progress < 1) {
        frame = requestAnimationFrame(tick)
      }
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target])

  return value
}

function normalizeMapPoints(items: Business[]) {
  const points = items.filter((item) => item.coordinates)
  if (points.length === 0) return []

  const lats = points.map((item) => item.coordinates!.lat)
  const lngs = points.map((item) => item.coordinates!.lng)
  const minLat = Math.min(...lats)
  const maxLat = Math.max(...lats)
  const minLng = Math.min(...lngs)
  const maxLng = Math.max(...lngs)

  return points.map((item, index) => {
    const lat = item.coordinates!.lat
    const lng = item.coordinates!.lng
    const x = maxLng === minLng ? 50 : ((lng - minLng) / (maxLng - minLng)) * 84 + 8
    const y = maxLat === minLat ? 50 : ((maxLat - lat) / (maxLat - minLat)) * 74 + 13
    return { ...item, x, y, index }
  })
}

function App() {
  const cardsRef = useRef<HTMLDivElement>(null)
  const sectionsRef = useRef<Array<HTMLElement | null>>([])

  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [locations, setLocations] = useState<string[]>([])
  const [results, setResults] = useState<Business[]>([])
  const [featured, setFeatured] = useState<Business[]>([])
  const [recommendations, setRecommendations] = useState<Business[]>([])
  const [promotions, setPromotions] = useState<Deal[]>([])
  const [activePage, setActivePage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [suggestions, setSuggestions] = useState<Business[]>([])
  const [mapMode, setMapMode] = useState<'list' | 'map'>('list')
  const [flippedCards, setFlippedCards] = useState<string[]>([])
  const [dealsRipple, setDealsRipple] = useState<Record<string, RippleState>>({})
  const [scrollProgress, setScrollProgress] = useState(0)
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    safeFetch<string[]>('/categories', ['Restaurant', 'Health', 'Auto', 'Tech']).then(setCategories)
    safeFetch<string[]>('/locations', ['Accra', 'Kumasi', 'Tamale', 'Takoradi']).then(setLocations)
    safeFetch<Business[]>('/featured-businesses', []).then(setFeatured)
    safeFetch<Business[]>('/recommendations', []).then(setRecommendations)
    safeFetch<Deal[]>('/api/promotions', []).then((data) => {
      setPromotions(data.length > 0 ? data : seedPromotions)
    })
    safeFetch<Business[]>('/search', []).then((data) => {
      setResults(data)
      setActivePage(1)
      setIsLoading(false)
    })
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const max = Math.max(document.body.scrollHeight - window.innerHeight, 1)
      setScrollProgress(window.scrollY / max)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view')
          }
        })
      },
      { threshold: 0.2 },
    )

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section)
    })

    return () => observer.disconnect()
  }, [results, activePage])

  useEffect(() => {
    if (!query.trim()) {
      return
    }
    safeFetch<Business[]>(
      `/search?keyword=${encodeURIComponent(query)}&limit=5`,
      [],
    ).then((data) => {
      setSuggestions(data)
      setSearchOpen(data.length > 0)
    })
  }, [query])

  const paginatedResults = useMemo(() => {
    const start = (activePage - 1) * PER_PAGE
    return results.slice(start, start + PER_PAGE)
  }, [activePage, results])

  const totalPages = Math.max(1, Math.ceil(results.length / PER_PAGE))
  const mapPoints = useMemo(() => normalizeMapPoints(results), [results])
  const totalBusinesses = useCountUp(results.length || 1)
  const totalCategories = useCountUp(categories.length || 1)

  const toggleFilter = (value: string, current: string[], setter: (next: string[]) => void) => {
    if (current.includes(value)) {
      setter(current.filter((item) => item !== value))
      return
    }
    setter([...current, value])
  }

  const runSearch = async () => {
    setIsLoading(true)
    const params = new URLSearchParams()
    if (query.trim()) params.set('keyword', query.trim())
    if (selectedCategories.length > 0) params.set('category', selectedCategories.join(','))
    if (selectedLocations.length > 0) params.set('location', selectedLocations.join(','))
    const apiPath = `/search?${params.toString()}`

    const data = await safeFetch<Business[]>(apiPath, [])
    setResults(data)
    setActivePage(1)
    setIsLoading(false)
  }

  const heroStyle: CSSProperties = {
    transform: `translateY(${scrollProgress * -32}px) scale(${1 + scrollProgress * 0.02})`,
  }

  const storyStyle: CSSProperties = {
    transform: `translateY(${scrollProgress * -70}px)`,
    opacity: 0.35 + scrollProgress * 0.65,
  }

  return (
    <div className="page-shell" style={{ '--story': `${scrollProgress}` } as CSSProperties}>
      <div className="story-layer" style={storyStyle} />

      <header className={`topbar slide-down ${scrollProgress > 0.02 ? 'scrolled' : ''}`}>
        <a className="brand" href="/">
          KosBiz
        </a>

        <nav className={`menu ${isMobileOpen ? 'open' : ''}`}>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
          <a href="/how-to-use">How To Use</a>
          <a href="/admin">Admin</a>
          <a className="btn btn-outline" href="/login">
            Login
          </a>
          <a className="btn btn-solid" href="/register">
            Signup
          </a>
        </nav>

        <button
          className={`hamburger ${isMobileOpen ? 'open' : ''}`}
          onClick={() => setIsMobileOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      <section
        className="hero"
        ref={(el) => {
          sectionsRef.current[0] = el
        }}
      >
        <video className="hero-video" autoPlay muted loop playsInline>
          <source src="https://cdn.coverr.co/videos/coverr-aerial-view-of-a-city-1579/1080p.mp4" type="video/mp4" />
        </video>
        <div className="particle-layer" />

        <div className="hero-overlay" style={heroStyle}>
          <h1 className="hero-title">Find trusted local businesses fast</h1>
          <p>Search by keyword, location, and category to discover businesses near you.</p>

          <div className="search-bar">
            <input
              value={query}
              onFocus={() => setSearchOpen(suggestions.length > 0)}
              onBlur={() => setTimeout(() => setSearchOpen(false), 120)}
              onChange={(e) => {
                const nextQuery = e.target.value
                setQuery(nextQuery)
                if (!nextQuery.trim()) {
                  setSuggestions([])
                  setSearchOpen(false)
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') runSearch()
              }}
              placeholder="Search for business, product, or service"
            />
            <button className="ripple" onClick={runSearch}>
              Search
            </button>
          </div>

          <div className={`typeahead ${searchOpen ? 'open' : ''}`}>
            {suggestions.map((item, idx) => (
              <button
                key={item.id}
                style={{ animationDelay: `${idx * 45}ms` }}
                onClick={() => {
                  setQuery(item.name)
                  setSearchOpen(false)
                  runSearch()
                }}
              >
                {item.name}
              </button>
            ))}
          </div>

          <div className="quick-row">
            <span>Trending:</span>
            {['Restaurant near me', 'Pharmacy', 'Car Wash'].map((trend) => (
              <button
                key={trend}
                className="chip"
                onClick={() => {
                  setQuery(trend)
                  runSearch()
                }}
              >
                {trend}
              </button>
            ))}
          </div>

          <div className="icon-row">
            {[
              { label: 'Food', value: 'Restaurant' },
              { label: 'Health', value: 'Health' },
              { label: 'Auto', value: 'Auto' },
              { label: 'Tech', value: 'Tech' },
            ].map((item) => (
              <button
                className="category-icon"
                key={item.value}
                onClick={() => {
                  setSelectedCategories([item.value])
                  runSearch()
                }}
              >
                <strong>{item.label.slice(0, 1)}</strong>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section
        className="filters reveal"
        ref={(el) => {
          sectionsRef.current[1] = el
        }}
      >
        <h2>Filters</h2>
        <div className="filter-group">
          <p>Category</p>
          <div className="pill-list">
            {(categories.length > 0 ? categories : ['Restaurant', 'Health', 'Auto']).map((item) => (
              <button
                key={item}
                className={`pill ${selectedCategories.includes(item) ? 'active pop' : ''}`}
                onClick={() => toggleFilter(item, selectedCategories, setSelectedCategories)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <p>Location</p>
          <div className="pill-list">
            {(locations.length > 0 ? locations : ['Accra', 'Kumasi', 'Tamale']).map((item) => (
              <button
                key={item}
                className={`pill ${selectedLocations.includes(item) ? 'active pop' : ''}`}
                onClick={() => toggleFilter(item, selectedLocations, setSelectedLocations)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <button className="btn btn-solid" onClick={runSearch}>
          Apply Filters
        </button>
      </section>

      <section
        className="listings reveal"
        ref={(el) => {
          sectionsRef.current[2] = el
        }}
      >
        <div className="section-head">
          <h2>Business Listings</h2>
          <button
            className="view-toggle"
            onClick={() => setMapMode((prev) => (prev === 'list' ? 'map' : 'list'))}
            aria-label={`Switch to ${mapMode === 'list' ? 'map' : 'list'} view`}
          >
            <span className={`view-dot ${mapMode === 'map' ? 'map' : ''}`} />
            {mapMode === 'list' ? 'Map View' : 'List View'}
          </button>
        </div>

        {isLoading && <p>Loading results...</p>}
        {!isLoading && results.length === 0 && <p>No businesses found from database for this filter.</p>}

        <div className="switch-stage">
          <div className={`panel cards-panel ${mapMode === 'list' ? 'active' : 'hidden'}`} ref={cardsRef}>
            <div className="cards">
              {paginatedResults.map((item) => {
                const filled = `${Math.max(0, Math.min(100, ((item.rating ?? 0) / 5) * 100))}%`
                const isFlipped = flippedCards.includes(item.id)
                return (
                  <article
                    key={item.id}
                    className={`biz-card fade-in ${isFlipped ? 'flipped' : ''}`}
                    onMouseMove={(e) => {
                      const target = e.currentTarget
                      const rect = target.getBoundingClientRect()
                      const x = e.clientX - rect.left
                      const y = e.clientY - rect.top
                      const rx = ((y / rect.height) * -12 + 6).toFixed(2)
                      const ry = ((x / rect.width) * 12 - 6).toFixed(2)
                      target.style.setProperty('--rx', `${rx}deg`)
                      target.style.setProperty('--ry', `${ry}deg`)
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.setProperty('--rx', '0deg')
                      e.currentTarget.style.setProperty('--ry', '0deg')
                    }}
                  >
                    <div className="biz-card-inner">
                      <div className="biz-face front">
                        <div className="card-top">
                          <img
                            loading="lazy"
                            src={item.logo || 'https://dummyimage.com/80x80/ddd/333.png&text=KB'}
                            alt={`${item.name} logo`}
                          />
                          <div>
                            <h3>{item.name}</h3>
                            {item.badges && item.badges.length > 0 && (
                              <div className="badge-row">
                                {item.badges.map((badge) => (
                                  <span
                                    key={`${item.id}-${badge}`}
                                    className={`badge ${
                                      badge.toLowerCase() === 'verified'
                                        ? 'badge-verified'
                                        : badge.toLowerCase() === 'top rated'
                                          ? 'badge-top-rated'
                                          : 'badge-new'
                                    }`}
                                  >
                                    {badge}
                                  </span>
                                ))}
                              </div>
                            )}
                            <p>{item.description}</p>
                          </div>
                        </div>

                        <div className="rating-wrap" style={{ '--fill': filled } as CSSProperties}>
                          <span className="stars base">*****</span>
                          <span className="stars fill">*****</span>
                        </div>

                        <div className="card-actions">
                          <a className="btn btn-outline" href={`/business/${item.id}`}>
                            View Details
                          </a>
                          <button
                            className="btn btn-solid"
                            onClick={() => {
                              setFlippedCards((prev) =>
                                prev.includes(item.id) ? prev.filter((id) => id !== item.id) : [...prev, item.id],
                              )
                            }}
                          >
                            More
                          </button>
                        </div>
                      </div>

                      <div className="biz-face back">
                        <h3>{item.name}</h3>
                        <p>Phone: {item.phone || 'N/A'}</p>
                        <p>Email: {item.email || 'N/A'}</p>
                        <p>Website: {item.website || 'N/A'}</p>
                        <button className="btn btn-outline" onClick={() => setFlippedCards((prev) => prev.filter((id) => id !== item.id))}>
                          Back
                        </button>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>

          <div className={`panel map-panel ${mapMode === 'map' ? 'active' : 'hidden'}`}>
            <div className="fake-map">
              <div className="heatmap-grid" />
              {mapPoints.map((item) => (
                <a
                  key={item.id}
                  className="pin"
                  href={`/business/${item.id}`}
                  style={{ left: `${item.x}%`, top: `${item.y}%`, animationDelay: `${item.index * 70}ms` }}
                >
                  <span className="pin-dot" />
                  <span className="pin-name">{item.name}</span>
                </a>
              ))}
              {mapPoints.length > 3 && <div className="cluster">{mapPoints.length}</div>}
            </div>
            <p className="map-note">Cluster and heat pulse are visualized; swap this block with Leaflet or Maps SDK when ready.</p>
          </div>
        </div>

        <div className="pagination">
          <button disabled={activePage === 1} onClick={() => setActivePage((prev) => Math.max(1, prev - 1))}>
            Prev
          </button>
          <span>
            Page {activePage} of {totalPages}
          </span>
          <button disabled={activePage === totalPages} onClick={() => setActivePage((prev) => Math.min(totalPages, prev + 1))}>
            Next
          </button>
        </div>
      </section>

      <section
        className="carousel reveal"
        ref={(el) => {
          sectionsRef.current[3] = el
        }}
      >
        <h2>Featured Businesses</h2>
        {featured.length > 0 ? (
          <div className="track-wrap">
            <div className="carousel-track auto-scroll">
              {[...featured, ...featured].map((item, idx) => (
                <article key={`${item.id}-f-${idx}`} className="mini-card rot-card">
                  <div className="mini-inner">
                    <div className="mini-face front">
                      <h3>{item.name}</h3>
                      <p>{item.description}</p>
                      <div className="badge-row">
                        {(item.badges || ['Verified']).map((badge) => (
                          <span
                            key={`${item.id}-${badge}-${idx}`}
                            className={`badge ${
                              badge.toLowerCase() === 'verified'
                                ? 'badge-verified'
                                : badge.toLowerCase() === 'top rated'
                                  ? 'badge-top-rated'
                                  : 'badge-new'
                            }`}
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="mini-face back">
                      <div className="quick-actions">
                        <a href={`tel:${item.phone || ''}`}>Call</a>
                        <a href={`https://wa.me/${(item.phone || '').replace(/\D/g, '')}`}>WhatsApp</a>
                        <a href={`https://maps.google.com/?q=${encodeURIComponent(item.location || item.name)}`}>Directions</a>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : (
          <p>No featured businesses returned from database yet.</p>
        )}
      </section>

      <section
        className="carousel reveal"
        ref={(el) => {
          sectionsRef.current[4] = el
        }}
      >
        <h2>For You</h2>
        {recommendations.length > 0 ? (
          <div className="track-wrap">
            <div className="carousel-track auto-scroll reverse">
              {[...recommendations, ...recommendations].map((item, idx) => (
                <article key={`${item.id}-r-${idx}`} className="mini-card rot-card">
                  <div className="mini-inner">
                    <div className="mini-face front">
                      <h3>{item.name}</h3>
                      <p>{item.description}</p>
                    </div>
                    <div className="mini-face back">
                      <a href={`/business/${item.id}`}>Open Profile</a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : (
          <p>No recommendations returned from database yet.</p>
        )}
      </section>

      <section
        className="carousel reveal"
        ref={(el) => {
          sectionsRef.current[5] = el
        }}
      >
        <h2>Deals and Promotions</h2>
        <div className="carousel-row">
          {promotions.map((item) => {
            const ripple = dealsRipple[item.id]
            return (
              <article
                key={item.id}
                className="mini-card deal-card ripple"
                onClick={(e) => {
                  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
                  setDealsRipple((prev) => ({
                    ...prev,
                    [item.id]: {
                      x: e.clientX - rect.left,
                      y: e.clientY - rect.top,
                      key: Date.now(),
                    },
                  }))
                }}
              >
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <p>{item.expiresAt ? `Ends: ${item.expiresAt}` : 'Limited offer'}</p>
                {ripple && <span key={ripple.key} className="ripple" style={{ left: ripple.x, top: ripple.y } as CSSProperties} />}
              </article>
            )
          })}
        </div>
      </section>

      <Testimonials />

      <footer
        className="footer reveal"
        ref={(el) => {
          sectionsRef.current[6] = el
        }}
      >
        <div>
          <h3>Contact</h3>
          <p>support@kosbiz.com</p>
          <p>+233 200 000 000</p>
          <p>
            <a href="/about">About</a> | <a href="/terms">Terms</a> | <a href="/terms#privacy">Privacy</a>
          </p>
          <div className="socials">
            {['F', 'X', 'I', 'L'].map((item, socialIndex) => (
              <a key={item} className="social" style={{ animationDelay: `${socialIndex * 60}ms` }} href="/contact">
                {item}
              </a>
            ))}
          </div>
        </div>

        <form
          className="newsletter-form"
          onSubmit={async (e) => {
            e.preventDefault()
            const form = e.currentTarget
            const input = form.querySelector('input')
            if (!input || !input.value) return
            await fetch('/subscribe', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: input.value }),
            }).catch(() => null)
            input.value = ''
          }}
        >
          <h3>Newsletter</h3>
          <input type="email" placeholder="Enter your email" />
          <button type="submit">Subscribe</button>
        </form>

        <div>
          <h3>Live Counters</h3>
          <p>{totalBusinesses} businesses listed</p>
          <p>{totalCategories} categories</p>
        </div>
      </footer>
    </div>
  )
}

const seedPromotions: Deal[] = [
  {
    id: 'd1',
    title: '20% Off Car Service',
    description: 'Valid for first-time visits this week.',
    expiresAt: '2026-03-10',
  },
  { id: 'd2', title: 'Buy 1 Get 1 Lunch', description: 'Available weekdays at Green Bowl.' },
  { id: 'd3', title: 'Free Delivery', description: 'Orders above GHS 100 at FreshMart.' },
]

export default App
