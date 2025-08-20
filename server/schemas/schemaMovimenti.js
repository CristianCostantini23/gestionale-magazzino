import { z } from "zod";

export const schemaMovimenti = z.object({
  strutturaOrigineId: z
    .number({
      required_error: "L'ID della struttura di origine è obbligatorio",
      invalid_type_error:
        "L'ID della struttura di origine deve essere un numero",
    })
    .int("Deve essere un numero intero")
    .positive("Deve essere maggiore di zero"),

  strutturaDestinazioneId: z
    .number({
      required_error: "L'ID della struttura di destinazione è obbligatorio",
      invalid_type_error:
        "L'ID della struttura di destinazione deve essere un numero",
    })
    .int("Deve essere un numero intero")
    .positive("Deve essere maggiore di zero"),

  dataTrasferimento: z
    .string({
      required_error: "La data di trasferimento è obbligatoria",
      invalid_type_error: "La data deve essere una stringa",
    })
    .regex(/^\d{2}-\d{2}-\d{4}$/, "La data deve essere in formato GG-MM-AAAA"),

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
      })
    )
    .nonempty("La lista dei prodotti non può essere vuota"),
});
