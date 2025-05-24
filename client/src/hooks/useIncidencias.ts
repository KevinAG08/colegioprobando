import api from "@/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useIncidencias = () => {
  return useQuery({
    queryKey: ["incidencias"],
    queryFn: async () => {
      const response = await api.get("/incidencias");
      return response.data;
    },
  });
};

export const useIncidenciasByProfesor = (profesorId: string | undefined) => {
  return useQuery({
    queryKey: ["incidenciasByProfesor", profesorId],
    queryFn: async () => {
      const response = await api.get(`/incidencias/profesor/${profesorId}`);
      return response.data;
    },
    enabled: !!profesorId,
  });
}

export const useIncidencia = (incidenciaId: string | undefined) => {
  return useQuery({
    queryKey: ["incidencia", incidenciaId],
    queryFn: async () => {
      if (!incidenciaId) return;
      const response = await api.get(`/incidencias/${incidenciaId}`);
      return response.data;
    },
    enabled: !!incidenciaId,
  });
};

export const useCreateIncidencia = (role: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => { // eslint-disable-line
      const response = await api.post("/incidencias/crear-incidencia", data);
      return response.data;
    },
    onSuccess: () => {
      if (role === "profesor") {
        queryClient.invalidateQueries({ queryKey: ["incidenciasByProfesor"] });
      } else if (role === "admin") {
        queryClient.invalidateQueries({ queryKey: ["incidencias"] });
      }
      toast.success("Incidencia registrada exitosamente!");
    },
    onError: (error) => {
      console.log(error);
      toast.error("Error al registrar la incidencia");
    },
  });
};

export const useUpdateIncidencia = (role: string, incidenciaId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => { // eslint-disable-line
      const response = await api.patch(`/incidencias/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      if (role === "profesor") {
        queryClient.invalidateQueries({ queryKey: ["incidenciasByProfesor"] });
      } else if (role === "admin") {
        queryClient.invalidateQueries({ queryKey: ["incidencias"] });
      }
      queryClient.invalidateQueries({ queryKey: ["incidencia", incidenciaId] });
      toast.success("Incidencia actualizada exitosamente!");
    },
    onError: (error) => {
      console.log(error);
      toast.error("Error al actualizar la incidencia");
    },
  });
};

export const useDeleteIncidencia = (role: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/incidencias/${id}`);
      return response.data;
    },
    onSuccess: () => {
      if (role === "profesor") {
        queryClient.invalidateQueries({ queryKey: ["incidenciasByProfesor"] });
      } else if (role === "admin") {
        queryClient.invalidateQueries({ queryKey: ["incidencias"] });
      }
      toast.success("Incidencia eliminada exitosamente!");
    },
    onError: (error) => {
      console.log(error);
      toast.error("Error al eliminar la incidencia");
    },
  });
};
