import api from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUpdateAdminProfile = (adminId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    // eslint-disable-next-line
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await api.patch(`/admin/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", adminId] });
      toast.success("Perfil actualizado correctamente");
    },
    onError: (error) => {
      toast.error("Error al actualizar el perfil");
      console.log("Error al actualizar el perfil", error);
    },
  });
};

export const useUpdateAdminPassword = (adminId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, password }: { id: string; password: string }) => {
      const response = await api.patch(`/admin/${id}/password`, {
        password,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", adminId] });
      toast.success("Contraseña actualizada correctamente");
    },
    onError: (error) => {
      toast.error("Error al actualizar la contraseña");
      console.log("Error al actualizar la contraseña", error);
    },
  });
};
