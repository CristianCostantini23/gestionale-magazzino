import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";

function mapInitialState(initialState, formFields) {
  const mapped = {};

  if ("id" in initialState) {
    mapped.id = initialState.id;
  }

  formFields.forEach(({ name, castToNumber }) => {
    if (name === "id") return;

    let val =
      initialState[name] !== undefined
        ? initialState[name]
        : initialState[name.replace(/[A-Z]/g, (m) => "_" + m.toLowerCase())] ??
          "";

    if (castToNumber && val !== "") {
      val = Number(val);
    }

    mapped[name] = val;
  });

  return mapped;
}

export default function FormModifica({
  initialState,
  onUpdateAction,
  formFields,
  successMessage = "Elemento aggiornato con successo!",
  onCancel,
  onSuccess,
}) {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [optionData, setOptionData] = useState({});
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    if (status === "success" && onSuccess) {
      const timeout = setTimeout(() => {
        onSuccess();
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [status, onSuccess]);

  useEffect(() => {
    if (initialState) {
      setFormData(mapInitialState(initialState, formFields));
      setErrors({});
      setStatus("idle");
    }
  }, [initialState, formFields]);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const selects = formFields.filter(
          (f) => f.type === "select" && f.optionsUrl
        );
        const promises = selects.map(async (f) => {
          const res = await axios.get(f.optionsUrl);
          return [f.name, res.data];
        });
        const result = await Promise.all(promises);
        setOptionData(Object.fromEntries(result));
      } catch {
        setErrors((e) => ({ ...e, global: "Errore caricamento opzioni" }));
      }
    };

    loadOptions();
  }, [formFields]);

  const handleChange = (e) => {
    let { name, value } = e.target;
    const field = formFields.find((f) => f.name === name);

    if (field?.castToNumber) {
      value = value === "" ? "" : Number(value);
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
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
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setErrors({});

    try {
      await dispatch(
        onUpdateAction({ id: formData.id, data: formData })
      ).unwrap();

      setStatus("success");
    } catch (errData) {
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
    <form onSubmit={handleSubmit}>
      {formFields.map((field) => (
        <div key={field.name} className="mb-4">
          <label htmlFor={field.name} className="block font-semibold mb-1">
            {field.label}
          </label>

          {field.type === "select" ? (
            <select
              name={field.name}
              id={field.name}
              value={formData[field.name] ?? ""}
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
              value={formData[field.name] ?? ""}
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

      {errors.global && (
        <p className="text-red-600 text-sm mb-2">{errors.global}</p>
      )}
      {status === "success" && (
        <p className="text-green-600 text-sm mb-2">{successMessage}</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="mr-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {status === "loading" ? "Salvando..." : "Salva"}
      </button>

      <button
        type="button"
        onClick={() => {
          if (onCancel) onCancel();
        }}
        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
      >
        Annulla
      </button>
    </form>
  );
}
