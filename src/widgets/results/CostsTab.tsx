import type { EvaluationResult } from "../../interfaces/evaluation";
import { COST_CATEGORIES, costByCategory, formatMoney } from "../../utils/results";

interface CostsTabProps {
  evaluation: EvaluationResult;
}

export default function CostsTab({ evaluation }: CostsTabProps) {
  const max = Math.max(...evaluation.ranking.map((arch) => arch.cost_high), 1);

  return (
    <div>
      <p className="max-w-3xl text-sm text-body">
        Répartition du coût mensuel au palier de trafic retenu, par type de composant. La barre claire en dessous montre
        le coût au palier supérieur. Montants du moteur, en dollars américains.
      </p>

      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2" aria-label="Légende">
        {COST_CATEGORIES.map((category) => (
          <li key={category.kind} className="flex items-center gap-2 text-sm text-body">
            <span className={`size-3 rounded ${category.bar}`} aria-hidden />
            {category.label}
          </li>
        ))}
      </ul>

      <ul className="mt-6 space-y-8">
        {evaluation.ranking.map((arch) => {
          const categories = costByCategory(arch);
          const eliminated = arch.verdict === "eliminated";
          return (
            <li key={arch.id} className={eliminated ? "opacity-70" : ""}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-semibold text-ink">
                  {arch.label}
                  {eliminated && <span className="ml-2 text-sm font-normal text-danger">(éliminée)</span>}
                </h3>
                <p className="font-mono text-sm text-body">
                  {formatMoney(arch.cost_low, "USD", 2)} à {formatMoney(arch.cost_high, "USD", 2)} par mois
                </p>
              </div>

              <div
                role="img"
                aria-label={`Répartition du coût de ${arch.label} : ${COST_CATEGORIES.filter((c) => categories[c.kind] > 0)
                  .map((c) => `${c.label} ${formatMoney(categories[c.kind], "USD", 2)}`)
                  .join(", ")}`}
                className="mt-2 flex h-5 overflow-hidden rounded-full bg-brand-50"
              >
                {COST_CATEGORIES.map(
                  (category) =>
                    categories[category.kind] > 0 && (
                      <div
                        key={category.kind}
                        className={`h-full ${category.bar}`}
                        style={{ width: `${(categories[category.kind] / max) * 100}%` }}
                      />
                    ),
                )}
              </div>
              <div
                className="mt-1.5 h-1.5 rounded-full bg-brand-200"
                style={{ width: `${(arch.cost_high / max) * 100}%` }}
                aria-hidden
              />
              <p className="mt-1 text-xs text-muted">Palier de trafic supérieur : {formatMoney(arch.cost_high, "USD", 2)}</p>

              <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1 text-sm sm:grid-cols-3">
                {COST_CATEGORIES.filter((category) => categories[category.kind] > 0).map((category) => (
                  <div key={category.kind} className="flex justify-between gap-3 border-b border-line/60 py-1">
                    <dt className="text-muted">{category.label}</dt>
                    <dd className="font-mono text-ink">{formatMoney(categories[category.kind], "USD", 2)}</dd>
                  </div>
                ))}
              </dl>
            </li>
          );
        })}
      </ul>
    </div>
  );
}