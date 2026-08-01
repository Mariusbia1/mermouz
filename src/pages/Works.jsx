import React, { useEffect, useState } from "react";
import { ArrowUpRight, Blocks, ShoppingBag, Workflow } from "lucide-react";
import { motion } from "framer-motion";
import { pageMotion } from "../config/motion";
import { getProjects } from "../lib/portfolioApi";

const projects = [
  {
    title: "Plateforme de gestion",
    category: "Application web",
    description:
      "Un espace central pour organiser les informations, suivre les opérations et simplifier le travail quotidien d’une équipe.",
    result: "Des tâches mieux organisées et moins de temps perdu.",
    tags: ["Tableau de bord", "Automatisation", "Gestion des accès"],
    icon: Blocks,
    tone: "blue",
  },
  {
    title: "Outil métier personnalisé",
    category: "Solution pour entreprise",
    description:
      "Une solution conçue autour d’un processus spécifique pour remplacer les manipulations répétitives et les fichiers dispersés.",
    result: "Un suivi plus fiable et une activité plus simple à piloter.",
    tags: ["Espace client", "Données centralisées", "Rapports"],
    icon: Workflow,
    tone: "navy",
  },
  {
    title: "Expérience de vente en ligne",
    category: "Commerce en ligne",
    description:
      "Un parcours clair et rassurant pour présenter les produits, faciliter le choix et conduire les visiteurs jusqu’à la commande.",
    result: "Une expérience plus fluide qui favorise les ventes.",
    tags: ["Catalogue", "Paiement", "Expérience mobile"],
    icon: ShoppingBag,
    tone: "slate",
  },
];

export default function Works() {
  const [visibleProjects, setVisibleProjects] = useState(projects);
  useEffect(() => {
    getProjects({ publishedOnly: true })
      .then((data) => {
        if (!data.length) return;
        setVisibleProjects(
          data.map((item, index) => ({
            ...item,
            description: item.summary,
            tags: [],
            icon: [Blocks, Workflow, ShoppingBag][index % 3],
            tone: ["blue", "navy", "slate"][index % 3],
          })),
        );
      })
      .catch(() => {});
  }, []);
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
          ({
            title,
            category,
            description,
            tags,
            icon: Icon,
            tone,
            project_url,
            image_url,
          }) => (
            <article
              className={`project-card project-card-${tone}`}
              key={title}
            >
              <div className="project-card-visual">
                <span className="project-category">{category}</span>
                <Icon />
                {image_url ? (
                  <div className="project-device-showcase">
                    <div className="device desktop">
                      <div className="device-bar" />
                      <img src={image_url} alt={`Capture de ${title}`} />
                    </div>
                    <div className="device tablet">
                      <img src={image_url} alt="" />
                    </div>
                    <div className="device mobile">
                      <span />
                      <img src={image_url} alt="" />
                    </div>
                  </div>
                ) : (
                  <div className="project-window">
                    <i />
                    <i />
                    <i />
                  </div>
                )}
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
    </motion.main>
  );
}
