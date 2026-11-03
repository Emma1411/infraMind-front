export type CommandLanguage = "powershell" | "bash" | "yaml" | "text";
export type StepLocation = "console" | "local" | "server";

export interface CommandBlock {
  label: string;
  language: CommandLanguage;
  code: string;
  os: "windows" | "macos_linux" | null;
}

export interface StepHelp {
  common_cause: string;
  doc_url: string | null;
  doc_label: string | null;
  search_query: string;
  youtube_url: string | null;
}

export interface GuideStep {
  id: string;
  title: string;
  where: StepLocation;
  why: string;
  checklist: string[];
  commands: CommandBlock[];
  expect: string;
  warning: string | null;
  optional: boolean;
  only_if: "database" | "no_database" | null;
  help: StepHelp;
}

export interface GuideSource {
  label: string;
  url: string;
}

export interface RenderedGuide {
  arch_id: string;
  title: string;
  intro: string;
  prerequisites: string[];
  steps: GuideStep[];
  cleanup: GuideStep[];
  limits: string[];
  sources: GuideSource[];
  written_from_docs_on: string;
  tested_on: string | null;
  /** Texte du badge de statut à afficher tel quel (documentation consultée, testé ou non). */
  status_label: string;
  /** Valeurs du projet injectées dans le guide (taille du serveur, coûts, etc.). */
  parameters: Record<string, string>;
}

export interface GuideFallback {
  message: string;
  youtube_url: string;
}

export interface GuideResponse {
  arch_id: string;
  available: boolean;
  guide: RenderedGuide | null;
  fallback: GuideFallback | null;
}