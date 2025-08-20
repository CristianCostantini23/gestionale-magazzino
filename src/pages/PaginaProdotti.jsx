import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ConfirmModal from "../components/ConfirmModal";
import ListaRisultati from "../components/ListaRisultati";
import { useDispatch, useSelector } from "react-redux";
import { Barcode, Edit, Trash2 } from "lucide-react";
import {
  deleteProdotto,
  fetchProdotti,
  postProdotto,
  updateProdotto,
} from "../store/slices/sliceProdotti.js";

export default function PaginaProdotti() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const prodotti = useSelector((state) => state.prodotti.prodotti);
  const { hasError, errorMessage } = useSelector((state) => state.prodotti);

  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    dispatch(fetchProdotti()).unwrap();
  }, [dispatch]);

  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setOpenConfirm(true);
  };

  const handleDelete = (id) => {
    return dispatch(deleteProdotto(id));
  };

  const azioni = [
    {
      label: "Modifica",
      icon: <Edit size={18} />,
      onClick: (item) => console.log("Modifica", item),
    },
    // {
    //   label: "Elimina",
    //   icon: <Trash2 size={18} className="text-red-400" />,
    //   onClick: handleDeleteClick,
    // },
  ];

  const icone = { default: <Barcode size={22} className="text-white" /> };

  const campi = ["nome", "descrizione", "codice", "prezzo_vendita"];

  const formFields = [
    {
      name: "nome",
      label: "nome",
      type: "text",
    },
    {
      name: "descrizione",
      label: "descrizione",
      type: "text",
    },
    {
      name: "codice",
      label: "codice",
      type: "text",
    },
    {
      name: "prezzo_vendita",
      label: "prezzo vendita",
      type: "number",
    },
  ];

  return (
    <>
      <ListaRisultati
        titolo="Prodotti"
        dati={prodotti}
        hasError={hasError}
        errorMessage={errorMessage}
        azioni={azioni}
        icone={icone}
        campi={campi}
        isStrutturePage={false}
        updateAction={updateProdotto}
        postAction={postProdotto}
        formFields={formFields}
        canAdd={true}
      />

      {/* <ConfirmModal
        open={openConfirm}
        onClose={setOpenConfirm}
        elementToDelete={selectedItem}
        message={`Sei sicuro di voler eliminare "${selectedItem?.nome || ""}"?`}
        onDelete={handleDelete}
        errorMessage={errorMessage}
      /> */}
    </>
  );
}
