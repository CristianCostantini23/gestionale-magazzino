import { useState } from "react";
import { ArrowLeft, ArrowRight, CirclePlus, CircleX, Save } from "lucide-react";
import { useDispatch } from "react-redux";

export default function ListaRisultati({
  titolo,
  campi,
  dati,
  azioni,
  icone,
  isStrutturePage,
  updateAction,
  hasError,
  errorMessage,
}) {
  const dispatch = useDispatch();
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});
  const [localError, setLocalError] = useState(null);

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData(item);
    setLocalError(null);
  };

  const handleChange = (e, campo) => {
    setFormData((prev) => ({
      ...prev,
      [campo]: e.target.value,
    }));
  };

  const handleSave = async (id) => {
    try {
      await dispatch(updateAction({ id, data: formData })).unwrap();
      setEditingId(null);
    } catch (error) {
      console.error("Errore durante il salvataggio:", error);
      setLocalError(error || "Impossibile salvare i dati");
    }
  };

  return (
    <>
      <div className="flex flex-row justify-between">
        <div className="flex flex-row items-center gap-2">
          <div className="relative group">
            <button
              className="p-2 rounded-full hover:bg-gray-600 transition"
              onClick={() => {
                console.log("indietro");
              }}
            >
              <ArrowLeft size={40} className="text-blue-500" />
            </button>
            <span className="absolute top-full left-1/2 -translate-x-1/2 text-xs bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
              Indietro
            </span>
          </div>

          <div className="relative group">
            <button
              className="p-2 rounded-full hover:bg-gray-600 transition"
              onClick={() => {
                console.log("indietro");
              }}
            >
              <ArrowRight size={40} className="text-blue-500" />
            </button>
            <span className="absolute top-full left-1/2 -translate-x-1/2 text-xs bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
              Avanti
            </span>
          </div>
        </div>

        <h1 className="font-extrabold text-5xl block text-center font-title my-5">
          {titolo}
        </h1>

        <div className="flex flex-row items-center">
          <div className="relative group">
            <button
              className="p-2 rounded-full hover:bg-gray-600  transition"
              onClick={() => {
                console.log("aggiungi");
              }}
            >
              <CirclePlus
                size={40}
                className="text-green-700 hover:text-green-500 transition"
              />
            </button>
            <span className="absolute top-full left-1/2 -translate-x-1/2 text-xs bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
              Aggiungi
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-row overflow-y-auto flex-wrap justify-center w-[100%] h-[80%]">
        {hasError && (
          <div className="w-full p-3 mb-4 rounded bg-red-600 text-white text-center">
            {errorMessage || "Si è verificato un errore."}
          </div>
        )}

        {dati.map((d) => (
          <div
            key={d.id}
            className="rounded-lg bg-gradient-to-t from-gray-700 to-gray-500 text-white
                       w-[80%] h-[25%] p-4 m-3
                       hover:shadow-xl hover:shadow-gray-700 hover:scale-105
                       transition-all duration-200 ease-in-out
                       flex justify-between
                       box-content 
                       items-center font-body
                      "
          >
            <div className="flex flex-col">
              <h2 className="text-lg font-bold capitalize mb-2 flex items-center gap-2">
                {isStrutturePage ? icone[d.tipo] : icone.default}

                {isStrutturePage &&
                  (editingId === d.id ? (
                    <select
                      value={formData.tipo || ""}
                      onChange={(e) => handleChange(e, "tipo")}
                      className="bg-gray-800 text-white p-1 rounded"
                    >
                      <option value="negozio">Negozio</option>
                      <option value="magazzino">Magazzino</option>
                    </select>
                  ) : (
                    d.tipo
                  ))}
              </h2>

              <div className="flex justify-start flex-wrap gap-5 text-sm text-gray-200">
                {campi
                  .filter((c) => c !== "tipo")
                  .map((c) =>
                    editingId === d.id ? (
                      <input
                        key={c}
                        value={formData[c] || ""}
                        onChange={(e) => handleChange(e, c)}
                        className="bg-gray-800 text-white p-1 rounded"
                      />
                    ) : (
                      <span key={c}>{d[c]}</span>
                    )
                  )}
              </div>
            </div>

            <div className="flex gap-3">
              {editingId === d.id ? (
                <>
                  <button
                    onClick={() => setEditingId(null)}
                    className="p-2 rounded-full bg-red-500 hover:bg-red-600 transition"
                  >
                    <CircleX size={18} className="text-white" />
                  </button>

                  <button
                    onClick={() => handleSave(d.id)}
                    className="p-2 rounded-full bg-green-500 hover:bg-green-600 transition"
                  >
                    <Save size={18} className="text-white" />
                  </button>
                </>
              ) : (
                <>
                  {azioni?.map((a) => (
                    <div key={a.label} className="relative group">
                      <button
                        className="p-2 rounded-full hover:bg-gray-600 transition"
                        onClick={() =>
                          a.label === "Modifica" ? handleEdit(d) : a.onClick(d)
                        }
                      >
                        {a.icon}
                      </button>
                      <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 text-xs bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                        {a.label}
                      </span>
                    </div>
                  ))}
                </>
              )}

              {editingId === d.id && localError && (
                <span className="text-red-400 text-xs mt-1">{localError}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
