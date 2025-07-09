import { z } from "zod";

export const brandsSchema = z.object({
  nome: z.string().min(1, "il nome è obbligatorio"),
});
