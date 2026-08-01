import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BriefcaseBusiness,
  GraduationCap,
  MapPin,
  MonitorSmartphone,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import { pageMotion } from "../config/motion";
import { useSiteContent } from "../hooks/useSiteContent";

export default function About() {
  const content = useSiteContent();
  return (
    <motion.main className="page inner-page about-page" {...pageMotion}>
      <section className="about-hero">
        <div className="about-story">
          <span className="about-kicker">
            {content.profile.fullName.toUpperCase()}, ALIAS{" "}
            {content.profile.alias.toUpperCase()}
          </span>
          <h1>
            <span>{content.about.title}</span>
            <em>{content.about.accent}</em>
          </h1>
          <p className="about-opening">{content.about.opening}</p>
          <p>{content.about.story1}</p>
          <p>{content.about.story2}</p>
          <p>{content.about.story3}</p>
          <div className="about-actions">
            <Link className="neo-primary" to="/cv">
              Découvrir mon parcours
              <span>
                <ArrowRight />
              </span>
            </Link>
            <span className="about-location">
              <MapPin /> {content.profile.location}
            </span>
          </div>
        </div>

        <div className="about-photo-wrap">
          <div
            className="about-photo"
            style={{ backgroundImage: `url(${content.profile.photoUrl})` }}
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

      <section className="about-now">
        <header className="about-now-head">
          <span>QUI JE SUIS AUJOURD’HUI</span>
          <h2>Un développeur impliqué dans chaque projet.</h2>
          <p>
            Mon travail ne consiste pas seulement à écrire du code. Je cherche à
            comprendre ce que votre activité doit améliorer et à construire une
            réponse claire, fiable et durable.
          </p>
        </header>
        <div className="about-now-grid">
          <article>
            <BriefcaseBusiness />
            <span>MON ACTIVITÉ ACTUELLE</span>
            <h3>Développeur chez OLRAF SARL</h3>
            <p>{content.about.currentRole}</p>
          </article>
          <article>
            <Users />
            <span>ACCOMPAGNEMENT</span>
            <h3>Freelance auprès des entrepreneurs</h3>
            <p>{content.about.freelance}</p>
          </article>
          <article>
            <GraduationCap />
            <span>MON PROFIL</span>
            <h3>Informatique et vision d’entreprise</h3>
            <p>{content.about.approach}</p>
          </article>
          <article>
            <MonitorSmartphone />
            <span>MA VISION</span>
            <h3>Créer une solution qui sert vraiment</h3>
            <p>{content.about.ambition}</p>
          </article>
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
