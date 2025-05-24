import * as z from "zod";

export const aulaSchema = z.object({
  nombre: z.string().min(1, { message: "El nombre del aula es requerido." }),
});