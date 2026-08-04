import React from "react";
import { Mail, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { pageMotion } from "../config/motion";
import { useSiteContent } from "../hooks/useSiteContent";

export default function Privacy() {
  const content = useSiteContent();

  return (
    <motion.main className="page inner-page privacy-page" {...pageMotion}>
      <header className="privacy-head">
        <span>CONFIDENTIALITÉ</span>
        <h1>
          Vos informations restent
          <em> sous votre contrôle.</em>
        </h1>
        <p>
          Cette page explique simplement les informations recueillies sur ce
          portfolio, leur utilisation et les choix dont vous disposez.
        </p>
      </header>

      <section className="privacy-intro">
        <ShieldCheck />
        <p>
          Je collecte uniquement les informations nécessaires pour comprendre
          votre demande, vous répondre et améliorer le fonctionnement du site.
          Elles ne sont ni vendues ni utilisées pour vous envoyer des messages
          publicitaires sans votre accord.
        </p>
      </section>

      <section className="privacy-grid">
        <article>
          <span>01</span>
          <h2>Informations recueillies</h2>
          <p>
            Lorsque vous utilisez le formulaire de contact ou de devis, le site
            enregistre votre nom, votre adresse email, votre numéro WhatsApp,
            le service recherché et le message décrivant votre projet.
          </p>
        </article>
        <article>
          <span>02</span>
          <h2>Pourquoi elles sont utilisées</h2>
          <p>
            Ces informations servent à étudier votre besoin, préparer une
            réponse adaptée, vous contacter et assurer le suivi de nos
            échanges concernant votre projet numérique.
          </p>
        </article>
        <article>
          <span>03</span>
          <h2>Mesure de fréquentation</h2>
          <p>
            Le site enregistre un identifiant technique anonyme, les pages
            visitées et la provenance éventuelle de la visite. Ces données
            permettent uniquement de comprendre l’utilisation générale du
            portfolio et ne servent pas à établir un profil publicitaire.
          </p>
        </article>
        <article>
          <span>04</span>
          <h2>Stockage et sécurité</h2>
          <p>
            Les données du portfolio sont hébergées avec Supabase et le site
            est publié sur Vercel. L’accès aux demandes reçues est réservé à
            l’espace d’administration protégé.
          </p>
        </article>
        <article>
          <span>05</span>
          <h2>Durée de conservation</h2>
          <p>
            Les demandes sont conservées pendant la durée nécessaire au suivi
            du projet et de la relation professionnelle. Les informations qui
            ne sont plus utiles peuvent ensuite être supprimées.
          </p>
        </article>
        <article>
          <span>06</span>
          <h2>Vos droits</h2>
          <p>
            Vous pouvez demander l’accès, la correction ou la suppression de
            vos informations. Vous pouvez également demander des précisions
            sur leur utilisation en me contactant directement.
          </p>
        </article>
      </section>

      <section className="privacy-contact">
        <div>
          <span>UNE QUESTION SUR VOS DONNÉES ?</span>
          <h2>Écrivez-moi directement.</h2>
        </div>
        <a href={`mailto:${content.profile.email}`}>
          <Mail /> {content.profile.email}
        </a>
      </section>
    </motion.main>
  );
}
