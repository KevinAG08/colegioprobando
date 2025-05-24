import { columns, EstudianteColumn } from "./columns";
import { useNavigate } from "react-router-dom";
import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/data-table";
import { Aula } from "@/types";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EstudianteClientProps {
  data: EstudianteColumn[];
  aulas: Aula[] | undefined;
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

  const handleAulaChange = (aulaId: string) => {
    onAulaChange(aulaId);

    navigate(`/admin/estudiantes?aulaId=${aulaId}`);
  }

  const handleAddStudent = () => {
    if (selectedAulaId) {
      navigate(`/admin/estudiantes/registrar/${selectedAulaId}`);
    } else {
      navigate("/admin/estudiantes/registrar");
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Estudiantes ${
            selectedAulaId
              ? `(${
                  selectedAulaId !== "todos"
                    ? aulas?.find((aula) => aula.id === selectedAulaId)?.nombre
                    : "Todos"
                })`
              : ""
          }`}
          description="Listado de estudiantes"
        />
        <Button onClick={handleAddStudent} disabled={isLoadingAulas}>
          <Plus className="mr-2 h-4 w-4" />
          Añadir estudiante
        </Button>
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
            ) : (aulas && aulas.length > 0) ? (
              <>
                <SelectItem key="todos" value="todos">
                  Todos
                </SelectItem>
                {aulas?.map((aula) => (
                  <SelectItem key={aula.id} value={aula.id}>
                    {aula.nombre}
                  </SelectItem>
                ))}
              </>
            ) : (
              <SelectItem value="none">No hay aulas disponibles.</SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
      <DataTable columns={columns} data={data} />
    </>
  );
};
