import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ConfirmModal from "./ConfirmModal";
import ModalModifica from "./ModalModifica";

export default function Lista({
  fields = [],
  foreignKeys = {},
  getElementAction,
  onDeleteAction,
  onUpdateAction,
  selector,
  canEdit = true,
  canDelete = true,
  pageName,
  formFields,
}) {
  const data = useSelector(selector);

  const [errors, setErrors] = useState("");
  const [fkData, setFkData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [elementToDelete, setElementToDelete] = useState(null);
  const [elementToEdit, setElementToEdit] = useState(null);
  const hasFetched = useRef(false);

  const dispatch = useDispatch();

  useEffect(() => {
    hasFetched.current = false;
  }, [pageName]);

  useEffect(() => {
    const loadFKs = async () => {
      try {
        const promises = Object.entries(foreignKeys).map(
          async ([key, { dataUrl }]) => {
            const res = await fetch(dataUrl);
            const json = await res.json();
            return [key, json];
          }
        );

        const result = await Promise.all(promises);
        setFkData(Object.fromEntries(result));
        setErrors("");
      } catch {
        setErrors("Errore nel caricamento dei dati");
      }
    };

    if (!hasFetched.current) {
      hasFetched.current = true;
      loadFKs();
    }
  }, [foreignKeys]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(getElementAction()).unwrap();
        setErrors("");
      } catch {
        setErrors("Errore durante il recupero dei dati");
      }
    };

    fetchData();
  }, [dispatch, getElementAction]);

  const renderField = (el, field) => {
    const value = el[field];

    if (foreignKeys[field]) {
      const { valueField, labelField } = foreignKeys[field];
      const related = (fkData[field] || []).find(
        (fk) => fk[valueField] === value
      );
      return related ? related[labelField] : "-";
    }

    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) {
      const date = new Date(value);
      return date.toLocaleDateString("it-IT");
    }

    return value;
  };

  if (errors) return <p>{errors}</p>;

  return (
    <>
      <table className="w-full border-collapse border border-gray-600 table-auto text-center bg-gray-500 text-gray-300 shadow-2xl shadow-gray-700">
        <thead>
          <tr>
            {fields.map((f) => {
              const label = foreignKeys[f]
                ? f.replace(/_id$/, "").replace(/_/g, " ")
                : f.replace(/_/g, " ");
              return (
                <th key={f} className="border border-gray-300 p-1.5">
                  {label}
                </th>
              );
            })}
            {(canEdit || canDelete) && <th>Azioni</th>}
          </tr>
        </thead>
        <tbody className="bg-white text-black">
          {Array.isArray(data) && data.length > 0 ? (
            data.map((el) => (
              <tr key={el.id} className="hover:bg-gray-400">
                {fields.map((f) => (
                  <td key={f} className="border border-gray-300 p-1.5">
                    {renderField(el, f)}
                  </td>
                ))}
                {(canEdit || canDelete) && (
                  <td className="border border-gray-300 p-1.5">
                    <div className="flex flex-col items-center gap-1">
                      {canEdit && (
                        <button
                          className="hover:text-blue-800"
                          onClick={() => {
                            setElementToEdit(el);
                            setShowEditModal(true);
                            console.log(elementToEdit);
                          }}
                        >
                          Modifica
                        </button>
                      )}
                      {canDelete && (
                        <button
                          className="hover:text-red-700"
                          onClick={() => {
                            setElementToDelete(el);
                            setShowModal(true);
                          }}
                        >
                          Elimina
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={fields.length + 1}>Nessun dato disponibile</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* MODAL ELIMINAZIONE */}
      <ConfirmModal
        open={showModal}
        onClose={setShowModal}
        elementToDelete={elementToDelete}
        onDelete={async (id) => {
          return await dispatch(onDeleteAction(id)).unwrap();
        }}
        message={`Vuoi davvero eliminare "${
          elementToDelete?.nome || "questo elemento"
        }"?`}
      />

      {/* MODAL MODIFICA  */}
      <ModalModifica
        open={showEditModal}
        onOpenChange={setShowEditModal}
        formFields={formFields}
        onUpdateAction={onUpdateAction}
        initialState={elementToEdit}
        onCancel={() => setShowEditModal(false)}
        onSuccess={() => setShowEditModal(false)}
      />
    </>
  );
}
