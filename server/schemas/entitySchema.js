import { z } from "zod";

export const entitySchema = z.object({
  nome: z.string().min(1, "Il nome è obbligatorio"),
  tipo: z.string().min(1, "Il tipo è obbligatorio"),
  indirizzo: z.string().min(1, "L'indirizzo è obbligatorio"),
});
