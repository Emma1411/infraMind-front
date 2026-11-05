import { Handle, Position, type NodeProps } from "@xyflow/react";
import { NODE_KINDS } from "../../../data/nodeKinds";
import { NODE_HEIGHT, NODE_WIDTH, compactCost, type ArchFlowNode } from "../../../utils/graphModel";

const HANDLE_STYLE = { width: 8, height: 8, background: "#93b9fb", border: "none" } as const;

export default function ArchNode({ id, data }: NodeProps<ArchFlowNode>) {
  const info = NODE_KINDS[data.kind];
  const Icon = info.icon;
  const isCore = data.kind === "compute";
  const showCost = data.kind !== "user";

  let frame = "border-line";
  if (data.selected) frame = "border-brand-500 ring-2 ring-brand-300";
  else if (data.highlighted) frame = "border-warn ring-2 ring-warn/30";
  else if (isCore) frame = "border-brand-400";

  const spoken = `${data.label}${showCost ? `, ${compactCost(data.cost)}` : ""}${data.highlighted ? ", diffère de l'autre architecture" : ""}`;

  return (
    <button
      type="button"
      aria-label={spoken}
      aria-pressed={data.interactive ? data.selected : undefined}
      aria-disabled={!data.interactive}
      tabIndex={data.interactive ? 0 : -1}
      onClick={() => data.interactive && data.onSelect(id)}
      style={{ width: NODE_WIDTH, height: NODE_HEIGHT, animationDelay: `${data.order * 90}ms` }}
      className={`node-appear relative rounded-xl border bg-white p-2.5 text-left shadow-card transition ${frame} ${
        data.interactive ? "cursor-pointer hover:border-brand-400" : "cursor-default"
      }`}
    >
      <Handle type="target" position={Position.Left} isConnectable={false} style={HANDLE_STYLE} />

      <div className="flex items-start justify-between gap-2">
        <span className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${info.iconBox}`}>
          <Icon className="size-4" aria-hidden />
        </span>
        {showCost && (
          <span className="rounded-md bg-brand-50 px-2 py-0.5 font-mono text-[11px] font-semibold text-brand-800">
            {compactCost(data.cost)}
          </span>
        )}
      </div>
      <p title={data.label} className="mt-1.5 truncate text-[13px] font-semibold text-ink">
        {data.label}
      </p>
      <p className="text-[11px] text-muted">
        {isCore ? "Cœur du calcul" : info.label}
        {data.highlighted && <span className="font-semibold text-warn"> · Diffère</span>}
      </p>

      <Handle type="source" position={Position.Right} isConnectable={false} style={HANDLE_STYLE} />
    </button>
  );
}