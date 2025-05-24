import { useQuery } from "@tanstack/react-query";
import api from "@/api";

export const useEstadisticas = () => {
  return useQuery({
    queryKey: ["dashboard-estadisticas"],
    queryFn: async () => {
      const response = await api.get("/dashboard/estadisticas");
      return response.data;
    },
  });
};

export const useDistribucionAula = () => {
  return useQuery({
    queryKey: ["distribucion-aula"],
    queryFn: async () => {
      const response = await api.get("/dashboard/distribucion-aula");
      return response.data;
    },
  });
};

export const useAsistenciaSemanal = () => {
  return useQuery({
    queryKey: ["asistencia-semanal"],
    queryFn: async () => {
      const response = await api.get("/dashboard/asistencia-semanal");
      return response.data;
    },
  });
};

export const useActividadReciente = () => {
  return useQuery({
    queryKey: ["actividad-reciente"],
    queryFn: async () => {
      const response = await api.get("/dashboard/actividad-reciente");
      return response.data;
    },
  });
};

export const useEstadisticasProfesor = (profesorId: string | undefined) => {
  return useQuery({
    queryKey: ["dashboard-estadisticas-profesor", profesorId],
    queryFn: async () => {
      const response = await api.get(
        `/dashboard/estadisticas-profesor/${profesorId}`
      );
      return response.data;
    },
    enabled: !!profesorId,
  });
};

export const useDistribucionIncidenciaProfesor = (
  profesorId: string | undefined
) => {
  return useQuery({
    queryKey: ["distribucion-incidencia-profesor", profesorId],
    queryFn: async () => {
      const response = await api.get(
        `/dashboard/distribucion-incidencia-profesor/${profesorId}`
      );
      return response.data;
    },
    enabled: !!profesorId,
  });
};

export const useAsistenciaSemanalProfesor = (
  profesorId: string | undefined
) => {
  return useQuery({
    queryKey: ["asistencia-semanal-profesor", profesorId],
    queryFn: async () => {
      const response = await api.get(
        `/dashboard/asistencia-semanal-profesor/${profesorId}`
      );
      return response.data;
    },
    enabled: !!profesorId,
  });
};

export const useActividadRecienteProfesor = (
  profesorId: string | undefined
) => {
  return useQuery({
    queryKey: ["actividad-reciente-profesor", profesorId],
    queryFn: async () => {
      const response = await api.get(
        `/dashboard/actividad-reciente-profesor/${profesorId}`
      );
      return response.data;
    },
    enabled: !!profesorId,
  });
};
