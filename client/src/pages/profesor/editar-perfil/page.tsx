import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useUpdateProfesorProfile } from "@/hooks/useProfesores";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as z from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { perfilUsuarioSchema } from "@/schemas/profile";

type FormValues = z.infer<typeof perfilUsuarioSchema>;

export const PerfilProfesorForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth()
  const updateMutation = useUpdateProfesorProfile(user?.id || "");

  const isLoading = updateMutation.isPending;

  const form = useForm<FormValues>({
    resolver: zodResolver(perfilUsuarioSchema),
    defaultValues: user
      ? {
          nombres: user.nombres || "",
          apellidos: user.apellidos || "",
          email: user.email || "",
          dni: user.dni || "",
          direccion: user.direccion || "",
          telefono: user.telefono || "",
        }
      : {
          nombres: "",
          apellidos: "",
          email: "",
          dni: "",
          direccion: "",
          telefono: "",
        },
  });

  const handleSubmit = async (data: FormValues) => {
    if (!user) return;

    updateMutation.mutate(
      {
        id: user.id as string,
        data: {
          ...data,
          rol: "profesor", // Mantenemos el rol actual
          aulaIds: user.aulas?.map((aula) => aula.aula.id) || [], // Mantenemos las aulas asignadas
        },
      },
      {
        onSuccess: () => {
          const currentUser = localStorage.getItem("user");
          if (currentUser) {
            const parsedUser = JSON.parse(currentUser);
            const newUserData = {
              ...parsedUser,
              ...data,
            };
            localStorage.setItem("user", JSON.stringify(newUserData));

            queryClient.setQueryData(["auth", "user"], newUserData);
          }
        }
      }
    );
  };

  if (!user) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-6">
        <div className="flex items-center justify-center h-40">
          <p>Cargando información del perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-6">
      <div className="flex items-center justify-between">
        <Heading
          title="Mi Perfil"
          description="Visualiza y actualiza tu información personal"
        />
      </div>
      <Separator className="mb-8" />
      <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <FormField
                control={form.control}
                name="nombres"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Nombres</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isLoading}
                        placeholder="Tus nombres"
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="apellidos"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Apellidos</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isLoading}
                        placeholder="Tus apellidos"
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">
                      Correo electrónico
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isLoading}
                        placeholder="correo@ejemplo.com"
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem>
                <FormLabel className="text-base">Contraseña</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/profesor/cambiar-password")}
                  disabled={isLoading}
                  className="w-full h-11 flex items-center justify-center gap-2"
                >
                  <KeyRound size={18} />
                  Cambiar mi contraseña
                </Button>
              </FormItem>

              <FormField
                control={form.control}
                name="dni"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">DNI</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isLoading}
                        placeholder="Documento de identidad"
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="telefono"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Teléfono</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isLoading}
                        placeholder="Número de teléfono"
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="direccion"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="text-base">Dirección</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isLoading}
                        placeholder="Dirección completa"
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Sección informativa de aulas asignadas (solo lectura) */}
              {user.aulas && user.aulas.length > 0 && (
                <div className="md:col-span-2 mt-4">
                  <h3 className="text-base font-medium mb-2">
                    Aulas Asignadas
                  </h3>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <ul className="list-disc pl-5 space-y-1">
                      {user.aulas.map((aulaRelacion) => (
                        <li key={aulaRelacion.aula.id} className="text-sm">
                          {aulaRelacion.aula.nombre}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Para modificar tus aulas asignadas, contacta con el
                    administrador.
                  </p>
                </div>
              )}
            </div>
            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                className="px-6 py-2.5 h-11 text-base"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                    Guardando...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Save size={18} />
                    Actualizar mi perfil
                  </span>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default PerfilProfesorForm;
