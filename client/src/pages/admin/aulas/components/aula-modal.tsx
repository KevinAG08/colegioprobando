import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { aulaSchema } from "@/schemas/aula";
import { Aula } from "@/types";
import { useCreateAula, useUpdateAula } from "@/hooks/useAulas";

interface AulaFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Aula | null; 
}

type FormValues = z.infer<typeof aulaSchema>;

export const AulaFormModal: React.FC<AulaFormModalProps> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const createMutation = useCreateAula();
  const updateMutation = useUpdateAula(initialData?.id || "");

  const isLoading = createMutation.isPending || updateMutation.isPending;

  const form = useForm<FormValues>({
    resolver: zodResolver(aulaSchema),
    defaultValues: initialData ? {
      nombre: initialData.nombre,
    } : {
      nombre: "",
    },
  })

  const handleSubmit = async (data: FormValues) => {
    if (initialData) {
      updateMutation.mutate(
        {
          id: initialData.id as string,
          nombre: data.nombre
        },
        {
          onSuccess: () => {
            onClose();
          }
        }
      )
    } else {
      createMutation.mutate(data.nombre, {
        onSuccess: () => {
          form.reset();
          onClose();
        }
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Editar Aula" : "Añadir Nueva Aula"}</DialogTitle>
          <DialogDescription>
            {initialData ? "Modifica el nombre del aula." : "Completa el nombre para la nueva aula."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-2 pb-4">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Aula</FormLabel>
                  <FormControl><Input placeholder="Ej: 1ro A" {...field} disabled={isLoading} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="outline" disabled={isLoading}>Cancelar</Button></DialogClose>
              <Button type="submit" disabled={isLoading}>{isLoading ? "Guardando..." : "Guardar Aula"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};