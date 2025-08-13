import { z } from "zod";

export const schemaStrutture = z.object({
  id: z.number().int().optional(),
  nome: z
    .string()
    .min(1, { message: "Il nome è obbligatorio" })
    .max(100, { message: "Il nome non può superare 100 caratteri" }),
  tipo: z.enum(["negozio", "magazzino"], {
    errorMap: () => ({ message: "Tipo deve essere 'negozio' o 'magazzino'" }),
  }),
  indirizzo: z
    .string()
    .max(255, { message: "L'indirizzo non può superare 255 caratteri" })
    .optional()
    .or(z.literal("")),
});
