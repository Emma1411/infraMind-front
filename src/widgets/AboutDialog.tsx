import { X } from "lucide-react";
import { useEffect, useRef } from "react";

interface AboutDialogProps {
  open: boolean;
  onClose: () => void;
}

const SECTIONS: { title: string; items: string[] }[] = [
  {
    title: "Ce que fait InfraMind",
    items: [
      "Compare cinq architectures (AWS, Azure, Google Cloud, Hetzner) pour ton projet.",
      "Chiffre l'infrastructure en fourchette, avec les hypothèses retenues.",
      "Te montre un schéma de l'architecture recommandée et ce qui peut faire varier ton devis.",
      "Te guide pas à pas pour la déployer et te donne la section infrastructure de ton devis.",
    ],
  },
  {
    title: "Ce qu'il ne fait pas",
    items: [
      "Il ne chiffre pas tes heures de développement ni la mise en place : c'est ton métier.",
      "Il ne déploie rien à ta place : tu exécutes toi-même les étapes du guide.",
      "Il ne remplace ni un expert en infrastructure, ni un avis juridique.",
    ],
  },
  {
    title: "Fiabilité des prix",
    items: [
      "Les prix sont des références publiques relevées à la main, avec leur date affichée dans chaque résultat.",
      "Ils valent pour l'Amérique du Nord. Le prix réel dépend de la région technique choisie.",
      "Certains prix sont marqués « à vérifier » : revérifie-les avant de t'engager.",
      "Une estimation n'est pas un engagement.",
    ],
  },
  {
    title: "Ton texte et l'IA",
    items: [
      "Ton texte est analysé par un service d'IA externe (DeepSeek) pour en extraire les besoins techniques.",
      "Les motifs évidents de secrets sont masqués avant l'envoi, mais pas tous : ne colle rien de confidentiel.",
      "Aucun compte et aucun stockage : rien n'est conservé sur nos serveurs.",
    ],
  },
];

export default function AboutDialog({ open, onClose }: AboutDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby="about-title"
      onClose={onClose}
      onClick={(event) => {
        // Un clic sur le fond (et non sur le contenu) ferme la fenêtre
        if (event.target === ref.current) onClose();
      }}
      className="m-auto max-h-[90vh] w-[min(92vw,42rem)] overflow-y-auto rounded-xl2 p-0 shadow-card backdrop:bg-brand-950/40"
    >
      <div className="p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <h2 id="about-title" className="text-2xl font-bold text-brand-900">
            À propos et limites
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="rounded-lg p-2 text-muted transition hover:bg-brand-50 hover:text-brand-700"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>

        <div className="mt-6 space-y-6">
          {SECTIONS.map((section) => (
            <section key={section.title}>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-brand-700">{section.title}</h3>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-body">
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </dialog>
  );
}