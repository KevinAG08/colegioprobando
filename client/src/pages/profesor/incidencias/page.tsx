import { IncidenciaColumn } from "./components/columns";
import { Incidencia } from "@/types";
import { IncidenciaClient } from "./components/client";
import { useIncidenciasByProfesor } from "@/hooks/useIncidencias";
import { useProfesorAulas } from "@/hooks/useAulas";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { LoadingComponent } from "@/components/loading-component";

const IncidenciasPageProfesor = () => {
  const { user } = useAuth();

  const { data: aulas, isLoading: isAulasLoading } = useProfesorAulas(user?.id);
  const {
    data: incidencias,
    isLoading,
    error,
  } = useIncidenciasByProfesor(user?.id);

  const [selectedAulaId, setSelectedAulaId] = useState<string>("todos");

  const filteredIncidencias = incidencias?.filter((incidencia: Incidencia) => {
    if (!selectedAulaId || selectedAulaId === "todos") {
      return true;
    }
    return incidencia?.detalles.some(
      (detalle) => detalle.estudiante.aulaId === selectedAulaId
    );
  });

  const formattedIncidencias: IncidenciaColumn[] = filteredIncidencias?.map(
    (incidencia: Incidencia) => {
      let fechaFormateada = "N/A";
      let horaFormateada = "N/A";
      let fechaOriginal = null;

      if (incidencia.fecha) {
        // Primero, convierte la cadena incidencia.fecha a un objeto Date
        const dateObject = new Date(incidencia.fecha);
        // Opcional: Verificar si la fecha es válida antes de formatear
        if (!isNaN(dateObject.getTime())) {
          fechaOriginal = incidencia.fecha;

          fechaFormateada = dateObject.toLocaleDateString("es-ES", {
            // Corregido "es-Es" a "es-ES" para el código de idioma estándar
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            timeZone: "UTC", // Mantener UTC si la fecha original es UTC y quieres mostrarla como tal
          });
          horaFormateada = dateObject.toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
            timeZone: "UTC",
          });
        } else {
          console.warn("Fecha inválida encontrada:", incidencia.fecha);
          // Mantener "N/A" o manejar como prefieras una fecha inválida
        }
      }
      return {
        id: incidencia.id || "",
        fecha: fechaOriginal || "",
        fechaFormateada: fechaFormateada || "",
        hora: horaFormateada || "",
        lugar: incidencia.lugar || "",
        tipoIncidencia: incidencia.tipoIncidencia || "",
        descripcion: incidencia.descripcion || "",
        medidasAdoptadas: incidencia.medidasAdoptadas || "",
        userFullName: incidencia.user
          ? `${incidencia.user.nombres || ""} ${
              incidencia.user.apellidos || ""
            }`.trim()
          : "",
        estudiantes:
          incidencia.detalles?.map(
            (detalle) =>
              `${detalle.estudiante.nombres} ${detalle.estudiante.apellidos}`
          ) || [],
        aulaId:
          incidencia.detalles.map((detalle) => detalle.estudiante.aulaId)[0] ||
          "",
        aulaNombre: incidencia.detalles.map(
          (detalle) => detalle.estudiante.aula.nombre
        ),
      };
    }
  );

  if (isLoading || isAulasLoading) {
    return <LoadingComponent />;
  }

  if (error) {
    return (
      <div>Error al cargar las incidencias: {(error as Error).message}</div>
    );
  }

  if (aulas?.length === 0 && !isAulasLoading) {
    return (
      <div>No hay aulas disponibles. Por favor, crea una aula primero.</div>
    );
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 md:p-8 pt-6">
        <IncidenciaClient
          data={formattedIncidencias}
          aulas={aulas}
          selectedAulaId={selectedAulaId}
          onAulaChange={setSelectedAulaId}
          isLoadingAulas={isAulasLoading}
        />
      </div>
    </div>
  );
};

export default IncidenciasPageProfesor;
