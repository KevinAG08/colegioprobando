import { useParams } from "react-router-dom";
import { IncidenciaFormProfesor } from "../components/form";
import { useIncidencia } from "@/hooks/useIncidencias";

const EditarIncidenciaProfesor = () => {
  const { incidenciaId } = useParams();
  const {
    data: incidenciaData,
    isLoading,
    error,
  } = useIncidencia(incidenciaId || "");

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (error || !incidenciaData) {
    return <div>Incidencia no encontrada</div>;
  }

  return <IncidenciaFormProfesor initialData={incidenciaData} />;
};

export default EditarIncidenciaProfesor;
