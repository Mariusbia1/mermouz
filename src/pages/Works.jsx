import React from "react";
import { ArrowUpRight, Blocks, ShoppingBag, Workflow } from "lucide-react";
import { motion } from "framer-motion";
import { pageMotion } from "../config/motion";

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
        {projects.map(
          ({
            title,
            category,
            description,
            result,
            tags,
            icon: Icon,
            tone,
          }) => (
            <article
              className={`project-card project-card-${tone}`}
              key={title}
            >
              <div className="project-card-visual">
                <span className="project-category">{category}</span>
                <Icon />
                <div className="project-window">
                  <i />
                  <i />
                  <i />
                </div>
              </div>
              <div className="project-card-body">
                <div className="project-card-title">
                  <h2>{title}</h2>
                  <span>
                    <ArrowUpRight />
                  </span>
                </div>
                <p>{description}</p>
                <div className="project-result">
                  <strong>Résultat</strong>
                  <span>{result}</span>
                </div>
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
