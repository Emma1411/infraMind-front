import { CircleCheck, CircleX, Star, TriangleAlert, Wallet } from "lucide-react";
import Badge from "../../components/Badge";
import type { ArchitectureResult } from "../../interfaces/evaluation";

interface ArchitectureBadgesProps {
  arch: ArchitectureResult;
  showVerdict?: boolean;
}

export default function ArchitectureBadges({ arch, showVerdict = true }: ArchitectureBadgesProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {showVerdict && arch.verdict === "recommended" && (
        <Badge icon={<Star className="size-3.5" aria-hidden />}>Recommandée</Badge>
      )}
      {showVerdict && arch.verdict === "eligible" && (
        <Badge tone="neutral" icon={<CircleCheck className="size-3.5" aria-hidden />}>
          Éligible
        </Badge>
      )}
      {showVerdict && arch.verdict === "eliminated" && (
        <Badge tone="danger" icon={<CircleX className="size-3.5" aria-hidden />}>
          Éliminée
        </Badge>
      )}
      {arch.needs_verification && (
        <Badge tone="warn" icon={<TriangleAlert className="size-3.5" aria-hidden />}>
          Prix à vérifier
        </Badge>
      )}
      {!arch.estimate_complete && (
        <Badge tone="warn" icon={<TriangleAlert className="size-3.5" aria-hidden />}>
          Estimation incomplète
        </Badge>
      )}
      {arch.budget_risk === "none" && (
        <Badge tone="ok" icon={<Wallet className="size-3.5" aria-hidden />}>
          Dans le budget
        </Badge>
      )}
      {arch.budget_risk === "possible" && (
        <Badge tone="warn" icon={<Wallet className="size-3.5" aria-hidden />}>
          Budget non garanti
        </Badge>
      )}
      {arch.budget_risk === "over" && (
        <Badge tone="danger" icon={<Wallet className="size-3.5" aria-hidden />}>
          Hors budget
        </Badge>
      )}
    </div>
  );
}