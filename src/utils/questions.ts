import { UNKNOWN_ANSWER, type AnswerValue, type Answers, type Question } from "../interfaces/analysis";
import { DOMAINS, type Currency, type DomainKey, type ProjectSpec } from "../interfaces/spec";

export const BUDGET_PATH = "constraints.budget_max_monthly";
export const CURRENCY_PATH = "constraints.budget_currency";
export const HOURLY_RATE_PATH = "team.hourly_rate";

export type DomainProgress = "complete" | "partial" | "missing" | "optional";

export function isUnknown(value: AnswerValue | undefined): boolean {
  return value === UNKNOWN_ANSWER;
}

export function isAnswered(draft: Answers, path: string): boolean {
  return draft[path] !== undefined;
}

/** Empreinte stable d'un ensemble de réponses (indépendante de l'ordre de saisie). */
export function draftKey(answers: Answers): string {
  return JSON.stringify(Object.entries(answers).sort(([a], [b]) => a.localeCompare(b)));
}

export function essentialQuestions(questions: Question[]): Question[] {
  return questions.filter((question) => question.priority <= 1);
}

export function detailQuestions(questions: Question[]): Question[] {
  return questions.filter((question) => question.priority > 1);
}

/** État d'un domaine, calculé sur ses questions essentielles et les réponses déjà saisies. */
export function domainProgress(domain: DomainKey, questions: Question[], draft: Answers): DomainProgress {
  const mine = questions.filter((question) => question.domain === domain);
  const essential = essentialQuestions(mine);

  if (essential.length === 0) {
    const pendingDetails = mine.some((question) => !isAnswered(draft, question.path));
    return pendingDetails ? "optional" : "complete";
  }

  const answered = essential.filter((question) => isAnswered(draft, question.path)).length;
  if (answered === essential.length) return "complete";
  return answered === 0 ? "missing" : "partial";
}

/** Devise connue : celle choisie dans les réponses, sinon celle détectée dans le texte. */
export function currentCurrency(spec: ProjectSpec | null, draft: Answers): Currency | null {
  const fromDraft = draft[CURRENCY_PATH];
  if (typeof fromDraft === "string" && fromDraft !== UNKNOWN_ANSWER) return fromDraft as Currency;
  return spec?.constraints.budget_currency ?? null;
}

export type Entry =
  | { kind: "question"; question: Question }
  | { kind: "budget"; budget: Question; currency: Question };

export function entryDomain(entry: Entry): DomainKey {
  return entry.kind === "budget" ? entry.budget.domain : entry.question.domain;
}

/** Une seule carte pour le budget et sa devise, quand les deux sont à poser. */
export function buildEntries(questions: Question[]): Entry[] {
  const budget = questions.find((question) => question.path === BUDGET_PATH);
  const currency = questions.find((question) => question.path === CURRENCY_PATH);
  const entries: Entry[] = [];

  for (const question of questions) {
    if (budget && currency && question.path === CURRENCY_PATH) continue;
    if (budget && currency && question.path === BUDGET_PATH) {
      entries.push({ kind: "budget", budget, currency });
    } else {
      entries.push({ kind: "question", question });
    }
  }
  return entries;
}

export function anchorId(domain: DomainKey): string {
  return `domaine-${domain}`;
}

/** Identifiant d'ancre pour la première carte de chaque domaine (cible du rail de gauche). */
export function entryAnchors(entries: Entry[]): { perEntry: (string | undefined)[]; byDomain: Partial<Record<DomainKey, string>> } {
  const byDomain: Partial<Record<DomainKey, string>> = {};
  const perEntry = entries.map((entry) => {
    const domain = entryDomain(entry);
    if (byDomain[domain]) return undefined;
    byDomain[domain] = anchorId(domain);
    return byDomain[domain];
  });
  return { perEntry, byDomain };
}

export function twoDigits(value: number): string {
  return String(value).padStart(2, "0");
}

/** Premier domaine, dans l'ordre officiel, parmi une liste (utile pour le libellé). */
export function domainIndex(domain: DomainKey): number {
  return DOMAINS.indexOf(domain);
}