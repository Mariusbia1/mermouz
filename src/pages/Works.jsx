import React from "react";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { pageMotion } from "../config/motion";
import { useProjects } from "../hooks/usePortfolioData";
import TestimonialsSection from "../components/TestimonialsSection";

export default function Works() {
  const visibleProjects = useProjects();
  return (
    <motion.main className="page inner-page projects-page" {...pageMotion}>
      <header className="page-head projects-head">
        <span>PROJETS</span>
        <h1>
          Des solutions pensées
          <br />
          <em>pour être vraiment utiles.</em>
        </h1>
        <p>
          Chaque projet part d’un besoin concret et devient une expérience
          claire, fiable et simple à utiliser.
        </p>
      </header>

      <section className="projects-grid">
        {visibleProjects.map(
          (
            {
              title,
              category,
              description,
              tags,
              icon: Icon,
              tone,
              project_url,
              image_url,
            },
            index,
          ) => (
            <article
              className={`project-card project-card-${tone}`}
              key={title}
              data-aos="zoom-in-up"
              data-aos-delay={(index % 3) * 90}
            >
              <div className="project-card-visual">
                {image_url ? (
                  <img
                    className="project-card-cover"
                    src={image_url}
                    alt={`Aperçu du projet ${title}`}
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <Icon aria-hidden="true" />
                )}
                <span className="project-category">{category}</span>
              </div>
              <div className="project-card-body">
                <div className="project-card-title">
                  <h2>{title}</h2>
                  {project_url ? (
                    <a href={project_url} target="_blank" rel="noreferrer">
                      <ArrowUpRight />
                    </a>
                  ) : (
                    <span>
                      <ArrowUpRight />
                    </span>
                  )}
                </div>
                <p>{description}</p>
                <div className="project-tags">
                  {tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
            </article>
          ),
        )}
      </section>
      <TestimonialsSection />
    </motion.main>
  );
}
