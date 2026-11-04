import { Lightbulb } from "lucide-react";
import { DOMAIN_LIST } from "../../data/domains";

export default function LookupPanel() {
  return (
    <aside aria-labelledby="lookup-title" className="self-start lg:sticky lg:top-28">
      <div className="rounded-xl2 border border-line bg-white p-5 shadow-card">
        <h2 id="lookup-title" className="text-lg font-semibold text-ink">
          Ce que l'outil va chercher
        </h2>
        <p className="mt-1 text-sm text-muted">
          Pour dimensionner ton infrastructure comme le ferait un DevOps, on s'intéresse à 12 domaines.
        </p>
        <ul className="mt-4 space-y-2">
          {DOMAIN_LIST.map(({ key, label, description, icon: Icon }) => (
            <li key={key} className="flex items-start gap-3 rounded-xl bg-brand-50/60 px-3 py-2.5">
              <Icon className="mt-0.5 size-4 shrink-0 text-brand-600" aria-hidden />
              <div>
                <p className="text-sm font-medium text-ink">{label}</p>
                <p className="text-xs text-muted">{description}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex gap-3 rounded-xl bg-brand-100/70 p-3 text-xs text-brand-900">
          <Lightbulb className="mt-0.5 size-4 shrink-0 text-brand-600" aria-hidden />
          <p>
            Ce que ton texte ne dit pas te sera demandé à l'étape 2. Tu pourras répondre « je ne sais pas » à
            n'importe quelle question : on utilisera alors une hypothèse prudente, affichée dans les résultats.
          </p>
        </div>
      </div>
    </aside>
  );
}