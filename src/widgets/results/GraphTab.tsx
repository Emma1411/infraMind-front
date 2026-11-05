import { GitCompareArrows, Network } from "lucide-react";
import { useCallback, useId, useMemo, useState } from "react";
import Badge from "../../components/Badge";
import Button from "../../components/Button";
import type { ArchitectureResult, EvaluationResult, NodeKind } from "../../interfaces/evaluation";
import { defaultNodeId, diffNodes, graphTotal } from "../../utils/graphModel";
import { formatMoney } from "../../utils/results";
import ArchitectureFlow from "./graph/ArchitectureFlow";
import GraphLegend from "./graph/GraphLegend";
import GraphTextAlternative from "./graph/GraphTextAlternative";
import NodeInspector from "./graph/NodeInspector";

interface GraphTabProps {
  evaluation: EvaluationResult;
  selected: ArchitectureResult;
  onSelect: (id: string) => void;
  onDeploy: (id: string) => void;
}

const HINT = "Fais glisser pour déplacer. Zoom : boutons + et −, pincement, ou Ctrl (Cmd) + molette.";

function kindsOf(...archs: ArchitectureResult[]): NodeKind[] {
  const order: NodeKind[] = ["user", "network", "compute", "database", "storage", "backup", "other"];
  const present = new Set(archs.flatMap((arch) => arch.graph?.nodes.map((node) => node.kind) ?? []));
  return order.filter((kind) => present.has(kind));
}

export default function GraphTab({ evaluation, selected, onSelect, onDeploy }: GraphTabProps) {
  const selectId = useId();
  const otherSelectId = useId();
  const ranking = evaluation.ranking;

  const [compare, setCompare] = useState(false);
  const [otherId, setOtherId] = useState<string | null>(null);
  const [pick, setPick] = useState<{ archId: string; nodeId: string } | null>(null);

  const graph = selected.graph;
  const other = ranking.find((arch) => arch.id === otherId && arch.id !== selected.id) ?? ranking.find((arch) => arch.id !== selected.id) ?? null;

  const pickedNodeId =
    pick && pick.archId === selected.id && graph?.nodes.some((node) => node.id === pick.nodeId) ? pick.nodeId : null;
  const activeNodeId = pickedNodeId ?? (graph ? defaultNodeId(graph) : null);
  const activeNode = graph?.nodes.find((node) => node.id === activeNodeId) ?? null;

  const selectNode = useCallback((nodeId: string) => setPick({ archId: selected.id, nodeId }), [selected.id]);

  const diff = useMemo(
    () => (compare && graph && other?.graph ? diffNodes(graph, other.graph) : null),
    [compare, graph, other],
  );

  const archOption = (arch: ArchitectureResult, index: number) => (
    <option key={arch.id} value={arch.id}>
      {index + 1}. {arch.label}
      {arch.verdict === "recommended" ? " (recommandée)" : ""}
    </option>
  );

  const selectClass =
    "mt-1 block w-full rounded-xl border border-brand-100 bg-white px-4 py-2.5 text-sm text-ink focus:border-brand-400 focus:ring-2 focus:ring-brand-200 focus:outline-none";

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-ink">Schéma interactif</h2>
          <p className="mt-1 max-w-2xl text-sm text-body">
            Clique sur un composant pour voir ce qu'il fait et ce qu'il coûte. La somme des composants est égale au coût
            estimé.
          </p>
        </div>
        <Button
          variant={compare ? "primary" : "secondary"}
          aria-pressed={compare}
          iconBefore={<GitCompareArrows className="size-4" aria-hidden />}
          onClick={() => setCompare((value) => !value)}
        >
          {compare ? "Quitter la comparaison" : "Comparer deux schémas"}
        </Button>
      </div>

      <div className={`mt-4 grid gap-4 ${compare ? "sm:grid-cols-2" : "sm:max-w-md"}`}>
        <div>
          <label htmlFor={selectId} className="text-sm font-medium text-ink">
            {compare ? "Architecture A" : "Architecture affichée"}
          </label>
          <select id={selectId} value={selected.id} onChange={(event) => onSelect(event.target.value)} className={selectClass}>
            {ranking.map(archOption)}
          </select>
        </div>
        {compare && (
          <div>
            <label htmlFor={otherSelectId} className="text-sm font-medium text-ink">
              Architecture B
            </label>
            <select
              id={otherSelectId}
              value={other?.id ?? ""}
              onChange={(event) => setOtherId(event.target.value)}
              className={selectClass}
            >
              {ranking.filter((arch) => arch.id !== selected.id).map((arch) => archOption(arch, ranking.indexOf(arch)))}
            </select>
          </div>
        )}
      </div>

      {!compare && (
        <>
          {!graph ? (
            <p className="mt-6 text-sm text-muted">Aucun schéma disponible pour cette architecture.</p>
          ) : (
            <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_21rem]">
              <section aria-label={`Schéma de ${selected.label}`} className="min-w-0 rounded-xl2 border border-line bg-white p-4 shadow-card">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <Badge icon={<Network className="size-3.5" aria-hidden />}>Topologie · palier retenu</Badge>
                  <p className="text-sm text-body">
                    Total des composants :{" "}
                    <span className="font-mono font-semibold text-ink">{formatMoney(graphTotal(graph), "USD", 2)} / mois</span>
                  </p>
                </div>
                <ArchitectureFlow
                  graph={graph}
                  graphKey={selected.id}
                  label={selected.label}
                  selectedId={activeNodeId}
                  onSelectNode={selectNode}
                />
                <p className="mt-2 text-xs text-muted">{HINT}</p>
                <GraphLegend kinds={kindsOf(selected)} />
              </section>

              <NodeInspector
                node={activeNode}
                archLabel={selected.label}
                canDeploy={selected.verdict !== "eliminated"}
                onDeploy={() => onDeploy(selected.id)}
              />
            </div>
          )}

          <details className="group mt-6 rounded-xl2 border border-line bg-white p-4 shadow-card">
            <summary className="cursor-pointer text-sm font-medium text-brand-800">Version textuelle du schéma</summary>
            <div className="mt-4">
              <GraphTextAlternative arch={selected} />
            </div>
          </details>
        </>
      )}

      {compare && other && (
        <>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {[
              { arch: selected, highlighted: diff?.a },
              { arch: other, highlighted: diff?.b },
            ].map(({ arch, highlighted }) => (
              <section
                key={arch.id}
                aria-label={`Schéma de ${arch.label}`}
                className="min-w-0 rounded-xl2 border border-line bg-white p-4 shadow-card"
              >
                <h3 className="font-semibold text-ink">{arch.label}</h3>
                <p className="mb-3 text-sm text-body">
                  Total :{" "}
                  <span className="font-mono font-semibold text-ink">
                    {arch.graph ? formatMoney(graphTotal(arch.graph), "USD", 2) : "—"} / mois
                  </span>
                </p>
                {arch.graph ? (
                  <ArchitectureFlow graph={arch.graph} graphKey={`compare-${arch.id}`} label={arch.label} highlighted={highlighted} />
                ) : (
                  <p className="text-sm text-muted">Aucun schéma disponible.</p>
                )}
                {highlighted && highlighted.size > 0 && arch.graph && (
                  <p className="mt-2 text-sm text-body">
                    Propre à cette architecture :{" "}
                    <span className="font-medium text-ink">
                      {arch.graph.nodes
                        .filter((node) => highlighted.has(node.id))
                        .map((node) => node.label)
                        .join(", ")}
                    </span>
                  </p>
                )}
              </section>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted">{HINT}</p>
          <GraphLegend kinds={kindsOf(selected, other)} showDifference />

          <details className="group mt-6 rounded-xl2 border border-line bg-white p-4 shadow-card">
            <summary className="cursor-pointer text-sm font-medium text-brand-800">Version textuelle des deux schémas</summary>
            <div className="mt-4 space-y-8">
              <GraphTextAlternative arch={selected} />
              <GraphTextAlternative arch={other} />
            </div>
          </details>
        </>
      )}
    </div>
  );
}