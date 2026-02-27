"use client";

import { useMemo, useState } from "react";

type TestimonialItem = {
  id: string;
  name: string;
  rating: number;
  text: string;
};

const TESTIMONIALS: TestimonialItem[] = [
  { id: "t1", name: "user.demo", rating: 5, text: "Sherbim shume i mire dhe ushqim cilesor." },
  { id: "t2", name: "user.demo", rating: 4, text: "Atmosfere e qete, kafe shume e mire." },
  { id: "t3", name: "user.demo", rating: 5, text: "Gjeta biznesin qe me duhej shume shpejt." },
];

export function Testimonials() {
  const [index, setIndex] = useState(0);

  const visible = useMemo(() => {
    if (TESTIMONIALS.length === 1) return [TESTIMONIALS[0]];
    return [TESTIMONIALS[index], TESTIMONIALS[(index + 1) % TESTIMONIALS.length]];
  }, [index]);

  const showPrev = () => {
    setIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const showNext = () => {
    setIndex((prev) => (prev + 1) % TESTIMONIALS.length);
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
          {visible.map((item) => (
            <article key={item.id} className="kb-testimonial-card">
              <div className="kb-quote-mark">&quot;</div>
              <p>{item.text}</p>
              <div className="kb-testimonial-user">
                <span>{item.name.slice(0, 1).toUpperCase()}</span>
                <div>
                  <strong>{item.name}</strong>
                  <small>
                    {"\u2605".repeat(Math.max(0, Math.min(5, Math.round(item.rating))))}
                    {"\u2606".repeat(Math.max(0, 5 - Math.round(item.rating)))}
                  </small>
                </div>
              </div>
            </article>
          ))}
        </div>

        <button type="button" onClick={showNext} aria-label="Next">
          &#8250;
        </button>
      </div>

      <div className="kb-testimonial-dot" />
    </section>
  );
}
