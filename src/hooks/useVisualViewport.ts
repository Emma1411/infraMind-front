import { useEffect } from "react";

/**
 * Expose la zone réellement visible de l'écran dans deux variables CSS :
 * --vv-height (hauteur visible, sans le clavier mobile) et --vv-offset-top (décalage du haut).
 * Exemple d'usage dans une classe Tailwind : min-h-[var(--vv-height)]
 */
export function useVisualViewport(): void {
  useEffect(() => {
    const root = document.documentElement;
    const viewport = window.visualViewport;

    const update = () => {
      root.style.setProperty("--vv-height", `${viewport?.height ?? window.innerHeight}px`);
      root.style.setProperty("--vv-offset-top", `${viewport?.offsetTop ?? 0}px`);
    };

    update();
    viewport?.addEventListener("resize", update);
    viewport?.addEventListener("scroll", update);
    window.addEventListener("resize", update);

    return () => {
      viewport?.removeEventListener("resize", update);
      viewport?.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      root.style.removeProperty("--vv-height");
      root.style.removeProperty("--vv-offset-top");
    };
  }, []);
}