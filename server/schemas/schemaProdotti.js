import { z } from "zod";

export const schemaProdotti = z.object({
  nome: z.string().min(1, "Il nome è obbligatorio").max(100),
  descrizione: z.string().optional().nullable(),
  codice: z.string().max(50).optional().nullable(),
  prezzo_vendita: z
    .number({ invalid_type_error: "Il prezzo deve essere un numero" })
    .positive("Il prezzo deve essere positivo"),
});
