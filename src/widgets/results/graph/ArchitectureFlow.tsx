import { Background, BackgroundVariant, Panel, ReactFlow, useReactFlow, type NodeTypes } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Maximize, ZoomIn, ZoomOut } from "lucide-react";
import { useMemo } from "react";
import type { ArchitectureGraph } from "../../../interfaces/evaluation";
import { toFlowEdges, toFlowNodes } from "../../../utils/graphModel";
import ArchNode from "./ArchNode";

const NODE_TYPES: NodeTypes = { arch: ArchNode };
const FIT = { padding: 0.12, minZoom: 0.55, maxZoom: 1.1 } as const;

function FlowControls() {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const button =
    "flex size-9 items-center justify-center rounded-lg text-brand-800 transition hover:bg-brand-50 focus-visible:outline-2";

  return (
    <Panel position="bottom-left">
      <div role="group" aria-label="Contrôles du schéma" className="flex gap-1 rounded-xl border border-line bg-white p-1 shadow-card">
        <button type="button" aria-label="Zoom avant" className={button} onClick={() => void zoomIn({ duration: 200 })}>
          <ZoomIn className="size-4" aria-hidden />
        </button>
        <button type="button" aria-label="Zoom arrière" className={button} onClick={() => void zoomOut({ duration: 200 })}>
          <ZoomOut className="size-4" aria-hidden />
        </button>
        <button
          type="button"
          aria-label="Recentrer le schéma"
          className={`${button} w-auto gap-1.5 px-2.5 text-xs font-medium`}
          onClick={() => void fitView({ ...FIT, duration: 300 })}
        >
          <Maximize className="size-4" aria-hidden />
          Recentrer
        </button>
      </div>
    </Panel>
  );
}

interface ArchitectureFlowProps {
  graph: ArchitectureGraph;
  /** Change avec l'architecture : remonte le schéma et le recentre. */
  graphKey: string;
  label: string;
  selectedId?: string | null;
  highlighted?: ReadonlySet<string>;
  /** Si absent, les composants ne sont pas cliquables (mode comparaison). */
  onSelectNode?: (id: string) => void;
}

export default function ArchitectureFlow({ graph, graphKey, label, selectedId, highlighted, onSelectNode }: ArchitectureFlowProps) {
  const nodes = useMemo(
    () => toFlowNodes(graph, { selectedId, highlighted, onSelect: onSelectNode }),
    [graph, selectedId, highlighted, onSelectNode],
  );
  const edges = useMemo(() => toFlowEdges(graph), [graph]);

  return (
    <div
      role="group"
      aria-label={`Schéma interactif : ${label}. Une version textuelle est disponible sous le schéma.`}
      className="h-[22rem] overflow-hidden rounded-xl bg-brand-50/40 ring-1 ring-brand-100 sm:h-[26rem]"
    >
      <ReactFlow
        key={graphKey}
        nodes={nodes}
        edges={edges}
        nodeTypes={NODE_TYPES}
        fitView
        fitViewOptions={FIT}
        minZoom={0.3}
        maxZoom={1.6}
        nodesDraggable={false}
        nodesConnectable={false}
        nodesFocusable={false}
        edgesFocusable={false}
        elementsSelectable={false}
        zoomOnScroll={false}
        preventScrolling={false}
      >
        <Background variant={BackgroundVariant.Dots} gap={18} size={1} color="#c3d8fd" />
        <FlowControls />
      </ReactFlow>
    </div>
  );
}