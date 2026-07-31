import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Check,
  Clock3,
  CreditCard,
  FileSearch,
  Gauge,
  LayoutDashboard,
  LockKeyhole,
  MailCheck,
  MessageCircle,
  MonitorSmartphone,
  MousePointerClick,
  PackageCheck,
  PenLine,
  Search,
  Send,
  ShieldCheck,
  ShoppingCart,
  SlidersHorizontal,
  Target,
  Wrench,
  Zap,
} from "lucide-react";
import { portfolioServices } from "../data/services";
import { pageMotion } from "../config/motion";

const workSteps = [
  {
    title: "Comprendre votre objectif",
    text: "Nous échangeons sur votre activité, vos clients et le résultat que vous souhaitez obtenir.",
  },
  {
    title: "Concevoir la bonne solution",
    text: "Je définis une structure claire et un parcours simple qui répondent réellement à votre besoin.",
  },
  {
    title: "Créer et vérifier",
    text: "Je réalise votre projet avec soin, puis je contrôle son affichage, sa rapidité et son fonctionnement.",
  },
  {
    title: "Mettre en ligne et vous accompagner",
    text: "Votre solution est publiée et je vous accompagne pour que vous puissiez l’utiliser sereinement.",
  },
];

const serviceQuality = {
  "developpement-web": [
    {
      icon: SlidersHorizontal,
      title: "Fonctionnalités personnalisées",
      text: "Chaque fonction est construite autour de votre manière de travailler et de vos objectifs.",
    },
    {
      icon: Gauge,
      title: "Rapidité et stabilité",
      text: "La solution reste fluide, même lorsque votre activité et le nombre d’utilisateurs augmentent.",
    },
    {
      icon: LockKeyhole,
      title: "Données mieux protégées",
      text: "Les accès et les informations sensibles sont organisés avec des règles de sécurité adaptées.",
    },
    {
      icon: Wrench,
      title: "Évolutions sans blocage",
      text: "Votre outil peut recevoir de nouvelles fonctions lorsque vos besoins évoluent.",
    },
  ],
  "site-wordpress": [
    {
      icon: PenLine,
      title: "Contenus faciles à modifier",
      text: "Vous pouvez mettre à jour vos textes, images et actualités sans difficulté.",
    },
    {
      icon: Gauge,
      title: "Pages plus rapides",
      text: "Les images et les pages sont optimisées pour réduire le temps de chargement.",
    },
    {
      icon: ShieldCheck,
      title: "Site entretenu et sécurisé",
      text: "Les protections, sauvegardes et mises à jour essentielles sont correctement préparées.",
    },
    {
      icon: Search,
      title: "Structure visible sur Google",
      text: "Les pages sont organisées pour faciliter leur compréhension par les moteurs de recherche.",
    },
  ],
  "boutique-shopify": [
    {
      icon: ShoppingCart,
      title: "Parcours d’achat rassurant",
      text: "Vos clients trouvent leurs produits et avancent facilement jusqu’à la commande.",
    },
    {
      icon: CreditCard,
      title: "Paiements bien configurés",
      text: "Les moyens de paiement sont intégrés pour permettre des achats simples et sécurisés.",
    },
    {
      icon: PackageCheck,
      title: "Commandes mieux organisées",
      text: "Produits, stocks, livraisons et commandes sont gérés depuis un espace central.",
    },
    {
      icon: MonitorSmartphone,
      title: "Boutique pensée pour le mobile",
      text: "L’expérience reste agréable sur téléphone, là où une grande partie des clients achètent.",
    },
  ],
  "site-wix": [
    {
      icon: LayoutDashboard,
      title: "Présentation professionnelle",
      text: "Votre univers visuel est adapté pour inspirer confiance dès la première visite.",
    },
    {
      icon: PenLine,
      title: "Gestion simple au quotidien",
      text: "Vous pouvez modifier vos informations et publier vos contenus de façon autonome.",
    },
    {
      icon: MonitorSmartphone,
      title: "Affichage adapté partout",
      text: "Le site reste clair et lisible sur ordinateur, tablette et téléphone.",
    },
    {
      icon: Search,
      title: "Bases de visibilité intégrées",
      text: "Les réglages indispensables sont préparés pour aider votre site à apparaître sur Google.",
    },
  ],
  "tunnel-de-vente": [
    {
      icon: Target,
      title: "Message concentré sur l’offre",
      text: "Chaque page répond aux questions du prospect et l’aide à prendre une décision.",
    },
    {
      icon: MousePointerClick,
      title: "Actions simples et visibles",
      text: "Les boutons et formulaires guident clairement vers l’inscription, le contact ou l’achat.",
    },
    {
      icon: MailCheck,
      title: "Suivi automatisé des prospects",
      text: "Les contacts peuvent recevoir les bonnes informations après leur inscription.",
    },
    {
      icon: BarChart3,
      title: "Résultats mesurables",
      text: "Le parcours peut être analysé pour comprendre les abandons et améliorer les conversions.",
    },
  ],
  "optimisation-seo": [
    {
      icon: FileSearch,
      title: "Diagnostic de votre visibilité",
      text: "Les obstacles qui limitent votre présence dans Google sont identifiés avec précision.",
    },
    {
      icon: Search,
      title: "Recherches de vos futurs clients",
      text: "Vos pages ciblent les expressions réellement utilisées pour trouver vos services.",
    },
    {
      icon: Zap,
      title: "Améliorations techniques",
      text: "La rapidité, la structure et les éléments techniques importants sont optimisés.",
    },
    {
      icon: BarChart3,
      title: "Progression suivie dans le temps",
      text: "Les résultats sont observés afin d’ajuster les priorités et développer votre visibilité.",
    },
  ],
};

export default function ServiceDetail() {
  const { slug } = useParams();
  const service = portfolioServices.find((item) => item.slug === slug);
  const [sent, setSent] = useState(false);

  if (!service) {
    return (
      <main className="page inner-page">
        <h1>Service introuvable</h1>
        <Link to="/services">Retour aux services</Link>
      </main>
    );
  }

  const Icon = service.icon;
  const qualityFeatures = serviceQuality[service.slug] || [];

  function handleSubmit(event) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <motion.main className="page inner-page service-detail" {...pageMotion}>
      <Link className="back-link" to="/services">
        <ArrowLeft /> Tous les services
      </Link>

      <div className="service-detail-layout">
        <div className="service-detail-content">
          <header className="service-detail-hero">
            <div className="detail-service-icon">
              <Icon />
            </div>
            <h1>{service.title}</h1>
            <p className="detail-intro">{service.intro}</p>
            <div className="detail-importance">
              <ShieldCheck />
              <div>
                <strong>
                  Pourquoi ce service compte pour votre entreprise
                </strong>
                <p>{service.importance}</p>
              </div>
            </div>
          </header>

          <section className="detail-included">
            <span className="detail-section-label">
              LA QUALITÉ INTÉGRÉE À VOTRE PROJET
            </span>
            <h2>Bien plus qu’un joli résultat.</h2>
            <p className="included-intro">
              Votre solution est pensée pour être agréable à utiliser,
              performante aujourd’hui et simple à faire évoluer demain.
            </p>
            <div className="service-impact-list">
              {service.outcomes.map((item) => (
                <div key={item}>
                  <Check />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className="quality-grid">
              {qualityFeatures.map(({ icon: FeatureIcon, title, text }) => (
                <article key={title}>
                  <FeatureIcon />
                  <div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="detail-method">
            <span className="detail-section-label">MA MÉTHODE DE TRAVAIL</span>
            <h2>Un processus simple pour construire sans confusion.</h2>
            <div className="method-list">
              {workSteps.map((step, index) => (
                <article key={step.title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>

        <aside className="quote-panel">
          <div className="quote-panel-head">
            <span>DEMANDE DE DEVIS</span>
            <h2>Parlons de votre projet.</h2>
            <p>
              Décrivez votre besoin. Je vous répondrai avec une proposition
              adaptée à votre activité.
            </p>
          </div>

          {sent ? (
            <div className="quote-success">
              <Check />
              <h3>Votre demande est prête.</h3>
              <p>
                Le formulaire sera connecté au backend Supabase pendant la
                prochaine étape du projet.
              </p>
            </div>
          ) : (
            <form className="quote-form" onSubmit={handleSubmit}>
              <label>
                Votre nom
                <input name="name" placeholder="Nom et prénom" required />
              </label>
              <label>
                Votre numéro WhatsApp
                <input
                  name="phone"
                  type="tel"
                  placeholder="Votre numéro"
                  required
                />
              </label>
              <label>
                Votre adresse email
                <input
                  name="email"
                  type="email"
                  placeholder="vous@entreprise.com"
                  required
                />
              </label>
              <label>
                Service souhaité
                <input value={service.title} readOnly />
              </label>
              <label>
                Parlez-moi de votre besoin
                <textarea
                  name="message"
                  placeholder="Votre activité, votre objectif et ce que vous souhaitez obtenir"
                  required
                />
              </label>
              <button type="submit" className="quote-submit">
                Recevoir une proposition <Send />
              </button>
            </form>
          )}

          <div className="quote-reassurance">
            <span>
              <Clock3 /> Réponse sous 24 heures au plus

            </span>
            <span>
              <MessageCircle /> Premier échange sans engagement
            </span>
          </div>
        </aside>
      </div>

      <Link className="detail-bottom-action" to="/services">
        Découvrir les autres services <ArrowRight />
      </Link>
    </motion.main>
  );
}
