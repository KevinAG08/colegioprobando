import { useParams } from "react-router-dom";
import { ProfesorForm } from "../components/form";
import { Heading } from "@/components/heading";
import { useProfesor } from "@/hooks/useProfesores";
import { LoadingComponent } from "@/components/loading-component";

const EditarProfesor = () => {
  const { profesorId } = useParams();
  const {
    data: profesorData,
    isLoading,
    error,
  } = useProfesor(profesorId || "");

  if (isLoading) {
    return <LoadingComponent />;
  }

  if (error || !profesorData) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-6">
        <Heading title="Error" description="Profesor no encontrado" />
      </div>
    );
  }

  return <ProfesorForm initialData={profesorData} />;
};

export default EditarProfesor;
