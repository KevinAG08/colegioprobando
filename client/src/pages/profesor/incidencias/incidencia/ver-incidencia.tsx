import { Heading } from "@/components/heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useIncidencia } from "@/hooks/useIncidencias";
import { Estudiante, IncidenciaDetalle } from "@/types";
import { Undo2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const VerIncidenciaProfesor = () => {
  const navigate = useNavigate();
  const { incidenciaId } = useParams<{ incidenciaId: string }>();
  const {
    data: incidencia,
    isLoading,
    error,
  } = useIncidencia(incidenciaId || "");

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    console.error("Error fetching incidencia:", error);
    return <div>Error al cargar la incidencia.</div>;
  }

  if (!incidencia) {
    return <div>Incidencia no encontrada</div>;
  }

  const estudiantesInvolucrados = incidencia.detalles.map(
    (detalle: IncidenciaDetalle) => {
      const estudiante = detalle.estudiante;
      return {
        ...estudiante,
      };
    }
  );

  return (
    <div className="container mx-auto max-w-6xl px-4 py-6">
      <div className="flex items-center justify-between">
        <Heading
          title="Incidencia"
          description="Información registrada de la incidencia"
        />
        <Button
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Fecha y Hora
            </p>
            <p className="text-base">
              {new Date(incidencia.fecha).toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                timeZone: "UTC"
              })}{" "} a las {" "}
              {new Date(incidencia.fecha).toLocaleTimeString("es-ES", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
                timeZone: "UTC"
              })}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Lugar</p>
            <p className="text-base">{incidencia.lugar}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Tipo de Incidencia
            </p>
            <p className="text-base">{incidencia.tipoIncidencia}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Descripción
            </p>
            <p className="text-base">{incidencia.descripcion}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Medidas Adoptadas
            </p>
            <p className="text-base">{incidencia.medidasAdoptadas}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Estudiantes involucrados
            </p>
            {estudiantesInvolucrados.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {estudiantesInvolucrados.map((estudiante: Estudiante) => (
                  <Badge
                    key={estudiante.id}
                    variant="secondary"
                    className="px-3 py-1.5 text-sm"
                  >
                    {estudiante.nombres} {estudiante.apellidos} -{" "}
                    {estudiante.aula.nombre}
                  </Badge>
                ))}{" "}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Sin estudiantes involucrados
              </p>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Reportado por
            </p>
            <p className="text-base">
              {incidencia.user.nombres} {incidencia.user.apellidos}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerIncidenciaProfesor;
