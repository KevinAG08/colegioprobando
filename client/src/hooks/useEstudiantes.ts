import api from "@/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useEstudiantes = () => {
  return useQuery({
    queryKey: ["estudiantes"],
    queryFn: async () => {
      const response = await api.get("/estudiantes");
      return response.data;
    },
  });
};

export const useEstudiantesByAula = (aulaId: string | undefined) => {
  return useQuery({
    queryKey: ["estudiantesByAula", aulaId],
    queryFn: async () => {
      const response = await api.get(`/estudiantes/aula/${aulaId}`);
      return response.data;
    },
    enabled: !!aulaId,
  });
};

export const useEstudiantesByProfesor = (profesorId: string | undefined) => {
  return useQuery({
    queryKey: ["estudiantesByProfesor", profesorId],
    queryFn: async () => {
      const response = await api.get(`/estudiantes/profesor/${profesorId}`);
      return response.data;
    },
    enabled: !!profesorId,
  });
}

export const useEstudiante = (estudianteId: string | undefined) => {
  return useQuery({
    queryKey: ["estudiante", estudianteId],
    queryFn: async () => {
      if (!estudianteId) return;
      const response = await api.get(`/estudiantes/${estudianteId}`);
      return response.data;
    },
    enabled: !!estudianteId,
  });
};

export const useCreateEstudiante = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // eslint-disable-next-line
    mutationFn: async (data: any) => {      
      const response = await api.post("/admin/crear-estudiante", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["estudiantes"] });
      toast.success("Estudiante registrado exitosamente!");
    },
    onError: (error) => {
      console.log(error);
      toast.error("Error al registrar el estudiante");
    },
  });
};

export const useUpdateEstudiante = (estudianteId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    // eslint-disable-next-line
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await api.patch(`/estudiantes/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["estudiantes"] });
      queryClient.invalidateQueries({ queryKey: ["estudiante", estudianteId] });
      toast.success("Estudiante actualizado exitosamente!");
    },
    onError: (error) => {
      console.log(error);
      toast.error("Error al actualizar el estudiante");
    },
  });
};

export const useDeleteEstudiante = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/estudiantes/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["estudiantes"] });
      toast.success("Estudiante eliminado exitosamente!");
    },
    onError: (error) => {
      console.log(error);
      toast.error("Error al eliminar el estudiante");
    },
  });
};
