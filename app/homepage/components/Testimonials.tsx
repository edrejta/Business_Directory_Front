"use client";

import { useEffect, useMemo, useState } from "react";

type Review = {
  id: string;
  reviewerName: string;
  rating: number;
  comment: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";
const FALLBACK_REVIEWS: Review[] = [
  { id: "seed-1", reviewerName: "user.demo", rating: 5, comment: "Sherbim shume i mire dhe ushqim cilesor." },
  { id: "seed-2", reviewerName: "user.demo", rating: 4, comment: "Atmosfere e qete, kafe shume e mire." },
];

export function Testimonials() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    fetch(`${API_BASE}/reviews`)
      .then((response) => (response.ok ? response.json() : []))
      .then((data) => setReviews(Array.isArray(data) && data.length > 0 ? data : FALLBACK_REVIEWS))
      .catch(() => setReviews(FALLBACK_REVIEWS));
  }, []);

  const visible = useMemo(() => {
    if (reviews.length === 0) {
      return [];
    }
    if (reviews.length === 1) {
      return [reviews[0]];
    }
    return [reviews[index], reviews[(index + 1) % reviews.length]];
  }, [reviews, index]);

  const showPrev = () => {
    if (reviews.length === 0) {
      return;
    }
    setIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const showNext = () => {
    if (reviews.length === 0) {
      return;
    }
    setIndex((prev) => (prev + 1) % reviews.length);
  };

  return (
    <section className="kb-testimonials">
      <div className="kb-testimonials-head">
        <p>THEY USE OUR SERVICE</p>
        <h2>Testimonials</h2>
      </div>

      <div className="kb-testimonials-stage">
        <button type="button" onClick={showPrev} aria-label="Previous">
          &#8249;
        </button>

        <div className="kb-testimonials-cards">
          {visible.length === 0 ? (
            <article className="kb-testimonial-card">
              <p>No testimonials found.</p>
            </article>
          ) : (
            visible.map((review) => (
              <article key={review.id} className="kb-testimonial-card">
                <div className="kb-quote-mark">&quot;</div>
                <p>{review.comment}</p>
                <div className="kb-testimonial-user">
                  <span>{review.reviewerName.slice(0, 1).toUpperCase()}</span>
                  <div>
                    <strong>{review.reviewerName}</strong>
                    <small>
                      {"\u2605".repeat(Math.max(0, Math.min(5, Math.round(review.rating))))}
                      {"\u2606".repeat(Math.max(0, 5 - Math.round(review.rating)))}
                    </small>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>

        <button type="button" onClick={showNext} aria-label="Next">
          &#8250;
        </button>
      </div>

      <div className="kb-testimonial-dot" />
    </section>
  );
}
