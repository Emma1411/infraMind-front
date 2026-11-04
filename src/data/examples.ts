export interface Example {
  id: string;
  tag: string;
  title: string;
  teaser: string;
  text: string;
}

export const EXAMPLES: Example[] = [
  {
    id: "salon",
    tag: "B2C local",
    title: "Salon de coiffure",
    teaser: "Réservations en ligne, rappels par courriel",
    text:
      "Application web de réservation pour un salon de coiffure indépendant. Frontend en React, backend FastAPI " +
      "avec une base PostgreSQL. Les clients réservent un créneau, reçoivent un rappel par courriel la veille, et " +
      "les coiffeuses consultent leur agenda. Environ 200 clients par jour, avec un pic le samedi. Les données " +
      "contiennent les noms, courriels et numéros de téléphone des clients. Pas de paiement en ligne. Le client " +
      "souhaite un budget d'hébergement d'environ 60 $ par mois. C'est moi qui maintiendrai l'application après " +
      "la livraison, mais je n'ai pas d'expérience en administration de serveurs.",
  },
  {
    id: "boutique",
    tag: "E-commerce",
    title: "Boutique en ligne",
    teaser: "Catalogue de 10 000 articles, paiements, cache",
    text:
      "Boutique en ligne avec un catalogue d'environ 10 000 produits et leurs photos. Frontend Next.js avec rendu " +
      "côté serveur, API Node.js, base PostgreSQL et un cache Redis pour le catalogue. Les clients créent un compte " +
      "et paient par carte, via un prestataire de paiement externe. Environ 3 000 visiteurs par jour, avec de gros " +
      "pics pendant les soldes. Les photos des produits sont envoyées par l'équipe, environ 30 Go la première " +
      "année. Le site doit être disponible en permanence. Budget autour de 250 $ par mois. L'équipe du client a un " +
      "technicien informatique à temps partiel.",
  },
  {
    id: "analytics",
    tag: "Analytics",
    title: "API pour tableau de bord",
    teaser: "Ingestion de mesures, agrégations de nuit",
    text:
      "API de données pour un tableau de bord interne. Backend Python (FastAPI) qui reçoit des mesures de capteurs " +
      "toutes les minutes et les stocke dans une base PostgreSQL, avec des agrégations calculées chaque nuit. Une " +
      "trentaine d'employés consultent le tableau de bord pendant les heures de bureau. Environ 5 Go de données la " +
      "première année, sans fichiers envoyés par les utilisateurs. Une panne de quelques heures est acceptable, " +
      "mais les données ne doivent pas être perdues. Pas de budget fixé. Je suis à l'aise avec Linux et Docker.",
  },
];