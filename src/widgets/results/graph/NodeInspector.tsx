import { ArrowRight, Info, MousePointerClick } from "lucide-react";
import Badge from "../../../components/Badge";
import Button from "../../../components/Button";
import { NODE_KINDS } from "../../../data/nodeKinds";
import type { GraphNode } from "../../../interfaces/evaluation";
import { formatMoney } from "../../../utils/results";

interface NodeInspectorProps {
  node: GraphNode | null;
  archLabel: string;
  canDeploy: boolean;
  onDeploy: () => void;
}

export default function NodeInspector({ node, archLabel, canDeploy, onDeploy }: NodeInspectorProps) {
  const info = node ? NODE_KINDS[node.kind] : null;
  const Icon = info?.icon;

  return (
    <aside aria-labelledby="inspector-title" className="self-start rounded-xl2 border border-line bg-white p-5 shadow-card">
      <p className="text-xs font-semibold tracking-wide text-muted uppercase">Inspecteur de composant</p>

      {!node || !info || !Icon ? (
        <div className="mt-4 flex items-start gap-3 text-sm text-muted">
          <MousePointerClick className="mt-0.5 size-4 shrink-0" aria-hidden />
          <p id="inspector-title">Clique sur un composant du schéma pour voir ce qu'il fait et ce qu'il coûte.</p>
        </div>
      ) : (
        <div aria-live="polite">
          <div className="mt-3 flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${info.iconBox}`}>
                <Icon className="size-5" aria-hidden />
              </span>
              <div>
                <h3 id="inspector-title" className="text-lg font-semibold text-ink">
                  {node.label}
                </h3>
                <p className="text-xs text-muted">{info.label}</p>
              </div>
            </div>
            {node.kind !== "user" && (
              <Badge tone="info" className="shrink-0 font-mono">
                {formatMoney(node.monthly_cost, "USD", 2)} / mois
              </Badge>
            )}
          </div>

          {node.description && (
            <div className="mt-4 flex gap-3 rounded-xl bg-brand-50 p-3 text-sm text-body">
              <Info className="mt-0.5 size-4 shrink-0 text-brand-600" aria-hidden />
              <div>
                <p className="font-semibold text-ink">À quoi ça sert ?</p>
                <p className="mt-0.5">{node.description}</p>
              </div>
            </div>
          )}

          {node.kind !== "user" && (
            <div className="mt-5">
              <h4 className="text-xs font-semibold tracking-wide text-muted uppercase">Décomposition des coûts mensuels</h4>
              {node.lines.length === 0 ? (
                <p className="mt-2 text-sm text-muted">Aucune ligne de coût pour ce composant.</p>
              ) : (
                <ul className="mt-2 divide-y divide-line/70 text-sm">
                  {node.lines.map((line) => (
                    <li key={`${line.item_id}-${line.detail}`} className="py-2">
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="text-ink">
                          {line.label}
                          {line.to_verify && (
                            <Badge tone="warn" className="ml-2">
                              à vérifier
                            </Badge>
                          )}
                        </span>
                        <span className="font-mono text-ink">{formatMoney(line.monthly, "USD", 2)}</span>
                      </div>
                      {line.detail && <p className="mt-0.5 text-xs text-muted">{line.detail}</p>}
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-2 flex justify-between border-t border-line pt-2 text-sm font-semibold text-ink">
                <span>Total du composant</span>
                <span className="font-mono">{formatMoney(node.monthly_cost, "USD", 2)}</span>
              </p>
            </div>
          )}
        </div>
      )}

      {canDeploy && (
        <Button className="mt-5 w-full" icon={<ArrowRight className="size-4" aria-hidden />} onClick={onDeploy}>
          Déployer cette architecture
        </Button>
      )}
      <p className="mt-3 text-center text-xs text-muted">{archLabel}</p>
    </aside>
  );
}