import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Code2,
  Compass,
  Heart,
  MapPin,
  MessagesSquare,
  PenTool,
  Rocket,
  UserRound,
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
            {content.profile.fullName.toUpperCase()}
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
          <span>AU-DELÀ DU MÉTIER</span>
          <h2>Ce qui m’anime et ce que je veux construire.</h2>
          <p>
            Me découvrir, c’est comprendre ce qui nourrit ma curiosité, les
            valeurs qui orientent mes choix et l’avenir que j’ai envie de bâtir.
          </p>
        </header>
        <div className="about-now-grid">
          <article>
            <Heart />
            <span>MA PASSION</span>
            <h3>Donner vie aux idées</h3>
            <p>{content.about.passion}</p>
          </article>
          <article>
            <Compass />
            <span>MA VISION</span>
            <h3>Créer des possibilités</h3>
            <p>{content.about.vision}</p>
          </article>
          <article>
            <Rocket />
            <span>MON RÊVE</span>
            <h3>Construire au-delà des frontières</h3>
            <p>{content.about.dream}</p>
          </article>
          <article>
            <UserRound />
            <span>MA PERSONNALITÉ</span>
            <h3>Avancer avec exigence et sincérité</h3>
            <p>{content.about.personality}</p>
          </article>
        </div>
      </section>

      <section className="about-method">
        <header className="about-method-head">
          <span>MA MÉTHODE DE TRAVAIL</span>
          <h2>Une collaboration claire, du premier échange à la livraison.</h2>
          <p>{content.about.methodIntro}</p>
        </header>
        <div className="about-method-grid">
          <article>
            <MessagesSquare />
            <h3>{content.about.methodDiscoveryTitle}</h3>
            <p>{content.about.methodDiscoveryText}</p>
          </article>
          <article>
            <PenTool />
            <h3>{content.about.methodDirectionTitle}</h3>
            <p>{content.about.methodDirectionText}</p>
          </article>
          <article>
            <Code2 />
            <h3>{content.about.methodCreationTitle}</h3>
            <p>{content.about.methodCreationText}</p>
          </article>
          <article>
            <CheckCircle2 />
            <h3>{content.about.methodDeliveryTitle}</h3>
            <p>{content.about.methodDeliveryText}</p>
          </article>
        </div>
        <div className="about-method-action">
          <p>
            Vous avez une idée en tête ? Commençons par en parler simplement.
          </p>
          <Link className="neo-primary" to="/contact">
            Présenter mon projet
            <span>
              <ArrowRight />
            </span>
          </Link>
        </div>
      </section>

      <section className="about-values">
        <div className="about-values-head">
          <span>CE QUI ME DÉFINIT</span>
          <h2>Des valeurs simples que j’essaie de vivre chaque jour.</h2>
        </div>
        <div className="about-value-grid">
          <article>
            <span>Curiosité</span>
            <p>
              J’aime poser des questions, découvrir de nouvelles idées et ne
              jamais considérer que j’ai fini d’apprendre.
            </p>
          </article>
          <article>
            <span>Persévérance</span>
            <p>
              Une difficulté n’est pas une raison d’abandonner. Je cherche,
              j’essaie et je progresse jusqu’à trouver une voie.
            </p>
          </article>
          <article>
            <span>Ambition</span>
            <p>
              Je veux construire des choses importantes sans oublier que les
              grands parcours commencent souvent par de petites étapes.
            </p>
          </article>
          <article>
            <span>Respect</span>
            <p>
              J’accorde de l’importance à l’écoute, à l’honnêteté et aux
              relations dans lesquelles chacun se sent considéré.
            </p>
          </article>
        </div>
      </section>
    </motion.main>
  );
}
