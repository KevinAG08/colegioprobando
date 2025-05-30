import { useParams } from "react-router-dom";
import { EstudianteForm } from "../components/form";
import { useEstudiante } from "@/hooks/useEstudiantes";
import { LoadingComponent } from "@/components/loading-component";

const EditarEstudiante = () => {
  const { estudianteId } = useParams();
  const {
    data: estudianteData,
    isLoading,
    error,
  } = useEstudiante(estudianteId || "");

  if (isLoading) {
    return <LoadingComponent />;
  }

  if (error || !estudianteData) {
    return <div>Estudiante no encontrado</div>;
  }

  return <EstudianteForm initialData={estudianteData} />;
};

export default EditarEstudiante;
