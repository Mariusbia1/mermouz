import React, { useEffect, useState } from "react";
import { ArrowUpRight, Check, Quote, Star, X } from "lucide-react";
import { useTestimonials } from "../hooks/usePortfolioData";

function formatDate(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("fr-FR", {
    month: "long",
    year: "numeric",
  }).format(new Date(`${value}T12:00:00`));
}

function TestimonialCard({ item, index, onOpenProof, duplicate = false }) {
  return (
    <article
      className="testimonial-card"
      style={{ "--float-i": index }}
      aria-hidden={duplicate || undefined}
    >
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
          <button
            type="button"
            tabIndex={duplicate ? -1 : undefined}
            onClick={() => onOpenProof(item)}
          >
            Voir la preuve <ArrowUpRight />
          </button>
        )}
      </footer>
    </article>
  );
}

export default function TestimonialsSection({ items }) {
  // Si la page parente a déjà chargé les avis, on évite une 2e requête.
  const fetched = useTestimonials(!items);
  const testimonials = items ?? fetched;
  const [proof, setProof] = useState(null);

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

  // Durée proportionnelle au nombre d'avis pour garder une vitesse constante.
  const driftDuration = `${Math.max(28, testimonials.length * 8)}s`;

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

      <div
        className="testimonials-marquee"
        style={{ "--drift-duration": driftDuration }}
      >
        <div className="testimonials-track">
          <div className="testimonials-group">
            {testimonials.map((item, index) => (
              <TestimonialCard
                key={item.id}
                item={item}
                index={index}
                onOpenProof={setProof}
              />
            ))}
          </div>
          <div className="testimonials-group" aria-hidden="true">
            {testimonials.map((item, index) => (
              <TestimonialCard
                key={`dup-${item.id}`}
                item={item}
                index={index}
                onOpenProof={setProof}
                duplicate
              />
            ))}
          </div>
        </div>
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
