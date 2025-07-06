import { z } from "zod";

export const productSchema = z.object({
  nome: z.string().min(1, "Il nome è obbligatorio"),
  descrizione: z.string().min(1, "La descrizione è obbligatoria"),
  brandId: z.number().int().positive("ID brand non valido"),
  prezzoAcquisto: z.number().nonnegative("Prezzo di acquisto non valido"),
  prezzoVendita: z.number().nonnegative("Prezzo di vendita non valido"),
});
