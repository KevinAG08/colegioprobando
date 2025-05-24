import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { loginSchema } from "@/schemas/login";
import { zodResolver } from "@hookform/resolvers/zod";
import logo from "@/assets/logo.png";

type FormValues = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const { isAuthenticated, user, error, login, isLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"login" | "login-profesor">(
    "login"
  );

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.rol === "admin") {
        navigate("/admin/dashboard");
      } else if (user.rol === "profesor") {
        navigate("/profesor/dashboard");
      }
    }
  }, [isAuthenticated, user, navigate]);

  const form = useForm<FormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const formProfesores = useForm<FormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleUserSubmit = async (data: FormValues) => {
    try {
      await login(data.email, data.password);
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  const handleProfesoresSubmit = async (data: FormValues) => {
    try {
      await login(data.email, data.password);
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/*Inicio Header*/}
      <header className="bg-white-600 text-blackshadow-md h-18 flex items-center">
        <div className="container mx-auto flex items-center gap-4">
          <img
            src={logo}
            alt="Logo de la institución"
            className="w-20 h-20 rounded-full object-cover cursor-pointer"
          />
          <h1 className="text-xl font-semibold text-center cursor-pointer">
            I.E. José María Arguedas Altamirano
          </h1>
        </div>
      </header>
      {/* Fin del header */}

      <div className="min-h-[94vh] pb-16 px-4 flex items-center justify-center bg-gradient-to-b from-primary/10 to-background/95">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <div className="inline-flex justify-center items-center mb-4">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              Bienvenido al sistema
            </h1>
            <p className="text-muted-foreground">Sistema académico</p>
          </div>

          <Card className="border-0 shadow-xl bg-background/95 backdrop-blur-md">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-center">
                Acceso al sistema
              </CardTitle>
              <CardDescription className="text-center">
                Ingresa tus credenciales para continuar
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Tabs
                value={activeTab}
                onValueChange={(value) =>
                  setActiveTab(value as "login" | "login-profesor")
                }
              >
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Administrativos</TabsTrigger>
                  <TabsTrigger value="login-profesor">
                    Profesores
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(handleUserSubmit)}
                      className="space-y-4"
                    >
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Correo electrónico</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="correo@ejemplo.com"
                                {...field}
                                className="bg-background"
                                disabled={isLoading}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contraseña</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                {...field}
                                placeholder="••••••"
                                className="bg-background"
                                disabled={isLoading}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {error && (
                        <Alert variant="destructive">
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}

                      <Button type="submit" className="w-full mt-6">
                        Iniciar Sesión
                      </Button>
                    </form>
                  </Form>
                </TabsContent>

                <TabsContent value="login-profesor">
                  <Form {...formProfesores}>
                    <form
                      onSubmit={formProfesores.handleSubmit(
                        handleProfesoresSubmit
                      )}
                      className="space-y-4"
                    >
                      <FormField
                        control={formProfesores.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="correo@ejemplo.com"
                                {...field}
                                className="bg-background"
                                disabled={isLoading}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={formProfesores.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contraseña</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                {...field}
                                placeholder="••••••"
                                className="bg-background"
                                disabled={isLoading}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {error && (
                        <Alert variant="destructive">
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}

                      <Button
                        disabled={isLoading}
                        type="submit"
                        className="w-full mt-6"
                      >
                        Ingresar al sistema
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            </CardContent>

            <CardFooter className="flex justify-center text-sm text-muted-foreground pt-0">
              <p>
                Recuerda seleccionar el formulario que corresponde a tu rol.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
      {/* Footer Responsive */}
      <footer className="bg-gray-800 text-white py-4 relative z-10 mt-auto">
        <div className="text-center w-full max-w-6xl mx-auto px-4">
          <p>
            &copy; 2025 I.E. José María Arguedas Altamirano. Todos los derechos
            reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
