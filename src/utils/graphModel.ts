import { MarkerType, type Edge, type Node } from "@xyflow/react";
import type { ArchitectureGraph, NodeKind } from "../interfaces/evaluation";

/**
 * Les positions du backend sont espacées d'au moins 180 : un nœud plus large se chevaucherait
 * sur le schéma de Fargate.
 */
export const NODE_WIDTH = 168;
export const NODE_HEIGHT = 92;

export type ArchNodeData = {
  label: string;
  kind: NodeKind;
  cost: number;
  description: string;
  selected: boolean;
  highlighted: boolean;
  /** Rang d'apparition (de gauche à droite), pour l'animation d'entrée. */
  order: number;
  interactive: boolean;
  onSelect: (id: string) => void;
};

export type ArchFlowNode = Node<ArchNodeData, "arch">;

const EDGE_COLOR = "#5e94f5";
const EDGE_QUIET = "#93b9fb";

export function compactCost(cost: number): string {
  if (cost <= 0) return "0 $/mois";
  if (cost < 1) return "< 1 $/mois";
  return `${Math.round(cost)} $/mois`;
}

interface NodeOptions {
  selectedId?: string | null;
  highlighted?: ReadonlySet<string>;
  onSelect?: (id: string) => void;
}

const NOOP = () => undefined;

export function toFlowNodes(graph: ArchitectureGraph, options: NodeOptions = {}): ArchFlowNode[] {
  const { selectedId = null, highlighted, onSelect } = options;
  const ordered = [...graph.nodes].sort((a, b) => a.x - b.x || a.y - b.y);
  const order = new Map(ordered.map((node, index) => [node.id, index]));

  return graph.nodes.map((node) => ({
    id: node.id,
    type: "arch" as const,
    position: { x: node.x, y: node.y },
    draggable: false,
    selectable: false,
    focusable: false,
    data: {
      label: node.label,
      kind: node.kind,
      cost: node.monthly_cost,
      description: node.description,
      selected: node.id === selectedId,
      highlighted: highlighted?.has(node.id) ?? false,
      order: order.get(node.id) ?? 0,
      interactive: onSelect !== undefined,
      onSelect: onSelect ?? NOOP,
    },
  }));
}

export function toFlowEdges(graph: ArchitectureGraph): Edge[] {
  return graph.edges.map((edge) => {
    const color = edge.animated ? EDGE_COLOR : EDGE_QUIET;
    return {
      id: edge.id,
      source: edge.source,
      target: edge.target,
      label: edge.label || undefined,
      animated: edge.animated,
      focusable: false,
      style: { stroke: color, strokeWidth: 2, ...(edge.animated ? {} : { strokeDasharray: "5 5" }) },
      markerEnd: { type: MarkerType.ArrowClosed, color, width: 18, height: 18 },
      labelStyle: { fontSize: 11, fontWeight: 600, fill: "#1e46a8" },
      labelBgStyle: { fill: "#f2f7ff", fillOpacity: 1 },
      labelBgPadding: [6, 3] as [number, number],
      labelBgBorderRadius: 6,
    };
  });
}

export function graphTotal(graph: ArchitectureGraph): number {
  return graph.nodes.reduce((sum, node) => sum + node.monthly_cost, 0);
}

/** Composant ouvert par défaut : le cœur du calcul, sinon le premier composant payant. */
export function defaultNodeId(graph: ArchitectureGraph): string | null {
  return (
    graph.nodes.find((node) => node.kind === "compute")?.id ??
    graph.nodes.find((node) => node.kind !== "user")?.id ??
    graph.nodes[0]?.id ??
    null
  );
}

/** Composants qui n'existent pas dans l'autre architecture. */
export function diffNodes(a: ArchitectureGraph, b: ArchitectureGraph): { a: Set<string>; b: Set<string> } {
  const idsA = new Set(a.nodes.map((node) => node.id));
  const idsB = new Set(b.nodes.map((node) => node.id));
  return {
    a: new Set([...idsA].filter((id) => !idsB.has(id))),
    b: new Set([...idsB].filter((id) => !idsA.has(id))),
  };
}