import { useNavigate } from "react-router-dom";
import { EstudianteColumn } from "./columns";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface CellActionProps {
  data: EstudianteColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const navigate = useNavigate();

  const onSee = () => {
    navigate(`/profesor/estudiantes/ver/${data.id}`);
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          size="icon"
          className="h-8 w-auto py-4 px-2 bg-green-400"
          onClick={onSee}
        >
          <Eye className="h-4 w-4 text-white" />
          <span className="text-white">Ver</span>
        </Button>
      </div>
    </>
  );
};
