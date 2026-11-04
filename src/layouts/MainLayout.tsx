import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AboutDialog from "../widgets/AboutDialog";
import Footer from "../widgets/Footer";
import Header from "../widgets/Header";

export default function MainLayout() {
  const [aboutOpen, setAboutOpen] = useState(false);
  const { pathname } = useLocation();

  // Chaque changement d'écran repart du haut de la page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:shadow-card"
      >
        Aller au contenu
      </a>
      <Header onOpenAbout={() => setAboutOpen(true)} />
      <main id="contenu" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <AboutDialog open={aboutOpen} onClose={() => setAboutOpen(false)} />
    </div>
  );
}