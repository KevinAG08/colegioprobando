import { useNavigate } from "react-router-dom";
import { columns, IncidenciaColumn } from "./columns";
import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/data-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Aula } from "@/types";

interface IncidenciaClientProps {
  data: IncidenciaColumn[];
  aulas: Aula[] | undefined;
  selectedAulaId: string | undefined;
  onAulaChange: (aulaId: string) => void;
  isLoadingAulas: boolean;
}

export const IncidenciaClient: React.FC<IncidenciaClientProps> = ({ data, aulas, selectedAulaId, onAulaChange, isLoadingAulas }) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title="Incidencias" description="Listado de incidencias" />
        <div className="flex gap-3">
          <div className="w-64">
            <Select
              value={selectedAulaId}
              onValueChange={onAulaChange}
              disabled={isLoadingAulas}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Seleccione un aula..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas las aulas</SelectItem>
                {aulas?.map((aula) => (
                  <SelectItem key={aula.id} value={aula.id}>
                    {aula.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={() => navigate("/admin/incidencias/registrar")}>
          <Plus className="mr-2 h-4 w-4" />
          Registrar incidencia
        </Button>
      </div>
      <Separator />
      <DataTable
        columns={columns}
        data={data}
      />
    </>
  );
};
