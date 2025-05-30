import { AulaColumn, columns } from "./columns";
import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/data-table";
import { AulaFormModal } from "./aula-modal";
import { useState } from "react";
import { useTableConfig } from "@/lib/tablesConfig/useTableConfig";

interface AulaClientProps {
  data: AulaColumn[];
}

export const AulaClient: React.FC<AulaClientProps> = ({ data }) => {
  const [showModal, setShowModal] = useState(false);
  const { aulasConfig } = useTableConfig();

  return (
    <>
      <AulaFormModal isOpen={showModal} onClose={() => setShowModal(false)} initialData={null} />
      <div className="flex items-center justify-between">
        <Heading title="Aulas" description="Listado de aulas" />
        <Button onClick={() => setShowModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Añadir aula
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchPlaceholder={aulasConfig.searchPlaceholder} />
    </>
  );
};
