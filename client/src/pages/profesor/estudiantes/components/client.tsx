import { columns, EstudianteColumn } from "./columns";
import { useNavigate } from "react-router-dom";
import { Heading } from "@/components/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/data-table";
import { AulaProfesor } from "@/types";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTableConfig } from "@/lib/tablesConfig/useTableConfig";

interface EstudianteClientProps {
  data: EstudianteColumn[];
  aulas: AulaProfesor[] | undefined;
  selectedAulaId: string | undefined;
  onAulaChange: (aulaId: string) => void;
  isLoadingAulas: boolean;
}

export const EstudianteClient: React.FC<EstudianteClientProps> = ({
  data,
  aulas,
  selectedAulaId,
  onAulaChange,
  isLoadingAulas,
}) => {
  const navigate = useNavigate();
  const { estudiantesConfig } = useTableConfig();

  const handleAulaChange = (aulaId: string) => {
    onAulaChange(aulaId);

    navigate(`/profesor/estudiantes?aulaId=${aulaId}`);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Estudiantes ${
            selectedAulaId
              ? `(${
                  selectedAulaId !== "todos"
                    ? aulas?.find((aula) => aula.aulaId === selectedAulaId)
                        ?.aula.nombre
                    : "Todos"
                })`
              : ""
          }`}
          description="Listado de estudiantes"
        />
      </div>
      <Separator />
      <div className="my-4">
        <Label htmlFor="aula-select">Seleccionar Aula</Label>
        <Select
          value={selectedAulaId}
          onValueChange={handleAulaChange}
          disabled={isLoadingAulas || aulas?.length === 0}
        >
          <SelectTrigger id="aula-select" className="w-[280px] mt-1">
            <SelectValue placeholder="Seleccionar un aula..." />
          </SelectTrigger>
          <SelectContent>
            {isLoadingAulas ? (
              <SelectItem value="loading" disabled>
                Cargando aulas...
              </SelectItem>
            ) : aulas && aulas.length > 0 ? (
              <>
                <SelectItem key="todos" value="todos">
                  Todos
                </SelectItem>
                {aulas?.map((aula) => (
                  <SelectItem key={aula.aulaId} value={aula.aulaId}>
                    {aula.aula.nombre}
                  </SelectItem>
                ))}
              </>
            ) : (
              <SelectItem value="none">No hay aulas disponibles.</SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
      <DataTable
        columns={columns}
        data={data}
        defaultSorting={estudiantesConfig.defaultSorting}
        searchPlaceholder={estudiantesConfig.searchPlaceholder}
        enableGlobalFilter={true}
        enableColumnFilters={true}
      />
    </>
  );
};
