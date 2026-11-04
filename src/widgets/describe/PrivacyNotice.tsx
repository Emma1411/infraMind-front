import { EyeOff, ShieldCheck } from "lucide-react";
import Badge from "../../components/Badge";

export default function PrivacyNotice() {
  return (
    <section
      aria-labelledby="privacy-title"
      className="mt-8 flex flex-col gap-4 rounded-xl2 bg-brand-50 p-5 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex gap-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-brand-700 shadow-sm">
          <ShieldCheck className="size-5" aria-hidden />
        </span>
        <div>
          <h2 id="privacy-title" className="font-semibold text-brand-900">
            Confidentialité et hygiène des données
          </h2>
          <p className="mt-1 text-sm text-body">
            Ne colle ni mot de passe, ni clé d'API, ni donnée confidentielle. Ton texte est analysé par un service d'IA
            externe pour en extraire les besoins techniques. Nous ne le stockons pas.
          </p>
        </div>
      </div>
      <Badge tone="info" icon={<EyeOff className="size-3.5" aria-hidden />} className="shrink-0 self-start sm:self-center">
        Masquage des secrets évidents : actif
      </Badge>
    </section>
  );
}