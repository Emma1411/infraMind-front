import { useAppSelector } from "./redux";

/** Les étapes 2 à 4 ne s'ouvrent qu'une fois le projet analysé. */
export function useStepAccess() {
  const hasSpec = useAppSelector((state) => state.project.spec !== null);
  return { hasSpec, canGo: (path: string) => path === "/" || hasSpec };
}