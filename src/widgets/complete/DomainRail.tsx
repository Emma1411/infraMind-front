import { Circle, CircleCheck, CircleDashed, CircleDot } from "lucide-react";
import { DOMAIN_LIST } from "../../data/domains";
import type { DomainKey } from "../../interfaces/spec";
import type { DomainProgress } from "../../utils/questions";

const STATUS_LABEL: Record<DomainProgress, string> = {
  complete: "Complet",
  partial: "Partiel",
  missing: "Manquant",
  optional: "Facultatif",
};

function StatusIcon({ progress }: { progress: DomainProgress }) {
  if (progress === "complete") return <CircleCheck className="size-4 text-brand-600" aria-hidden />;
  if (progress === "partial") return <CircleDot className="size-4 text-brand-500" aria-hidden />;
  if (progress === "optional") return <CircleDashed className="size-4 text-muted" aria-hidden />;
  return <Circle className="size-4 text-muted/60" aria-hidden />;
}

interface DomainRailProps {
  progress: Record<DomainKey, DomainProgress>;
  /** Domaines qui ont une carte vers laquelle défiler. */
  anchors: Partial<Record<DomainKey, string>>;
  activeDomain: DomainKey | null;
  answered: number;
  total: number;
  onJump: (domain: DomainKey) => void;
}

export default function DomainRail({ progress, anchors, activeDomain, answered, total, onJump }: DomainRailProps) {
  const percent = total === 0 ? 100 : Math.round((answered / total) * 100);

  return (
    <aside aria-labelledby="rail-title" className="hidden self-start lg:sticky lg:top-28 lg:block">
      <div className="rounded-xl2 border border-line bg-white p-5 shadow-card">
        <div className="flex items-baseline justify-between">
          <h2 id="rail-title" className="font-semibold text-ink">
            12 domaines clés
          </h2>
          <span className="font-mono text-sm font-semibold text-brand-700">
            {answered} / {total}
          </span>
        </div>
        <p className="mt-1 text-xs text-muted">
          {total === 0
            ? "Ton texte contenait déjà les informations essentielles."
            : `${answered} question${answered > 1 ? "s" : ""} essentielle${answered > 1 ? "s" : ""} répondue${answered > 1 ? "s" : ""} sur ${total}`}
        </p>
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
          aria-label="Progression des réponses essentielles"
          className="mt-3 h-1.5 overflow-hidden rounded-full bg-brand-100"
        >
          <div className="h-full rounded-full bg-brand-600 transition-all" style={{ width: `${percent}%` }} />
        </div>

        <ol className="mt-4 space-y-1">
          {DOMAIN_LIST.map(({ key, label }, index) => {
            const state = progress[key];
            const active = activeDomain === key && anchors[key] !== undefined;
            const content = (
              <>
                <StatusIcon progress={state} />
                <span className="flex-1 text-left text-sm text-ink">
                  {index + 1}. {label}
                </span>
                {active ? (
                  <span className="rounded-full bg-brand-800 px-2 py-0.5 text-[11px] font-semibold text-white">En cours</span>
                ) : (
                  <span className="text-xs text-muted">{STATUS_LABEL[state]}</span>
                )}
              </>
            );
            const row = `flex w-full items-center gap-3 rounded-lg px-3 py-2 ${active ? "bg-brand-100" : ""}`;
            return (
              <li key={key}>
                {anchors[key] ? (
                  <button type="button" onClick={() => onJump(key)} className={`${row} transition hover:bg-brand-50`}>
                    {content}
                  </button>
                ) : (
                  <div className={row}>{content}</div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </aside>
  );
}