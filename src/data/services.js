import { Code2, SearchCheck, Workflow } from "lucide-react";
import { FaShopify, FaWix, FaWordpress } from "react-icons/fa6";

export const portfolioServices = [
  {
    slug: "developpement-web",
    title: "Développement web",
    short:
      "Une solution créée entièrement selon les besoins de votre entreprise pour gérer vos activités, automatiser certaines tâches ou proposer un nouveau service à vos clients.",
    intro:
      "Votre projet est développé spécialement pour vous, sans modèle imposé. Chaque fonctionnalité répond à votre activité, à vos utilisateurs et au résultat que vous souhaitez obtenir.",
    importance:
      "Le sur-mesure vous permet d’automatiser vos processus, de proposer une expérience unique à vos clients et de faire évoluer votre outil au rythme de votre entreprise.",
    icon: Code2,
    outcomes: [
      "Automatiser vos tâches répétitives",
      "Centraliser vos informations",
      "Proposer un service accessible en ligne",
    ],
    deliverables: [
      "Analyse de votre besoin",
      "Interface adaptée à votre activité",
      "Développement et tests",
      "Mise en ligne et accompagnement",
    ],
  },
  {
    slug: "site-wordpress",
    title: "Création de site web WordPress",
    short:
      "Un site professionnel pour présenter votre entreprise, rassurer vos visiteurs et leur permettre de vous contacter facilement.",
    intro:
      "Je crée votre site WordPress pour présenter votre activité, rassurer vos visiteurs et générer de nouvelles demandes.",
    importance:
      "Un site WordPress bien conçu renforce votre crédibilité, améliore votre visibilité et vous permet de publier vos contenus sans dépendre d’un développeur.",
    icon: FaWordpress,
    outcomes: [
      "Présenter clairement vos services",
      "Être visible sur Google",
      "Modifier vos contenus simplement",
    ],
    deliverables: [
      "Design personnalisé",
      "Pages essentielles",
      "Version mobile",
      "Formation à la prise en main",
    ],
  },
  {
    slug: "boutique-shopify",
    title: "Création de boutique en ligne Shopify",
    short:
      "Une boutique en ligne complète pour présenter vos produits, recevoir les paiements et gérer vos commandes au même endroit.",
    intro:
      "Je configure et personnalise votre boutique Shopify pour vous permettre de vendre en ligne avec une expérience fluide, du produit jusqu’au paiement.",
    importance:
      "Une boutique structurée réduit les hésitations au moment de l’achat et transforme plus facilement vos visiteurs en clients.",
    icon: FaShopify,
    outcomes: [
      "Vendre vos produits en ligne",
      "Gérer facilement les commandes",
      "Rassurer vos clients au moment du paiement",
    ],
    deliverables: [
      "Configuration Shopify",
      "Catalogue et fiches produits",
      "Paiement et livraison",
      "Optimisation du parcours d’achat",
    ],
  },
  {
    slug: "site-wix",
    title: "Création de site web Wix",
    short:
      "Un site élégant et simple à gérer pour rendre votre activité visible et permettre à vos futurs clients de vous découvrir.",
    intro:
      "Je construis votre site Wix avec une image professionnelle et une structure pensée pour conduire vos visiteurs vers la prise de contact.",
    importance:
      "Wix est adapté aux entreprises qui souhaitent être rapidement visibles avec un site professionnel qu’elles peuvent gérer facilement.",
    icon: FaWix,
    outcomes: [
      "Lancer rapidement votre présence en ligne",
      "Présenter une image professionnelle",
      "Gérer le site sans difficulté",
    ],
    deliverables: [
      "Structure des pages",
      "Design sur mesure",
      "Adaptation mobile",
      "Connexion du domaine",
    ],
  },
  {
    slug: "tunnel-de-vente",
    title: "Création de tunnel de vente",
    short:
      "Un parcours de pages qui présente votre offre étape par étape et guide vos visiteurs jusqu’à la prise de contact ou la commande.",
    intro:
      "Je conçois un tunnel de vente simple et convaincant pour capter l’attention, présenter votre offre et convertir davantage de visiteurs.",
    importance:
      "Un tunnel de vente évite de perdre des prospects en leur présentant le bon message, dans le bon ordre, avec une action claire à chaque étape.",
    icon: Workflow,
    outcomes: [
      "Collecter des contacts qualifiés",
      "Présenter votre offre avec clarté",
      "Augmenter vos conversions",
    ],
    deliverables: [
      "Page de capture",
      "Page de vente",
      "Formulaires et automatisations",
      "Suivi des performances",
    ],
  },
  {
    slug: "optimisation-seo",
    title: "Optimisation SEO",
    short:
      "Une amélioration de votre site pour apparaître plus facilement dans Google et attirer des personnes qui recherchent déjà vos services.",
    intro:
      "J’optimise la structure, les contenus et les performances de votre site pour aider Google à mieux le comprendre et à le présenter aux bonnes personnes.",
    importance:
      "Le SEO vous apporte une visibilité durable et des prospects qualifiés sans dépendre uniquement de la publicité payante.",
    icon: SearchCheck,
    outcomes: [
      "Gagner en visibilité sur Google",
      "Attirer des visiteurs qualifiés",
      "Développer une acquisition durable",
    ],
    deliverables: [
      "Audit technique et éditorial",
      "Recherche de mots-clés",
      "Optimisation des pages",
      "Recommandations de contenu",
    ],
  },
];
