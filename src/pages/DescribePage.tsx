import { ShieldCheck, Tag } from "lucide-react";
import Badge from "../components/Badge";
import HowItWorks from "../widgets/describe/HowItWorks";
import LookupPanel from "../widgets/describe/LookupPanel";
import PrivacyNotice from "../widgets/describe/PrivacyNotice";
import ProjectInput from "../widgets/describe/ProjectInput";
import ProvidersStrip from "../widgets/describe/ProvidersStrip";

export default function DescribePage() {
  return (
    <div className="mx-auto max-w-[1200px] px-5 pt-10 pb-16">
      <section aria-labelledby="hero-title">
        <div className="flex flex-wrap gap-2">
          <Badge icon={<ShieldCheck className="size-3.5" aria-hidden />}>
            Neutre entre fournisseurs : AWS, Azure, Google Cloud, Hetzner
          </Badge>
          <Badge tone="neutral" icon={<Tag className="size-3.5" aria-hidden />}>
            Prix publics, hypothèses affichées
          </Badge>
        </div>
        <h1 id="hero-title" className="mt-5 max-w-3xl text-4xl leading-tight font-bold text-brand-900 sm:text-5xl">
          Décris ton projet, obtiens la bonne infra avec les vrais coûts.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-body">
          Colle ton cahier des charges ou une description de ton application en français simple. On s'occupe de
          repérer les besoins techniques, le trafic attendu et les coûts cachés.
        </p>
      </section>

      <PrivacyNotice />

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <ProjectInput />
        <LookupPanel />
      </div>

      <HowItWorks />
      <ProvidersStrip />
    </div>
  );
}