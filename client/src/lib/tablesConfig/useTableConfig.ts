import { SortingState } from "@tanstack/react-table";

// Hook para configuraciones comunes de tablas
export const useTableConfig = () => {
  // Configuración para tabla de estudiantes
  const estudiantesConfig = {
    defaultSorting: [{ id: "apellidos", desc: false }] as SortingState,
    searchPlaceholder: "Buscar estudiantes...",
  };

  // Configuración para tabla de aulas
  const aulasConfig = {
    defaultSorting: [{ id: "nombre", desc: false }] as SortingState,
    searchPlaceholder: "Buscar aulas...",
  };

  // Configuración para tabla de profesores
  const profesoresConfig = {
    defaultSorting: [{ id: "apellidos", desc: false}] as SortingState,
    searchPlaceholder: "Buscar profesores...",
  };

  // Configuración para tabla de incidencias
  const incidenciasConfig = {
    defaultSorting: [{ id: "fecha", desc: false }] as SortingState,
    searchPlaceholder: "Buscar incidencia...",
  };

  return {
    estudiantesConfig,
    aulasConfig,
    profesoresConfig,
    incidenciasConfig,
  };
};
