import type { ArchitectureResult, EvaluationResult, NodeKind, Verdict } from "../interfaces/evaluation";
import { formatMoney, formatRange } from "./money";

export const CRITERION_LABEL: Record<string, string> = {
  cost: "Coût",
  security: "Sécurité",
  performance: "Performance",
  availability: "Disponibilité",
  scalability: "Évolutivité",
  maintenance: "Maintenance",
  portability: "Portabilité",
  rollback: "Restauration",
};

export function criterionLabel(criterion: string): string {
  return CRITERION_LABEL[criterion] ?? criterion;
}

export const VERDICT_LABEL: Record<Verdict, string> = {
  recommended: "Recommandée",
  eligible: "Éligible",
  eliminated: "Éliminée",
};

const SCORE = new Intl.NumberFormat("fr-CA", { maximumFractionDigits: 1 });

export function formatScore(value: number): string {
  return SCORE.format(value);
}

export type CostCategoryKind = Exclude<NodeKind, "user">;

export interface CostCategory {
  kind: CostCategoryKind;
  label: string;
  /** Classe de couleur de la barre (écrite en entier pour que Tailwind la détecte). */
  bar: string;
}

export const COST_CATEGORIES: CostCategory[] = [
  { kind: "compute", label: "Calcul", bar: "bg-brand-800" },
  { kind: "database", label: "Base de données", bar: "bg-brand-600" },
  { kind: "storage", label: "Stockage", bar: "bg-brand-400" },
  { kind: "network", label: "Réseau", bar: "bg-sky-400" },
  { kind: "backup", label: "Sauvegardes", bar: "bg-brand-200" },
  { kind: "other", label: "Autres", bar: "bg-slate-300" },
];

/** Coût au palier retenu, regroupé par type de composant du schéma. */
export function costByCategory(arch: ArchitectureResult): Record<CostCategoryKind, number> {
  const totals: Record<CostCategoryKind, number> = { compute: 0, database: 0, storage: 0, network: 0, backup: 0, other: 0 };
  if (!arch.graph) {
    totals.other = arch.cost_low;
    return totals;
  }
  for (const node of arch.graph.nodes) {
    const kind = node.kind;
    if (kind === "user") continue;
    totals[kind] += node.monthly_cost;
  }
  return totals;
}

export interface RangeLabels {
  primary: string;
  /** Équivalent dans la devise du budget, seulement si un taux de change existe. */
  secondary: string | null;
}

function converted(evaluation: EvaluationResult, low: number | null, high: number | null): string | null {
  const currency = evaluation.display_currency;
  if (!currency || currency === "USD" || low === null || high === null) return null;
  return `≈ ${formatRange(low, high, currency)}`;
}

export function costRange(arch: ArchitectureResult, evaluation: EvaluationResult): RangeLabels {
  return {
    primary: formatRange(arch.cost_low, arch.cost_high),
    secondary: converted(evaluation, arch.cost_low_display, arch.cost_high_display),
  };
}

/** Coût avec maintenance : seulement si un tarif horaire a été renseigné. */
export function maintenanceRange(arch: ArchitectureResult, evaluation: EvaluationResult): RangeLabels | null {
  if (arch.total_low_with_maintenance === null || arch.total_high_with_maintenance === null) return null;
  return {
    primary: formatRange(arch.total_low_with_maintenance, arch.total_high_with_maintenance),
    secondary: converted(
      evaluation,
      arch.total_low_with_maintenance_display,
      arch.total_high_with_maintenance_display,
    ),
  };
}

export { formatMoney };