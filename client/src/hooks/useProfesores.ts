import api from "@/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useProfesores = () => {
  return useQuery({
    queryKey: ["profesores"],
    queryFn: async () => {
      const response = await api.get("/profesores");
      return response.data;
    },
  });
};

export const useProfesor = (profesorId: string | undefined) => {
  return useQuery({
    queryKey: ["profesor", profesorId],
    queryFn: async () => {
      if (!profesorId) return;
      const response = await api.get(`/profesores/${profesorId}`);
      return response.data;
    },
    enabled: !!profesorId,
  });
};

export const useCreateProfesor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => { // eslint-disable-line
      const response = await api.post("/admin/crear-profesor", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profesores"] });
      toast.success("Profesor registrado exitosamente!");
    },
    onError: (error) => {
      console.log(error);
      toast.error("Error al registrar el profesor");
    },
  });
};

export const useUpdateProfesor = (profesorId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => { // eslint-disable-line
      const response = await api.patch(`/profesores/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profesores"] });
      queryClient.invalidateQueries({ queryKey: ["profesor", profesorId] });
      toast.success("Profesor actualizado exitosamente!");
    },
    onError: (error) => {
      console.log(error);
      toast.error("Error al actualizar el profesor");
    },
  });
};

export const useUpdateProfesorProfile = (profesorId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => { // eslint-disable-line
      const response = await api.patch(`/profesores/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profesor", profesorId] });
      toast.success("Perfil actualizado correctamente");
    },
    onError: (error) => {
      toast.error("Error al actualizar el perfil");
      console.log("Error al actualizar el perfil", error);
    },
  })
}

export const useDeleteProfesor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/profesores/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profesores"] });
      toast.success("Profesor eliminado exitosamente!");
    },
    onError: (error) => {
      console.log(error);
      toast.error("Error al eliminar el profesor");
    },
  });
};

export const useUpdateProfesorPassword = (profesorId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({id, password} : {id: string, password:string}) => {
      const response = await api.patch(`/profesores/${id}/password`, {
        password,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profesor", profesorId] });
      toast.success("Contraseña actualizada exitosamente!");
    },
    onError: (error) => {
      console.log(error);
      toast.error("Error al actualizar la contraseña del profesor");
    }
  })
}
