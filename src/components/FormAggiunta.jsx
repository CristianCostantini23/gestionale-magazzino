import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Building2,
  Package,
  Hash,
  Calendar,
  PlusCircle,
  Trash2,
  Save,
  CircleX,
} from "lucide-react";

export default function FormAggiunta({
  titolo,
  campi,
  campiProdotti,
  options = {},
  onSubmitAction,
  onStrutturaOrigineChange,
}) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ prodotti: [] });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProdottoChange = (index, field, value) => {
    setFormData((prev) => {
      const prodotti = [...prev.prodotti];
      prodotti[index] = { ...prodotti[index], [field]: value };
      return { ...prev, prodotti };
    });
  };

  const aggiungiProdotto = () => {
    const nuovoProdotto = {};
    campiProdotti.forEach(
      (c) => (nuovoProdotto[c] = c === "quantita" ? 1 : "")
    );
    setFormData((prev) => ({
      ...prev,
      prodotti: [...prev.prodotti, nuovoProdotto],
    }));
  };

  const rimuoviProdotto = (index) => {
    setFormData((prev) => ({
      ...prev,
      prodotti: prev.prodotti.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(onSubmitAction(formData));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg bg-gradient-to-t from-gray-700 to-gray-500 text-white w-full max-w-4xl p-6 flex flex-col gap-4 shadow-xl"
    >
      <h1 className="font-extrabold text-3xl text-center mb-4">{titolo}</h1>

      {campi.map(({ name, label, type, required }) => {
        let fieldOptions = options[name] || [];

        if (name === "strutturaOrigineId") {
          fieldOptions = fieldOptions.filter(
            (opt) => opt.value !== formData.strutturaDestinazioneId
          );
        }
        if (name === "strutturaDestinazioneId") {
          fieldOptions = fieldOptions.filter(
            (opt) => opt.value !== formData.strutturaOrigineId
          );
        }

        const Icon = name.includes("Struttura")
          ? Building2
          : name.includes("data")
          ? Calendar
          : null;

        return (
          <div key={name}>
            <label className="flex items-center gap-2 mb-1 font-semibold">
              {Icon && <Icon className="w-4 h-4" />}
              {label}
            </label>
            {options[name] ? (
              <select
                name={name}
                key={name}
                required={required}
                value={formData[name] || ""}
                onChange={(e) => {
                  handleChange(e);
                  if (
                    name === "strutturaOrigineId" &&
                    onStrutturaOrigineChange
                  ) {
                    onStrutturaOrigineChange(e.target.value);
                    setFormData((prev) => ({
                      ...prev,
                      prodotti: [],
                      strutturaDestinazioneId:
                        prev.strutturaDestinazioneId === e.target.value
                          ? ""
                          : prev.strutturaDestinazioneId,
                    }));
                  }
                }}
                className="bg-gray-800 text-white p-2 rounded w-full"
              >
                <option value="">-- Seleziona --</option>
                {fieldOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={type}
                name={name}
                key={name}
                required={required}
                value={formData[name] || ""}
                onChange={handleChange}
                className="bg-gray-800 text-white p-2 rounded w-full"
              />
            )}
          </div>
        );
      })}

      <div>
        <h2 className="text-xl font-bold mb-2">Prodotti</h2>
        {formData.prodotti.map((p, index) => (
          <div
            key={index}
            className="rounded-lg bg-gray-600 p-3 mb-3 flex flex-col gap-3 shadow hover:shadow-xl hover:scale-105 transition-all duration-200"
          >
            <div>
              <label className="flex items-center gap-1 mb-1">
                <Package className="w-4 h-4" /> Prodotto
              </label>
              <select
                value={p.prodottoId}
                onChange={(e) =>
                  handleProdottoChange(index, "prodottoId", e.target.value)
                }
                className="bg-gray-800 text-white p-2 rounded w-full"
                required
              >
                <option value="">Seleziona</option>
                {options["prodottoId"]?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {campiProdotti.includes("quantita") && (
              <div>
                <label className="flex items-center gap-1 mb-1">
                  <Hash className="w-4 h-4" /> Quantità
                </label>
                <input
                  type="number"
                  min="1"
                  max={
                    titolo === "Nuovo Movimento Merce"
                      ? options["prodottoId"].quantita
                      : null
                  }
                  value={p.quantita}
                  onChange={(e) =>
                    handleProdottoChange(index, "quantita", e.target.value)
                  }
                  className="bg-gray-800 text-white p-2 rounded w-full"
                  required
                />
              </div>
            )}

            {campiProdotti.includes("prezzoUnitario") && (
              <div>
                <label className="flex items-center gap-1 mb-1">
                  <Package className="w-4 h-4" /> Prezzo unitario
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={p.prezzoUnitario || ""}
                  onChange={(e) =>
                    handleProdottoChange(
                      index,
                      "prezzoUnitario",
                      e.target.value
                    )
                  }
                  className="bg-gray-800 text-white p-2 rounded w-full"
                />
              </div>
            )}

            {formData.prodotti.length > 1 && (
              <button
                type="button"
                onClick={() => rimuoviProdotto(index)}
                className="p-2 rounded-full bg-red-500 hover:bg-red-600 transition self-start"
              >
                <Trash2 className="w-4 h-4 text-white" />
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={aggiungiProdotto}
          className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 transition flex items-center gap-1"
          disabled={
            formData.strutturaOrigineId
              ? !formData.strutturaOrigineId
              : !formData.strutturaId
          }
        >
          <PlusCircle className="w-4 h-4 text-white" /> Aggiungi prodotto
        </button>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <button
          type="button"
          onClick={() => setFormData({ prodotti: [] })}
          className="p-2 rounded-full bg-red-500 hover:bg-red-600 transition"
        >
          <CircleX size={18} className="text-white" />
        </button>
        <button
          type="submit"
          className="p-2 rounded-full bg-green-500 hover:bg-green-600 transition flex items-center justify-center"
        >
          <Save size={18} className="text-white" />
        </button>
      </div>
    </form>
  );
}
