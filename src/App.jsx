import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import CheckinPage from "./pages/CheckinPage";
import DashboardPage from "./pages/Dashboardpage";
import StudentsPage from "./pages/StudentsPage";
import PaymentsPage from "./pages/PaymentsPage";
import AttendancePage from "./pages/AttendancePage";
import ActivitiesPage from "./pages/Activitiespage";

export default function App() {
  return (
    <Routes>
      {/* Ruta de check-in: pantalla completa sin sidebar */}
      <Route path="/checkin" element={<CheckinPage />} />

      {/* Rutas con layout (sidebar + header) */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="alumnos" element={<StudentsPage />} />
        <Route path="/student/:id" element={<StudentsPage />} />
        <Route path="pagos" element={<PaymentsPage />} />
        <Route path="asistencias" element={<AttendancePage />} />
        <Route path="actividades" element={<ActivitiesPage />} />
      </Route>

      {/* Ruta por defecto */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
