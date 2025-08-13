import { z } from "zod";

export const schemaVendite = z.object({
  strutturaId: z
    .number({
      required_error: "L'ID dell'entità è obbligatorio",
      invalid_type_error: "L'ID dell'entità deve essere un numero",
    })
    .int("L'ID dell'entità deve essere un numero intero")
    .positive("L'ID dell'entità deve essere maggiore di zero"),

  prodotti: z
    .array(
      z.object({
        prodottoId: z
          .number({
            required_error: "L'ID del prodotto è obbligatorio",
            invalid_type_error: "L'ID del prodotto deve essere un numero",
          })
          .int("L'ID del prodotto deve essere un numero intero")
          .positive("L'ID del prodotto deve essere maggiore di zero"),

        quantita: z
          .number({
            required_error: "La quantità è obbligatoria",
            invalid_type_error: "La quantità deve essere un numero",
          })
          .int("La quantità deve essere un numero intero")
          .positive("La quantità deve essere maggiore di zero"),

        prezzoUnitario: z
          .number({
            required_error: "Il prezzo unitario è obbligatorio",
            invalid_type_error: "Il prezzo unitario deve essere un numero",
          })
          .positive("Il prezzo unitario deve essere maggiore di zero"),
      })
    )
    .nonempty("La lista dei prodotti non può essere vuota")
    .min(1, "Deve essere incluso almeno un prodotto nella vendita"),
});
