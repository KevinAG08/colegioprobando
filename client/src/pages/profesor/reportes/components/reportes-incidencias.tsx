import { useState, useEffect } from "react";
import { useIncidenciasByProfesor } from "@/hooks/useIncidencias";
import { useProfesorAulas } from "@/hooks/useAulas";
import { useEstudiantesByProfesor } from "@/hooks/useEstudiantes";
import { Incidencia, Estudiante, IncidenciaDetalle } from "@/types";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/heading";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, FileDown, RotateCcw, X } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  endOfDay,
  format,
  isWithinInterval,
  startOfDay,
  subDays,
} from "date-fns";
import { es } from "date-fns/locale";
import { useAuth } from "@/hooks/useAuth";
import { LoadingComponent } from "@/components/loading-component";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

export const IncidenciasExportProfesor = () => {
  const { user } = useAuth();

  const { data: incidencias, isLoading: isIncidenciasLoading } =
    useIncidenciasByProfesor(user?.id);
  const { data: aulas, isLoading: isAulasLoading } = useProfesorAulas(user?.id);
  const { data: estudiantes, isLoading: isEstudiantesLoading } =
    useEstudiantesByProfesor(user?.id);

  const [selectedAulaId, setSelectedAulaId] = useState<string>("todos");
  const [selectedEstudianteId, setSelectedEstudianteId] =
    useState<string>("todos");
  const [selectedTipoIncidencia, setSelectedTipoIncidencia] =
    useState<string>("todos");
  const [selectedLugar, setSelectedLugar] = useState<string>("todos");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dateRange, setDateRange] = useState<string>("all");
  const [filteredEstudiantes, setFilteredEstudiantes] = useState<Estudiante[]>(
    []
  );
  const [filteredIncidencias, setFilteredIncidencias] = useState<Incidencia[]>(
    []
  );
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);

  const limpiarFiltros = () => {
    setSelectedAulaId("todos");
    setSelectedEstudianteId("todos");
    setSelectedTipoIncidencia("todos");
    setSelectedLugar("todos");
    setSelectedDate(null);
    setDateRange("all");
  };

  // FUNCIÓN AGREGADA: Para crear objeto Date sin problemas de zona horaria
  const crearFechaSinZonaHoraria = (fechaString: string) => {
    const [year, month, day] = fechaString.split(" ")[0].split("-");
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  };

  // FUNCIÓN AGREGADA: Para obtener todas las aulas de una incidencia
  const obtenerAulasDeIncidencia = (incidencia: Incidencia) => {
    const aulas = new Set();
    incidencia.detalles.forEach((detalle: IncidenciaDetalle) => {
      aulas.add(detalle.estudiante.aula.nombre);
    });
    return Array.from(aulas).join(", ");
  };

  // Efecto para filtrar estudiantes basados en el aula seleccionada
  useEffect(() => {
    if (!estudiantes) return;

    if (selectedAulaId === "todos") {
      setFilteredEstudiantes(estudiantes);
    } else {
      const estudiantesDeAula = estudiantes.filter(
        (estudiante: Estudiante) => estudiante.aulaId === selectedAulaId
      );
      setFilteredEstudiantes(estudiantesDeAula);
    }
    // Reset estudiante selection when aula changes
    setSelectedEstudianteId("todos");
  }, [selectedAulaId, estudiantes]);

  // Efecto para filtrar incidencias basadas en aula y/o estudiante seleccionados
  useEffect(() => {
    if (!incidencias) return;

    let filtered = [...incidencias];

    // Filtrar por aula si se ha seleccionado una
    if (selectedAulaId !== "todos") {
      filtered = filtered.filter((incidencia) =>
        incidencia.detalles.some(
          (detalle: IncidenciaDetalle) =>
            detalle.estudiante.aulaId === selectedAulaId
        )
      );
    }

    // Filtrar por estudiante si se ha seleccionado uno
    if (selectedEstudianteId !== "todos") {
      filtered = filtered.filter((incidencia) =>
        incidencia.detalles.some(
          (detalle: IncidenciaDetalle) =>
            detalle.estudiante.id === selectedEstudianteId
        )
      );
    }

    if (selectedTipoIncidencia !== "todos") {
      filtered = filtered.filter(
        (incidencia) => incidencia.tipoIncidencia === selectedTipoIncidencia
      );
    }

    if (selectedLugar !== "todos") {
      filtered = filtered.filter(
        (incidencia) => incidencia.lugar === selectedLugar
      );
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
    })

    setFilteredIncidencias(filtered);
  }, [
    dateRange,
    selectedDate,
    selectedTipoIncidencia,
    selectedLugar,
    selectedAulaId,
    selectedEstudianteId,
    incidencias,
  ]);

  const exportToPDF = () => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();

    // Título del documento
    pdf.setFontSize(18);
    pdf.text("Informe de Incidencias", pageWidth / 2, 20, { align: "center" });

    // Información de filtros aplicados
    pdf.setFontSize(11);
    let filterText = "Filtros aplicados: ";

    if (selectedAulaId !== "todos") {
      const aulaName =
        aulas?.find((a) => a.id === selectedAulaId)?.aula.id || selectedAulaId;
      filterText += `Aula: ${aulaName}`;
    } else {
      filterText += "Todas las aulas";
    }

    if (selectedEstudianteId !== "todos") {
      const estudiante = estudiantes?.find(
        (e: Estudiante) => e.id === selectedEstudianteId
      );
      if (estudiante) {
        filterText += `, Estudiante: ${estudiante.nombres} ${estudiante.apellidos}`;
      }
    } else if (selectedAulaId !== "todos") {
      filterText += ", Todos los estudiantes del aula";
    } else {
      filterText += ", Todos los estudiantes";
    }

    pdf.text(filterText, 14, 30);
    pdf.text(
      `Fecha de generación: ${format(new Date(), "dd/MM/yyyy HH:mm", {
        locale: es,
      })}`,
      14,
      37
    );

    // Formatear datos para la tabla
    const tableData = filteredIncidencias.map((incidencia) => {
      let fechaFormateada = "N/A";

      if (incidencia.fecha) {
        const dateObject = new Date(incidencia.fecha);
        if (!isNaN(dateObject.getTime())) {
          fechaFormateada = dateObject.toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            timeZone: "UTC",
          });
          fechaFormateada += fechaFormateada += " a las ";
          fechaFormateada += dateObject.toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
            timeZone: "UTC",
          });
        }
      }

      // Obtener nombres de estudiantes involucrados
      const nombresEstudiantes = incidencia.detalles
        .map(
          (detalle) =>
            `${detalle.estudiante.nombres} ${detalle.estudiante.apellidos}`
        )
        .join(", ");

      // CAMBIO: Obtener todas las aulas involucradas
      const aulasNombres = obtenerAulasDeIncidencia(incidencia);

      // Acortar textos largos para la vista previa en tabla
      const acortarTexto = (texto: string, maxLength: number) => {
        if (!texto) return "";
        return texto.length > maxLength
          ? texto.substring(0, maxLength) + "..."
          : texto;
      };

      return [
        fechaFormateada,
        incidencia.lugar || "N/A",
        incidencia.tipoIncidencia || "N/A",
        nombresEstudiantes,
        aulasNombres,
        acortarTexto(incidencia.descripcion || "", 20),
        acortarTexto(incidencia.medidasAdoptadas || "", 20),
      ];
    });

    // Configuración de la tabla
    autoTable(pdf, {
      startY: 45,
      head: [
        [
          "Fecha",
          "Lugar",
          "Tipo",
          "Estudiantes",
          "Aula",
          "Descripción",
          "Medidas Adoptadas",
        ],
      ],
      body: tableData,
      theme: "striped",
      styles: { overflow: "linebreak", cellPadding: 3 },
      columnStyles: {
        4: { cellWidth: 16 }, // Aulas
        5: { cellWidth: 20 }, // Descripción
        6: { cellWidth: 20 }, // Medidas Adoptadas
      },
      didDrawPage: function (data) {
        // Agregar número de página
        pdf.setFontSize(10);
        pdf.text(
          `Página ${data.pageNumber} de ${pdf.getNumberOfPages()}`,
          pageWidth - 20,
          pdf.internal.pageSize.getHeight() - 10,
          { align: "right" }
        );
      },
    });

    // Para cada incidencia, agregar una página detallada
    filteredIncidencias.forEach((incidencia, index) => {
      pdf.addPage();

      let fechaFormateada = "N/A";
      if (incidencia.fecha) {
        const dateObject = new Date(incidencia.fecha);
        if (!isNaN(dateObject.getTime())) {
          fechaFormateada = dateObject.toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            timeZone: "UTC",
          });
          fechaFormateada += " a las ";
          fechaFormateada += dateObject.toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
            timeZone: "UTC",
          });
        }
      }

      // Título de la incidencia
      pdf.setFontSize(14);
      pdf.text(`Incidencia #${index + 1}`, pageWidth / 2, 20, {
        align: "center",
      });

      // Información básica
      pdf.setFontSize(11);
      pdf.text(`Fecha: ${fechaFormateada}`, 14, 30);
      pdf.text(`Lugar: ${incidencia.lugar || "N/A"}`, 14, 37);
      pdf.text(`Tipo: ${incidencia.tipoIncidencia || "N/A"}`, 14, 44);

      // Estudiantes involucrados
      const nombresEstudiantes = incidencia.detalles
        .map(
          (detalle) =>
            `${detalle.estudiante.nombres} ${detalle.estudiante.apellidos}`
        )
        .join(", ");

      pdf.text(`Estudiantes: ${nombresEstudiantes}`, 14, 51);

      // CAMBIO: Mostrar todas las aulas
      const aulasNombres = obtenerAulasDeIncidencia(incidencia);
      pdf.text(`Aulas: ${aulasNombres}`, 14, 58);

      // Descripción completa (texto largo)
      pdf.setFontSize(12);
      pdf.text("Descripción:", 14, 70);

      // Manejar texto largo con saltos de línea automáticos
      const splitDescription = pdf.splitTextToSize(
        incidencia.descripcion || "No hay descripción disponible",
        pageWidth - 28
      );

      pdf.setFontSize(10);
      pdf.text(splitDescription, 14, 78);

      // Calcular posición Y después de la descripción
      const descriptionEndY = 78 + splitDescription.length * 5;

      // Medidas adoptadas (texto largo)
      pdf.setFontSize(12);
      pdf.text("Medidas Adoptadas:", 14, descriptionEndY + 10);

      const splitMedidas = pdf.splitTextToSize(
        incidencia.medidasAdoptadas || "No hay medidas registradas",
        pageWidth - 28
      );

      pdf.setFontSize(10);
      pdf.text(splitMedidas, 14, descriptionEndY + 18);

      // Agregar pie de página en cada página detallada
      pdf.setFontSize(10);
      pdf.text(
        `Página ${pdf.getNumberOfPages()} de ${filteredIncidencias.length + 1}`,
        pageWidth - 20,
        pdf.internal.pageSize.getHeight() - 10,
        { align: "right" }
      );
    });

    // Guardar el PDF
    pdf.save(`Informe_Incidencias_${format(new Date(), "yyyyMMdd_HHmm")}.pdf`);
  };

  if (isIncidenciasLoading || isAulasLoading || isEstudiantesLoading) {
    return <LoadingComponent />;
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 md:p-8 pt-6">
        <div className="flex sm:flex-row flex-col md:items-center justify-between">
          <Heading
            title="Exportar Incidencias"
            description="Filtra y exporta incidencias a PDF"
          />
          <div className="flex gap-2 mt-[0.5rem] md:mt-0">
            <Button onClick={exportToPDF} className="print:hidden">
              <FileDown className="mr-2 h-4 w-4" />
              Exportar a PDF
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
              Limpiar filtros
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
              <label className="text-sm font-medium">Tipo de Incidencia</label>
              <Select
                value={selectedTipoIncidencia}
                onValueChange={setSelectedTipoIncidencia}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un tipo..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="Inasistencia">Inasistencia</SelectItem>
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
            </div>

            <div>
              <label className="text-sm font-medium">Lugar</label>
              <Select value={selectedLugar} onValueChange={setSelectedLugar}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un lugar..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="En el aula">En el aula</SelectItem>
                  <SelectItem value="En el patio">En el patio</SelectItem>
                  <SelectItem value="En los alrededores">
                    En los alrededores
                  </SelectItem>
                  <SelectItem value="En otro lugar">En otro lugar</SelectItem>
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

        <div className="print-content">
          {filteredIncidencias.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No hay incidencias que coincidan con los filtros seleccionados.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredIncidencias.map((incidencia) => {
                let fechaFormateada = "N/A";
                let horaFormateada = "N/A";

                if (incidencia.fecha) {
                  const dateObject = new Date(incidencia.fecha);
                  if (!isNaN(dateObject.getTime())) {
                    fechaFormateada = dateObject.toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      timeZone: "UTC",
                    });
                    horaFormateada = dateObject.toLocaleTimeString("es-ES", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                      timeZone: "UTC",
                    });
                  }
                }

                return (
                  <Card key={incidencia.id} className="overflow-hidden">
                    <CardHeader className="bg-muted/40">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">
                            {incidencia.tipoIncidencia || "Sin tipo"}
                          </CardTitle>
                          <CardDescription>
                            {fechaFormateada} a las {horaFormateada} -{" "}
                            {incidencia.lugar || "Sin ubicación"}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-medium">Aulas:</span>
                          <p className="text-sm">
                            {obtenerAulasDeIncidencia(incidencia)}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="mb-4">
                        <h4 className="text-sm font-medium mb-1">
                          Estudiantes involucrados:
                        </h4>
                        <p className="text-sm">
                          {incidencia.detalles
                            .map(
                              (detalle) =>
                                `${detalle.estudiante.nombres} ${detalle.estudiante.apellidos}`
                            )
                            .join(", ")}
                        </p>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-sm font-medium mb-1">
                          Descripción:
                        </h4>
                        <p className="text-sm whitespace-pre-wrap">
                          {incidencia.descripcion || "Sin descripción"}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-1">
                          Medidas adoptadas:
                        </h4>
                        <p className="text-sm whitespace-pre-wrap">
                          {incidencia.medidasAdoptadas ||
                            "Sin medidas registradas"}
                        </p>
                      </div>

                      {incidencia.user && (
                        <div className="mt-4 pt-2 border-t text-right">
                          <p className="text-xs text-muted-foreground">
                            Registrado por: {incidencia.user.nombres}{" "}
                            {incidencia.user.apellidos}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IncidenciasExportProfesor;
