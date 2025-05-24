import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

// Lazy loading de componentes
const DashboardProfesor = lazy(() => import("@/pages/profesor/dashboard"));
const AsistenciasPage = lazy(() => import("@/pages/profesor/asistencias/page"));
const IncidenciasPageProfesor = lazy(() => import("@/pages/profesor/incidencias/page"));
const RegistrarIncidenciaProfesor = lazy(() => import("@/pages/profesor/incidencias/incidencia/registrar-incidencia"));
const VerIncidenciaProfesor = lazy(() => import("@/pages/profesor/incidencias/incidencia/ver-incidencia"));
const EditarIncidenciaProfesor = lazy(() => import("@/pages/profesor/incidencias/incidencia/editar-incidencia"));
const PerfilProfesorForm = lazy(() => import("@/pages/profesor/editar-perfil/page"));
const CambiarPasswordProfesorPerfil = lazy(() => import("@/pages/profesor/editar-perfil/cambiar-password"));

// Componente de carga durante la carga perezosa
const LoadingFallback = () => <div className="flex items-center justify-center h-screen">Cargando...</div>;

const ProfesorRoutes: React.FC = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="dashboard" element={<DashboardProfesor />} />
        <Route path="asistencia" element={<AsistenciasPage />} />
        
        {/* Rutas de incidencias */}
        <Route path="incidencias">
          <Route index element={<IncidenciasPageProfesor />} />
          <Route path="registrar" element={<RegistrarIncidenciaProfesor />} />
          <Route path="ver/:incidenciaId" element={<VerIncidenciaProfesor />} />
          <Route path="editar/:incidenciaId" element={<EditarIncidenciaProfesor />} />
        </Route>
        
        {/* Perfil del profesor */}
        <Route path="editar-perfil" element={<PerfilProfesorForm />} />
        <Route path="cambiar-password" element={<CambiarPasswordProfesorPerfil />} />
      </Routes>
    </Suspense>
  );
};

export default ProfesorRoutes;