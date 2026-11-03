import type { ProjectSpec } from "../interfaces/spec";

export function createEmptySpec(): ProjectSpec {
  return {
    name: null,
    application: {
      app_type: null,
      runtime: null,
      has_background_jobs: null,
      needs_realtime: null,
      third_party_services: [],
    },
    traffic: { daily_users: null, has_peaks: null, peak_notes: null },
    data: { database_type: null, data_size: null, has_file_uploads: null },
    backups: { acceptable_data_loss: null, acceptable_restore_time: null },
    compliance: { personal_data: null, payment_data: null, health_data: null, other_regulations: null },
    availability: { availability_target: null },
    security: { auth_required: null, admin_access: null, needs_ddos_protection: null, audit_required: null },
    network: { custom_domain: null, needs_cdn: null, sends_emails: null },
    delivery: { environments: [], ci_cd_wanted: null },
    observability: { monitoring_level: null },
    team: { who_maintains: null, contract_duration_months: null, ops_skill: null, hourly_rate: null },
    constraints: {
      budget_max_monthly: null,
      budget_currency: null,
      imposed_provider: null,
      existing_stack_notes: null,
      migration_from: null,
    },
    unknown: [],
  };
}