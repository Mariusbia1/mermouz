insert into public.services (
  title,
  slug,
  short_description,
  description,
  benefits,
  inclusions,
  is_active,
  display_order
)
values
  (
    'Développement web',
    'developpement-web',
    'Une solution créée selon les besoins précis de votre entreprise.',
    'Votre projet est développé spécialement pour vous. Chaque fonctionnalité répond à votre activité, à vos utilisateurs et au résultat que vous souhaitez obtenir.',
    '["Automatiser les tâches répétitives", "Centraliser les informations", "Proposer un service accessible en ligne"]',
    '["Analyse du besoin", "Interface adaptée", "Développement et tests", "Mise en ligne et accompagnement"]',
    true,
    1
  ),
  (
    'Création de site web WordPress',
    'site-wordpress',
    'Un site professionnel pour présenter votre entreprise et recevoir plus de demandes.',
    'Votre site présente clairement votre activité, rassure vos visiteurs et leur permet de vous contacter facilement.',
    '["Présenter clairement vos services", "Être visible sur Google", "Modifier les contenus simplement"]',
    '["Design personnalisé", "Pages essentielles", "Version mobile", "Formation à la prise en main"]',
    true,
    2
  ),
  (
    'Création de boutique en ligne Shopify',
    'boutique-shopify',
    'Une boutique complète pour présenter vos produits, recevoir les paiements et gérer les commandes.',
    'Votre boutique est structurée pour faciliter les achats et offrir une expérience fluide du produit jusqu’au paiement.',
    '["Vendre en ligne", "Gérer les commandes", "Rassurer au moment du paiement"]',
    '["Configuration de la boutique", "Catalogue produits", "Paiement et livraison", "Optimisation du parcours d’achat"]',
    true,
    3
  ),
  (
    'Création de site web Wix',
    'site-wix',
    'Un site élégant et simple à gérer pour rendre votre activité visible.',
    'Votre site Wix valorise votre image et conduit naturellement les visiteurs vers la prise de contact.',
    '["Lancer rapidement votre présence", "Présenter une image professionnelle", "Gérer le site facilement"]',
    '["Structure des pages", "Design personnalisé", "Adaptation mobile", "Connexion du domaine"]',
    true,
    4
  ),
  (
    'Création de tunnel de vente',
    'tunnel-de-vente',
    'Un parcours qui présente votre offre et guide les visiteurs vers la commande.',
    'Votre tunnel présente le bon message dans le bon ordre afin de transformer davantage de visiteurs en clients.',
    '["Collecter des contacts qualifiés", "Présenter l’offre avec clarté", "Augmenter les conversions"]',
    '["Page de capture", "Page de vente", "Formulaires et automatisations", "Suivi des performances"]',
    true,
    5
  ),
  (
    'Optimisation SEO',
    'optimisation-seo',
    'Une amélioration du site pour être trouvé plus facilement sur Google.',
    'La structure, les contenus et les performances sont optimisés pour attirer des personnes qui recherchent déjà vos services.',
    '["Gagner en visibilité", "Attirer des visiteurs qualifiés", "Développer une acquisition durable"]',
    '["Audit technique et éditorial", "Recherche de mots clés", "Optimisation des pages", "Recommandations de contenu"]',
    true,
    6
  )
on conflict (slug) do update set
  title = excluded.title,
  short_description = excluded.short_description,
  description = excluded.description,
  benefits = excluded.benefits,
  inclusions = excluded.inclusions,
  is_active = excluded.is_active,
  display_order = excluded.display_order,
  updated_at = now();
