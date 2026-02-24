import { useEffect, useMemo, useState } from 'react'

type Review = {
  id: string
  reviewerName: string
  rating: number
  comment: string
}

const fallbackReviews: Review[] = [
  { id: 'r1', reviewerName: 'Ama K.', rating: 5, comment: 'Found a trusted service provider in minutes.' },
  { id: 'r2', reviewerName: 'John D.', rating: 4, comment: 'Strong directory filters and clean listing cards.' },
  { id: 'r3', reviewerName: 'Naa T.', rating: 5, comment: 'The map and business contacts are very useful.' },
  { id: 'r4', reviewerName: 'Efua A.', rating: 4, comment: 'Suggestions and filters made my search much faster.' },
]

export function Testimonials() {
  const [reviews, setReviews] = useState<Review[]>(fallbackReviews)
  const [index, setIndex] = useState(0)

  const showPrev = () => {
    setIndex((prev) => (prev - 1 + reviews.length) % reviews.length)
  }

  const showNext = () => {
    setIndex((prev) => (prev + 1) % reviews.length)
  }

  useEffect(() => {
    fetch('/reviews')
      .then((res) => (res.ok ? res.json() : fallbackReviews))
      .then((data) => setReviews(Array.isArray(data) && data.length > 0 ? data : fallbackReviews))
      .catch(() => setReviews(fallbackReviews))
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % reviews.length)
    }, 2800)
    return () => window.clearInterval(timer)
  }, [reviews.length])

  const visible = useMemo(() => {
    if (reviews.length === 0) return []
    if (reviews.length === 1) return [{ ...reviews[0], slot: 'center' as const }]
    if (reviews.length === 2) {
      return [{ ...reviews[0], slot: 'side' as const }, { ...reviews[1], slot: 'center' as const }]
    }

    return [
      { ...reviews[(index - 1 + reviews.length) % reviews.length], slot: 'side' as const },
      { ...reviews[index], slot: 'center' as const },
      { ...reviews[(index + 1) % reviews.length], slot: 'side' as const },
    ]
  }, [reviews, index])

  return (
    <section className="testimonials reveal in-view">
      <div className="testimonials-head">
        <p className="testimonials-label">THEY USE OUR SERVICE</p>
        <h2>Testimonials</h2>
      </div>

      <div className="testimonials-stage">
        <button type="button" className="testimonials-arrow" aria-label="Previous testimonial" onClick={showPrev}>
          {'<'}
        </button>

        <div className="testimonials-cards">
          {visible.map((review) => (
            <article key={review.id} className={`testimonial-card ${review.slot === 'center' ? 'active' : 'side'}`}>
              <div className="testimonial-body">
                <span className="quote-mark">&quot;</span>
                <p>{review.comment}</p>
              </div>
              <div className="testimonial-meta">
                <div className="avatar">{review.reviewerName.slice(0, 1)}</div>
                <div>
                  <h3>{review.reviewerName}</h3>
                  <p>Rating {review.rating.toFixed(1)}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <button type="button" className="testimonials-arrow" aria-label="Next testimonial" onClick={showNext}>
          {'>'}
        </button>
      </div>

      <div className="testimonials-dots">
        {reviews.map((item, dotIndex) => (
          <button
            key={item.id}
            type="button"
            aria-label={`Go to testimonial ${dotIndex + 1}`}
            className={dotIndex === index ? 'active' : ''}
            onClick={() => setIndex(dotIndex)}
          />
        ))}
      </div>
    </section>
  )
}
