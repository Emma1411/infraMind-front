import { NODE_KINDS } from "../../../data/nodeKinds";
import type { NodeKind } from "../../../interfaces/evaluation";

interface GraphLegendProps {
  kinds: NodeKind[];
  showDifference?: boolean;
}

export default function GraphLegend({ kinds, showDifference = false }: GraphLegendProps) {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-body">
      <ul aria-label="Types de composants" className="flex flex-wrap gap-x-4 gap-y-1.5">
        {kinds.map((kind) => (
          <li key={kind} className="flex items-center gap-1.5">
            <span className={`size-2.5 rounded-sm ${NODE_KINDS[kind].swatch}`} aria-hidden />
            {NODE_KINDS[kind].label}
          </li>
        ))}
      </ul>
      <ul aria-label="Types de liens" className="flex flex-wrap gap-x-4 gap-y-1.5">
        <li className="flex items-center gap-1.5">
          <span className="h-0 w-6 border-t-2 border-dashed border-brand-400" aria-hidden />
          Échange de données (animé)
        </li>
        <li className="flex items-center gap-1.5">
          <span className="h-0 w-6 border-t-2 border-dashed border-brand-300" aria-hidden />
          Sauvegarde (fixe)
        </li>
        {showDifference && (
          <li className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm bg-warn" aria-hidden />
            Composant propre à cette architecture
          </li>
        )}
      </ul>
    </div>
  );
}