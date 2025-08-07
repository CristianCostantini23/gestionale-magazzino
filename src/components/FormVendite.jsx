import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postVendita } from "../store/slices/venditeSlice";
import { fetchEntita } from "../store/slices/entitaSlice";
import { fetchProdotti } from "../store/slices/prodottiSlice";
import { useEffect } from "react";

export default function FormVendite() {
  const dispatch = useDispatch();
  const entita = useSelector((state) => state.entita.entita);
  const prodotti = useSelector((state) => state.prodotti.prodotti);

  const [entitaId, setEntitaId] = useState("");
  const [prodottiVendita, setProdottiVendita] = useState([
    { prodottoId: "", quantita: 1, prezzoUnitario: "" },
  ]);
  const [errore, setErrore] = useState("");

  const calcolaTotale = () => {
    return prodottiVendita
      .reduce((totale, p) => {
        const prezzo = parseFloat(p.prezzoUnitario);
        const quantita = parseInt(p.quantita);
        if (!isNaN(prezzo) && !isNaN(quantita)) {
          return totale + prezzo * quantita;
        }
        return totale;
      }, 0)
      .toFixed(2);
  };

  const isFormValido = () => {
    if (!entitaId) return false;
    for (let p of prodottiVendita) {
      if (
        !p.prodottoId ||
        isNaN(parseInt(p.quantita)) ||
        parseInt(p.quantita) < 1 ||
        isNaN(parseFloat(p.prezzoUnitario)) ||
        parseFloat(p.prezzoUnitario) <= 0
      ) {
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    dispatch(fetchEntita());
    dispatch(fetchProdotti());
  }, [dispatch]);

  const handleProdottoChange = (index, field, value) => {
    const updated = [...prodottiVendita];

    if (field === "quantita") {
      updated[index][field] = parseInt(value, 10);
    } else if (field === "prezzoUnitario") {
      updated[index][field] = parseFloat(value);
    } else if (field === "prodottoId") {
      updated[index][field] = parseInt(value, 10);
    } else {
      updated[index][field] = value;
    }

    setProdottiVendita(updated);
  };

  const addProdotto = () => {
    setProdottiVendita([
      ...prodottiVendita,
      { prodottoId: "", quantita: 1, prezzoUnitario: "" },
    ]);
  };

  const removeProdotto = (index) => {
    const updated = prodottiVendita.filter((_, i) => i !== index);
    setProdottiVendita(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrore("");

    console.log("Dati inviati:", {
      entitaId: parseInt(entitaId),
      prodotti: prodottiVendita,
    });

    try {
      await dispatch(
        postVendita({ entitaId: parseInt(entitaId), prodotti: prodottiVendita })
      ).unwrap();
      setEntitaId("");
      setProdottiVendita([{ prodottoId: "", quantita: 1, prezzoUnitario: "" }]);
    } catch (error) {
      console.log(error);
      setErrore(error?.errore || "Errore nella registrazione della vendita");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-semibold">Entità</label>
        <select
          value={entitaId}
          onChange={(e) => setEntitaId(parseInt(e.target.value, 10))}
          className="border rounded px-2 py-1 w-full"
          required
        >
          <option value="">Seleziona un'entità</option>
          {entita.map((e) => (
            <option key={e.id} value={e.id}>
              {e.nome}
            </option>
          ))}
        </select>
      </div>

      {prodottiVendita.map((prodotto, index) => (
        <div
          key={index}
          className="grid grid-cols-4 gap-2 items-end border-b pb-2"
        >
          <div>
            <label>Prodotto</label>
            <select
              value={prodotto.prodottoId}
              onChange={(e) =>
                handleProdottoChange(index, "prodottoId", e.target.value)
              }
              className="border rounded px-2 py-1 w-full"
              required
            >
              <option value="">Seleziona</option>
              {prodotti.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Quantità</label>
            <input
              type="number"
              min="1"
              value={prodotto.quantita}
              onChange={(e) =>
                handleProdottoChange(index, "quantita", e.target.value)
              }
              className="border rounded px-2 py-1 w-full"
              required
            />
          </div>

          <div>
            <label>Prezzo unitario</label>
            <input
              type="number"
              step="0.01"
              value={prodotto.prezzoUnitario}
              onChange={(e) =>
                handleProdottoChange(index, "prezzoUnitario", e.target.value)
              }
              className="border rounded px-2 py-1 w-full"
              required
            />
          </div>

          <div>
            {prodottiVendita.length > 1 && (
              <button
                type="button"
                onClick={() => removeProdotto(index)}
                className="text-red-600 text-sm hover:underline"
              >
                Rimuovi
              </button>
            )}
          </div>
        </div>
      ))}

      <div className="text-right font-semibold">
        Totale parziale: € {calcolaTotale()}
      </div>

      <div>
        <button
          type="button"
          onClick={addProdotto}
          className="text-blue-600 text-sm hover:underline"
        >
          + Aggiungi prodotto
        </button>
      </div>

      {errore && <div className="text-red-600 text-sm">{errore}</div>}

      <button
        type="submit"
        disabled={!isFormValido()}
        className={`px-4 py-2 rounded text-white ${
          isFormValido()
            ? "bg-green-600 hover:bg-green-700"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        Salva Vendita
      </button>
    </form>
  );
}
