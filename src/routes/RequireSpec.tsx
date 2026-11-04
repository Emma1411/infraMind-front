import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../hooks/redux";

/** Les écrans 2 à 4 n'ont de sens qu'après l'analyse : sinon, retour à l'accueil. */
export default function RequireSpec() {
  const hasSpec = useAppSelector((state) => state.project.spec !== null);
  return hasSpec ? <Outlet /> : <Navigate to="/" replace />;
}