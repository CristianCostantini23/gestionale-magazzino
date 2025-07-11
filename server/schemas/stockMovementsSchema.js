import { z } from "zod";

export const stockMovementsSchema = z.object({
  prodottoId: z.number().int().positive("ID prodotto non valido"),
  daEntitaId: z.number().int().positive("ID entità non valido"),
  aEntitaId: z.number().int().positive("ID entità non valido"),
  quantita: z
    .number()
    .int()
    .positive("La quantità deve essere un numero positivo"),
});
