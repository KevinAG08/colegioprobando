import { useParams } from "react-router-dom";
import { IncidenciaForm } from "../components/form";
import { useIncidencia } from "@/hooks/useIncidencias";
import { LoadingComponent } from "@/components/loading-component";

const EditarIncidencia = () => {
  const { incidenciaId } = useParams();
  const {
    data: incidenciaData,
    isLoading,
    error,
  } = useIncidencia(incidenciaId || "");

  if (isLoading) {
    return <LoadingComponent />;
  }

  if (error || !incidenciaData) {
    return <div>Incidencia no encontrada</div>;
  }

  return <IncidenciaForm initialData={incidenciaData} />;
};

export default EditarIncidencia;
