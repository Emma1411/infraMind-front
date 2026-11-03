export const DOMAINS = [
  "application",
  "traffic",
  "data",
  "backups",
  "compliance",
  "availability",
  "security",
  "network",
  "delivery",
  "observability",
  "team",
  "constraints",
] as const;

export type DomainKey = (typeof DOMAINS)[number];

export type AppType = "static_site" | "web_app" | "api_only" | "ssr_app" | "data_pipeline" | "other";
export type UsersBand = "under_100" | "between_100_1000" | "between_1000_10000" | "over_10000";
export type DatabaseType = "none" | "relational" | "document" | "key_value" | "other";
export type DataSizeBand = "under_1gb" | "gb_1_10" | "gb_10_100" | "over_100gb";
export type LossTolerance = "none" | "minutes" | "hours" | "one_day";
export type RestoreTime = "under_1h" | "few_hours" | "one_day" | "several_days";
export type AvailabilityTarget = "best_effort" | "business_hours" | "always_on";
export type MonitoringLevel = "none" | "basic" | "full";
export type Maintainer = "developer" | "client" | "client_it" | "nobody";
export type OpsSkill = "none" | "basic" | "advanced";
export type Environment = "dev" | "staging" | "prod";
export type Currency = "CAD" | "USD" | "EUR";

export interface ApplicationSpec {
  app_type: AppType | null;
  runtime: string | null;
  has_background_jobs: boolean | null;
  needs_realtime: boolean | null;
  third_party_services: string[];
}

export interface TrafficSpec {
  daily_users: UsersBand | null;
  has_peaks: boolean | null;
  peak_notes: string | null;
}

export interface DataSpec {
  database_type: DatabaseType | null;
  data_size: DataSizeBand | null;
  has_file_uploads: boolean | null;
}

export interface BackupsSpec {
  acceptable_data_loss: LossTolerance | null;
  acceptable_restore_time: RestoreTime | null;
}

export interface ComplianceSpec {
  personal_data: boolean | null;
  payment_data: boolean | null;
  health_data: boolean | null;
  other_regulations: string | null;
}

export interface AvailabilitySpec {
  availability_target: AvailabilityTarget | null;
}

export interface SecuritySpec {
  auth_required: boolean | null;
  admin_access: boolean | null;
  needs_ddos_protection: boolean | null;
  audit_required: boolean | null;
}

export interface NetworkSpec {
  custom_domain: boolean | null;
  needs_cdn: boolean | null;
  sends_emails: boolean | null;
}

export interface DeliverySpec {
  environments: Environment[];
  ci_cd_wanted: boolean | null;
}

export interface ObservabilitySpec {
  monitoring_level: MonitoringLevel | null;
}

export interface TeamSpec {
  who_maintains: Maintainer | null;
  contract_duration_months: number | null;
  ops_skill: OpsSkill | null;
  hourly_rate: number | null;
}

export interface ConstraintsSpec {
  budget_max_monthly: number | null;
  budget_currency: Currency | null;
  imposed_provider: string | null;
  existing_stack_notes: string | null;
  migration_from: string | null;
}

export interface ProjectSpec {
  name: string | null;
  application: ApplicationSpec;
  traffic: TrafficSpec;
  data: DataSpec;
  backups: BackupsSpec;
  compliance: ComplianceSpec;
  availability: AvailabilitySpec;
  security: SecuritySpec;
  network: NetworkSpec;
  delivery: DeliverySpec;
  observability: ObservabilitySpec;
  team: TeamSpec;
  constraints: ConstraintsSpec;
  /** Chemins « domaine.champ » auxquels l'utilisateur a répondu « je ne sais pas ». */
  unknown: string[];
}