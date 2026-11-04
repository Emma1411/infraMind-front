import { FileText, Network, SlidersHorizontal, type LucideIcon } from "lucide-react";

const STEPS: { number: string; title: string; text: string; tag: string; icon: LucideIcon }[] = [
  {
    number: "01",
    title: "Tu décris",
    text: "Colle ton texte brut ou charge un modèle type. Aucun besoin de connaître le vocabulaire cloud pour commencer.",
    tag: "Français simple",
    icon: FileText,
  },
  {
    number: "02",
    title: "On complète ensemble",
    text: "Des questions claires, sans jargon, sur le trafic, les données, les sauvegardes et ton équipe. Réponds « je ne sais pas » quand tu hésites.",
    tag: "Hypothèses prudentes affichées",
    icon: SlidersHorizontal,
  },
  {
    number: "03",
    title: "Tu reçois ton plan",
    text: "Cinq architectures comparées avec un coût en fourchette, un schéma interactif, un guide de déploiement pas à pas et la section infrastructure de ton devis.",
    tag: "Schéma, guide et devis",
    icon: Network,
  },
];

export default function HowItWorks() {
  return (
    <section aria-labelledby="how-title" className="mt-16">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-wide text-brand-700 uppercase">Processus transparent</p>
          <h2 id="how-title" className="mt-1 text-3xl font-bold text-brand-800">
            Comment ça marche ?
          </h2>
        </div>
        <p className="max-w-md text-sm text-muted">
          Un parcours pensé pour les développeurs indépendants et les petites équipes qui doivent chiffrer et justifier
          une infrastructure.
        </p>
      </div>

      <ol className="mt-6 grid gap-4 md:grid-cols-3">
        {STEPS.map(({ number, title, text, tag, icon: Icon }) => (
          <li key={number} className="flex flex-col rounded-xl2 border border-line bg-white p-6 shadow-card">
            <div className="flex items-start justify-between">
              <span className="rounded-lg bg-brand-100 px-2.5 py-1 font-mono text-sm font-semibold text-brand-800">
                {number}
              </span>
              <Icon className="size-5 text-muted" aria-hidden />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-brand-800">{title}</h3>
            <p className="mt-2 flex-1 text-sm text-body">{text}</p>
            <p className="mt-4 text-xs font-medium text-brand-700">{tag}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}