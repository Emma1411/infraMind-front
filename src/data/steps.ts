export interface StepItem {
  path: string;
  label: string;
}

export const STEPS: StepItem[] = [
  { path: "/", label: "Décrire" },
  { path: "/completer", label: "Compléter" },
  { path: "/resultats", label: "Résultats" },
  { path: "/deployer", label: "Déployer" },
];