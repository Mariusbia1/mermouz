import { Blocks, ShoppingBag, Workflow } from "lucide-react";

export const projectIcons = [Blocks, Workflow, ShoppingBag];
export const projectTones = ["blue", "navy", "slate"];

export const defaultProjects = [
  {
    title: "Plateforme de gestion",
    category: "Application web",
    description:
      "Un espace central pour organiser les informations, suivre les opérations et simplifier le travail quotidien d’une équipe.",
    result: "Des tâches mieux organisées et moins de temps perdu.",
    tags: ["Tableau de bord", "Automatisation", "Gestion des accès"],
    icon: Blocks,
    tone: "blue",
  },
  {
    title: "Outil métier personnalisé",
    category: "Solution pour entreprise",
    description:
      "Une solution conçue autour d’un processus spécifique pour remplacer les manipulations répétitives et les fichiers dispersés.",
    result: "Un suivi plus fiable et une activité plus simple à piloter.",
    tags: ["Espace client", "Données centralisées", "Rapports"],
    icon: Workflow,
    tone: "navy",
  },
  {
    title: "Expérience de vente en ligne",
    category: "Commerce en ligne",
    description:
      "Un parcours clair et rassurant pour présenter les produits, faciliter le choix et conduire les visiteurs jusqu’à la commande.",
    result: "Une expérience plus fluide qui favorise les ventes.",
    tags: ["Catalogue", "Paiement", "Expérience mobile"],
    icon: ShoppingBag,
    tone: "slate",
  },
];
