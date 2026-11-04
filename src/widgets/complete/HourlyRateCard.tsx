import Badge from "../../components/Badge";
import type { AnswerValue, Answers } from "../../interfaces/analysis";
import type { Currency } from "../../interfaces/spec";
import { HOURLY_RATE_PATH } from "../../utils/questions";
import { CardShell, NumberField } from "./QuestionParts";

interface HourlyRateCardProps {
  draft: Answers;
  currency: Currency | null;
  onChange: (path: string, value: AnswerValue) => void;
  onClear: (path: string) => void;
}

export default function HourlyRateCard({ draft, currency, onChange, onClear }: HourlyRateCardProps) {
  const value = draft[HOURLY_RATE_PATH];

  return (
    <CardShell
      tag="COÛT COMPLET (TCO) / CALCUL DE L'EFFORT HUMAIN"
      title="Ton tarif horaire de maintenance (ou celui de ton équipe)"
      badge={<Badge tone="neutral">Facultatif</Badge>}
    >
      <div className="grid gap-4 rounded-xl bg-brand-50 p-4 sm:grid-cols-[minmax(0,1fr)_14rem] sm:items-center">
        <div>
          <p className="text-sm font-semibold text-ink">Pourquoi renseigner un tarif horaire ?</p>
          <p className="mt-1 text-sm text-body">
            Il permet de comparer le coût réel de chaque architecture, maintenance comprise : une infrastructure moins
            chère à héberger peut coûter plus cher à maintenir. Le tarif est compté dans la devise de ton budget
            {currency ? ` (${currency})` : " (dollars américains si tu n'en as pas choisi)"}.
          </p>
        </div>
        <NumberField
          label="Tarif horaire de maintenance"
          value={typeof value === "number" ? value : undefined}
          unit={`${currency ?? "USD"} / heure`}
          placeholder="Ex. : 75"
          onValue={(next) => onChange(HOURLY_RATE_PATH, next)}
          onClear={() => onClear(HOURLY_RATE_PATH)}
        />
      </div>
    </CardShell>
  );
}