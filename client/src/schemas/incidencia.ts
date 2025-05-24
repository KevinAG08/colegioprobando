import { z } from "zod";

export const incidenciaSchema = z.object({
  fecha: z.string().min(1, { message: "La fecha es requerida" }),
  hora: z.string().optional(),
  lugar: z.string().min(1, { message: "El lugar es requerido" }),
  tipoIncidencia: z
    .string()
    .min(1, { message: "El tipo de incidencia es requerido" }),
  descripcion: z.string().min(1, { message: "La descripción es requerida" }),
  medidasAdoptadas: z
    .string()
    .min(1, { message: "Las medidas adoptadas son requeridas" }),
  estudianteIds: z
    .array(z.string())
    .min(1, { message: "Debe seleccionar al menos un estudiante" }),
});
