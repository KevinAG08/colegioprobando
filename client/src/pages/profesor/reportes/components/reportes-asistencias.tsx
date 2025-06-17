import { useState, useEffect } from "react";
import { useProfesorAsistencias } from "@/hooks/useAsistencias";
import { useProfesorAulas } from "@/hooks/useAulas";
import { useEstudiantesByProfesor } from "@/hooks/useEstudiantes";
import {
  AsistenciaDetalle,
  Estudiante,
  Asistencia,
} from "@/types";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/heading";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileDown, Calendar as CalendarIcon, X, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  format,
  isWithinInterval,
  subDays,
  startOfDay,
  endOfDay,
} from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { LoadingComponent } from "@/components/loading-component";

const AsistenciasExportProfesor = () => {
  const { user } = useAuth();

  const { data: asistencias, isLoading: isAsistenciasLoading } =
    useProfesorAsistencias(user?.id);
  const { data: aulas, isLoading: isAulasLoading } = useProfesorAulas(user?.id);
  const { data: estudiantes, isLoading: isEstudiantesLoading } =
    useEstudiantesByProfesor(user?.id);

  const [selectedAulaId, setSelectedAulaId] = useState<string>("todos");
  const [selectedEstudianteId, setSelectedEstudianteId] =
    useState<string>("todos");
  const [selectedEstado, setSelectedEstado] = useState<string>("todos");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dateRange, setDateRange] = useState<string>("all");
  const [filteredEstudiantes, setFilteredEstudiantes] = useState<Estudiante[]>(
    []
  );
  const [filteredDetalles, setFilteredDetalles] = useState<any[]>([]); // eslint-disable-line
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  // Datos paginados para mostrar en la tabla
  const [paginatedDetalles, setPaginatedDetalles] = useState<any[]>([]); // eslint-disable-line
  const [totalPages, setTotalPages] = useState(0);

  const limpiarFiltros = () => {
    setSelectedAulaId("todos");
    setSelectedEstudianteId("todos");
    setSelectedEstado("todos");
    setDateRange("all");
    setSelectedDate(null);
    setCurrentPage(1); // Resetear a la primera página
  };

  // Estados disponibles
  const estadosDisponibles = [
    { value: "presente", label: "Presente" },
    { value: "falta", label: "Falta" },
    { value: "tardanza", label: "Tardanza" },
    { value: "falta_justificada", label: "Falta Justificada" },
    { value: "tardanza_justificada", label: "Tardanza Justificada" },
  ];


  // FUNCIÓN AGREGADA: Para manejar fechas sin problemas de zona horaria
  const formatearFechaSolo = (fechaString: string) => {
    const [year, month, day] = fechaString.split(" ")[0].split("-");
    const fecha = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return format(fecha, "dd/MM/yyyy", { locale: es });
  };

  // FUNCIÓN AGREGADA: Para crear objeto Date sin problemas de zona horaria
  const crearFechaSinZonaHoraria = (fechaString: string) => {
    const [year, month, day] = fechaString.split(" ")[0].split("-");
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  };

  useEffect(() => {
    if (!estudiantes) return;

    if (selectedAulaId === "todos") {
      setFilteredEstudiantes(estudiantes);
    } else {
      setFilteredEstudiantes(
        estudiantes.filter((e: Estudiante) => e.aulaId === selectedAulaId)
      );
    }
    setSelectedEstudianteId("todos");
  }, [selectedAulaId, estudiantes]);

  useEffect(() => {
    if (!asistencias) return;

    const detalles = asistencias.flatMap((asistencia: Asistencia) =>
      asistencia.detalles.map((detalle: AsistenciaDetalle) => ({
        ...detalle,
        fecha: asistencia.fecha,
        aula: asistencia.aula,
        estudiante: detalle.estudiante,
      }))
    );

    let filtered = [...detalles];

    if (selectedAulaId !== "todos") {
      filtered = filtered.filter(
        (det) => det.estudiante.aulaId === selectedAulaId
      );
    }

    if (selectedEstudianteId !== "todos") {
      filtered = filtered.filter(
        (det) => det.estudianteId === selectedEstudianteId
      );
    }

    if (selectedEstado !== "todos") {
      filtered = filtered.filter((det) => det.estado === selectedEstado);
    }

    if (dateRange !== "all") {
      const today = new Date();
      let startDate: Date;
      let endDate = endOfDay(today);

      switch (dateRange) {
        case "today":
          startDate = startOfDay(today);
          break;
        case "week":
          startDate = startOfDay(subDays(today, 7));
          break;
        case "month":
          startDate = startOfDay(subDays(today, 30));
          break;
        case "custom":
          if (selectedDate) {
            startDate = startOfDay(selectedDate);
            endDate = endOfDay(selectedDate);
          } else {
            startDate = new Date(0);
          }
          break;
        default:
          startDate = new Date(0);
      }

      filtered = filtered.filter((det) => {
        const fecha = crearFechaSinZonaHoraria(det.fecha); // CAMBIADO: Usar función helper
        return isWithinInterval(fecha, { start: startDate, end: endDate });
      });
    }

    // Ordenar por fecha más reciente primero
    filtered.sort((a, b) => {
      const fechaA = crearFechaSinZonaHoraria(a.fecha);
      const fechaB = crearFechaSinZonaHoraria(b.fecha);
      return fechaB.getTime() - fechaA.getTime();
    });

    setFilteredDetalles(filtered);
    setCurrentPage(1); // Resetear a la primera página cuando cambien los filtros
  }, [
    asistencias,
    selectedAulaId,
    selectedEstudianteId,
    selectedEstado,
    dateRange,
    selectedDate,
  ]);

  // Efecto para manejar la paginación
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginated = filteredDetalles.slice(startIndex, endIndex);
    
    setPaginatedDetalles(paginated);
    setTotalPages(Math.ceil(filteredDetalles.length / itemsPerPage));
  }, [filteredDetalles, currentPage]);

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "presente":
        return "bg-green-100 text-green-800";
      case "falta":
        return "bg-red-100 text-red-800";
      case "tardanza":
        return "bg-yellow-100 text-yellow-800";
      case "falta_justificada":
        return "bg-blue-100 text-blue-800";
      case "tardanza_justificada":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const exportToPDF = () => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();

    pdf.setFontSize(18);
    pdf.text("Informe de Asistencias", pageWidth / 2, 20, { align: "center" });
    pdf.setFontSize(11);

    const tableData = filteredDetalles.map((det) => [
      formatearFechaSolo(det.fecha), // LÍNEA CAMBIADA: Usar la función helper
      `${det.estudiante.nombres} ${det.estudiante.apellidos}`,
      det.aula?.nombre || "N/A",
      det.estado,
    ]);

    autoTable(pdf, {
      startY: 30,
      head: [["Fecha", "Estudiante", "Aula", "Estado"]],
      body: tableData,
    });

    pdf.save(`Informe_Asistencias_${format(new Date(), "yyyyMMdd_HHmm")}.pdf`);
  };

  
  // Funciones de navegación de páginas
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Generar números de páginas para mostrar
  const getPageNumbers = () => {
    const pageNumbers = [];
    const showPages = 5; // Mostrar máximo 5 números de página
    
    let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
    const endPage = Math.min(totalPages, startPage + showPages - 1);
    
    // Ajustar startPage si endPage es menor que showPages
    if (endPage - startPage + 1 < showPages) {
      startPage = Math.max(1, endPage - showPages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  };

  if (isAsistenciasLoading || isAulasLoading || isEstudiantesLoading)
    return <LoadingComponent />;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 md:p-8 pt-6">
        <div className="flex sm:flex-row flex-col md:items-center justify-between">
          <Heading
            title="Exportar Asistencias"
            description="Filtra y exporta el registro de asistencias"
          />
          <div className="flex gap-2 mt-[0.5rem] md:mt-0">
            <Button onClick={exportToPDF}>
              <FileDown className="mr-2 h-4 w-4" /> Exportar PDF
            </Button>
          </div>
        </div>
        <Separator />

        {/* Filtros */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h3 className="text-lg font-medium">Filtros</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={limpiarFiltros}
              className="w-fit"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Limpiar Filtros
            </Button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <div>
              <label className="text-sm font-medium">Aula</label>
              <Select value={selectedAulaId} onValueChange={setSelectedAulaId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un aula..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas</SelectItem>
                  {aulas?.map((aula) => (
                    <SelectItem key={aula.aulaId} value={aula.aulaId}>
                      {aula.aula.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Estudiante</label>
              <Select
                value={selectedEstudianteId}
                onValueChange={setSelectedEstudianteId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un estudiante..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  {filteredEstudiantes?.map((est) => (
                    <SelectItem key={est.id} value={est.id}>
                      {`${est.nombres} ${est.apellidos}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Estado</label>
              <Select value={selectedEstado} onValueChange={setSelectedEstado}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un estado..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  {estadosDisponibles.map((estado) => (
                    <SelectItem key={estado.value} value={estado.value}>
                      {estado.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Rango de Fecha</label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Rango de fecha" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="today">Hoy</SelectItem>
                  <SelectItem value="week">Últimos 7 días</SelectItem>
                  <SelectItem value="month">Últimos 30 días</SelectItem>
                  <SelectItem value="custom">Fecha específica</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {dateRange === "custom" && (
              <div>
                <label className="text-sm font-medium">Fecha específica</label>
                <div className="flex items-center">
                  <Popover
                    open={isCalendarOpen}
                    onOpenChange={setIsCalendarOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? (
                          format(selectedDate, "PPP", { locale: es })
                        ) : (
                          <span>Seleccionar fecha</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate || undefined} // This is correct: selected prop expects Date | undefined
                        onSelect={(dateValue: Date | undefined) => {
                          setSelectedDate(dateValue || null); // Convert undefined to null
                          setIsCalendarOpen(false); // Close popover on selection
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {selectedDate && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedDate(null)}
                      className="ml-2"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Información de resultados */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Mostrando {paginatedDetalles.length} de {filteredDetalles.length} registros
          </div>
          <div className="text-sm text-gray-600">
            Página {currentPage} de {totalPages}
          </div>
        </div>

        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Estudiante</TableHead>
                  <TableHead>Aula</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedDetalles.map((det) => (
                  <TableRow key={det.id}>
                    <TableCell>
                      {formatearFechaSolo(det.fecha)}
                    </TableCell>
                    <TableCell>{`${det.estudiante.nombres} ${det.estudiante.apellidos}`}</TableCell>
                    <TableCell>{det.aula?.nombre || "N/A"}</TableCell>
                    <TableCell>
                      <Badge className={getEstadoColor(det.estado)}>
                        {det.estado}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Controles de paginación */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 mt-4 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>

                <div className="flex space-x-1">
                  {getPageNumbers().map((pageNum) => (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => goToPage(pageNum)}
                      className="w-10"
                    >
                      {pageNum}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AsistenciasExportProfesor;
