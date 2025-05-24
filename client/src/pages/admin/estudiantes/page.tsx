import { useEffect, useState } from "react";
import { EstudianteColumn } from "./components/columns";
import { Estudiante } from "@/types";
import { format } from "date-fns";
import { EstudianteClient } from "./components/client";
import { useAulas } from "@/hooks/useAulas";
import { useEstudiantes } from "@/hooks/useEstudiantes";
import { useLocation } from "react-router-dom";

const EstudiantesPage = () => {
  const { data: aulas, isLoading: isAulasLoading } = useAulas();
  const { data: estudiantes, isLoading, error } = useEstudiantes();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const aulaIdFromUrl = queryParams.get("aulaId");

  const [selectedAulaId, setSelectedAulaId] = useState<string>("");

  useEffect(() => {
    if (aulaIdFromUrl) {
      setSelectedAulaId(aulaIdFromUrl);
    }
    else if (aulas && aulas?.length > 0 && !selectedAulaId) {
      setSelectedAulaId(aulas[0]?.id);
    }
  }, [aulas, selectedAulaId, aulaIdFromUrl])

  const filteredEstudiantes = estudiantes?.filter((estudiante: Estudiante) => {
    if (!selectedAulaId || selectedAulaId === "todos") {
      return true;
    }
    return estudiante?.aula?.id === selectedAulaId;
  });

  const formattedEstudiantes: EstudianteColumn[] = filteredEstudiantes?.map(
    (estudiante: Estudiante) => ({
      id: estudiante.id || "",
      nombres: estudiante.nombres || "",
      apellidos: estudiante.apellidos || "",
      email: estudiante.email || "",
      dni: estudiante.dni || "",
      telefono: estudiante.telefono || "",
      apoderado: estudiante.apoderado || "",
      sexo: estudiante.sexo || "",
      fechaNacimiento: estudiante.fechaNacimiento
        ? format(new Date(estudiante.fechaNacimiento), "dd/MM/yyyy")
        : "N/A",
      aula: estudiante.aula?.nombre || "",
    })
  );

  if (isLoading || isAulasLoading) {
    return <div>Cargando datos...</div>;
  }

  if (error) {
    return <div>Error al cargar los estudiantes: {(error as Error).message}</div>;
  }

  if (aulas?.length === 0 && !isAulasLoading) {
    return (
      <div>No hay aulas disponibles. Por favor, crea una aula primero.</div>
    );
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <EstudianteClient
          data={formattedEstudiantes}
          aulas={aulas}
          selectedAulaId={selectedAulaId}
          onAulaChange={setSelectedAulaId}
          isLoadingAulas={isAulasLoading}
        />
      </div>
    </div>
  );
};

export default EstudiantesPage;
