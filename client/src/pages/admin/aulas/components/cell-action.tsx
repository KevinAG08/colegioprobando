import { useState } from "react";
import { AulaColumn } from "./columns";
import { useDeleteAula } from "@/hooks/useAulas";
import { AlertModal } from "@/components/alert-modal";
import { AulaFormModal } from "./aula-modal";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";

interface CellActionProps {
  data: AulaColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const { mutate: deleteAula, isPending } = useDeleteAula();

  const onEdit = () => {
    setShowModal(true);
  };

  const onDelete = () => {
    deleteAula(data.id, {
      onSuccess: () => {
        setShowAlert(false);
      },
    });
  };

  return (
    <>
      <AlertModal
        showAlert={showAlert}
        setShowAlert={setShowAlert}
        onConfirm={onDelete}
      />
      <AulaFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        initialData={data}
      />
      <div className="flex items-center gap-2">
        <Button
          size="icon"
          className="h-8 w-auto py-4 px-2 bg-blue-500"
          onClick={onEdit}
        >
          <Edit className="h-4 w-4 text-white" />
          <span className="text-white">Editar</span>
        </Button>
        <Button
          variant="destructive"
          size="icon"
          className="w-auto py-4 px-2 h-8"
          onClick={() => setShowAlert(true)}
          disabled={isPending}
        >
          <Trash className="h-4 w-4 text-white" />
          <span className="text-white">
            {isPending ? "Eliminando..." : "Eliminar"}
          </span>
        </Button>
      </div>
    </>
  );
};
