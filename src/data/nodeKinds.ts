import { Archive, Cpu, Database, HardDrive, Layers, Network, Users, type LucideIcon } from "lucide-react";
import type { NodeKind } from "../interfaces/evaluation";

export interface NodeKindInfo {
  label: string;
  icon: LucideIcon;
  /** Classes écrites en entier (sans concaténation) pour que Tailwind les détecte. */
  iconBox: string;
  swatch: string;
}

export const NODE_KINDS: Record<NodeKind, NodeKindInfo> = {
  user: { label: "Utilisateurs", icon: Users, iconBox: "bg-sky-100 text-sky-700", swatch: "bg-sky-400" },
  compute: { label: "Calcul", icon: Cpu, iconBox: "bg-brand-800 text-white", swatch: "bg-brand-800" },
  database: { label: "Base de données", icon: Database, iconBox: "bg-brand-600 text-white", swatch: "bg-brand-600" },
  storage: { label: "Stockage de fichiers", icon: HardDrive, iconBox: "bg-brand-400 text-white", swatch: "bg-brand-400" },
  network: { label: "Réseau", icon: Network, iconBox: "bg-cyan-100 text-cyan-800", swatch: "bg-cyan-400" },
  backup: { label: "Sauvegardes", icon: Archive, iconBox: "bg-brand-100 text-brand-800", swatch: "bg-brand-300" },
  other: { label: "Autres coûts", icon: Layers, iconBox: "bg-slate-200 text-slate-700", swatch: "bg-slate-400" },
};