import { useState, useEffect } from "react";
import { useIncidencias } from "@/hooks/useIncidencias";
import { useAulas } from "@/hooks/useAulas";
import { useEstudiantes } from "@/hooks/useEstudiantes";
import { Incidencia, Estudiante, Aula, IncidenciaDetalle } from "@/types";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/heading";
import { Separator } from "@/components/ui/separator";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileDown } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export const IncidenciasExport = () => {
  const { data: incidencias, isLoading: isIncidenciasLoading } = useIncidencias();
  const { data: aulas, isLoading: isAulasLoading } = useAulas();
  const { data: estudiantes, isLoading: isEstudiantesLoading } = useEstudiantes();

  const [selectedAulaId, setSelectedAulaId] = useState<string>("todos");
  const [selectedEstudianteId, setSelectedEstudianteId] = useState<string>("todos");
  const [filteredEstudiantes, setFilteredEstudiantes] = useState<Estudiante[]>([]);
  const [filteredIncidencias, setFilteredIncidencias] = useState<Incidencia[]>([]);

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
      filtered = filtered.filter(incidencia =>
        incidencia.detalles.some((detalle: IncidenciaDetalle) => detalle.estudiante.aulaId === selectedAulaId)
      );
    }

    // Filtrar por estudiante si se ha seleccionado uno
    if (selectedEstudianteId !== "todos") {
      filtered = filtered.filter(incidencia =>
        incidencia.detalles.some((detalle: IncidenciaDetalle) => detalle.estudiante.id === selectedEstudianteId)
      );
    }

    setFilteredIncidencias(filtered);
  }, [selectedAulaId, selectedEstudianteId, incidencias]);

  const handleAulaChange = (aulaId: string) => {
    setSelectedAulaId(aulaId);
  };

  const handleEstudianteChange = (estudianteId: string) => {
    setSelectedEstudianteId(estudianteId);
  };

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
      const aulaName = aulas?.find(a => a.id === selectedAulaId)?.nombre || selectedAulaId;
      filterText += `Aula: ${aulaName}`;
    } else {
      filterText += "Todas las aulas";
    }
    
    if (selectedEstudianteId !== "todos") {
      const estudiante = estudiantes?.find((e: Estudiante) => e.id === selectedEstudianteId);
      if (estudiante) {
        filterText += `, Estudiante: ${estudiante.nombres} ${estudiante.apellidos}`;
      }
    } else if (selectedAulaId !== "todos") {
      filterText += ", Todos los estudiantes del aula";
    } else {
      filterText += ", Todos los estudiantes";
    }
    
    pdf.text(filterText, 14, 30);
    pdf.text(`Fecha de generación: ${format(new Date(), "dd/MM/yyyy HH:mm", { locale: es })}`, 14, 37);
    
    // Formatear datos para la tabla
    const tableData = filteredIncidencias.map(incidencia => {
      let fechaFormateada = "N/A";
      
      if (incidencia.fecha) {
        const dateObject = new Date(incidencia.fecha);
        if (!isNaN(dateObject.getTime())) {
          fechaFormateada = format(dateObject, "dd/MM/yyyy HH:mm", { locale: es });
        }
      }
      
      // Obtener nombres de estudiantes involucrados
      const nombresEstudiantes = incidencia.detalles
        .map(detalle => `${detalle.estudiante.nombres} ${detalle.estudiante.apellidos}`)
        .join(", ");
      
      // Obtener nombre del aula
      const aulaNombre = incidencia.detalles.length > 0
        ? incidencia.detalles[0].estudiante.aula.nombre
        : "N/A";
      
      // Acortar textos largos para la vista previa en tabla
      const acortarTexto = (texto: string, maxLength: number) => {
        if (!texto) return "";
        return texto.length > maxLength ? texto.substring(0, maxLength) + "..." : texto;
      };
      
      return [
        fechaFormateada,
        incidencia.lugar || "N/A",
        incidencia.tipoIncidencia || "N/A",
        nombresEstudiantes,
        aulaNombre,
        acortarTexto(incidencia.descripcion || "", 50),
        acortarTexto(incidencia.medidasAdoptadas || "", 50)
      ];
    });
    
    // Configuración de la tabla
    autoTable(pdf, {
      startY: 45,
      head: [['Fecha', 'Lugar', 'Tipo', 'Estudiantes', 'Aula', 'Descripción', 'Medidas Adoptadas']],
      body: tableData,
      theme: 'striped',
      styles: { overflow: 'linebreak', cellPadding: 3 },
      columnStyles: {
        5: { cellWidth: 40 }, // Descripción
        6: { cellWidth: 40 }  // Medidas Adoptadas
      },
      didDrawPage: function(data) {
        // Agregar número de página
        pdf.setFontSize(10);
        pdf.text(
          `Página ${data.pageNumber} de ${pdf.getNumberOfPages()}`,
          pageWidth - 20, 
          pdf.internal.pageSize.getHeight() - 10,
          { align: "right" }
        );
      }
    });
    
    // Para cada incidencia, agregar una página detallada
    filteredIncidencias.forEach((incidencia, index) => {
      pdf.addPage();
      
      let fechaFormateada = "N/A";
      if (incidencia.fecha) {
        const dateObject = new Date(incidencia.fecha);
        if (!isNaN(dateObject.getTime())) {
          fechaFormateada = format(dateObject, "dd/MM/yyyy HH:mm", { locale: es });
        }
      }
      
      // Título de la incidencia
      pdf.setFontSize(14);
      pdf.text(`Incidencia #${index + 1}`, pageWidth / 2, 20, { align: "center" });
      
      // Información básica
      pdf.setFontSize(11);
      pdf.text(`Fecha: ${fechaFormateada}`, 14, 30);
      pdf.text(`Lugar: ${incidencia.lugar || "N/A"}`, 14, 37);
      pdf.text(`Tipo: ${incidencia.tipoIncidencia || "N/A"}`, 14, 44);
      
      // Estudiantes involucrados
      const nombresEstudiantes = incidencia.detalles
        .map(detalle => `${detalle.estudiante.nombres} ${detalle.estudiante.apellidos}`)
        .join(", ");
      
      pdf.text(`Estudiantes: ${nombresEstudiantes}`, 14, 51);
      
      // Aula
      const aulaNombre = incidencia.detalles.length > 0
        ? incidencia.detalles[0].estudiante.aula.nombre
        : "N/A";
      
      pdf.text(`Aula: ${aulaNombre}`, 14, 58);
      
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
      const descriptionEndY = 78 + (splitDescription.length * 5);
      
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
    return <div>Cargando datos...</div>;
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <Heading 
            title="Exportar Incidencias" 
            description="Filtra y exporta incidencias a PDF"
          />
          <div className="flex gap-2">
            <Button onClick={exportToPDF} className="print:hidden">
              <FileDown className="mr-2 h-4 w-4" />
              Exportar a PDF
            </Button>
          </div>
        </div>
        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:hidden">
          <div>
            <label className="text-sm font-medium">Filtrar por Aula</label>
            <Select
              value={selectedAulaId}
              onValueChange={handleAulaChange}
              disabled={isAulasLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione un aula..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas las aulas</SelectItem>
                {aulas?.map((aula: Aula) => (
                  <SelectItem key={aula.id} value={aula.id}>
                    {aula.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Filtrar por Estudiante</label>
            <Select
              value={selectedEstudianteId}
              onValueChange={handleEstudianteChange}
              disabled={isEstudiantesLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione un estudiante..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estudiantes</SelectItem>
                {filteredEstudiantes?.map((estudiante: Estudiante) => (
                  <SelectItem key={estudiante.id} value={estudiante.id}>
                    {`${estudiante.nombres} ${estudiante.apellidos}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="print-content">
          {filteredIncidencias.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No hay incidencias que coincidan con los filtros seleccionados.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredIncidencias.map((incidencia) => {
                let fechaFormateada = "N/A";
                let horaFormateada = "N/A";

                if (incidencia.fecha) {
                  const dateObject = new Date(incidencia.fecha);
                  if (!isNaN(dateObject.getTime())) {
                    fechaFormateada = format(dateObject, "dd/MM/yyyy", { locale: es });
                    horaFormateada = format(dateObject, "HH:mm", { locale: es });
                  }
                }

                return (
                  <Card key={incidencia.id} className="overflow-hidden">
                    <CardHeader className="bg-muted/40">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{incidencia.tipoIncidencia || "Sin tipo"}</CardTitle>
                          <CardDescription>
                            {fechaFormateada} a las {horaFormateada} - {incidencia.lugar || "Sin ubicación"}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-medium">Aula:</span>
                          <p className="text-sm">
                            {incidencia.detalles.length > 0
                              ? incidencia.detalles[0].estudiante.aula.nombre
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="mb-4">
                        <h4 className="text-sm font-medium mb-1">Estudiantes involucrados:</h4>
                        <p className="text-sm">
                          {incidencia.detalles
                            .map(detalle => `${detalle.estudiante.nombres} ${detalle.estudiante.apellidos}`)
                            .join(", ")}
                        </p>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="text-sm font-medium mb-1">Descripción:</h4>
                        <p className="text-sm whitespace-pre-wrap">{incidencia.descripcion || "Sin descripción"}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-1">Medidas adoptadas:</h4>
                        <p className="text-sm whitespace-pre-wrap">{incidencia.medidasAdoptadas || "Sin medidas registradas"}</p>
                      </div>
                      
                      {incidencia.user && (
                        <div className="mt-4 pt-2 border-t text-right">
                          <p className="text-xs text-muted-foreground">
                            Registrado por: {incidencia.user.nombres} {incidencia.user.apellidos}
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

export default IncidenciasExport;