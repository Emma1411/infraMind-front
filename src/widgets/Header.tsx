import { Info } from "lucide-react";
import { Link } from "react-router-dom";
import LogoMark from "../components/LogoMark";
import Stepper, { StepperCompact } from "./Stepper";

interface HeaderProps {
  onOpenAbout: () => void;
}

export default function Header({ onOpenAbout }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-line/70 bg-white/85 backdrop-blur">
      <div className=" flex  items-center justify-between gap-4 px-5 py-3">
        <Link to="/" className="flex items-center gap-3" aria-label="InfraMind, retour à l'accueil">
          <LogoMark />
          <span className="leading-tight">
            <span className="block text-base font-bold text-brand-800">InfraMind</span>
            <span className="hidden text-xs text-muted sm:block">L'architecture cloud claire et honnête</span>
          </span>
        </Link>

        <Stepper />

        <button
          type="button"
          onClick={onOpenAbout}
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-brand-700 transition hover:bg-brand-50"
        >
          <Info className="size-4" aria-hidden />
          <span className="hidden sm:inline">À propos et limites</span>
          <span className="sm:hidden">À propos</span>
        </button>
      </div>

      <div className="mx-auto max-w-[1200px] px-5 pb-3 lg:hidden">
        <StepperCompact />
      </div>
    </header>
  );
}