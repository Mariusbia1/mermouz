import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { Reveal, SectionHead } from "./Reveal";

export default function HomeWorks({ projects }) {
  return (
    <section className="hs-section" aria-labelledby="home-works-title">
      <div className="hs-head-row">
        <SectionHead
          id="home-works-title"
          kicker="RÉALISATIONS"
          title="Des projets pensés"
          accent="pour être vraiment utiles."
          text="Chaque projet part d’un besoin concret et devient une expérience claire, fiable et simple à utiliser."
        />
        <Link className="hs-link" to="/works">
          Voir tous les projets <ArrowRight />
        </Link>
      </div>

      <div className="hs-works">
        {projects.slice(0, 3).map((project, index) => {
          const Icon = project.icon;
          const Wrapper = project.project_url ? "a" : Link;
          const wrapperProps = project.project_url
            ? { href: project.project_url, target: "_blank", rel: "noreferrer" }
            : { to: "/works" };

          return (
            <Reveal key={project.id ?? project.title} delay={index * 0.08}>
              <Wrapper className={`hs-work hs-work-${project.tone}`} {...wrapperProps}>
                <div className="hs-work-visual">
                  {project.image_url ? (
                    <img
                      src={project.image_url}
                      alt={`Aperçu du projet ${project.title}`}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <Icon aria-hidden="true" />
                  )}
                  <span className="hs-work-category">{project.category}</span>
                </div>
                <div className="hs-work-body">
                  <h3>
                    {project.title} <ArrowUpRight />
                  </h3>
                  <p>{project.description}</p>
                  {project.result && (
                    <p className="hs-work-result">
                      <Check /> {project.result}
                    </p>
                  )}
                </div>
              </Wrapper>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
