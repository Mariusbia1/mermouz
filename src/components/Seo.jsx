import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const defaultDescription =
  "Marius BIAOU crée des sites web et des solutions numériques pour les entreprises et entrepreneurs : sites internet, boutiques en ligne et développement web.";

const pages = {
  "/": {
    title: "Création de site web | Marius BIAOU",
    description: defaultDescription,
  },
  "/about": {
    title: "À propos de Marius BIAOU | Développeur web",
    description:
      "Découvrez Marius BIAOU, développeur web : son parcours, sa passion, sa vision et sa méthode pour créer des sites internet utiles.",
  },
  "/services": {
    title: "Création de site internet et développement web | Services",
    description:
      "Création de sites web, sites WordPress et Wix, boutiques Shopify, tunnels de vente, solutions sur mesure et optimisation SEO.",
  },
  "/works": {
    title: "Projets de création de sites web | Marius BIAOU",
    description:
      "Découvrez les sites internet, applications web, boutiques en ligne et solutions numériques réalisés par Marius BIAOU pour ses clients.",
  },
  "/cv": {
    title: "CV de Marius BIAOU | Développeur web",
    description:
      "Parcours, expériences et compétences de Marius BIAOU en développement web, React, JavaScript, PHP, Laravel, WordPress et création de sites internet.",
  },
  "/contact": {
    title: "Demander un devis pour un site web | Marius BIAOU",
    description:
      "Présentez votre projet de site internet, boutique en ligne ou solution numérique et demandez un devis à Marius BIAOU, développeur web.",
  },
  "/confidentialite": {
    title: "Politique de confidentialité | Marius BIAOU",
    description:
      "Découvrez comment les informations transmises sur le portfolio de Marius BIAOU sont collectées, utilisées, protégées et supprimées.",
  },
};

function setMeta(selector, attributes) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([name, value]) =>
    element.setAttribute(name, value),
  );
}

export default function Seo() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname.startsWith("/admin")) {
      setMeta('meta[name="robots"]', {
        name: "robots",
        content: "noindex, nofollow",
      });
      document.title = "Administration | Marius BIAOU";
      return;
    }

    const isService = pathname.startsWith("/services/");
    const metadata = isService
      ? {
          title: "Service de création de site web | Marius BIAOU",
          description:
            "Découvrez ce service de création de site internet et demandez un devis adapté à votre activité auprès de Marius BIAOU, développeur web.",
        }
      : pages[pathname] || pages["/"];
    const configuredOrigin = import.meta.env.VITE_SITE_URL?.replace(/\/$/, "");
    const origin = configuredOrigin || "https://mariusbiaou.vercel.app";
    const canonicalUrl = `${origin}${pathname === "/" ? "" : pathname}`;
    const imageUrl = `${origin}/marius-navy-portrait-optimized.jpg`;

    document.title = metadata.title;
    setMeta('meta[name="description"]', {
      name: "description",
      content: metadata.description,
    });
    setMeta('meta[name="keywords"]', {
      name: "keywords",
      content:
        "création site web, création site internet, développeur web, développement web, boutique en ligne, WordPress, Shopify, Wix, tunnel de vente, référencement SEO",
    });
    setMeta('meta[name="robots"]', {
      name: "robots",
      content: "index, follow, max-image-preview:large",
    });
    setMeta('meta[property="og:title"]', {
      property: "og:title",
      content: metadata.title,
    });
    setMeta('meta[property="og:description"]', {
      property: "og:description",
      content: metadata.description,
    });
    setMeta('meta[property="og:type"]', {
      property: "og:type",
      content: "website",
    });
    setMeta('meta[property="og:url"]', {
      property: "og:url",
      content: canonicalUrl,
    });
    setMeta('meta[property="og:image"]', {
      property: "og:image",
      content: imageUrl,
    });
    setMeta('meta[name="twitter:card"]', {
      name: "twitter:card",
      content: "summary_large_image",
    });

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    let structuredData = document.head.querySelector("#portfolio-schema");
    if (!structuredData) {
      structuredData = document.createElement("script");
      structuredData.type = "application/ld+json";
      structuredData.id = "portfolio-schema";
      document.head.appendChild(structuredData);
    }
    structuredData.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      name: "Marius BIAOU",
      url: origin,
      image: imageUrl,
      description: defaultDescription,
      founder: {
        "@type": "Person",
        name: "Marius BIAOU",
        jobTitle: "Développeur web",
      },
      knowsAbout: [
        "Création de site web",
        "Création de site internet",
        "Développement web",
        "Boutique en ligne",
        "WordPress",
        "Shopify",
        "Référencement SEO",
      ],
    });
  }, [pathname]);

  return null;
}
