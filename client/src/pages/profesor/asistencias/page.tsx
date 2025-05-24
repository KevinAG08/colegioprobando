import { Heading } from "@/components/heading";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useAsistenciasByAulaAndDate,
  useSaveAsistencias,
} from "@/hooks/useAsistencias";
import { useProfesorAulas } from "@/hooks/useAulas";
import { useAuth } from "@/hooks/useAuth";
import { useEstudiantesByAula } from "@/hooks/useEstudiantes";
import { AsistenciaDetalle, Estudiante } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarIcon, Loader2, School } from "lucide-react";
import { useEffect, useState } from "react";

// Define the type for estado values
type EstadoKey =
  | "presente"
  | "falta"
  | "tardanza"
  | "falta_justificada"
  | "tardanza_justificada";

// Define the asistenciaEstados object with proper typing
const asistenciaEstados: Record<EstadoKey, { label: string; color: string }> = {
  presente: { label: "Presente", color: "bg-green-100 text-green-800" },
  falta: { label: "Falta", color: "bg-red-100 text-red-800" },
  tardanza: { label: "Tardanza", color: "bg-yellow-100 text-yellow-800" },
  falta_justificada: {
    label: "Falta justificada",
    color: "bg-blue-100 text-blue-800",
  },
  tardanza_justificada: {
    label: "Tardanza justificada",
    color: "bg-purple-100 text-purple-800",
  },
};

interface MergedEstudianteAsistencia {
  estudiante: Estudiante;
  estado: EstadoKey;
}

const AsistenciasPage = () => {
  const queryClient = useQueryClient();

  const [selectedAulaId, setSelectedAulaId] = useState<string>("");
  const [date, setDate] = useState(new Date());
  const { user } = useAuth();

  const {
    data: aulas,
    isLoading: isAulasLoading,
    error: aulasError,
  } = useProfesorAulas(user?.id);

  useEffect(() => {
    if (aulas && aulas?.length > 0 && !selectedAulaId) {
      setSelectedAulaId(aulas[0]?.aulaId);
    }
  }, [aulas, selectedAulaId]);

  const formattedDate = format(date, "yyyy-MM-dd");

  const {
    data: estudiantes,
    isLoading: isEstudiantesLoading,
    error: estudiantesError,
  } = useEstudiantesByAula(selectedAulaId);
  const {
    data: asistenciaData,
    isLoading: isAsistenciaLoading,
    error: asistenciaError,
  } = useAsistenciasByAulaAndDate(selectedAulaId, formattedDate);

  const [mergedData, setMergedData] = useState<MergedEstudianteAsistencia[]>(
    []
  );

  const saveMutation = useSaveAsistencias();
  const isLoading = saveMutation.isPending;

  useEffect(() => {    
    if (estudiantes && estudiantes.length > 0) {
      if (!asistenciaData || !asistenciaData.detalles || asistenciaData.detalles.length === 0) {
        // No attendance data exists for this date, so default to "presente"
        const newMergedData = estudiantes.map((estudiante: Estudiante) => ({
          estudiante: estudiante,
          estado: "presente" as EstadoKey,
        }));
        setMergedData(newMergedData);
      } else {
        // Attendance data exists, map it to students
        const newMergedData = estudiantes.map((estudiante: Estudiante) => {
          const asistenciaItem = asistenciaData.detalles.find(
            (item: AsistenciaDetalle) => item.estudianteId === estudiante.id
          );

          return {
            estudiante: estudiante,
            estado: asistenciaItem
              ? (asistenciaItem.estado as EstadoKey)
              : ("presente" as EstadoKey),
          };
        });
        setMergedData(newMergedData);
      }
    }
  }, [estudiantes, asistenciaData]);

  const handleEstadoChange = (estudianteId: string, newEstado: EstadoKey) => {
    setMergedData((prevData) =>
      prevData.map((item) =>
        item.estudiante.id === estudianteId
          ? { ...item, estado: newEstado }
          : item
      )
    );
  };

  const handleSaveAsistencia = async () => {
    const asistenciaDetalles = mergedData.map((item) => ({
      estudianteId: item.estudiante.id,
      estado: item.estado,
    }));

    saveMutation.mutate({
      aulaId: selectedAulaId,
      date: formattedDate,
      asistenciaDetalles: asistenciaDetalles,
    });
  };

  const handleAulaChange = (aulaId: string) => {
    setSelectedAulaId(aulaId);
    setMergedData([]);

    queryClient.invalidateQueries({ queryKey: ["estudiantesByAula", aulaId] });
    queryClient.invalidateQueries({
      queryKey: ["asistenciasByAulaAndDate", aulaId, formattedDate],
    });
  };

  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);

      const newFormattedDate = format(newDate, "yyyy-MM-dd");
      queryClient.invalidateQueries({
        queryKey: [
          "asistenciasByAulaAndDate",
          selectedAulaId,
          newFormattedDate,
        ],
      });
    }
  };

  if (aulasError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          No se pudieron cargar las aulas asignadas: {aulasError.message}
        </AlertDescription>
      </Alert>
    );
  }

  if (estudiantesError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          No se pudieron cargar los estudiantes: {estudiantesError.message}
        </AlertDescription>
      </Alert>
    );
  }

  if (asistenciaError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          No se pudieron cargar la asistencia: {asistenciaError.message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-6">
      <div className="flex items-center justify-between sm:flex-row flex-col">
        <Heading title="Asistencias" description="Listado de asistencias" />
      </div>
      <Separator className="mb-8" />
      <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start">
          <div className="space-y-2 w-full sm:w-auto">
            <div className="text-sm font-medium">Aula</div>
            <Select
              value={selectedAulaId}
              onValueChange={handleAulaChange}
              disabled={isAulasLoading}
            >
              <SelectTrigger className="w-full sm:w-[240px]">
                <SelectValue placeholder="Selecciona un aula">
                  {isAulasLoading ? (
                    <div className="flex items-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Cargando aulas...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <School className="mr-2 h-4 w-4" />
                      {selectedAulaId
                        ? aulas?.find((aula) => aula.aulaId === selectedAulaId)
                            ?.aula.nombre || "Selecciona un aula"
                        : "Selecciona un aula"}
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {aulas?.map((aula) => (
                  <SelectItem key={aula.aulaId} value={aula.aulaId}>
                    {aula?.aula.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 w-full sm:w-auto">
            <div className="text-sm font-medium">Fecha</div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full sm:w-[240px] justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(date, "PPP")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        {isEstudiantesLoading || isAsistenciaLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Cargando datos...</span>
          </div>
        ) : estudiantes && estudiantes.length === 0 ? (
          <Alert>
            <AlertTitle>No hay estudiantes</AlertTitle>
            <AlertDescription>
              No se encontraron estudiantes registrados en este aula.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <Table>
              <TableCaption>
                Lista de asistencia del {format(date, "PPP")}
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Estudiante</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mergedData.map((item) => (
                  <TableRow key={item.estudiante.id}>
                    <TableCell className="font-medium">
                      {item.estudiante.nombres} {item.estudiante.apellidos}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={item.estado}
                        onValueChange={(value) =>
                          handleEstadoChange(
                            item.estudiante.id,
                            value as EstadoKey
                          )
                        }
                      >
                        <SelectTrigger
                          className={`w-[180px] ${
                            asistenciaEstados[item.estado]?.color || ""
                          }`}
                        >
                          <SelectValue placeholder="Selecciona un estado" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(asistenciaEstados).map(
                            ([value, { label }]) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-6 flex justify-end">
              <Button onClick={handleSaveAsistencia} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Guardar asistencia
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AsistenciasPage;