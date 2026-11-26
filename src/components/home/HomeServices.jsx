import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Reveal, SectionHead } from "./Reveal";

export default function HomeServices({ services }) {
  return (
    <section className="hs-section" aria-labelledby="home-services-title">
      <div className="hs-head-row">
        <SectionHead
          id="home-services-title"
          kicker="CE QUE JE FAIS"
          title="Des solutions web"
          accent="adaptées à votre objectif."
          text="Site vitrine, boutique en ligne, outil sur mesure ou visibilité sur Google : je vous aide à choisir la solution qui sert réellement votre activité."
        />
        <Link className="hs-link" to="/services">
          Tous les services <ArrowRight />
        </Link>
      </div>

      <div className="hs-services">
        {services.slice(0, 6).map(({ slug, title, short, icon: Icon }, index) => (
          <Reveal key={slug} delay={(index % 3) * 0.08}>
            <Link className="hs-service" to={`/services/${slug}`}>
              <span className="hs-service-index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="hs-service-icon">
                <Icon />
              </span>
              <h3>{title}</h3>
              <p>{short}</p>
              <span className="hs-service-more">
                En savoir plus <ArrowUpRight />
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
