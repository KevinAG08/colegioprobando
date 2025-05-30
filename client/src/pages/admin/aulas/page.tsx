import { useAulas } from "@/hooks/useAulas";
import { AulaColumn } from "./components/columns";
import { Aula } from "@/types";
import { AulaClient } from "./components/client";
import { LoadingComponent } from "@/components/loading-component";

const AulasPage = () => {
  const { data: aulas, isLoading, error } = useAulas();

  const formattedAulas: AulaColumn[] =
    aulas?.map((aula: Aula) => ({
      id: aula.id || "",
      nombre: aula.nombre || "",
      nivel: aula.nivel || "",
    })) || [];

  if (isLoading) return <LoadingComponent />;

  if (error) return <h1>Error: {(error as Error).message}</h1>;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 md:p-8 pt-6">
        <AulaClient data={formattedAulas} />
      </div>
    </div>
  );
};

export default AulasPage;
