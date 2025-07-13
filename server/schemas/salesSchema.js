import { z } from "zod";

export const saleSchema = z.object({
  entitaId: z.number().int().positive(),
  prodotti: z
    .array(
      z.object({
        prodottoId: z.number().int().positive(),
        quantita: z.number().int().positive(),
        prezzoUnitario: z.number().positive(),
      })
    )
    .nonempty("Deve contenere almeno un prodotto")
    .min(1, "Almeno un prodotto deve essere incluso nella vendita"),
});
