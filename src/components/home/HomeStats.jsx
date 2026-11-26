import React, { useMemo } from "react";
import { Reveal } from "./Reveal";

/** Chiffres clés calculés à partir des vraies données (aucun chiffre inventé). */
export default function HomeStats({ content, services, testimonials }) {
  const stats = useMemo(() => {
    const rated = testimonials.filter((t) => Number(t.rating) > 0);
    const average = rated.length
      ? rated.reduce((sum, t) => sum + Number(t.rating), 0) / rated.length
      : null;

    return [
      {
        value: content.cv.experiences.length,
        label: "expériences professionnelles",
      },
      { value: services.length, label: "services proposés" },
      { value: testimonials.length, label: "avis clients vérifiés" },
      average && {
        value: `${average.toFixed(1).replace(".", ",")}/5`,
        label: "note moyenne des clients",
      },
    ].filter(Boolean);
  }, [content, services, testimonials]);

  return (
    <section className="hs-section hs-stats" aria-label="Chiffres clés">
      {stats.map((stat, index) => (
        <Reveal className="hs-stat" key={stat.label} delay={index * 0.08}>
          <strong>{stat.value}</strong>
          <span>{stat.label}</span>
        </Reveal>
      ))}
    </section>
  );
}
