import { UNKNOWN_ANSWER, type AnswerValue, type Answers, type QuestionState } from "../interfaces/analysis";
import type { Currency, DomainKey, ProjectSpec } from "../interfaces/spec";

export const BUDGET_PATH = "constraints.budget_max_monthly";
export const CURRENCY_PATH = "constraints.budget_currency";
export const HOURLY_RATE_PATH = "team.hourly_rate";

export type DomainProgress = "complete" | "partial" | "missing" | "optional";
/** D'où vient la valeur affichée : du texte de l'utilisateur, de lui, ou nulle part. */
export type Origin = "detected" | "edited" | "answered" | "none";
export type EntryState = "answered" | "unknown" | "pending";

export function isUnknown(value: unknown): boolean {
  return value === UNKNOWN_ANSWER;
}

function sameValue(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

/** Valeur affichée : ce que l'utilisateur a saisi, sinon ce qui a été détecté dans son texte. */
export function displayValue(question: QuestionState, draft: Answers): AnswerValue | undefined {
  const typed = draft[question.path];
  if (typed !== undefined) return typed;
  if (question.status === "unknown") return UNKNOWN_ANSWER;
  if (question.status === "known" && question.value !== null) return question.value;
  return undefined;
}

export function isAnswered(question: QuestionState, draft: Answers): boolean {
  return draft[question.path] !== undefined || question.status !== "missing";
}

export function originOf(question: QuestionState, draft: Answers): Origin {
  const typed = draft[question.path];
  const detected = question.status === "known";
  if (typed === undefined) return detected ? "detected" : "none";
  if (!detected) return "answered";
  return sameValue(typed, question.value) ? "detected" : "edited";
}

/** Empreinte stable d'un ensemble de réponses (indépendante de l'ordre de saisie). */
export function draftKey(answers: Answers): string {
  return JSON.stringify(Object.entries(answers).sort(([a], [b]) => a.localeCompare(b)));
}

export function essentialQuestions(questions: QuestionState[]): QuestionState[] {
  return questions.filter((question) => question.priority <= 1);
}

export function detailQuestions(questions: QuestionState[]): QuestionState[] {
  return questions.filter((question) => question.priority > 1);
}

export type Entry =
  | { kind: "question"; question: QuestionState }
  | { kind: "budget"; budget: QuestionState; currency: QuestionState };

export function entryKey(entry: Entry): string {
  return entry.kind === "budget" ? "budget" : entry.question.path;
}

export function entryDomain(entry: Entry): DomainKey {
  return (entry.kind === "budget" ? entry.budget.domain : entry.question.domain) as DomainKey;
}

/** Une seule carte pour le budget et sa devise, quand les deux existent. */
export function buildEntries(questions: QuestionState[]): Entry[] {
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

export function entryState(entry: Entry, draft: Answers): EntryState {
  if (entry.kind === "budget") {
    const amount = displayValue(entry.budget, draft);
    if (isUnknown(amount)) return "unknown";
    const currency = displayValue(entry.currency, draft);
    return amount !== undefined && currency !== undefined && !isUnknown(currency) ? "answered" : "pending";
  }
  const value = displayValue(entry.question, draft);
  if (isUnknown(value)) return "unknown";
  return isAnswered(entry.question, draft) ? "answered" : "pending";
}

/** État d'un domaine : calculé sur ses cartes essentielles, détectées ou répondues. */
export function domainProgress(
  domain: DomainKey,
  entries: Entry[],
  details: QuestionState[],
  draft: Answers,
): DomainProgress {
  const mine = entries.filter((entry) => entryDomain(entry) === domain);
  if (mine.length === 0) {
    const pendingDetails = details.some((question) => question.domain === domain && !isAnswered(question, draft));
    return pendingDetails ? "optional" : "complete";
  }
  const done = mine.filter((entry) => entryState(entry, draft) !== "pending").length;
  if (done === mine.length) return "complete";
  return done === 0 ? "missing" : "partial";
}

/** Devise connue : celle choisie dans les réponses, sinon celle détectée dans le texte. */
export function currentCurrency(spec: ProjectSpec | null, draft: Answers): Currency | null {
  const fromDraft = draft[CURRENCY_PATH];
  if (typeof fromDraft === "string" && fromDraft !== UNKNOWN_ANSWER) return fromDraft as Currency;
  return spec?.constraints.budget_currency ?? null;
}

export function anchorId(domain: DomainKey): string {
  return `domaine-${domain}`;
}

/** Identifiant d'ancre pour la première carte de chaque domaine (cible du rail de gauche). */
export function entryAnchors(entries: Entry[]): {
  perEntry: (string | undefined)[];
  byDomain: Partial<Record<DomainKey, string>>;
} {
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