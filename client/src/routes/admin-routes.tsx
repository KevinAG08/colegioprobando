import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

// Lazy loading de componentes
const DashboardAdmin = lazy(() => import("@/pages/admin/dashboard"));
const ProfesoresPage = lazy(() => import("@/pages/admin/profesores/page"));
const RegistrarProfesor = lazy(() => import("@/pages/admin/profesores/profesor/registrar-profesor"));
const VerProfesor = lazy(() => import("@/pages/admin/profesores/profesor/ver-profesor"));
const EditarProfesor = lazy(() => import("@/pages/admin/profesores/profesor/editar-profesor"));
const CambiarPasswordProfesor = lazy(() => import("@/pages/admin/profesores/profesor/cambiar-password"));
const EstudiantesPage = lazy(() => import("@/pages/admin/estudiantes/page"));
const RegistrarEstudiante = lazy(() => import("@/pages/admin/estudiantes/estudiante/registrar-estudiante"));
const VerEstudiante = lazy(() => import("@/pages/admin/estudiantes/estudiante/ver-estudiante"));
const EditarEstudiante = lazy(() => import("@/pages/admin/estudiantes/estudiante/editar-estudiante"));
const IncidenciasPage = lazy(() => import("@/pages/admin/incidencias/page"));
const RegistrarIncidencia = lazy(() => import("@/pages/admin/incidencias/incidencia/registrar-incidencia"));
const VerIncidencia = lazy(() => import("@/pages/admin/incidencias/incidencia/ver-incidencia"));
const EditarIncidencia = lazy(() => import("@/pages/admin/incidencias/incidencia/editar-incidencia"));
const Reportes = lazy(() => import("@/pages/admin/reportes/page"));
const PerfilAdminForm = lazy(() => import("@/pages/admin/editar-perfil/page"));
const CambiarPasswordAdminPerfil = lazy(() => import("@/pages/admin/editar-perfil/cambiar-password"));
const AulasPage = lazy(() => import("@/pages/admin/aulas/page"))

// Componente de carga durante la carga perezosa
const LoadingFallback = () => <div className="flex items-center justify-center h-screen">Cargando...</div>;

const AdminRoutes: React.FC = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="dashboard" element={<DashboardAdmin />} />

        {/* Rutas de aulas */}
        <Route path="aulas">
          <Route index element={<AulasPage />} />
        </Route>
        
        {/* Rutas de profesores */}
        <Route path="profesores">
          <Route index element={<ProfesoresPage />} />
          <Route path="registrar" element={<RegistrarProfesor />} />
          <Route path="ver/:profesorId" element={<VerProfesor />} />
          <Route path="editar/:profesorId" element={<EditarProfesor />} />
          <Route path="cambiar-password/:profesorId" element={<CambiarPasswordProfesor />} />
        </Route>
        
        {/* Rutas de estudiantes */}
        <Route path="estudiantes">
          <Route index element={<EstudiantesPage />} />
          <Route path="registrar/:aulaId" element={<RegistrarEstudiante />} />
          <Route path="ver/:estudianteId" element={<VerEstudiante />} />
          <Route path="editar/:estudianteId" element={<EditarEstudiante />} />
        </Route>
        
        {/* Rutas de incidencias */}
        <Route path="incidencias">
          <Route index element={<IncidenciasPage />} />
          <Route path="registrar" element={<RegistrarIncidencia />} />
          <Route path="ver/:incidenciaId" element={<VerIncidencia />} />
          <Route path="editar/:incidenciaId" element={<EditarIncidencia />} />
        </Route>
        
        {/* Otras rutas */}
        <Route path="reportes" element={<Reportes />} />
        <Route path="editar-perfil" element={<PerfilAdminForm />} />
        <Route path="cambiar-password" element={<CambiarPasswordAdminPerfil />} />
      </Routes>
    </Suspense>
  );
};

export default AdminRoutes;