# inframind-front — Interface Utilisateur

## Description

Application web React de **InfraMind**, un outil qui aide un développeur à choisir, chiffrer et déployer l'infrastructure de son projet. L'utilisateur colle son cahier des charges, répond aux questions qui manquent, compare cinq architectures avec leur coût en fourchette, puis suit un guide de déploiement pas à pas. Un schéma interactif montre l'architecture recommandée, composant par composant.

Interface sans compte et sans stockage côté serveur, responsive, avec Redux pour la gestion d'état du parcours.

🔗 Lien de démonstration : https://infra-mind-front.vercel.app/

## Fonctionnalités

- **1. Décrire** : zone de texte avec compteur (limite de 8 000 caractères), trois modèles à charger en un clic, avertissement si le texte semble contenir un secret, annulation de l'analyse en cours, messages d'attente et erreurs claires.
- **2. Compléter** : les 12 domaines clés dans un rail de progression. Les valeurs trouvées par l'IA dans le texte sont **pré-remplies et modifiables**, avec une pastille « Détecté dans ton texte » ou « Modifié par toi ». Chaque question a son « pourquoi on demande ça ? » et un bouton « Je ne sais pas ». Budget, tarif horaire de maintenance, filtre « À compléter », et une note d'honnêteté sur le nombre de réponses qui reposeront sur des hypothèses.
- **3. Résultats** : bandeau de synthèse (fourchette, note, hypothèses, avertissements), explication rédigée par l'IA (avec sa source affichée), classement de 5 architectures avec leur détail, répartition des coûts, sensibilité du devis, comparaison de deux architectures, export du devis en Markdown.
- **Schéma interactif** (React Flow) : chaque composant avec son coût mensuel, liens fléchés et animés, inspecteur au clic (décomposition des coûts), comparaison côte à côte avec mise en évidence des différences, et version textuelle accessible. La somme des composants est égale au coût estimé.
- **4. Déployer** : guide pas à pas avec prérequis à cocher, commandes copiables (valeurs à remplacer surlignées, variantes Windows et macOS / Linux), « Ce que tu dois voir », avertissements, aide « Ça n'a pas marché ? » (cause fréquente, documentation, recherche de vidéo), progression, section de nettoyage pour tout supprimer, et téléchargement du guide en Markdown.
- **Honnêteté de l'interface** : prix à vérifier, estimations incomplètes, hypothèses et exigences non respectées sont toujours signalés avec une icône et un texte, jamais par la seule couleur.
- **Accessibilité** : navigation complète au clavier, focus visibles, libellés pour lecteurs d'écran, version textuelle du schéma, respect de « réduire les animations ».
- **Interface responsive** : mobile, tablette et bureau.

## Stack technique

| Composant | Technologie |
|---|---|
| Framework | React 19 |
| Langage | TypeScript |
| État | Redux Toolkit |
| Styling | Tailwind CSS v4 |
| Schéma interactif | React Flow (`@xyflow/react`) |
| Icônes | Lucide, React Icons |
| Routage | React Router |
| Build | Vite |
| Déploiement | Vercel|

## Architecture Frontend

```
┌──────────────────────────────────────────────────────────────┐
│                      React Application                       │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐        │
│  │    Pages    │   │   Widgets   │   │    Hooks    │        │
│  │ (Describe,  │   │ (questions, │   │ (redux,     │        │
│  │  Complete,  │   │  résultats, │   │  copier,    │        │
│  │  Results,   │   │  schéma,    │   │  section    │        │
│  │  Deploy)    │   │  guide)     │   │  active)    │        │
│  └─────────────┘   └─────────────┘   └─────────────┘        │
│         │                 │                 │               │
│         └─────────────────┴─────────────────┘               │
│                           │                                 │
│                  ┌────────▼────────┐                        │
│                  │   Redux Store   │                        │
│                  │  (project,      │                        │
│                  │   questions,    │                        │
│                  │   results,      │                        │
│                  │   guide)        │                        │
│                  └────────┬────────┘                        │
│                           │                                 │
│                  ┌────────▼────────┐                        │
│                  │  API Service    │                        │
│                  │ (fetch +        │                        │
│                  │  X-API-Key)     │                        │
│                  └─────────────────┘                        │
│                                                              │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
                  ┌──────────────────────┐
                  │    inframind-api     │
                  │  (FastAPI, Cloud Run)│
                  └──────────┬───────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │    API DeepSeek      │
                  └──────────────────────┘
```

Les types TypeScript du dossier `interfaces/` reflètent exactement les réponses du backend. Les thunks reçoivent leurs données en argument : ce sont les composants qui décident quoi envoyer.

## Structure du projet

```
inframind-front/
├── .env  .env.example  index.html  vercel.json  vite.config.ts
└── src/
    ├── components/    briques génériques : Button, Badge, Alert, Tabs…
    ├── data/          exemples, libellés des domaines, étapes du parcours
    ├── hooks/         redux, copier dans le presse-papiers, section active
    ├── interfaces/    types qui reflètent les réponses du backend
    ├── layouts/       MainLayout : en-tête, stepper, pied de page
    ├── pages/         DescribePage, CompletePage, ResultsPage, DeployPage
    ├── routes/        AppRoutes, RequireSpec
    ├── services/      client HTTP + un fichier par domaine
    ├── slices/        project, questions, results, guide
    ├── thunks/        analyse, réponses, évaluation, rapport, guide, devis
    ├── utils/         formats, devis, guide en Markdown, liens sûrs
    ├── widgets/       blocs d'écran (describe, complete, results, graph, deploy)
    └── App.tsx  main.tsx  store.ts  rootReducers.ts  index.css
```

## Limites connues

- **La clé d'API est incluse dans le JavaScript du site** : n'importe quel visiteur peut la lire. Elle bloque les robots et les scripts qui ne la connaissent pas, mais ne constitue pas une authentification. Une amélioration prévue est de la faire ajouter côté serveur par une fonction intermédiaire.
- **L'état du parcours vit en mémoire** : recharger la page repart de zéro.
- **Les montants** sont en dollars américains, hors taxes, avec des prix de référence pour l'Amérique du Nord. Un budget saisi dans une autre devise n'est comparé que si un taux de change est renseigné côté backend.
- Le guide peut être téléchargé en Markdown, mais pas en PDF.
