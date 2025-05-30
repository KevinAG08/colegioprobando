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
import { Label } from "@/components/ui/label";
import { useTableConfig } from "@/lib/tablesConfig/useTableConfig";

interface IncidenciaClientProps {
  data: IncidenciaColumn[];
  aulas: Aula[] | undefined;
  selectedAulaId: string | undefined;
  onAulaChange: (aulaId: string) => void;
  isLoadingAulas: boolean;
}

export const IncidenciaClient: React.FC<IncidenciaClientProps> = ({ data, aulas, selectedAulaId, onAulaChange, isLoadingAulas }) => {
  const navigate = useNavigate();
  const { incidenciasConfig } = useTableConfig();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title="Incidencias" description="Listado de incidencias" />
        <Button onClick={() => navigate("/admin/incidencias/registrar")}>
          <Plus className="mr-2 h-4 w-4" />
          Registrar incidencia
        </Button>
      </div>
      <Separator />
      <div className="my-4">
        <Label htmlFor="aula-select">Seleccionar aula</Label>
        <Select
              value={selectedAulaId}
              onValueChange={onAulaChange}
              disabled={isLoadingAulas}
            >
              <SelectTrigger id="aula-select" className="w-[280px] mt-1">
                <SelectValue placeholder="Seleccionar un aula..." />
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
      <DataTable
        columns={columns}
        data={data}
        defaultSorting={incidenciasConfig.defaultSorting}
        searchPlaceholder={incidenciasConfig.searchPlaceholder}
        enableGlobalFilter={true}
        enableColumnFilters={true}
      />
    </>
  );
};
