export type Verdict = "recommended" | "eligible" | "eliminated";
export type BudgetRisk = "none" | "possible" | "over";
export type NodeKind = "user" | "compute" | "database" | "storage" | "network" | "backup" | "other";

export interface CostLine {
  item_id: string;
  label: string;
  monthly: number;
  detail: string;
  to_verify: boolean;
}

export interface UnpricedLine {
  item_id: string;
  label: string;
  reason: string;
}

export interface CriterionScore {
  criterion: string;
  score: number;
  weight: number;
  why: string;
}

export interface WeightInfo {
  criterion: string;
  weight: number;
}

export interface AvailabilityDetail {
  application_score: number;
  application_why: string;
  database_score: number | null;
  database_why: string | null;
  overall_score: number;
  overall_why: string;
}

export interface GraphNode {
  id: string;
  label: string;
  kind: NodeKind;
  description: string;
  x: number;
  y: number;
  monthly_cost: number;
  lines: CostLine[];
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  animated: boolean;
}

export interface ArchitectureGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface SensitivityScenario {
  value: string;
  label: string;
  cost_low: number;
  cost_high: number;
  recommended_id: string | null;
  is_current: boolean;
}

export interface SensitivityEntry {
  path: string;
  question: string;
  /** « known » : réponse donnée ; « assumed » : hypothèse du moteur. */
  status: "known" | "assumed";
  current_label: string;
  arch_id: string;
  cost_min: number;
  cost_max: number;
  spread: number;
  changes_recommendation: boolean;
  scenarios: SensitivityScenario[];
}

export interface ArchitectureResult {
  id: string;
  provider: string;
  label: string;
  summary: string;
  verdict: Verdict;
  eliminated_reasons: string[];
  cost_low: number;
  cost_high: number;
  cost_low_display: number | null;
  cost_high_display: number | null;
  within_budget_low: boolean | null;
  within_budget_high: boolean | null;
  budget_risk: BudgetRisk | null;
  maintenance_cost_monthly: number | null;
  maintenance_cost_display: number | null;
  total_low_with_maintenance: number | null;
  total_high_with_maintenance: number | null;
  total_low_with_maintenance_display: number | null;
  total_high_with_maintenance_display: number | null;
  estimate_complete: boolean;
  needs_verification: boolean;
  lines: CostLine[];
  unpriced: UnpricedLine[];
  graph: ArchitectureGraph | null;
  scores: CriterionScore[];
  total_score: number;
  availability: AvailabilityDetail;
  requirements_unmet: string[];
  warnings: string[];
  maintenance_hours_per_month: number;
  price_basis: string;
}

export interface EvaluationResult {
  /** Les montants du moteur sont toujours en dollars américains. */
  currency: string;
  display_currency: string | null;
  fx_rate: number | null;
  fx_as_of: string | null;
  pricing_disclaimer: string;
  tier: string;
  tier_label: string;
  assumptions: string[];
  weights: WeightInfo[];
  weight_reasons: string[];
  global_warnings: string[];
  ranking: ArchitectureResult[];
  recommended_id: string | null;
  coverage_missing: string[];
  sensitivity: SensitivityEntry[];
}