import { Heading } from "@/components/heading";
import { LoadingComponent } from "@/components/loading-component";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useEstudiante } from "@/hooks/useEstudiantes";
import { Undo2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const VerEstudianteProfesor = () => {
  const navigate = useNavigate();
  const { estudianteId } = useParams<{ estudianteId: string }>();
  const {
    data: estudiante,
    isLoading,
    error,
  } = useEstudiante(estudianteId || "");

  const calcularEdad = (
    // Updated function
    fechaNacimientoInput: Date | string | null | undefined
  ): string => {
    if (!fechaNacimientoInput) {
      return "No registrada";
    }

    // Ensure fechaNacimiento is a Date object
    // If fechaNacimientoInput is a string, attempt to parse it.
    // If fechaNacimientoInput is already a Date object, use it directly.
    const fechaNacimiento =
      typeof fechaNacimientoInput === "string"
        ? new Date(fechaNacimientoInput)
        : fechaNacimientoInput;

    // Validate the resulting Date object
    if (isNaN(fechaNacimiento.getTime())) {
      // This catches cases where the input string was unparseable,
      // or if the input Date object was somehow invalid.
      return "Formato de fecha incorrecto";
    }

    const hoy = new Date();

    // Compare date parts only to avoid issues with timezones or time of day.
    const hoyDateOnly = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate()
    );
    const fechaNacimientoDateOnly = new Date(
      fechaNacimiento.getFullYear(),
      fechaNacimiento.getMonth(),
      fechaNacimiento.getDate()
    );

    if (fechaNacimientoDateOnly > hoyDateOnly) {
      return "Fecha de nacimiento futura"; // More specific message for future dates
    }

    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const mes = hoy.getMonth() - fechaNacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
      edad--;
    }
    return `${edad} años`;
  };

  if (isLoading) {
    return <LoadingComponent />;
  }

  if (error || !estudiante) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-6">
        <Heading title="Error" description="Estudiante no encontrado" />
        <Button
          variant="outline"
          size="default"
          onClick={() => navigate("/profesor/estudiantes")}
          className="mt-4"
        >
          <Undo2 className="h-4 w-4 mr-2" />
          Volver a la lista
        </Button>
      </div>
    );
  }

  const aulaNombre = estudiante.aula?.nombre || "No asignada";
  const edad = calcularEdad(estudiante.fechaNacimiento);

  return (
    <div className="container mx-auto max-w-6xl px-4 py-6">
      <div className="flex items-center justify-between">
        <Heading
          title="Estudiante"
          description="Información registrada del estudiante"
        />
        <Button
          variant="outline"
          size="default"
          onClick={() => navigate("/profesor/estudiantes")}
        >
          <Undo2 className="h-4 w-4 mr-2" />
          Volver a la lista
        </Button>
      </div>
      <Separator className="my-8" />
      <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {[
            { label: "Nombres", value: estudiante.nombres },
            { label: "Apellidos", value: estudiante.apellidos },
            { label: "DNI", value: estudiante.dni },
            { label: "Correo electrónico", value: estudiante.email },
            { label: "Sexo", value: estudiante.sexo },
            {
              label: "Fecha de Nacimiento",
              value: estudiante.fechaNacimiento
                ? new Date(estudiante.fechaNacimiento).toLocaleDateString(
                    "es-ES",
                    {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      timeZone: "UTC",
                    }
                  )
                : "No registrada",
            },
            { label: "Edad", value: edad },
            {
              label: "Teléfono",
              value: estudiante.telefono || "No registrado",
            },
            {
              label: "Apoderado",
              value: estudiante.apoderado || "No registrado",
            },
            { label: "Aula", value: aulaNombre },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-sm font-medium text-muted-foreground">
                {item.label}
              </p>
              <p className="text-base">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VerEstudianteProfesor;
