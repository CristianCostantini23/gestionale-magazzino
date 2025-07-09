import { z } from "zod";

export const suppliersSchema = z.object({
  nome: z.string().min(1, "Il nome è obbligatorio"),
  telefono: z.string().min(1, "Il telefono è obbligatorio"),
  email: z
    .string()
    .email("Inserisci un indirizzo email valido")
    .min(1, "La email è obbligatoria"),
});
