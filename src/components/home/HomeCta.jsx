import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Mail, MessageCircle } from "lucide-react";
import { Reveal } from "./Reveal";

export default function HomeCta({ content }) {
  const { profile, social } = content;

  return (
    <section className="hs-section" aria-labelledby="home-cta-title">
      <Reveal className="hs-cta" aos="zoom-in">
        <span className="hs-kicker">PARLONS DE VOTRE PROJET</span>
        <h2 id="home-cta-title">
          Vous avez une idée ou une activité à développer ?{" "}
          <em>Construisons-la ensemble.</em>
        </h2>
        <p>
          Décrivez-moi votre besoin en quelques lignes. Je vous réponds
          rapidement avec une proposition claire et adaptée.
        </p>
        <div className="hs-cta-actions">
          <Link className="neo-primary" to="/contact">
            Démarrer mon projet{" "}
            <span>
              <ArrowUpRight />
            </span>
          </Link>
          {profile.email && (
            <a className="hs-cta-contact" href={`mailto:${profile.email}`}>
              <Mail /> {profile.email}
            </a>
          )}
          {social.whatsapp && (
            <a
              className="hs-cta-contact"
              href={social.whatsapp}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle /> WhatsApp
            </a>
          )}
        </div>
      </Reveal>
    </section>
  );
}
