import { Heading } from "@/components/heading";
import { columns, ProfesorColumn } from "./columns";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/data-table";
import { useTableConfig } from "@/lib/tablesConfig/useTableConfig";

interface ProfesorClientProps {
  data: ProfesorColumn[];
}

export const ProfesorClient: React.FC<ProfesorClientProps> = ({ data }) => {
  const navigate = useNavigate();
  const { profesoresConfig } = useTableConfig();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title="Profesores" description="Listado de profesores" />
        <Button onClick={() => navigate("/admin/profesores/registrar")}>
          <Plus className="mr-2 h-4 w-4" />
          Añadir profesor
        </Button>
      </div>
      <Separator />
      <DataTable
        columns={columns}
        data={data}
        defaultSorting={profesoresConfig.defaultSorting}
        searchPlaceholder={profesoresConfig.searchPlaceholder}
        enableGlobalFilter={true}
        enableColumnFilters={true}
      />
    </>
  );
};
