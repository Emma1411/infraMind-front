export interface SpecRow {
  label: string;
  value: string;
}

type Params = Record<string, string>;

/** Les valeurs du projet à afficher en haut du guide, selon les paramètres que ce guide contient. */
export function specRows(p: Params, hasDatabase: boolean): SpecRow[] {
  const rows: SpecRow[] = [];
  const add = (label: string, value: string) => rows.push({ label, value });

  if (p.region) add("Région de référence", p.region);
  if (p.server_type) add("Serveur", `${p.server_type} · ${p.vcpu} vCPU, ${p.ram_gb} Go de RAM`);
  if (p.ec2_type) add("Instance EC2", `${p.ec2_type} · ${p.ec2_vcpu} vCPU, ${p.ec2_ram_gb} Gio de RAM`);
  if (p.vm_size) add("Machine virtuelle", `${p.vm_size} · ${p.vm_vcpu} vCPU, ${p.vm_ram_gb} Gio de RAM`);
  if (p.run_vcpu) add("Cloud Run", `${p.run_vcpu} vCPU, ${p.run_memory}`);
  if (p.task_vcpu) add("Conteneur Fargate", `${p.task_vcpu} vCPU, ${p.task_memory_gib} Gio, ${p.tasks} tâche(s)`);
  if (p.rds_class) add("Base RDS", `${p.rds_class} · ${p.rds_vcpu} vCPU, ${p.rds_ram_gb} Gio, ${p.rds_storage_gb} Go`);
  if (p.pg_sku) add("PostgreSQL", `${p.pg_sku} · ${p.pg_vcpu} vCPU, ${p.pg_ram_gb} Gio, ${p.pg_storage_gb} Go`);
  if (p.db_vcpu && hasDatabase) add("Cloud SQL", `${p.db_vcpu} vCPU, ${p.db_memory_gib} Gio, ${p.db_storage_gb} Go`);
  if (p.app_slug) add("Nom technique", p.app_slug);
  return rows;
}