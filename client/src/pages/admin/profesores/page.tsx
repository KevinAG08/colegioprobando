import { ProfesorClient } from "./components/client";
import { ProfesorColumn } from "./components/columns";
import { User } from "@/types";
import { useProfesores } from "@/hooks/useProfesores";

const ProfesoresPage = () => {
  const { data: profesores, isLoading, error } = useProfesores();

  const formattedProfesores: ProfesorColumn[] = profesores?.map(
    (profesor: User) => ({
      id: profesor.id || "",
      nombres: profesor.nombres || "",
      apellidos: profesor.apellidos || "",
      email: profesor.email || "",
      dni: profesor.dni || "",
      aulas: profesor.aulas?.map((aula) => aula.aula.nombre) || [],
      telefono: profesor.telefono || "",
    })
  );

  if (isLoading) {
    return <div>Cargando profesores...</div>;
  }

  if (error) {
    return <div>Error al cargar los profesores: {(error as Error).message}</div>;
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProfesorClient data={formattedProfesores} />
      </div>
    </div>
  );
};

export default ProfesoresPage;
