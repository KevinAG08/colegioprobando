import { useNavigate } from "react-router-dom";
import { IncidenciaColumn } from "./columns";
import { useState } from "react";
import { AlertModal } from "@/components/alert-modal";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Trash } from "lucide-react";
import { useDeleteIncidencia } from "@/hooks/useIncidencias";

interface CellActionProps {
  data: IncidenciaColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);

  const { mutate: deleteIncidencia, isPending } = useDeleteIncidencia("admin");

  const onEdit = () => {
    navigate(`/admin/incidencias/editar/${data.id}`);
  };

  const onSee = () => {
    navigate(`/admin/incidencias/ver/${data.id}`);
  };

  const onDelete = () => {
    deleteIncidencia(data.id, {
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
        isLoading={isPending}
      />
      <div className="flex items-center gap-2">
        <Button
          size="icon"
          className="h-8 w-auto py-4 px-2 bg-green-400"
          onClick={onSee}
        >
          <Eye className="h-4 w-4 text-white" />
          <span className="text-white">Ver</span>
        </Button>
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
