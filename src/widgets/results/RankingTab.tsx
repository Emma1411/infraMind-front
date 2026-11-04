import type { ArchitectureResult, EvaluationResult } from "../../interfaces/evaluation";
import ArchitectureCard from "./ArchitectureCard";
import ArchitectureDetail from "./ArchitectureDetail";

interface RankingTabProps {
  evaluation: EvaluationResult;
  selected: ArchitectureResult;
  onSelect: (id: string) => void;
  onDeploy: (id: string) => void;
}

export default function RankingTab({ evaluation, selected, onSelect, onDeploy }: RankingTabProps) {
  const openDetail = (id: string) => {
    onSelect(id);
    window.requestAnimationFrame(() =>
      document.getElementById("detail-architecture")?.scrollIntoView({ behavior: "smooth", block: "start" }),
    );
  };

  return (
    <div className="space-y-6">
      <ul className="space-y-4">
        {evaluation.ranking.map((arch, index) => (
          <li key={arch.id}>
            <ArchitectureCard
              arch={arch}
              rank={index + 1}
              evaluation={evaluation}
              selected={arch.id === selected.id}
              onDetail={openDetail}
              onDeploy={onDeploy}
            />
          </li>
        ))}
      </ul>
      <ArchitectureDetail arch={selected} evaluation={evaluation} />
    </div>
  );
}