import api from "@/api";
import { Aula, AulaProfesor } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useAulas = () => {
  return useQuery({
    queryKey: ["aulas"],
    queryFn: async () => {
      const response = await api.get<Aula[]>("/aulas");
      return response.data;
    },
  });
};

export const useProfesorAulas = (profesorId: string | undefined) => {
  return useQuery({
    queryKey: ["profesorAulas", profesorId],
    queryFn: async () => {
      const response = await api.get<AulaProfesor[]>(
        `/aulas/profesor/${profesorId}`
      );
      return response.data;
    },
    enabled: !!profesorId,
  });
};

export const useCreateAula = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (nombre: string) => {
      const response = await api.post("/aulas/crear-aula", {
        nombre,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aulas"] });
      toast.success("Aula registrada exitosamente!");
    },
    onError: (error) => {
      console.log(error);
      toast.error("Error al registrar el aula");
    },
  });
};

export const useUpdateAula = (aulaId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, nombre }: { id: string; nombre: string }) => {
      const response = await api.patch(`/aulas/${id}`, {
        nombre,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aulas"] });
      queryClient.invalidateQueries({ queryKey: ["aula", aulaId] });
      toast.success("Aula actualizada exitosamente!");
    },
    onError: (error) => {
      console.log(error);
      toast.error("Error al actualizar el aula");
    },
  });
};

export const useDeleteAula = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/aulas/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aulas"] });
      toast.success("Aula eliminada exitosamente!");
    },
    onError: (error) => {
      console.log(error);
      toast.error("Error al eliminar el aula");
    },
  });
};
