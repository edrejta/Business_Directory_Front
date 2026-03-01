"use client";

import { useMemo, useState } from "react";

type TestimonialItem = {
  id: string;
  name: string;
  role: string;
  text: string;
};

const TESTIMONIALS: TestimonialItem[] = [
  {
    id: "t1",
    name: "Mergim Cahani",
    role: "CEO - Gjirafa, Inc",
    text: "KosBiz has significantly enhanced our online visibility. Within weeks of listing our company, we observed a measurable increase in qualified inquiries from new clients across Kosovo. The platform reflects a modern and structured approach to digital business presence.",
  },
  {
    id: "t2",
    name: "Arta K.",
    role: "Owner - Aroma Coffee House",
    text: "Since joining KosBiz, our cafe has gained greater exposure among local customers and tourists. The listing has strengthened our online presence and made it easier for customers to discover our location and services.",
  },
  {
    id: "t3",
    name: "Leon D.",
    role: "Restaurant Manager - Bella Vista Restaurant",
    text: "KosBiz provides a professional platform that helps restaurants like ours reach a wider audience. We have noticed increased reservations and customer engagement since being featured.",
  },
  {
    id: "t4",
    name: "Sara M.",
    role: "Platform User",
    text: "KosBiz makes it simple and efficient to find reliable businesses in Kosovo. The interface is clean, the information is clear, and it saves valuable time when searching for trusted services.",
  },
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
                  <small>{item.role}</small>
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
