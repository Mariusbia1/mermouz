import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { pageMotion } from "../config/motion";
import { useSiteContent } from "../hooks/useSiteContent";
import {
  useProjects,
  useServices,
  useTestimonials,
} from "../hooks/usePortfolioData";
import TestimonialsSection from "../components/TestimonialsSection";
import HomeStats from "../components/home/HomeStats";
import HomeServices from "../components/home/HomeServices";
import HomeWorks from "../components/home/HomeWorks";
import HomeProcess from "../components/home/HomeProcess";
import HomeAbout from "../components/home/HomeAbout";
import HomeSkills from "../components/home/HomeSkills";
import HomeCta from "../components/home/HomeCta";
import "../components/home/home.css";

export default function Home() {
  const content = useSiteContent();
  // Données chargées une seule fois ici puis partagées entre les sections.
  const services = useServices();
  const projects = useProjects();
  const testimonials = useTestimonials();
  return (
    <motion.main className="page home" {...pageMotion}>
      <section className="home-hero neo-hero">
        <div className="neo-copy">
          <div className="neo-intro">
            <span>Disponible pour de nouveaux projets</span>
          </div>
          <p className="neo-name">{content.profile.fullName.toUpperCase()}</p>
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

      {/* 1. Preuves rapides  2. Ce que je fais  3. Exemples concrets
          4. Comment je travaille  5. Qui je suis  6. Outils
          7. Ce qu'en disent les clients  8. Passage à l'action */}
      <HomeStats content={content} />
      <HomeServices
        services={services}
        featuredSlugs={content.home?.featuredServices}
      />
      <HomeWorks projects={projects} />
      <HomeProcess content={content} />
      <HomeAbout content={content} />
      <HomeSkills content={content} />
      <TestimonialsSection items={testimonials} />
      <HomeCta content={content} />
    </motion.main>
  );
}
