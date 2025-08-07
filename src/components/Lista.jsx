import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "./ConfirmModal";

export default function Lista({
  fields = [],
  foreignKeys = {},
  getElementAction,
  urlUpdateAction,
  onDeleteAction,
  selector,
  canEdit = true,
  canDelete = true,
  pageName,
}) {
  const data = useSelector(selector);

  const [errors, setErrors] = useState("");
  const [fkData, setFkData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [elementToDelete, setElementToDelete] = useState(null);
  const hasFetched = useRef(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    hasFetched.current = false;
  }, [pageName]);

  useEffect(() => {
    const loadFKs = async () => {
      console.log("Carico FK...");

      try {
        const promises = Object.entries(foreignKeys).map(
          async ([key, { dataUrl }]) => {
            const res = await axios.get(dataUrl);
            return [key, res.data];
          }
        );

        const result = await Promise.all(promises);
        const formatted = Object.fromEntries(result);
        setFkData(formatted);
        setErrors("");
      } catch (error) {
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
      console.log("Carico dati...");
      try {
        await dispatch(getElementAction()).unwrap();
        setErrors("");
      } catch (error) {
        setErrors("Errore durante il recupero dei dati");
      }
    };

    fetchData();

    // if (!hasFetched.current) {
    //   hasFetched.current = true;
    //   fetchData();
    // }
  }, [dispatch, getElementAction]);

  const renderField = (el, field) => {
    console.log("Render dei campi...");
    if (foreignKeys[field]) {
      const { valueField, labelField } = foreignKeys[field];
      const related = (fkData[field] || []).find(
        (fk) => fk[valueField] === el[field]
      );
      return related ? related[labelField] : "-";
    }
    return el[field];
  };

  if (errors) return <p>{errors}</p>;

  return (
    <>
      <table>
        <thead>
          <tr>
            {fields.map((f) => {
              const label = foreignKeys[f]
                ? f.replace(/_id$/, "").replace(/_/g, " ")
                : f.replace(/_/g, " ");
              return <th key={f}>{label}</th>;
            })}
            {(canEdit || canDelete) && <th>Azioni</th>}
          </tr>
        </thead>
        <tbody>
          {Array.isArray(data) && data.length > 0 ? (
            data.map((el) => (
              <tr key={el.id}>
                {fields.map((f) => {
                  return <td key={f}>{renderField(el, f)}</td>;
                })}
                {(canEdit || canDelete) && (
                  <td>
                    {canEdit && (
                      <button
                        onClick={() => navigate(`${urlUpdateAction}/${el.id}`)}
                      >
                        Modifica
                      </button>
                    )}
                    {canDelete && (
                      <button
                        onClick={() => {
                          setElementToDelete(el);
                          setShowModal(true);
                        }}
                      >
                        Elimina
                      </button>
                    )}
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
    </>
  );
}
