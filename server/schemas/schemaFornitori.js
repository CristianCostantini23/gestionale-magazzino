import { z } from "zod";

export const schemaFornitori = z.object({
  nome: z
    .string()
    .min(1, { message: "Il nome è obbligatorio" })
    .max(100, { message: "Il nome non può superare 100 caratteri" }),
  cell: z
    .string()
    .max(20, {
      message: "Il numero di cellulare non può superare 20 caratteri",
    })
    .optional()
    .or(z.literal("")),
  email: z
    .string()
    .email({ message: "Email non valida" })
    .max(100, { message: "L'email non può superare 100 caratteri" })
    .optional()
    .or(z.literal("")),
});
