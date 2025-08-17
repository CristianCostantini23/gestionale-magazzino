import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStrutture,
  updateStruttura,
  deleteStruttura,
} from "../store/slices/sliceStrutture.js";
import ListaRisultati from "../components/ListaRisultati.jsx";
import ConfirmModal from "../components/ConfirmModal.jsx";
import { Edit, Trash2, Boxes, Store, Warehouse } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PaginaStrutture() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const strutture = useSelector((state) => state.strutture.strutture);
  const { hasError, errorMessage } = useSelector((state) => state.strutture);

  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    dispatch(fetchStrutture()).unwrap();
  }, [dispatch]);

  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setOpenConfirm(true);
  };

  const handleDelete = (id) => {
    return dispatch(deleteStruttura(id));
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
    {
      label: "Vedi Inventario",
      icon: <Boxes size={18} className="text-green-400" />,
      onClick: (item) => navigate(`/strutture/${item.id}`, item),
    },
  ];

  const icone = {
    negozio: <Store size={18} className="text-white" />,
    magazzino: <Warehouse size={18} className="text-white" />,
  };

  const campi = ["nome", "tipo", "indirizzo"];

  return (
    <>
      <ListaRisultati
        titolo="Le tue Strutture"
        dati={strutture}
        hasError={hasError}
        errorMessage={errorMessage}
        azioni={azioni}
        icone={icone}
        campi={campi}
        isStrutturePage={true}
        updateAction={updateStruttura}
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
