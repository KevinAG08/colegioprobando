import { Heading } from "@/components/heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useProfesorAulas } from "@/hooks/useAulas";
import { useAuth } from "@/hooks/useAuth";
import { useEstudiantesByProfesor } from "@/hooks/useEstudiantes";
import {
  useCreateIncidencia,
  useUpdateIncidencia,
} from "@/hooks/useIncidencias";
import { cn } from "@/lib/utils";
import { incidenciaSchema } from "@/schemas/incidencia";
import { AulaProfesor, Estudiante, Incidencia } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown, Save, Undo2, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as z from "zod";

interface IncidenciaFormProps {
  initialData: Incidencia | null;
}

type FormValues = z.infer<typeof incidenciaSchema>;

export const IncidenciaFormProfesor: React.FC<IncidenciaFormProps> = ({
  initialData,
}) => {
  const { user } = useAuth();

  const navigate = useNavigate();
  const [popoverOpen, setPopoverOpen] = useState(false);

  const { data: aulas, isLoading: isAulasLoading } = useProfesorAulas(user?.id);
  const { data: estudiantes, isLoading: isEstudiantesLoading } =
    useEstudiantesByProfesor(user?.id);

  const [selectedAulaId, setSelectedAulaId] = useState<string>("todos");

  const createMutation = useCreateIncidencia("profesor");
  const updateMutation = useUpdateIncidencia("profesor", initialData?.id || "");

  const isLoading = createMutation.isPending || updateMutation.isPending;

  const title = initialData ? "Editar incidencia" : "Registrar incidencia";
  const description = initialData
    ? "Edita los datos de la incidencia"
    : "Registra los datos de una nueva incidencia";
  const action = initialData ? "Actualizar incidencia" : "Registrar incidencia";

  const filteredEstudiantes = estudiantes?.filter((estudiante: Estudiante) => {
    if (!selectedAulaId || selectedAulaId === "todos") {
      return true;
    }
    return estudiante?.aula?.id === selectedAulaId;
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(incidenciaSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          fecha: initialData.fecha
            ? new Date(initialData.fecha).toISOString().split("T")[0]
            : "",
          hora: initialData.fecha
            ? new Date(initialData.fecha).toISOString().split("T")[1].substring(0, 5)
            : "",
          estudianteIds:
            initialData.detalles.map((detalle) => detalle.estudianteId) || [],
        }
      : {
          fecha: "",
          hora: "",
          lugar: "",
          tipoIncidencia: "",
          descripcion: "",
          medidasAdoptadas: "",
          estudianteIds: [],
        },
  });

  const handleSubmit = async (data: FormValues) => {
    let fechaHoraIso;

    if (data.fecha && data.hora) {
      // Crear fecha directamente en UTC sin conversión de timezone
      const fechaHoraString = `${data.fecha}T${data.hora}:00.000Z`;
      fechaHoraIso = fechaHoraString;
    } else {
      fechaHoraIso = data.fecha ? `${data.fecha}T00:00:00.000Z` : "";
    }

    const submitData = {
      ...data,
      fecha: fechaHoraIso,
    };

    delete submitData.hora;

    if (initialData) {
      updateMutation.mutate(
        {
          id: initialData.id as string,
          data: submitData,
        },
        {
          onSuccess: () => {
            navigate("/profesor/incidencias");
          },
        }
      );
    } else {
      createMutation.mutate(submitData, {
        onSuccess: () => {
          form.reset();
          setPopoverOpen(false);
        },
      });
    }
  };

  const getSelectedEstudiantesFullNames = (selectedIds: string[]): string[] => {
    if (!estudiantes || estudiantes.length === 0) {
      return [];
    }
    return selectedIds
      .map(
        (id) =>
          `${
            estudiantes.find((estudiante: Estudiante) => estudiante.id === id)
              ?.nombres
          } ${
            estudiantes.find((estudiante: Estudiante) => estudiante.id === id)
              ?.apellidos
          }`
      )
      .filter((name): name is string => !!name);
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-6">
      <div className="flex items-center justify-between sm:flex-row flex-col">
        <Heading title={title} description={description} />

        <Button
          disabled={isLoading}
          variant="outline"
          size="default"
          onClick={() => navigate("/profesor/incidencias")}
        >
          <Undo2 className="h-4 w-4" />
          Volver a la lista
        </Button>
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
                name="fecha"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Fecha</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isLoading}
                        type="date"
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hora"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Hora</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isLoading}
                        type="time"
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lugar"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="text-base">Lugar</FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Seleccione un lugar..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="En el aula">En el aula</SelectItem>
                        <SelectItem value="En el patio">En el patio</SelectItem>
                        <SelectItem value="En los alrededores">En los alrededores</SelectItem>
                        <SelectItem value="En otro lugar">
                          En otro lugar
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tipoIncidencia"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="text-base">
                      Tipo de incidencia
                    </FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Seleccione un lugar..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Inasistencia">
                          Inasistencia
                        </SelectItem>
                        <SelectItem value="Acoso escolar / Bullying">
                          Acoso escolar / Bullying
                        </SelectItem>
                        <SelectItem value="Agresión física">
                          Agresión física
                        </SelectItem>
                        <SelectItem value="Agresión verbal">
                          Agresión verbal
                        </SelectItem>                        
                        <SelectItem value="Robo/hurto">Robo/hurto</SelectItem>
                        <SelectItem value="Posesión de objetos peligrosos">
                          Posesión de objetos peligrosos
                        </SelectItem>
                        <SelectItem value="Pandillaje">Pandillaje</SelectItem>
                        <SelectItem value="Otros">Otros</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Selector de aulas para filtrar estudiantes */}
              <div className="md:col-span-2">
                <FormLabel className="text-base">Filtrar por aula</FormLabel>
                <Select
                  disabled={isLoading || isAulasLoading}
                  value={selectedAulaId}
                  onValueChange={(value) => setSelectedAulaId(value)}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Seleccione un aula..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todas las aulas</SelectItem>
                    {!isAulasLoading &&
                      aulas?.map((aula: AulaProfesor) => (
                        <SelectItem key={aula?.aula.id} value={aula?.aula.id}>
                          {aula?.aula.nombre}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Multiselect de estudiantes */}
              <FormField
                control={form.control}
                name="estudianteIds"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="text-base">
                      Estudiantes involucrados
                    </FormLabel>
                    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            type="button"
                            variant="outline"
                            role="combobox"
                            aria-expanded={popoverOpen}
                            className={cn(
                              "w-full justify-between h-11",
                              !field.value?.length && "text-muted-foreground"
                            )}
                            disabled={isLoading || isEstudiantesLoading}
                          >
                            <span className="truncate">
                              {field.value?.length > 0
                                ? `${field.value.length} estudiantes seleccionados`
                                : "Seleccione estudiantes..."}
                            </span>
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
                        <Command>
                          <CommandInput placeholder="Buscar estudiante..." />
                          <CommandList>
                            <CommandEmpty>
                              No se encontraron estudiantes.
                            </CommandEmpty>
                            <CommandGroup>
                              {isEstudiantesLoading ? (
                                <CommandItem disabled>Cargando...</CommandItem>
                              ) : (
                                filteredEstudiantes.map(
                                  (estudiante: Estudiante) => {
                                    const estudianteId = estudiante.id;
                                    const isSelected =
                                      field.value?.includes(estudianteId);
                                    return (
                                      <CommandItem
                                        key={estudiante.id}
                                        value={`${estudiante.nombres} ${estudiante.apellidos}`}
                                        onSelect={() => {
                                          const currentValues =
                                            field.value || [];
                                          if (isSelected) {
                                            field.onChange(
                                              currentValues.filter(
                                                (id) => id !== estudianteId
                                              )
                                            );
                                          } else {
                                            field.onChange([
                                              ...currentValues,
                                              estudianteId,
                                            ]);
                                          }
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            isSelected
                                              ? "opacity-100"
                                              : "opacity-0"
                                          )}
                                        />
                                        {`${estudiante.nombres} ${estudiante.apellidos}`}{" "}
                                        <span className="ml-2 text-xs text-muted-foreground">
                                          {estudiante?.aula?.nombre ||
                                            "Sin aula"}
                                        </span>
                                      </CommandItem>
                                    );
                                  }
                                )
                              )}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    {/* Mostrar bagdes de los estudiantes seleccionadas */}
                    <div className="pt-3 flex flex-wrap gap-2">
                      {getSelectedEstudiantesFullNames(field.value || []).map(
                        (fullNombre, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="px-3 py-1.5 text-sm"
                          >
                            {fullNombre}
                            <button
                              type="button"
                              className="ml-2 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                              onClick={() => {
                                const estudianteIdToRemove = estudiantes.find(
                                  (a: Estudiante) =>
                                    `${a.nombres} ${a.apellidos}` === fullNombre
                                )?.id;
                                if (estudianteIdToRemove) {
                                  field.onChange(
                                    field.value?.filter(
                                      (id) => id !== estudianteIdToRemove
                                    )
                                  );
                                }
                              }}
                            >
                              <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                            </button>
                          </Badge>
                        )
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="descripcion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">
                      Descripción de la incidencia
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        disabled={isLoading}
                        placeholder="Describe la incidencia..."
                        className="h-30"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="medidasAdoptadas"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">
                      Medidas adoptadas
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        disabled={isLoading}
                        placeholder="Describe las medidas adoptadas..."
                        className="h-30"
                      />
                    </FormControl>
                    <FormMessage />
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
          </form>
        </Form>
      </div>
    </div>
  );
};
