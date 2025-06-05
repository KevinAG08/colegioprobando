import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface AlertModalProps {
  showAlert: boolean;
  setShowAlert: (value: boolean) => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  showAlert,
  setShowAlert,
  onConfirm,
  isLoading,
}) => {
  return (
    <Dialog open={showAlert} onOpenChange={setShowAlert}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Estás seguro?</DialogTitle>
          <DialogDescription>Esta acción es irreversible.</DialogDescription>
        </DialogHeader>
        <div className="pt-6 space-x-2 flex items-center justify-end w-full">
          <Button variant="outline" onClick={() => setShowAlert(false)} disabled={isLoading}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isLoading}>
            Confirmar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
