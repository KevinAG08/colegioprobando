import { Heading } from "@/components/heading";
import { LoadingComponent } from "@/components/loading-component";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useProfesor } from "@/hooks/useProfesores";
import { AulaProfesor } from "@/types";
import { Undo2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const VerProfesor = () => {
  const navigate = useNavigate();
  const { profesorId } = useParams();
  const { data: profesor, isLoading, error } = useProfesor(profesorId || "");

  if (isLoading) {
    return <LoadingComponent />;
  }

  if (error || !profesor) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-6">
        <Heading title="Error" description="Profesor no encontrado" />
      </div>
    );
  }

  const aulaNombres =
    profesor.aulas?.map((aula: AulaProfesor) => aula.aula.nombre) || [];

  return (
    <div className="container mx-auto max-w-6xl px-4 py-6">
      <div className="flex items-center justify-between">
        <Heading
          title="Profesor"
          description="Información registrada del profesor"
        />
        <Button
          variant="outline"
          size="default"
          onClick={() => navigate("/admin/profesores")}
        >
          <Undo2 className="h-4 w-4" />
          Volver a la lista
        </Button>
      </div>
      <Separator className="my-8" />
      <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Nombres</p>
            <p className="text-base">{profesor.nombres}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Apellidos
            </p>
            <p className="text-base">{profesor.apellidos}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Correo electrónico
            </p>
            <p className="text-base">{profesor.email}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">DNI</p>
            <p className="text-base">{profesor.dni}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Teléfono
            </p>
            <p className="text-base">{profesor.telefono || "No registrado"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Dirección
            </p>
            <p className="text-base">{profesor.direccion || "No registrada"}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Aulas Asignadas
            </p>
            {aulaNombres.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {aulaNombres.map((nombre: string, index: number) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="px-3 py-1.5 text-sm"
                  >
                    {nombre}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Ninguna aula asignada
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerProfesor;
