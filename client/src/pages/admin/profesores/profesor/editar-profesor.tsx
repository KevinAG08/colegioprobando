import { useParams } from "react-router-dom";
import { ProfesorForm } from "../components/form";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/heading";
import { useProfesor } from "@/hooks/useProfesores";

const EditarProfesor = () => {
  const { profesorId } = useParams();
  const {
    data: profesorData,
    isLoading,
    error,
  } = useProfesor(profesorId || "");

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
