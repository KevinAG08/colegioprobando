import api from "@/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useAllAsistencias = () => {
  return useQuery({
    queryKey: ["asistencias"],
    queryFn: async () => {
      const response = await api.get("/asistencias");
      return response.data;
    },
  });
};

export const useAsistenciasByAulaAndDate = (
  aulaId: string | undefined,
  date: string | undefined
) => {
  return useQuery({
    queryKey: ["asistenciasByAulaAndDate", aulaId, date],
    queryFn: async () => {
      if (!aulaId || !date) return null;
      try {
        const response = await api.get(`/asistencias/${aulaId}/${date}`);
        return response.data; // This might be null or an empty object, but that's fine
      } catch (error) {
        console.error("Error fetching asistencias:", error);
        return null;
      }
    },
    enabled: !!aulaId && !!date,
  });
};

export const useSaveAsistencias = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      aulaId: string;
      date: string;
      asistenciaDetalles: Array<{ estudianteId: string; estado: string }>;
    }) => {
      const response = await api.post("/asistencias/save", data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          "asistenciasByAulaAndDate",
          variables.aulaId,
          variables.date,
        ],
      });
      toast.success("Asistencia registrada exitosamente!");
    },
    onError: (error) => {
      console.log(error);
      toast.error("Error al registrar la asistencia");
    },
  });
};
