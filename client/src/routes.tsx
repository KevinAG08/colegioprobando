import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { UserRole } from "@/types";
import RutaProtegida from "@/pages/ruta-protegida";

// Componente de carga para lazy loading
const LoadingFallback = () => <div className="flex items-center justify-center h-screen">Cargando...</div>;

// Página común
const LoginPage = lazy(() => import("@/pages/login"));
const NotFoundPage = lazy(() => import("@/pages/not-found-page"));

// Admin routes
const AdminRoutes = lazy(() => import("@/routes/admin-routes"));

// Profesor routes
const ProfesorRoutes = lazy(() => import("@/routes/profesor-routes"));

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Admin routes */}
        <Route element={<RutaProtegida allowedRol={UserRole.ADMIN} />}>
          <Route path="/admin/*" element={<AdminRoutes />} />
        </Route>

        {/* Profesor routes */}
        <Route element={<RutaProtegida allowedRol={UserRole.PROFESOR} />}>
          <Route path="/profesor/*" element={<ProfesorRoutes />} />
        </Route>

        {/* Default routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;