import { TriangleAlert } from "lucide-react";
import Badge from "../../components/Badge";
import Button from "../../components/Button";
import type { EvaluationResult } from "../../interfaces/evaluation";
import { formatMoney } from "../../utils/results";

interface SensitivityTabProps {
  evaluation: EvaluationResult;
  onEdit: () => void;
}

export default function SensitivityTab({ evaluation, onEdit }: SensitivityTabProps) {
  const labels = Object.fromEntries(evaluation.ranking.map((arch) => [arch.id, arch.label]));
  const entries = evaluation.sensitivity;

  if (entries.length === 0) {
    return <p className="text-sm text-muted">Aucune analyse de sensibilité disponible pour ce projet.</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-ink">Ce qui peut faire varier ton devis</h2>
      <p className="mt-1 max-w-3xl text-sm text-body">
        Pour {labels[entries[0].arch_id] ?? "l'architecture analysée"}, voici les informations qui font le plus bouger
        le coût mensuel, de la plus influente à la moins influente. Chaque ligne montre le coût si cette réponse change.
        Les montants sont en dollars américains, hors taxes.
      </p>

      <ul className="mt-6 space-y-5">
        {entries.map((entry) => {
          const max = Math.max(...entry.scenarios.map((scenario) => scenario.cost_low), 1);
          return (
            <li key={entry.path} className="rounded-xl2 border border-line bg-white p-5 shadow-card">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h3 className="max-w-xl font-semibold text-ink">{entry.question}</h3>
                <div className="flex flex-wrap items-center gap-2">
                  {entry.status === "assumed" ? (
                    <Badge tone="warn">Hypothèse à confirmer</Badge>
                  ) : (
                    <Badge tone="ok">Ta réponse</Badge>
                  )}
                  {entry.changes_recommendation && (
                    <Badge tone="danger" icon={<TriangleAlert className="size-3.5" aria-hidden />}>
                      Change la recommandation
                    </Badge>
                  )}
                </div>
              </div>
              <p className="mt-1 text-sm text-muted">
                Valeur retenue : <span className="font-medium text-ink">{entry.current_label}</span> · le coût varie de{" "}
                {formatMoney(entry.cost_min, "USD", 0)} à {formatMoney(entry.cost_max, "USD", 0)} par mois
              </p>

              <ul className="mt-4 space-y-2.5">
                {entry.scenarios.map((scenario) => (
                  <li key={scenario.value}>
                    <div className="grid grid-cols-[minmax(0,9rem)_minmax(0,1fr)_5.5rem] items-center gap-3 text-sm">
                      <span className={scenario.is_current ? "font-semibold text-brand-800" : "text-body"}>
                        {scenario.label}
                        {scenario.is_current && " (retenue)"}
                      </span>
                      <div className="h-2.5 overflow-hidden rounded-full bg-brand-50" aria-hidden>
                        <div
                          className={`h-full rounded-full ${scenario.is_current ? "bg-brand-600" : "bg-brand-300"}`}
                          style={{ width: `${(scenario.cost_low / max) * 100}%` }}
                        />
                      </div>
                      <span className="text-right font-mono text-ink">{formatMoney(scenario.cost_low, "USD", 0)}</span>
                    </div>
                    {scenario.recommended_id && scenario.recommended_id !== evaluation.recommended_id && (
                      <p className="mt-0.5 pl-1 text-xs text-warn">
                        Avec cette valeur, l'architecture recommandée serait « {labels[scenario.recommended_id] ?? scenario.recommended_id} ».
                      </p>
                    )}
                  </li>
                ))}
              </ul>

              <Button variant="ghost" className="mt-3 px-0" onClick={onEdit}>
                Modifier cette réponse
              </Button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}