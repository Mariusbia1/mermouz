import React from "react";
import { defaultSiteContent } from "../../data/siteContent";
import { Reveal } from "./Reveal";

export default function HomeStats({ content }) {
  const stats = content?.home?.stats?.length
    ? content.home.stats
    : defaultSiteContent.home.stats;

  return (
    <section className="hs-section hs-stats" aria-label="Chiffres clés">
      {stats.map((stat, index) => (
        <Reveal className="hs-stat" key={stat.label} delay={index * 0.08}>
          <strong>{stat.value}</strong>
          <span>{stat.label}</span>
          {stat.detail && <p className="hs-stat-detail">{stat.detail}</p>}
        </Reveal>
      ))}
    </section>
  );
}
