import React, { useEffect, useState } from "react";
import { ArrowUpRight, Check, Quote, Star, X } from "lucide-react";
import { defaultTestimonials } from "../data/testimonials";
import { getTestimonials } from "../lib/portfolioApi";

function formatDate(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("fr-FR", {
    month: "long",
    year: "numeric",
  }).format(new Date(`${value}T12:00:00`));
}

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState(defaultTestimonials);
  const [proof, setProof] = useState(null);

  useEffect(() => {
    getTestimonials({ publishedOnly: true })
      .then((items) =>
        setTestimonials(items.length ? items : defaultTestimonials),
      )
      .catch(() => setTestimonials(defaultTestimonials));
  }, []);

  useEffect(() => {
    if (!proof) return undefined;
    const close = (event) => event.key === "Escape" && setProof(null);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", close);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", close);
    };
  }, [proof]);

  return (
    <section className="testimonials-section">
      <header className="testimonials-head">
        <span>TÉMOIGNAGES</span>
        <h2>
          Des collaborations qui parlent
          <em>d’elles-mêmes.</em>
        </h2>
        <p>
          Chaque projet repose sur l’écoute, la qualité du travail et une
          relation de confiance. Voici ce que mes clients retiennent de notre
          collaboration.
        </p>
      </header>

      <div className="testimonials-track">
        {testimonials.map((item) => (
          <article className="testimonial-card" key={item.id}>
            <div className="testimonial-topline">
              <span className="testimonial-avatar">
                {item.client_name.charAt(0).toUpperCase()}
              </span>
              <div>
                <strong>{item.client_name}</strong>
                <small>{item.source}</small>
              </div>
              {item.rating && (
                <span className="testimonial-rating">
                  <Star /> {item.rating}.0
                </span>
              )}
            </div>
            <Quote className="testimonial-quote-icon" />
            <blockquote>{item.quote}</blockquote>
            <div className="testimonial-details">
              <span>{item.service}</span>
              {item.review_date && <time>{formatDate(item.review_date)}</time>}
            </div>
            <footer>
              <span>
                <Check /> Avis client vérifié
              </span>
              {item.screenshot_url && (
                <button type="button" onClick={() => setProof(item)}>
                  Voir la preuve <ArrowUpRight />
                </button>
              )}
            </footer>
          </article>
        ))}
      </div>

      {proof && (
        <div
          className="testimonial-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`Capture de l’avis de ${proof.client_name}`}
          onClick={() => setProof(null)}
        >
          <div onClick={(event) => event.stopPropagation()}>
            <header>
              <span>AVIS ORIGINAL · {proof.source.toUpperCase()}</span>
              <button
                type="button"
                onClick={() => setProof(null)}
                aria-label="Fermer"
              >
                <X />
              </button>
            </header>
            <img
              src={proof.screenshot_url}
              alt={`Capture originale de l’avis de ${proof.client_name}`}
            />
          </div>
        </div>
      )}
    </section>
  );
}
