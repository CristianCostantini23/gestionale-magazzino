import pool from "../db/db.js";
import { saleSchema } from "../schemas/salesSchema.js";
import { handleServerError, handleZodError } from "../utils/dataValidation.js";
import { buildGetByIdQuery, buildInsertQuery } from "../utils/queryBuilder.js";

// POST registro una nuova vendita
export async function createSale(req, res) {
  try {
    const parsedData = saleSchema.parse(req.body);
    const { entitaId, prodotti } = parsedData;

    // stabilisco la connessione
    const conn = await pool.getConnection();
    try {
      // comincio la transazione
      await conn.beginTransaction();

      // inserisco nella tabella vendite
      const [saleResult] = await conn.query(
        buildInsertQuery("vendite", ["entita_id"]),
        [entitaId]
      );

      const venditaId = saleResult.insertId;

      // inserisci in vendita_prodotto per ogni prodotto della singola vendita
      // aggiorno il relativo inventario
      for (const prodotto of prodotti) {
        const { prodottoId, quantita, prezzoUnitario } = prodotto;

        // verifico che la quantità sia maggiore di 0
        if (quantita <= 0) {
          await conn.rollback();
          return res.status(400).json({
            errore: `La quantità per il prodotto ID ${prodottoId} deve essere maggiore di zero`,
          });
        }

        // controllo disponibiltà
        const [stockRows] = await conn.query(
          "SELECT quantità FROM inventario WHERE prodotto_id = ? AND entita_id = ?",
          [prodottoId, entitaId]
        );

        // verifico se la quantita in stock sia sufficiente
        if (!stockRows[0] || stockRows[0].quantita < quantita) {
          await conn.rollback();
          return res.status(400).json({
            errore: `Quantità insufficiente per il prodotto ID ${prodottoId}`,
          });
        }

        // inserisci in vendita_prodotto
        await conn.query(
          buildInsertQuery("vendita_prodotto", [
            "vendita_id",
            "prodotto_id",
            "quantità",
            "prezzo_unitario",
          ]),
          [venditaId, prodottoId, quantita, prezzoUnitario]
        );

        // aggiorna inventario entita
        await conn.query(
          "UPDATE inventario SET quantità = quantità - ? WHERE prodotto_id = ? AND entita_id = ?",
          [quantita, prodottoId, entitaId]
        );
      }

      // concludo la transazione
      await conn.commit();

      res.status(200).json({ messaggio: "vendita registrata con successo" });
    } catch (error) {
      // se qualcosa va storto annullo la transazione
      await conn.rollback();
      handleServerError(
        res,
        error,
        "errore durante la registrazione della vendita"
      );
    } finally {
      // interrompo la connessione
      conn.release();
    }
  } catch (error) {
    if (error instanceof z.ZodError) return handleZodError(res, error);
    handleServerError(
      res,
      error,
      "Errore durante la registrazione della vendita"
    );
  }
}

// GET ricevo i dettagli di una singola vendita per ID
export async function getSaleById(req, res) {
  const { id } = req;

  try {
    // recupero i dati dalla vendita
    const [saleData] = await pool.query(
      "SELECT v.id, e.nome AS nome_entita, v.data_vendita FROM vendite v JOIN entita e ON v.entita_id = e.id WHERE v.id = ?",
      [id]
    );

    if (!saleData[0]) {
      return res
        .status(404)
        .json({ errore: "impossibile trovare i dati della vendita" });
    }

    const vendita = saleData[0];

    // recupero i dati dei prodotti associati alla vendita
    const [productsData] = await pool.query(
      "SELECT p.nome AS nome_prodotto, vp.quantità, vp.prezzo_unitario FROM vendita_prodotto vp JOIN prodotti p ON vp.prodotto_id = p.id WHERE vp.vendita_id = ?",
      [id]
    );

    res.status(200).json({
      vendita: {
        id: vendita.id,
        entita: vendita.nome_entita,
        data_vendita: vendita.data_vendita,
      },
      prodotti: productsData,
    });
  } catch (error) {
    handleServerError(
      res,
      error,
      "impossibile trovare i dati relativi alla vendita"
    );
  }
}

// GET tutte le vendite
export async function getAllSales(req, res) {
  try {
    const [sales] = await pool.query(`
      SELECT 
        v.id, 
        e.nome AS nome_entita, 
        v.data_vendita,
        SUM(vp.quantità * vp.prezzo_unitario) AS totale
      FROM vendite v
      JOIN entita e ON v.entita_id = e.id
      JOIN vendita_prodotto vp ON v.id = vp.vendita_id
      GROUP BY v.id, e.nome, v.data_vendita
      ORDER BY v.data_vendita DESC
    `);

    res.status(200).json(sales);
  } catch (error) {
    handleServerError(
      res,
      error,
      "Impossibile recuperare la lista delle vendite"
    );
  }
}
