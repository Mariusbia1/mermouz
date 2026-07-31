import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { pageMotion } from "../config/motion";

export default function Home() {
  return (
    <motion.main className="page home" {...pageMotion}>
      <section className="home-hero neo-hero">
        <div className="neo-copy">
          <div className="neo-intro">
            <span>Disponible pour de nouveaux projets</span>
          </div>
          <p className="neo-name">
            BIAOU MARIUS <em>/ MERMOUZ</em>
          </p>
          <h1>
            Je crée des sites web
            <br />
            qui attirent vos clients
            <br />
            <span className="growth-line">
              et font grandir <em>votre activité.</em>
            </span>
          </h1>
          <p className="neo-lead">
            Vous avez une entreprise ou une idée. Je construis le site qui la
            rend visible, crédible et accessible à vos futurs clients.
          </p>
          <p className="neo-description">
            Que votre objectif soit de vendre en ligne, recevoir plus de
            demandes ou présenter vos services, je crée une solution moderne et
            simple à utiliser. Vous gérez votre métier. Je m’occupe de votre
            présence sur le web.
          </p>
          <div className="neo-actions">
            <Link className="neo-primary" to="/contact">
              Parlons de votre projet{" "}
              <span>
                <ArrowUpRight />
              </span>
            </Link>
            <Link className="neo-secondary" to="/works">
              <span>Voir mes réalisations</span>
              <ArrowRight />
            </Link>
          </div>
          <div className="neo-services">
            <span>Sites web</span>
            <span>Applications métier</span>
            <span>Plateformes SaaS</span>
          </div>
        </div>
        <div className="neo-visual">
          <div className="neo-card">
            <div
              className="neo-portrait"
              role="img"
              aria-label="Portrait de BIAOU Marius"
            />
          </div>
          <div className="neo-badge">
            <strong>+2</strong>
            <span>
              ans
              <br />
              d’expérience
            </span>
          </div>
        </div>
      </section>
    </motion.main>
  );
}
