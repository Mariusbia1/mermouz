import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Code2,
  Database,
  Github,
  GraduationCap,
  Layers3,
  Linkedin,
  MapPin,
  MonitorSmartphone,
} from "lucide-react";
import { motion } from "framer-motion";
import { pageMotion } from "../config/motion";
import { useSiteContent } from "../hooks/useSiteContent";

const experiences = [
  {
    period: "Actuellement",
    role: "Développeur web",
    company: "OLRAF SARL",
    place: "Abomey-Calavi",
    description:
      "Je participe à la conception et au développement de solutions web destinées à répondre aux besoins de l’entreprise et de ses utilisateurs.",
    current: true,
  },
  {
    period: "Depuis avril 2025",
    role: "Développeur web freelance",
    company: "ComeUp et Fiverr",
    place: "À distance",
    description:
      "J’accompagne des clients dans la création de solutions web adaptées à leur activité, de la compréhension du besoin jusqu’à la livraison.",
    current: true,
  },
  {
    period: "Novembre 2025 à février 2026",
    role: "Développement web",
    company: "SGTIC SARL",
    place: "Cotonou",
    description:
      "Trois mois d’immersion professionnelle pour participer au développement de projets web et renforcer ma façon de travailler en équipe.",
  },
  {
    period: "Avril à juin 2025",
    role: "Développement web et mobile",
    company: "ORABO GROUP",
    place: "Parakou",
    description:
      "Participation à des projets numériques concrets et découverte des exigences liées à la création d’outils destinés à de vrais utilisateurs.",
  },
  {
    period: "Août à septembre 2024",
    role: "Concours de développement frontend",
    company: "FigmaCode",
    place: "En ligne",
    description:
      "Conception et intégration d’interfaces avec une attention particulière portée à la précision visuelle et à l’expérience utilisateur.",
  },
  {
    period: "Août à septembre 2023",
    role: "Première expérience en développement web",
    company: "EcomDev",
    place: "Parakou",
    description:
      "Une première immersion qui a confirmé mon envie de créer des produits numériques utiles et de progresser dans le développement web.",
  },
];

const skills = [
  {
    icon: Code2,
    title: "Création web",
    text: "Sites professionnels, applications et solutions adaptées à un besoin précis.",
  },
  {
    icon: MonitorSmartphone,
    title: "Interfaces responsives",
    text: "Expériences claires et agréables sur ordinateur, tablette et téléphone.",
  },
  {
    icon: Database,
    title: "Gestion des données",
    text: "Organisation des informations et création de fonctionnalités fiables.",
  },
  {
    icon: Layers3,
    title: "Vision complète",
    text: "Compréhension du projet depuis l’idée jusqu’à sa mise en ligne.",
  },
];

export default function Resume() {
  const content = useSiteContent();
  const cvExperiences = content.cv.experiences?.length
    ? content.cv.experiences
    : experiences;
  const cvEducation = content.cv.education || [];
  return (
    <motion.main className="page inner-page career-page" {...pageMotion}>
      <section className="career-hero">
        <div className="career-hero-copy">
          <span className="career-kicker">MON PARCOURS</span>
          <h1>
            J’apprends en construisant.
            <em> Je progresse en pratiquant.</em>
          </h1>
          <p>{content.cv.introduction}</p>
          <div className="career-links">
            <Link className="neo-primary" to="/contact">
              Travaillons ensemble
              <span>
                <ArrowUpRight />
              </span>
            </Link>
            <a href={content.social.github} target="_blank" rel="noreferrer">
              <Github /> GitHub
            </a>
            <a href={content.social.linkedin} target="_blank" rel="noreferrer">
              <Linkedin /> LinkedIn
            </a>
          </div>
        </div>

        <div className="career-hero-visual">
          <div
            className="career-photo"
            style={{ backgroundImage: `url(${content.profile.photoUrl})` }}
          />
          <div className="career-status">
            <span>Disponible pour de nouveaux projets</span>
          </div>
          <div className="career-location">
            <MapPin />
            <span>{content.profile.location}</span>
          </div>
        </div>
      </section>

      <section className="career-summary">
        <article>
          <strong>+2</strong>
          <span>années d’apprentissage et de pratique</span>
        </article>
        <article>
          <strong>4</strong>
          <span>expériences en entreprise</span>
        </article>
        <article>
          <strong>1</strong>
          <span>licence en Informatique de gestion</span>
        </article>
      </section>

      <section className="career-experience">
        <header className="career-section-head">
          <div>
            <BriefcaseBusiness />
            <span>EXPÉRIENCES</span>
          </div>
          <h2>Des étapes qui ont construit ma façon de travailler.</h2>
        </header>
        <div className="career-timeline">
          {cvExperiences.map((item) => (
            <article key={`${item.company}-${item.period}`}>
              <div className="career-date">
                <i className={item.current ? "active" : ""} />
                <span>{item.period}</span>
              </div>
              <div className="career-role">
                <div>
                  <h3>{item.role}</h3>
                  {item.current && <span>EN COURS</span>}
                </div>
                <strong>{item.company}</strong>
                <small>{item.place}</small>
                <p>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="career-education">
        <header className="career-section-head">
          <div>
            <GraduationCap />
            <span>FORMATION</span>
          </div>
          <h2>
            Une formation entre technologie et compréhension de l’entreprise.
          </h2>
        </header>
        <div className="education-cards">
          {cvEducation.map((item) => (
            <article key={`${item.title}-${item.period}`}>
              <span>{item.period}</span>
              <h3>{item.title}</h3>
              <p>{item.school}</p>
              <strong>{item.place}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="career-skills">
        <header className="career-section-head">
          <div>
            <Code2 />
            <span>CE QUE JE SAIS FAIRE</span>
          </div>
          <h2>Des compétences mises au service de projets concrets.</h2>
        </header>
        <div className="career-skill-grid">
          {skills.map(({ icon: Icon, title, text }) => (
            <article key={title}>
              <Icon />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="career-contact">
        <span>UNE IDÉE À CONCRÉTISER ?</span>
        <h2>Mon prochain projet peut être le vôtre.</h2>
        <Link className="neo-primary" to="/contact">
          Me parler de votre projet
          <span>
            <ArrowUpRight />
          </span>
        </Link>
      </section>
    </motion.main>
  );
}
