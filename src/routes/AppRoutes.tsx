import { Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import CompletePage from "../pages/CompletePage";
import DescribePage from "../pages/DescribePage";
import ResultsPage from "../pages/ResultsPage";
import RequireSpec from "./RequireSpec";

// Écran provisoire : il sera remplacé par le guide de déploiement.
function Placeholder({ title }: { title: string }) {
  return (
    <div className="mx-auto max-w-3xl p-8">
      <h1 className="text-2xl font-bold text-brand-800">{title}</h1>
      <p className="mt-2 text-muted">Écran à venir.</p>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<DescribePage />} />
        <Route element={<RequireSpec />}>
          <Route path="/completer" element={<CompletePage />} />
          <Route path="/resultats" element={<ResultsPage />} />
          <Route path="/deployer" element={<Placeholder title="4. Déployer" />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}