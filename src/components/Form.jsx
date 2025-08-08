import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";

export default function Form({
  fields = [],
  onSubmitAction,
  getElementAction,
  title = "Aggiungi elemento",
  successMessage = "Elemento creato con successo!",
  initialData = {}, // nuovo
}) {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState(() =>
    fields.reduce(
      (acc, field) => ({
        ...acc,
        [field.name]: initialData[field.name] ?? "",
      }),
      {}
    )
  );

  const [status, setStatus] = useState("idle");
  const [errors, setErrors] = useState({});
  const [optionData, setOptionData] = useState({});

  useEffect(() => {
    const loadOptions = async () => {
      const selects = fields.filter((f) => f.type === "select" && f.optionsUrl);
      const promises = selects.map(async (f) => {
        const res = await axios.get(f.optionsUrl);
        return [f.name, res.data];
      });
      const result = await Promise.all(promises);
      setOptionData(Object.fromEntries(result));
    };

    loadOptions();
  }, [fields]);

  useEffect(() => {
    setFormData(
      fields.reduce(
        (acc, field) => ({
          ...acc,
          [field.name]: initialData[field.name] ?? "",
        }),
        {}
      )
    );
  }, [initialData, fields]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleBlur = (e) => {
    const { name, value, type } = e.target;

    if (type === "number") {
      const num = parseFloat(value);
      if (isNaN(num) || num < 0) {
        setErrors((prev) => ({
          ...prev,
          [name]: "Inserisci un numero positivo",
        }));
        setFormData((prev) => ({ ...prev, [name]: "" }));
        return;
      }
      setFormData((prev) => ({ ...prev, [name]: num.toFixed(2) }));
    }
  };

  const isFormValido = () => {
    return fields.every((field) => formData[field.name] !== "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    for (const field of fields) {
      if (field.type === "number" && field.castToNumber) {
        formData[field.name] = parseFloat(formData[field.name]);
      }
      if (field.type === "select" && field.castToNumber) {
        formData[field.name] = parseInt(formData[field.name]);
      }
    }

    try {
      await dispatch(onSubmitAction(formData)).unwrap();
      setFormData(
        fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {})
      );
      setStatus("success");
    } catch (error) {
      console.error("Errore durante la submit del form:", error);
      const errData = error;

      if (errData?.messaggio) {
        setErrors({ global: errData.messaggio });
      } else if (errData?.errore && errData?.duplicati) {
        const lista = errData.duplicati.join(", ");
        setErrors({ global: `ATTENZIONE! ${errData.errore}: ${lista}` });
      } else if (errData?.errore) {
        setErrors({ global: errData.errore });
      } else {
        setErrors({ global: "Errore imprevisto durante l'invio." });
      }

      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-bold">{title}</h2>

      {fields.map((field) => (
        <div key={field.name}>
          <label htmlFor={field.name} className="block font-semibold">
            {field.label}
          </label>

          {field.type === "select" ? (
            <select
              name={field.name}
              id={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              disabled={!optionData[field.name]}
              required
              className="border rounded px-2 py-1 w-full"
            >
              <option value="">Seleziona...</option>
              {(optionData[field.name] || []).map((opt) => (
                <option
                  key={opt[field.optionValue]}
                  value={opt[field.optionValue]}
                >
                  {opt[field.optionLabel]}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={field.type || "text"}
              id={field.name}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              onBlur={handleBlur}
              step={field.type === "number" ? "0.01" : undefined}
              required
              className="border rounded px-2 py-1 w-full"
            />
          )}

          {errors[field.name] && (
            <span className="text-red-600 text-sm">{errors[field.name]}</span>
          )}
        </div>
      ))}

      {errors.global && <p className="text-red-600 text-sm">{errors.global}</p>}
      {status === "success" && (
        <p className="text-green-600 text-sm">{successMessage}</p>
      )}

      <button
        type="submit"
        disabled={status === "loading" || !isFormValido()}
        className={`px-4 py-2 rounded text-white ${
          isFormValido()
            ? "bg-green-600 hover:bg-green-700"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        {status === "loading" ? "Caricamento..." : "Invia"}
      </button>
    </form>
  );
}
