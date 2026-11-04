import { useId } from "react";
import type { ArchitectureResult, EvaluationResult } from "../../interfaces/evaluation";
import { formatMoney } from "../../utils/results";

interface GraphTabProps {
  evaluation: EvaluationResult;
  selected: ArchitectureResult;
  onSelect: (id: string) => void;
}

const KIND_LABEL: Record<string, string> = {
  user: "Utilisateurs",
  compute: "Calcul",
  database: "Base de données",
  storage: "Stockage",
  network: "Réseau",
  backup: "Sauvegardes",
  other: "Autres",
};

/** Version textuelle de l'architecture : composants et connexions. Sert aussi d'alternative accessible au schéma visuel. */
export default function GraphTab({ evaluation, selected, onSelect }: GraphTabProps) {
  const selectId = useId();
  const graph = selected.graph;
  const labels = new Map((graph?.nodes ?? []).map((node) => [node.id, node.label]));
  const total = (graph?.nodes ?? []).reduce((sum, node) => sum + node.monthly_cost, 0);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-ink">Composants et connexions</h2>
          <p className="mt-1 text-sm text-body">
            Chaque composant avec son coût mensuel. La somme des composants est égale au coût estimé.
          </p>
        </div>
        <div>
          <label htmlFor={selectId} className="text-sm font-medium text-ink">
            Architecture affichée
          </label>
          <select
            id={selectId}
            value={selected.id}
            onChange={(event) => onSelect(event.target.value)}
            className="mt-1 block rounded-xl border border-brand-100 bg-white px-4 py-2.5 text-sm text-ink focus:border-brand-400 focus:ring-2 focus:ring-brand-200 focus:outline-none"
          >
            {evaluation.ranking.map((arch, index) => (
              <option key={arch.id} value={arch.id}>
                {index + 1}. {arch.label}
                {arch.verdict === "recommended" ? " (recommandée)" : ""}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!graph ? (
        <p className="mt-6 text-sm text-muted">Aucun schéma disponible pour cette architecture.</p>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section aria-labelledby="graph-nodes">
            <h3 id="graph-nodes" className="text-sm font-semibold tracking-wide text-brand-700 uppercase">
              Composants
            </h3>
            <ul className="mt-3 space-y-3">
              {graph.nodes.map((node) => (
                <li key={node.id} className="rounded-xl border border-line bg-white p-4">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="font-semibold text-ink">
                      {node.label} <span className="text-xs font-normal text-muted">· {KIND_LABEL[node.kind] ?? node.kind}</span>
                    </p>
                    {node.kind !== "user" && (
                      <p className="font-mono text-sm text-brand-800">{formatMoney(node.monthly_cost, "USD", 2)} / mois</p>
                    )}
                  </div>
                  {node.description && <p className="mt-1 text-sm text-body">{node.description}</p>}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-right text-sm font-semibold text-ink">
              Total : {formatMoney(total, "USD", 2)} / mois
            </p>
          </section>

          <section aria-labelledby="graph-links">
            <h3 id="graph-links" className="text-sm font-semibold tracking-wide text-brand-700 uppercase">
              Connexions
            </h3>
            <ul className="mt-3 space-y-2">
              {graph.edges.map((edge) => (
                <li key={edge.id} className="rounded-xl bg-brand-50 px-4 py-2.5 text-sm text-ink">
                  {labels.get(edge.source) ?? edge.source} <span aria-hidden>→</span>
                  <span className="sr-only"> vers </span> {labels.get(edge.target) ?? edge.target}
                  {edge.label && <span className="ml-2 font-mono text-xs text-muted">({edge.label})</span>}
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}