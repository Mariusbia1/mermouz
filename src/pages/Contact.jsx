import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { pageMotion } from "../config/motion";
export default function Contact() {
  return (
    <motion.main className="page inner-page contact-page" {...pageMotion}>
      <header className="page-head">
        <span>CONTACT</span>
        <h1>
          Construisons quelque
          <br />
          <em>chose de solide.</em>
        </h1>
      </header>
      <section className="contact-grid">
        <div>
          <p>
            Un projet, une idée ou un problème à résoudre ? Écrivez-moi. Je
            réponds généralement sous 24 heures.
          </p>
          <a href="mailto:hello@mermouz.com">
            hello@mermouz.com <ArrowUpRight />
          </a>
        </div>
        <form onSubmit={(e) => e.preventDefault()}>
          <label>
            VOTRE NOM
            <input placeholder="Comment vous appelez-vous ?" />
          </label>
          <label>
            VOTRE EMAIL
            <input type="email" placeholder="vous@entreprise.com" />
          </label>
          <label>
            PARLEZ-MOI DU PROJET
            <textarea placeholder="Objectifs, contexte, délai..." />
          </label>
          <button className="button primary">
            Envoyer la demande <ArrowRight />
          </button>
        </form>
      </section>
    </motion.main>
  );
}
