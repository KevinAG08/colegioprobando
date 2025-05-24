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
import { Separator } from "@/components/ui/separator";
import { useAulas } from "@/hooks/useAulas";
import { useCreateProfesor, useUpdateProfesor } from "@/hooks/useProfesores";
import { cn } from "@/lib/utils";
import { profesorSchema } from "@/schemas/profesor";
import { User } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Check,
  ChevronsUpDown,
  KeyRound,
  Save,
  Undo2,
  X,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as z from "zod";

interface ProfesorFormProps {
  initialData: User | null;
}

type FormValues = z.infer<typeof profesorSchema>;

export const ProfesorForm: React.FC<ProfesorFormProps> = ({ initialData }) => {
  const navigate = useNavigate();
  const [popoverOpen, setPopoverOpen] = useState(false);

  const { data: aulas, isLoading: isAulasLoading } = useAulas();
  const createMutation = useCreateProfesor();
  const updateMutation = useUpdateProfesor(initialData?.id || "");

  const isLoading = createMutation.isPending || updateMutation.isPending;

  const title = initialData ? "Editar profesor" : "Registrar profesor";
  const description = initialData
    ? "Edita los datos de un profesor existente"
    : "Agrega los datos de un nuevo profesor";
  const action = initialData ? "Actualizar profesor" : "Registrar profesor";

  const form = useForm<FormValues>({
    resolver: zodResolver(profesorSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          aulaIds: initialData.aulas?.map((aula) => aula.aula.id) || [],
          password: "",
        }
      : {
          nombres: "",
          apellidos: "",
          email: "",
          password: "",
          dni: "",
          rol: "profesor",
          direccion: "",
          telefono: "",
          aulaIds: [],
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
            navigate("/admin/profesores");
          },
        }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          form.reset();
          setPopoverOpen(false);
        },
      });
    }
  };

  const getSelectedAulaNames = (selectedIds: string[]): string[] => {
    return selectedIds
      .map((id) => aulas?.find((aula) => aula.id === id)?.nombre) // Busca nombres de aulas que tengan los ids que se mapean, si no tiene lo agrega como undefined
      .filter((name): name is string => !!name); // Filtra si un ID es string, borra los undefined
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-6">
      <div className="flex items-center justify-between sm:flex-row flex-col">
        <Heading title={title} description={description} />

        <Button
          disabled={isLoading}
          variant="outline"
          size="default"
          onClick={() => navigate("/admin/profesores")}
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
                name="nombres"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Nombres</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isLoading}
                        placeholder="Nombres del profesor"
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
                        placeholder="Apellidos del profesor"
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

              {initialData ? (
                <FormItem>
                  <FormLabel className="text-base">Contraseña</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      navigate(`/admin/profesores/cambiar-password/${initialData.id}`)
                    }
                    disabled={isLoading}
                    className="w-full h-11 flex items-center justify-center gap-2"
                  >
                    <KeyRound size={18} />
                    Ir a cambiar contraseña
                  </Button>
                </FormItem>
              ) : (
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Contraseña</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isLoading}
                          placeholder="••••••"
                          type="password"
                          className="h-11"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

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
              {/* MULTISELECT DE AULAS */}
              <FormField
                control={form.control}
                name="aulaIds"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="text-base">Aulas Asignadas</FormLabel>
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
                            disabled={isLoading || isAulasLoading}
                          >
                            <span className="truncate">
                              {field.value?.length > 0
                                ? `${field.value.length} aulas seleccionadas`
                                : "Seleccione aulas..."}
                            </span>
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
                        <Command>
                          <CommandInput placeholder="Buscar aula..." />
                          <CommandList>
                            <CommandEmpty>
                              No se encontraron aulas.
                            </CommandEmpty>
                            <CommandGroup>
                              {isAulasLoading ? (
                                <CommandItem disabled>Cargando...</CommandItem>
                              ) : (
                                aulas?.map((aula) => {
                                  const aulaId = aula.id;
                                  const isSelected =
                                    field.value?.includes(aulaId);
                                  return (
                                    <CommandItem
                                      key={aula.id}
                                      value={aula.nombre}
                                      onSelect={() => {
                                        const currentValues = field.value || [];
                                        if (isSelected) {
                                          field.onChange(
                                            currentValues.filter(
                                              (id) => id !== aulaId
                                            )
                                          );
                                        } else {
                                          field.onChange([
                                            ...currentValues,
                                            aulaId,
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
                                      {aula.nombre}
                                    </CommandItem>
                                  );
                                })
                              )}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    {/* Mostrar bagdes de las aulas seleccionadas */}
                    <div className="pt-3 flex flex-wrap gap-2">
                      {getSelectedAulaNames(field.value || []).map(
                        (nombre, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="px-3 py-1.5 text-sm"
                          >
                            {nombre}
                            <button
                              type="button"
                              className="ml-2 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                              onClick={() => {
                                const aulaIdToRemove = aulas?.find(
                                  (a) => a.nombre === nombre
                                )?.id;
                                if (aulaIdToRemove) {
                                  field.onChange(
                                    field.value?.filter(
                                      (id) => id !== aulaIdToRemove
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
