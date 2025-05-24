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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useAulas } from "@/hooks/useAulas";
import {
  useCreateEstudiante,
  useUpdateEstudiante,
} from "@/hooks/useEstudiantes";
import { estudianteSchema } from "@/schemas/estudiante";
import { Estudiante } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Undo2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import * as z from "zod";

interface EstudianteFormProps {
  initialData: Estudiante | null;
}

type FormValues = z.infer<typeof estudianteSchema>;

export const EstudianteForm: React.FC<EstudianteFormProps> = ({
  initialData,
}) => {
  const navigate = useNavigate();
  const { aulaId } = useParams();

  const { data: aulas, isLoading: isAulasLoading } = useAulas();
  const createMutation = useCreateEstudiante();
  const updateMutation = useUpdateEstudiante(initialData?.id || "");

  const isLoading = createMutation.isPending || updateMutation.isPending;
  const aulaIdFromUrl = !initialData ? aulaId : null;

  const title = initialData ? "Editar estudiante" : "Registrar estudiante";
  const description = initialData
    ? "Edita los datos de un estudiante existente"
    : "Agrega los datos de un nuevo estudiante";
  const action = initialData ? "Actualizar estudiante" : "Registrar estudiante";

  const form = useForm<FormValues>({
    resolver: zodResolver(estudianteSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          fechaNacimiento: initialData.fechaNacimiento
            ? new Date(initialData.fechaNacimiento).toISOString().split("T")[0]
            : "",
          aulaId: initialData.aulaId || "",
        }
      : {
          nombres: "",
          apellidos: "",
          email: "",
          dni: "",
          apoderado: "",
          telefono: "",
          sexo: "",
          fechaNacimiento: "",
          aulaId: aulaIdFromUrl || "",
        },
  });

  const handleSubmit = async (data: FormValues) => {
    if (initialData) {
      updateMutation.mutate(
        {
          id: initialData.id as string,
          data,
        },
        {
          onSuccess: () => {
            navigate(`/admin/estudiantes?aulaId=${data.aulaId}`);
          },
        }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          form.reset();
        },
      });
    }
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-6">
      <div className="flex items-center justify-between sm:flex-row flex-col">
        <Heading title={title} description={description} />

        <Button
          disabled={isLoading}
          variant="outline"
          size="default"
          onClick={() =>
            navigate(
              `/admin/estudiantes?aulaId=${aulaIdFromUrl ? aulaIdFromUrl : ""}`
            )
          }
        >
          <Undo2 className="h-4 w-4" />
          Volver a la lista
        </Button>
      </div>
      <Separator className="mb-8" />
      <div>
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-8"
            >
              <div>
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
                            placeholder="Nombres del estudiante"
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
                            placeholder="Apellidos del estudiante"
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
                    name="apoderado"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Apoderado</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isLoading}
                            placeholder="Nombres del apoderado"
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
                    name="sexo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sexo</FormLabel>
                        <Select
                          disabled={isLoading || isAulasLoading}
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-11">
                              <SelectValue placeholder="Selecciona un sexo..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem key={"M"} value="Masculino">
                              Masculino
                            </SelectItem>
                            <SelectItem key={"F"} value="Femenino">
                              Femenino
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="aulaId"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="text-base">Aula</FormLabel>
                        {/* *** Use Select component *** */}
                        <Select
                          disabled={isLoading || isAulasLoading}
                          onValueChange={field.onChange} // Pass the selected value directly
                          value={field.value} // Bind the current value
                        >
                          <FormControl>
                            <SelectTrigger className="h-11">
                              {/* Display placeholder or selected value */}
                              <SelectValue placeholder="Seleccione un aula..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem key={"todos"} value="todos" disabled>
                              Seleccione un aula
                            </SelectItem>
                            {isAulasLoading ? (
                              <SelectItem value="loading" disabled>
                                Cargando aulas...
                              </SelectItem>
                            ) : aulas && aulas.length > 0 ? (
                              aulas.map((aula) => (
                                <SelectItem key={aula.id} value={aula.id}>
                                  {aula.nombre} {/* Display aula name */}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="no-aulas" disabled>
                                No hay aulas disponibles
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />{" "}
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="fechaNacimiento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">
                          Fecha de nacimiento
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isLoading}
                            type="date"
                            className="h-11"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
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
                        {action}
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};
