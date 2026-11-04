import { ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-white/70">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-2 px-5 py-4 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>Estimations basées sur des prix publics, à revérifier avant signature. Rien n'est stocké sur nos serveurs.</p>
        <p className="inline-flex items-center gap-1.5 font-medium text-brand-700">
          <ShieldCheck className="size-3.5" aria-hidden />
          Aucun compte, aucun stockage
        </p>
      </div>
    </footer>
  );
}