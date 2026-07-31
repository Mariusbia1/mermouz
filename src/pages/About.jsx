import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { pageMotion } from "../config/motion";

export default function About() {
  return (
    <motion.main className="page inner-page about-page" {...pageMotion}>
      <section className="about-hero">
        <div className="about-story">
          <span className="about-kicker">BIAOU MARIUS, ALIAS MERMOUZ</span>
          <h1>
            J’aime transformer une idée
            <em> en solution qui compte.</em>
          </h1>
          <p className="about-opening">
            Mon parcours a commencé par une curiosité simple : comprendre
            comment les outils numériques fonctionnent et comment ils peuvent
            résoudre de vrais problèmes.
          </p>
          <p>
            À Parakou, pendant ma licence en Informatique de gestion, j’ai
            appris à relier deux univers : la technologie et les besoins d’une
            entreprise. Je ne voulais pas seulement créer des pages. Je voulais
            construire des outils capables de simplifier une activité, présenter
            une idée clairement et aider une entreprise à progresser.
          </p>
          <p>
            Les stages, les projets et le travail en freelance m’ont ensuite
            appris la rigueur, l’écoute et l’importance des détails.
            Aujourd’hui, j’accompagne les entrepreneurs avec une approche simple
            : comprendre leur objectif avant de choisir la solution.
          </p>
          <div className="about-actions">
            <Link className="neo-primary" to="/cv">
              Découvrir mon parcours
              <span>
                <ArrowRight />
              </span>
            </Link>
            <span className="about-location">
              <MapPin /> Abomey-Calavi, Bénin
            </span>
          </div>
        </div>

        <div className="about-photo-wrap">
          <div
            className="about-photo"
            role="img"
            aria-label="Portrait de BIAOU Marius"
          />
          <div className="about-photo-caption">
            <span>
              <strong>+2 ans</strong> à apprendre, créer et progresser
            </span>
          </div>
        </div>
      </section>

      <section className="about-values">
        <div className="about-values-head">
          <span>CE QUI GUIDE MON TRAVAIL</span>
          <h2>Créer avec méthode et rester proche du besoin.</h2>
        </div>
        <div className="about-value-grid">
          <article>
            <span>Comprendre</span>
            <p>
              Je commence par écouter votre réalité, vos contraintes et ce que
              vous voulez améliorer.
            </p>
          </article>
          <article>
            <span>Simplifier</span>
            <p>
              Je rends les idées complexes faciles à comprendre et les
              interfaces agréables à utiliser.
            </p>
          </article>
          <article>
            <span>Soigner</span>
            <p>
              Je porte attention à la qualité visuelle, à la rapidité et au bon
              fonctionnement de chaque détail.
            </p>
          </article>
          <article>
            <span>Accompagner</span>
            <p>
              Je communique clairement et je reste disponible pendant et après
              la réalisation du projet.
            </p>
          </article>
        </div>
      </section>
    </motion.main>
  );
}
