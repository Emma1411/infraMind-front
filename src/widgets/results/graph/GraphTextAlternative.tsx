import { NODE_KINDS } from "../../../data/nodeKinds";
import type { ArchitectureResult } from "../../../interfaces/evaluation";
import { graphTotal } from "../../../utils/graphModel";
import { formatMoney } from "../../../utils/results";

/** Version textuelle d'une architecture : composants, coûts et connexions. Alternative accessible au schéma. */
export default function GraphTextAlternative({ arch }: { arch: ArchitectureResult }) {
  const graph = arch.graph;
  if (!graph) return <p className="text-sm text-muted">Aucun schéma disponible pour cette architecture.</p>;
  const labels = new Map(graph.nodes.map((node) => [node.id, node.label]));

  return (
    <div>
      <h4 className="font-semibold text-ink">{arch.label}</h4>
      <div className="mt-3 grid gap-6 lg:grid-cols-2">
        <section aria-label={`Composants de ${arch.label}`}>
          <h5 className="text-xs font-semibold tracking-wide text-brand-700 uppercase">Composants</h5>
          <ul className="mt-2 space-y-2">
            {graph.nodes.map((node) => (
              <li key={node.id} className="rounded-xl border border-line bg-white p-3 text-sm">
                <p className="flex items-baseline justify-between gap-3">
                  <span className="font-semibold text-ink">
                    {node.label} <span className="text-xs font-normal text-muted">· {NODE_KINDS[node.kind].label}</span>
                  </span>
                  {node.kind !== "user" && (
                    <span className="font-mono text-xs text-brand-800">{formatMoney(node.monthly_cost, "USD", 2)} / mois</span>
                  )}
                </p>
                {node.description && <p className="mt-1 text-body">{node.description}</p>}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-right text-sm font-semibold text-ink">
            Total : {formatMoney(graphTotal(graph), "USD", 2)} / mois
          </p>
        </section>

        <section aria-label={`Connexions de ${arch.label}`}>
          <h5 className="text-xs font-semibold tracking-wide text-brand-700 uppercase">Connexions</h5>
          <ul className="mt-2 space-y-2">
            {graph.edges.map((edge) => (
              <li key={edge.id} className="rounded-xl bg-brand-50 px-3 py-2 text-sm text-ink">
                {labels.get(edge.source) ?? edge.source} <span aria-hidden>→</span>
                <span className="sr-only"> vers </span> {labels.get(edge.target) ?? edge.target}
                {edge.label && <span className="ml-2 font-mono text-xs text-muted">({edge.label})</span>}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}