import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { fetchStrutture } from "../store/slices/sliceStrutture.js";
import { postVendita } from "../store/slices/sliceVendite.js";
import {
  Building2,
  Package,
  Hash,
  DollarSign,
  Trash2,
  Receipt,
  PlusCircle,
  Save,
  CircleX,
  Calendar,
} from "lucide-react";

export default function AggiungiVendita() {
  const dispatch = useDispatch();
  const { strutture } = useSelector((state) => state.strutture);

  const [strutturaId, setStrutturaId] = useState("");
  const [prodottiVendita, setProdottiVendita] = useState([
    { prodottoId: "", quantita: 1, prezzoUnitario: "" },
  ]);
  const [prodotti, setProdotti] = useState([]);
  const [dataVendita, setDataVendita] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    dispatch(fetchStrutture()).unwrap();
  }, [dispatch]);

  useEffect(() => {
    if (strutturaId) {
      axios
        .get(`/api/popola/prodotti/${strutturaId}`)
        .then((res) => setProdotti(res.data.filter((p) => p.quantita > 0)))
        .catch(() => setProdotti([]));
    }
  }, [strutturaId]);

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
    if (!strutturaId) return false;
    for (let p of prodottiVendita) {
      const prodInv = prodotti.find((x) => x.id === p.prodottoId);
      if (
        !p.prodottoId ||
        isNaN(parseInt(p.quantita)) ||
        parseInt(p.quantita) < 1 ||
        (prodInv && parseInt(p.quantita) > prodInv.quantita) ||
        isNaN(parseFloat(p.prezzoUnitario)) ||
        parseFloat(p.prezzoUnitario) <= 0
      ) {
        return false;
      }
    }
    return true;
  };

  const handleProdottoChange = (index, field, value) => {
    const updated = [...prodottiVendita];
    updated[index][field] = value;
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
    setError("");
    setSuccessMessage(null);

    try {
      await dispatch(
        postVendita({
          strutturaId: parseInt(strutturaId),
          prodotti: prodottiVendita.map((p) => ({
            ...p,
            quantita: parseInt(p.quantita),
            prezzoUnitario: parseFloat(p.prezzoUnitario),
          })),
          dataVendita,
        })
      ).unwrap();

      setSuccessMessage("Vendita registrata con successo!");
      setTimeout(() => setSuccessMessage(null), 1000);
      setStrutturaId("");
      setProdottiVendita([{ prodottoId: "", quantita: 1, prezzoUnitario: "" }]);
      setDataVendita("");
    } catch (error) {
      setError(error || "Errore nella registrazione della vendita");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg bg-gradient-to-t from-gray-700 to-gray-500 text-white w-[80%] p-6 m-5 flex flex-col gap-4 shadow-xl"
    >
      <h1 className="font-extrabold text-3xl text-center mb-4">
        Nuova Vendita
      </h1>

      {/* Selezione Struttura */}
      <div>
        <label className="font-semibold flex items-center gap-2 mb-1">
          <Building2 className="w-4 h-4" /> Struttura
        </label>
        <select
          value={strutturaId}
          onChange={(e) => setStrutturaId(parseInt(e.target.value, 10))}
          className="bg-gray-800 text-white p-2 rounded w-full"
          required
        >
          <option value="">Seleziona una struttura</option>
          {strutture.map((s) => (
            <option key={s.id} value={s.id}>
              {s.nome}
            </option>
          ))}
        </select>
      </div>

      {/* Data Vendita */}
      <div>
        <label className="font-semibold flex items-center gap-2 mb-1">
          <Calendar className="w-4 h-4" /> Data vendita
        </label>
        <input
          type="date"
          value={dataVendita}
          onChange={(e) => setDataVendita(e.target.value)}
          className="bg-gray-800 text-white p-2 rounded w-full"
          required
        />
      </div>

      {/* Lista Prodotti */}
      {prodottiVendita.map((prodotto, index) => {
        const prodottoInv = prodotti.find(
          (p) => p.id === parseInt(prodotto.prodottoId)
        );
        return (
          <div
            key={index}
            className="rounded-lg bg-gray-600 p-3 mb-3 flex flex-col gap-3 shadow hover:shadow-xl hover:shadow-gray-700 hover:scale-105 transition-all duration-200 ease-in-out"
          >
            {/* Prodotto */}
            <div>
              <label className="flex items-center gap-1 mb-1">
                <Package className="w-4 h-4" /> Prodotto
              </label>
              <select
                value={prodotto.prodottoId}
                onChange={(e) =>
                  handleProdottoChange(index, "prodottoId", e.target.value)
                }
                className="bg-gray-800 text-white p-2 rounded w-full"
                required
              >
                <option value="">Seleziona</option>
                {prodotti.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome} (Disponibili: {p.quantita})
                  </option>
                ))}
              </select>
            </div>

            {/* Quantità */}
            <div>
              <label className="flex items-center gap-1 mb-1">
                <Hash className="w-4 h-4" /> Quantità
              </label>
              <input
                type="number"
                min="1"
                max={prodottoInv ? prodottoInv.quantita : undefined}
                value={prodotto.quantita}
                onChange={(e) =>
                  handleProdottoChange(index, "quantita", e.target.value)
                }
                className="bg-gray-800 text-white p-2 rounded w-full"
                required
              />
              {prodottoInv && (
                <span className="text-xs text-gray-300">
                  Max disponibile: {prodottoInv.quantita}
                </span>
              )}
            </div>

            {/* Prezzo Unitario */}
            <div>
              <label className="flex items-center gap-1 mb-1">
                <DollarSign className="w-4 h-4" /> Prezzo unitario
              </label>
              <input
                type="number"
                step="0.01"
                value={prodotto.prezzoUnitario}
                onChange={(e) =>
                  handleProdottoChange(index, "prezzoUnitario", e.target.value)
                }
                className="bg-gray-800 text-white p-2 rounded w-full"
                required
              />
            </div>

            {/* Rimuovi Prodotto */}
            {prodottiVendita.length > 1 && (
              <button
                type="button"
                onClick={() => removeProdotto(index)}
                className="p-2 rounded-full bg-red-500 hover:bg-red-600 transition self-start"
              >
                <Trash2 className="w-4 h-4 text-white" />
              </button>
            )}
          </div>
        );
      })}

      {/* Totale */}
      <div className="text-right font-semibold flex justify-end items-center gap-1">
        <Receipt className="w-4 h-4" /> Totale parziale: € {calcolaTotale()}
      </div>

      {/* Aggiungi Prodotto */}
      <button
        type="button"
        onClick={addProdotto}
        className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 transition self-start flex items-center gap-1"
      >
        <PlusCircle className="w-4 h-4 text-white" /> Aggiungi prodotto
      </button>

      {/* Messaggi */}
      {error && <div className="text-red-400 text-sm">{error}</div>}
      {successMessage && (
        <div className="w-full p-3 mb-2 rounded bg-green-600 text-white text-center">
          {successMessage}
        </div>
      )}

      {/* Bottoni */}
      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={() => {
            setStrutturaId("");
            setProdottiVendita([
              { prodottoId: "", quantita: 1, prezzoUnitario: "" },
            ]);
          }}
          className="p-2 rounded-full bg-red-500 hover:bg-red-600 transition"
        >
          <CircleX size={18} className="text-white" />
        </button>
        <button
          type="submit"
          disabled={!isFormValido()}
          className={`p-2 rounded-full flex items-center justify-center transition ${
            isFormValido()
              ? "bg-green-500 hover:bg-green-600"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          <Save size={18} className="text-white" />
        </button>
      </div>
    </form>
  );
}
