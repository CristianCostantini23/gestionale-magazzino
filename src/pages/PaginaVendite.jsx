import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ListaRisultati from "../components/ListaRisultati.jsx";
import ConfirmModal from "../components/ConfirmModal.jsx";
import { useNavigate } from "react-router-dom";
import {
  fetchVendite,
  fetchVenditaById,
  postVendita,
} from "../store/slices/sliceVendite.js";
import { ListCollapse, ShoppingCart } from "lucide-react";

export default function PaginaStrutture() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const vendite = useSelector((state) => state.strutture.vendite);
  const { hasError, errorMessage } = useSelector((state) => state.vendite);

  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    dispatch(fetchVendite()).unwrap();
  }, [dispatch]);

  const azioni = [
    {
      label: "Dettagli vendita",
      icon: <ListCollapse size={18} />,
      onClick: (item) => console.log("Dettagli", item),
    },
  ];

  const icone = {
    default: <ShoppingCart size={18} className="text-white" />,
  };

  const campi = ["nome_struttura", "data_vendita", "totale"];

  return (
    <>
      <ListaRisultati
        titolo="Vendite"
        dati={vendite}
        hasError={hasError}
        errorMessage={errorMessage}
        azioni={azioni}
        icone={icone}
        campi={campi}
        isStrutturePage={false}
        updateAction={null}
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
