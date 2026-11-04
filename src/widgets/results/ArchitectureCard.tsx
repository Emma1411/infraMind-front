import { ArrowRight, Clock, TriangleAlert } from "lucide-react";
import Button from "../../components/Button";
import type { ArchitectureResult, EvaluationResult } from "../../interfaces/evaluation";
import { formatNumber } from "../../utils/format";
import { costRange, maintenanceRange } from "../../utils/results";
import ArchitectureBadges from "./ArchitectureBadges";
import ScoreRing from "./ScoreRing";

interface ArchitectureCardProps {
  arch: ArchitectureResult;
  rank: number;
  evaluation: EvaluationResult;
  selected: boolean;
  onDetail: (id: string) => void;
  onDeploy: (id: string) => void;
}

function frame(arch: ArchitectureResult, selected: boolean): string {
  if (selected) return "border-brand-500 bg-white ring-2 ring-brand-500";
  if (arch.verdict === "recommended") return "border-brand-300 bg-brand-50/50 ring-1 ring-brand-200";
  if (arch.verdict === "eliminated") return "border-line bg-slate-50";
  return "border-line bg-white";
}

export default function ArchitectureCard({ arch, rank, evaluation, selected, onDetail, onDeploy }: ArchitectureCardProps) {
  const eliminated = arch.verdict === "eliminated";
  const range = costRange(arch, evaluation);
  const withMaintenance = maintenanceRange(arch, evaluation);
  const titleId = `architecture-${arch.id}`;

  return (
    <article aria-labelledby={titleId} className={`rounded-xl2 border p-5 shadow-card sm:p-6 ${frame(arch, selected)}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-muted">#{rank}</span>
            <ArchitectureBadges arch={arch} />
          </div>
          <h3 id={titleId} className={`mt-2 text-lg font-semibold ${eliminated ? "text-muted" : "text-ink"}`}>
            {arch.label}
          </h3>
          <p className="mt-1 text-sm text-body">{arch.summary}</p>
        </div>
        <ScoreRing score={arch.total_score} />
      </div>

      {eliminated && arch.eliminated_reasons.length > 0 && (
        <ul className="mt-4 list-disc space-y-1 rounded-xl bg-danger-soft p-4 pl-8 text-sm text-danger">
          {arch.eliminated_reasons.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-wide text-muted uppercase">Coût mensuel estimé</p>
          <p className={`text-xl font-bold ${eliminated ? "text-muted" : "text-brand-900"}`}>{range.primary}</p>
          {range.secondary && <p className="text-sm text-brand-700">{range.secondary}</p>}
          {withMaintenance && <p className="mt-1 text-sm text-body">Avec maintenance : {withMaintenance.primary}</p>}
        </div>
        <p className="flex items-center gap-1.5 text-sm text-body">
          <Clock className="size-4 text-muted" aria-hidden />
          {formatNumber(arch.maintenance_hours_per_month)} h de maintenance par mois
        </p>
      </div>

      {arch.requirements_unmet.length > 0 && (
        <ul className="mt-4 space-y-1.5">
          {arch.requirements_unmet.map((item) => (
            <li key={item} className="flex gap-2 text-sm text-warn">
              <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
              {item}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-5 flex flex-wrap gap-3">
        <Button variant="secondary" aria-pressed={selected} onClick={() => onDetail(arch.id)}>
          Voir le détail
        </Button>
        {!eliminated && (
          <Button variant="ghost" icon={<ArrowRight className="size-4" aria-hidden />} onClick={() => onDeploy(arch.id)}>
            Guide de déploiement
          </Button>
        )}
      </div>
    </article>
  );
}