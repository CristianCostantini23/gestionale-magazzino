import { ZodError } from "zod";

// funzione da passare nel blocco catch dei controller
// ritorna un messaggio per tutti i vari tipi di errore possibili
// passo come args error = error del blocco catch, res e defaultStatus = status errore generico (opzionale)

export function handleControllerError(error, res, defaultStatus = 500) {
  if (error instanceof ZodError) {
    const formattedErrors = error.errors.map((err) => ({
      field: err.path.join("."),
      message: err.message,
    }));
    return res.status(400).json({ error: formattedErrors });
  }

  if (error.status && error.message) {
    return res.status(error.status).json({ error: error.message });
  }

  if (error.code === "ER_DUP_ENTRY") {
    return res.status(409).json({ error: "Record duplicato" });
  }

  console.error("Errore interno:", error);
  return res.status(defaultStatus).json({ error: "Errore interno del server" });
}
