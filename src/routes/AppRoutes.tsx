import { Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import CompletePage from "../pages/CompletePage";
import DeployPage from "../pages/DeployPage";
import DescribePage from "../pages/DescribePage";
import ResultsPage from "../pages/ResultsPage";
import RequireSpec from "./RequireSpec";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<DescribePage />} />
        <Route element={<RequireSpec />}>
          <Route path="/completer" element={<CompletePage />} />
          <Route path="/resultats" element={<ResultsPage />} />
          <Route path="/deployer" element={<DeployPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}