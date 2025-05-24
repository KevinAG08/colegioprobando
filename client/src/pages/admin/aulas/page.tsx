import { useAulas } from "@/hooks/useAulas";
import { AulaColumn } from "./components/columns";
import { Aula } from "@/types";
import { AulaClient } from "./components/client";

const AulasPage = () => {
  const { data: aulas, isLoading, error } = useAulas();

  const formattedAulas: AulaColumn[] =
    aulas?.map((aula: Aula) => ({
      id: aula.id || "",
      nombre: aula.nombre || "",
      nivel: aula.nivel || "",
    })) || [];

  if (isLoading) return <h1>Cargando...</h1>;

  if (error) return <h1>Error: {(error as Error).message}</h1>;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <AulaClient data={formattedAulas} />
      </div>
    </div>
  );
};

export default AulasPage;
