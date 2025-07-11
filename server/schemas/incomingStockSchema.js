import { z } from "zod";

export const incomingStockSchema = z.object({
  fornitoreId: z.number().int().positive("ID fornitore non valido"),
  prodottoId: z.number().int().positive("ID prodotto non valido"),
  entitaId: z.number().int().positive("ID entità non valido"),
  quantita: z
    .number()
    .int()
    .positive("La quantità deve essere un numero positivo"),
  prezzoAcquisto: z
    .number()
    .positive("Il prezzo di acquisto deve essere un numero positivo"),
  prezzoVendita: z.number().positive("ID entità non valido"),
});
