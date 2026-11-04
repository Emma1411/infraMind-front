import {
  Activity,
  Database,
  Eye,
  Gauge,
  GitBranch,
  Globe,
  Layers,
  LifeBuoy,
  Lock,
  Scale,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { DOMAINS, type DomainKey } from "../interfaces/spec";

export interface DomainInfo {
  key: DomainKey;
  label: string;
  description: string;
  icon: LucideIcon;
}

const INFO: Record<DomainKey, Omit<DomainInfo, "key">> = {
  application: {
    label: "Application",
    description: "Type d'application, tâches en arrière-plan, temps réel",
    icon: Layers,
  },
  traffic: { label: "Trafic et charge", description: "Utilisateurs par jour, pics d'affluence", icon: Gauge },
  data: { label: "Données et stockage", description: "Base de données, volume, fichiers envoyés", icon: Database },
  backups: {
    label: "Sauvegardes",
    description: "Perte de données et temps d'arrêt acceptables",
    icon: LifeBuoy,
  },
  compliance: { label: "Conformité", description: "Données personnelles, paiements, santé", icon: Scale },
  availability: { label: "Disponibilité", description: "Pannes acceptables, service attendu", icon: Activity },
  security: { label: "Sécurité", description: "Comptes, administration, protection", icon: Lock },
  network: { label: "Réseau et domaine", description: "Nom de domaine, courriels, CDN", icon: Globe },
  delivery: { label: "Livraison", description: "Environnements, déploiement continu", icon: GitBranch },
  observability: { label: "Surveillance", description: "Journaux, alertes", icon: Eye },
  team: { label: "Équipe et maintenance", description: "Qui maintient, niveau, tarif horaire", icon: Users },
  constraints: { label: "Budget et contraintes", description: "Budget mensuel, fournisseur imposé", icon: Wallet },
};

export const DOMAIN_LIST: DomainInfo[] = DOMAINS.map((key) => ({ key, ...INFO[key] }));

export function domainLabel(key: string): string {
  return key in INFO ? INFO[key as DomainKey].label : key;
}