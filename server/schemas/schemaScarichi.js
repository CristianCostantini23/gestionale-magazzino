import { z } from "zod";

export const schemaScarichi = z.object({
  strutturaId: z
    .number({
      required_error: "L'ID della struttura è obbligatorio",
      invalid_type_error: "L'ID della struttura deve essere un numero",
    })
    .int("Deve essere un numero intero")
    .positive("Deve essere maggiore di zero"),

  dataScarico: z
    .string({
      required_error: "La data di scarico è obbligatoria",
      invalid_type_error: "La data deve essere una stringa",
    })
    .regex(/^\d{2}-\d{2}-\d{4}$/, "La data deve essere in formato GG-MM-AAAA"),

  fornitoreId: z
    .number({
      invalid_type_error: "L'ID del fornitore deve essere un numero",
    })
    .int("Deve essere un numero intero")
    .positive("Deve essere maggiore di zero")
    .optional(),

  documentoRiferimento: z
    .string()
    .max(100, "Il documento di riferimento non può superare i 100 caratteri")
    .optional(),

  note: z.string().optional(),

  prodotti: z
    .array(
      z.object({
        prodottoId: z
          .number({
            required_error: "L'ID del prodotto è obbligatorio",
            invalid_type_error: "L'ID del prodotto deve essere un numero",
          })
          .int("Deve essere un numero intero")
          .positive("Deve essere maggiore di zero"),

        quantita: z
          .number({
            required_error: "La quantità è obbligatoria",
            invalid_type_error: "La quantità deve essere un numero",
          })
          .int("Deve essere un numero intero")
          .positive("La quantità deve essere maggiore di zero"),

        prezzoUnitario: z
          .number({
            invalid_type_error: "Il prezzo unitario deve essere un numero",
          })
          .positive("Il prezzo unitario deve essere maggiore di zero")
          .optional(),
      })
    )
    .nonempty("La lista dei prodotti non può essere vuota"),
});
