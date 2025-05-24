import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "react-router-dom";
import { EstudianteForm } from "../components/form";
import { useEstudiante } from "@/hooks/useEstudiantes";

const EditarEstudiante = () => {
  const { estudianteId } = useParams();
  const {
    data: estudianteData,
    isLoading,
    error,
  } = useEstudiante(estudianteId || "");

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-6 space-y-4">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-4 w-1/2" />
        <Separator className="my-8" />
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full md:col-span-2" />
            <Skeleton className="h-10 w-full md:col-span-2" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !estudianteData) {
    return <div>Estudiante no encontrado</div>;
  }

  return <EstudianteForm initialData={estudianteData} />;
};

export default EditarEstudiante;
