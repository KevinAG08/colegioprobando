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
import { useAuth } from "@/hooks/useAuth";
import { useUpdateAdminPassword } from "@/hooks/useAdmin";
import { changePasswordSchema } from "@/schemas/password";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, Save, Undo2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as z from "zod";

type FormValues = z.infer<typeof changePasswordSchema>;

const CambiarPasswordAdminPerfil = () => {
  const navigate = useNavigate();

  const { user, logout } = useAuth();
  const updateProfesorPasswordMutation = useUpdateAdminPassword(user?.id || "");

  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const isLoading = updateProfesorPasswordMutation.isPending;

  const nombreCompleto = user ? `${user.nombres} ${user.apellidos}` : "admin";

  const handleSubmit = async (data: FormValues) => {
    if (!user?.id) return;

    updateProfesorPasswordMutation.mutate(
      {
        id: user.id,
        password: data.password,
      },
      {
        onSuccess: () => {
          setTimeout(() => {
            logout();
          }, 2000);
        },
      }
    );
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-6">
      <div className="flex items-center justify-between">
        <Heading
          title="Cambiar contraseña"
          description={`Cambiar contraseña del administrador ${nombreCompleto}`}
        />
        <Button
          disabled={isLoading}
          variant="outline"
          size="default"
          onClick={() => navigate("/admin/editar-perfil")}
        >
          <Undo2 className="h-4 w-4 mr-2" />
          Volver al perfil
        </Button>
      </div>
      <Separator className="mb-8" />
      <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 max-w-md mx-auto">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
            <KeyRound className="h-8 w-8 text-slate-600" />
          </div>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Nueva contraseña</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isLoading}
                      type={showPassword ? "text" : "password"}
                      placeholder="********"
                      className="h-11"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    Confirmar contraseña
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isLoading}
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirmar contraseña"
                      className="h-11"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                className="rounded text-primary focus:ring-primary"
              />
              <label htmlFor="showPassword" className="text-sm text-gray-600">
                Mostrar contraseñas
              </label>
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
                    Actualizar contraseña
                  </span>
                )}
              </Button>
            </div>
            <div className="flex items-center [.border-t]:pt-6">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded-md w-full">
                <p className="text-sm">
                  Luego de cambiar la contraseña deberás iniciar sesión
                  nuevamente.
                </p>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CambiarPasswordAdminPerfil;
