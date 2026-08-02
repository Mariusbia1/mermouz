import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { pageMotion } from "../config/motion";
import { useSiteContent } from "../hooks/useSiteContent";
import TestimonialsSection from "../components/TestimonialsSection";

export default function Home() {
  const content = useSiteContent();
  return (
    <motion.main className="page home" {...pageMotion}>
      <section className="home-hero neo-hero">
        <div className="neo-copy">
          <div className="neo-intro">
            <span>Disponible pour de nouveaux projets</span>
          </div>
          <p className="neo-name">
            {content.profile.fullName.toUpperCase()}{" "}
            <em>/ {content.profile.alias.toUpperCase()}</em>
          </p>
          <h1>
            {content.home.titleLine1}
            <br />
            {content.home.titleLine2}
            <br />
            <span className="growth-line">
              {content.home.titleLine3} <em>{content.home.titleAccent}</em>
            </span>
          </h1>
          <p className="neo-lead">{content.home.lead}</p>
          <p className="neo-description">{content.home.description}</p>
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
              style={{ backgroundImage: `url(${content.profile.photoUrl})` }}
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
      <TestimonialsSection />
    </motion.main>
  );
}
