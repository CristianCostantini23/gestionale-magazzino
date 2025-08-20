import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postProdotto } from "../store/slices/sliceProdotti.js";
import { Plus, CircleX, Save } from "lucide-react";

export function FormProdotti() {
  const dispatch = useDispatch();
  const { hasError, errorMessage } = useSelector((state) => state.prodotti);
  const [formData, setFormData] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await dispatch(postProdotto(formData)).unwrap();
      setSuccessMessage("Voce aggiunta con successo!");
      setFormData({});
      setTimeout(() => {
        setSuccessMessage(null);
        setShowForm(false);
      }, 2000);
    } catch (error) {
      console.log("errore durante la richiesta POST", error);
    }
  };

  return (
    <>
      <button
        className="flex flex-row my-2 p-2 rounded-full hover:bg-gray-600 text-green-700 hover:text-green-500 transition items-center"
        disabled={showForm}
        onClick={() => setShowForm(true)}
      >
        <Plus size={20} className="" /> Crea nuovo prodotto
      </button>
      {showForm && (
        <div
          className="rounded-lg bg-gradient-to-t from-gray-700 to-gray-500 text-white
                  w-[80%] p-4 m-3 flex flex-col gap-3 items-start"
        >
          <input
            type="text"
            placeholder="Nome"
            name="nome"
            required
            value={formData.nome || ""}
            onChange={(e) => handleChange(e)}
            className="bg-gray-800 text-white p-2 rounded w-full"
          />

          <input
            type="text"
            placeholder="Descrizione"
            name="descrizione"
            required
            value={formData.descrizione || ""}
            onChange={(e) => handleChange(e)}
            className="bg-gray-800 text-white p-2 rounded w-full"
          />

          <input
            type="text"
            placeholder="Codice"
            name="codice"
            required
            value={formData.codice || ""}
            onChange={(e) => handleChange(e)}
            className="bg-gray-800 text-white p-2 rounded w-full"
          />

          <input
            type="number"
            placeholder="Prezzo vendita"
            name="prezzo_vendita"
            required
            value={formData.prezzo_vendita || ""}
            onChange={(e) => handleChange(e)}
            className="bg-gray-800 text-white p-2 rounded w-full"
          />

          {hasError && (
            <span className="text-red-400 text-sm">{errorMessage.error}</span>
          )}

          {successMessage && (
            <div className="w-full p-3 mb-4 rounded bg-green-600 text-white text-center">
              {successMessage}
            </div>
          )}

          <div className="flex gap-3 mt-2">
            <button
              onClick={() => {
                setShowForm(false);
                setFormData({});
              }}
              className="p-2 rounded-full bg-red-500 hover:bg-red-600 transition"
            >
              <CircleX size={18} className="text-white" />
            </button>

            <button
              onClick={handleSubmit}
              className="p-2 rounded-full bg-green-500 hover:bg-green-600 transition"
            >
              <Save size={18} className="text-white" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
