import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ConfirmModal from "../components/ConfirmModal";
import ListaRisultati from "../components/ListaRisultati";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFornitori,
  updateFornitore,
  deleteFornitore,
  postFornitore,
} from "../store/slices/sliceFornitori.js";
import { Package, Edit, Trash2 } from "lucide-react";

export default function PaginaFornitori() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fornitori = useSelector((state) => state.fornitori.fornitori);
  const { hasError, errorMessage } = useSelector((state) => state.fornitori);

  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    dispatch(fetchFornitori()).unwrap();
  }, [dispatch]);

  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setOpenConfirm(true);
  };

  const handleDelete = (id) => {
    return dispatch(deleteFornitore(id));
  };

  const azioni = [
    {
      label: "Modifica",
      icon: <Edit size={18} />,
      onClick: (item) => console.log("Modifica", item),
    },
    {
      label: "Elimina",
      icon: <Trash2 size={18} className="text-red-400" />,
      onClick: handleDeleteClick,
    },
  ];

  const icone = { default: <Package size={22} className="text-white" /> };

  const campi = ["nome", "cell", "email"];

  const formFields = [
    {
      name: "nome",
      label: "nome",
      type: "text",
    },
    {
      name: "cell",
      label: "cellulare",
      type: "text",
    },
    {
      name: "email",
      label: "e-mail",
      type: "email",
    },
  ];

  return (
    <>
      <ListaRisultati
        titolo="Fornitori"
        dati={fornitori}
        hasError={hasError}
        errorMessage={errorMessage}
        azioni={azioni}
        icone={icone}
        campi={campi}
        isStrutturePage={false}
        updateAction={updateFornitore}
        postAction={postFornitore}
        formFields={formFields}
        canAdd={true}
      />

      <ConfirmModal
        open={openConfirm}
        onClose={setOpenConfirm}
        elementToDelete={selectedItem}
        message={`Sei sicuro di voler eliminare "${selectedItem?.nome || ""}"?`}
        onDelete={handleDelete}
        errorMessage={errorMessage}
      />
    </>
  );
}
