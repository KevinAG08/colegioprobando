import api from "@/api";
import { User, UserRole } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const getUserFromStorage = (): User | null => {
  const storedUser = localStorage.getItem("user");
  return storedUser ? JSON.parse(storedUser) : null;
};

export const useAuthQuery = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: user, isLoading } = useQuery({
    queryKey: ["auth", "user"],
    queryFn: () => getUserFromStorage(),
    staleTime: Infinity,
  });

  const loginMutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const response = await api.post("/auth/login", { email, password });
      return response.data;
    },
    onSuccess: (data) => {
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));

      queryClient.setQueryData(["auth", "user"], data.user);

      toast.success("Inicio de sesión exitoso");

      if (data.user.rol === UserRole.ADMIN) {
        navigate("/admin/dashboard");
      } else if (data.user.rol === UserRole.PROFESOR) {
        navigate("/profesor/dashboard");
      }
    },
    onError: () => {
      toast.error("Error al iniciar sesión, por favor intente nuevamente");
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      return await api.post("/auth/logout");
    },
    onSuccess: () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");

      queryClient.clear();

      toast.success("Cierre de sesión exitoso");
      navigate("/login");
    },
    onError: () => {
      toast.error("Error al cerrar sesión.");
    },
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login: (email: string, password: string) =>
      loginMutation.mutate({ email, password }),
    logout: () => logoutMutation.mutate(),
    error: loginMutation.error
      ? "Error al iniciar sesión, por favor intente nuevamente"
      : null,
    isLoginLoading: loginMutation.isPending,
    isLogoutLoading: logoutMutation.isPending,
  };
};
