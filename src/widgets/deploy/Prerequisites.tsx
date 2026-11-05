import { ShieldCheck } from "lucide-react";

interface PrerequisitesProps {
  items: string[];
  doneIndexes: number[];
  onToggle: (index: number) => void;
}

export default function Prerequisites({ items, doneIndexes, onToggle }: PrerequisitesProps) {
  return (
    <section aria-labelledby="prereq-title" className="rounded-xl2 border border-line bg-white p-5 shadow-card">
      <div className="flex items-center justify-between gap-3">
        <h2 id="prereq-title" className="flex items-center gap-2 font-semibold text-ink">
          <ShieldCheck className="size-4 text-brand-600" aria-hidden />
          Avant de commencer
        </h2>
        <span className="rounded-md bg-brand-100 px-2 py-0.5 text-[11px] font-semibold tracking-wide text-brand-800 uppercase">
          Prérequis
        </span>
      </div>
      <p className="mt-1 text-xs text-muted">Vérifie ces points avant d'exécuter la première commande.</p>
      <ul className="mt-3 space-y-2">
        {items.map((item, index) => (
          <li key={item}>
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-line p-3 text-sm text-body has-[:checked]:border-brand-300 has-[:checked]:bg-brand-50">
              <input
                type="checkbox"
                checked={doneIndexes.includes(index)}
                onChange={() => onToggle(index)}
                className="mt-0.5 size-4 shrink-0 accent-brand-600"
              />
              <span>{item}</span>
            </label>
          </li>
        ))}
      </ul>
    </section>
  );
}