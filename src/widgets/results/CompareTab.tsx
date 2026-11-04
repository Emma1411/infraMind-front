import { Check } from "lucide-react";
import { useId, useState, type ReactNode } from "react";
import type { ArchitectureResult, EvaluationResult } from "../../interfaces/evaluation";
import { formatNumber } from "../../utils/format";
import { criterionLabel, formatMoney, formatScore, VERDICT_LABEL } from "../../utils/results";

interface CompareTabProps {
  evaluation: EvaluationResult;
}

type Better = "a" | "b" | null;

interface Row {
  label: string;
  a: ReactNode;
  b: ReactNode;
  better: Better;
}

function pick(a: number, b: number, higherIsBetter: boolean): Better {
  if (a === b) return null;
  return (a > b) === higherIsBetter ? "a" : "b";
}

function buildRows(a: ArchitectureResult, b: ArchitectureResult): Row[] {
  const rows: Row[] = [
    { label: "Statut", a: VERDICT_LABEL[a.verdict], b: VERDICT_LABEL[b.verdict], better: null },
    {
      label: "Coût mensuel (palier retenu)",
      a: formatMoney(a.cost_low, "USD", 2),
      b: formatMoney(b.cost_low, "USD", 2),
      better: pick(a.cost_low, b.cost_low, false),
    },
    {
      label: "Coût mensuel (palier supérieur)",
      a: formatMoney(a.cost_high, "USD", 2),
      b: formatMoney(b.cost_high, "USD", 2),
      better: pick(a.cost_high, b.cost_high, false),
    },
  ];

  if (a.total_low_with_maintenance !== null && b.total_low_with_maintenance !== null) {
    rows.push({
      label: "Coût avec maintenance (palier retenu)",
      a: formatMoney(a.total_low_with_maintenance, "USD", 2),
      b: formatMoney(b.total_low_with_maintenance, "USD", 2),
      better: pick(a.total_low_with_maintenance, b.total_low_with_maintenance, false),
    });
  }

  rows.push(
    {
      label: "Maintenance (heures par mois)",
      a: formatNumber(a.maintenance_hours_per_month),
      b: formatNumber(b.maintenance_hours_per_month),
      better: pick(a.maintenance_hours_per_month, b.maintenance_hours_per_month, false),
    },
    {
      label: "Note globale (sur 100)",
      a: formatScore(a.total_score),
      b: formatScore(b.total_score),
      better: pick(a.total_score, b.total_score, true),
    },
  );

  for (const scoreA of a.scores) {
    const scoreB = b.scores.find((candidate) => candidate.criterion === scoreA.criterion);
    if (!scoreB) continue;
    rows.push({
      label: criterionLabel(scoreA.criterion),
      a: formatScore(scoreA.score),
      b: formatScore(scoreB.score),
      better: pick(scoreA.score, scoreB.score, true),
    });
  }

  const db = (arch: ArchitectureResult) =>
    arch.availability.database_score === null ? "—" : `${arch.availability.database_score} / 5`;
  rows.push(
    {
      label: "Disponibilité de l'application",
      a: `${a.availability.application_score} / 5`,
      b: `${b.availability.application_score} / 5`,
      better: pick(a.availability.application_score, b.availability.application_score, true),
    },
    { label: "Disponibilité de la base de données", a: db(a), b: db(b), better: null },
    {
      label: "Exigences non respectées",
      a: formatNumber(a.requirements_unmet.length),
      b: formatNumber(b.requirements_unmet.length),
      better: pick(a.requirements_unmet.length, b.requirements_unmet.length, false),
    },
    {
      label: "Prix à vérifier",
      a: a.needs_verification ? "Oui" : "Non",
      b: b.needs_verification ? "Oui" : "Non",
      better: null,
    },
  );

  return rows;
}

function Cell({ value, best }: { value: ReactNode; best: boolean }) {
  return (
    <td className={`px-4 py-2.5 text-right font-mono ${best ? "font-semibold text-brand-800" : "text-body"}`}>
      {best && (
        <>
          <Check className="mr-1.5 inline size-4 text-brand-600" aria-hidden />
          <span className="sr-only">(meilleur) </span>
        </>
      )}
      {value}
    </td>
  );
}

export default function CompareTab({ evaluation }: CompareTabProps) {
  const ranking = evaluation.ranking;
  const idA = useId();
  const idB = useId();
  const [aId, setAId] = useState(ranking[0].id);
  const [bId, setBId] = useState(ranking[1]?.id ?? ranking[0].id);

  const a = ranking.find((arch) => arch.id === aId) ?? ranking[0];
  const b = ranking.find((arch) => arch.id === bId) ?? ranking[0];
  const rows = buildRows(a, b);

  const select = (id: string, label: string, value: string, onChange: (next: string) => void) => (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-xl border border-brand-100 bg-white px-4 py-3 text-sm text-ink focus:border-brand-400 focus:ring-2 focus:ring-brand-200 focus:outline-none"
      >
        {ranking.map((arch) => (
          <option key={arch.id} value={arch.id}>
            {arch.label}
            {arch.verdict === "recommended" ? " (recommandée)" : ""}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div>
      <h2 className="text-xl font-semibold text-ink">Comparer deux architectures</h2>
      <p className="mt-1 text-sm text-body">La meilleure valeur de chaque ligne est marquée d'une coche.</p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {select(idA, "Architecture A", aId, setAId)}
        {select(idB, "Architecture B", bId, setBId)}
      </div>

      {a.id === b.id && <p className="mt-3 text-sm text-warn">Choisis deux architectures différentes pour les comparer.</p>}

      <div className="mt-5 overflow-x-auto rounded-xl2 border border-line bg-white shadow-card">
        <table className="w-full min-w-[32rem] text-left text-sm">
          <caption className="sr-only">Comparaison de {a.label} et de {b.label}</caption>
          <thead>
            <tr className="border-b border-line bg-brand-50 text-xs tracking-wide text-muted uppercase">
              <th scope="col" className="px-4 py-3 font-medium">
                Critère
              </th>
              <th scope="col" className="px-4 py-3 text-right font-medium">
                {a.label}
              </th>
              <th scope="col" className="px-4 py-3 text-right font-medium">
                {b.label}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-line/60 last:border-0">
                <th scope="row" className="px-4 py-2.5 font-medium text-ink">
                  {row.label}
                </th>
                <Cell value={row.a} best={row.better === "a"} />
                <Cell value={row.b} best={row.better === "b"} />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}