import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ListaRisultati from "../components/ListaRisultati.jsx";
import { useNavigate } from "react-router-dom";
import { ListCollapse, Truck } from "lucide-react";
import { fetchScarichi } from "../store/slices/sliceScarichi.js";

export default function PaginaScarichi() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const scarichi = useSelector((state) => state.scarichi.scarichi);
  const { hasError, errorMessage } = useSelector((state) => state.scarichi);

  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    dispatch(fetchScarichi()).unwrap();
  }, [dispatch]);

  const azioni = [
    {
      label: "Dettagli scarico",
      icon: <ListCollapse size={18} />,
      onClick: (item) => navigate(`/scarichi/${item.scarico_id}`, item),
    },
  ];

  const icone = {
    default: <Truck size={18} className="text-white" />,
  };

  const campi = [
    "nome_struttura",
    "data_scarico",
    "nome_fornitore",
    "documento_riferimento",
    "note",
  ];

  return (
    <>
      <ListaRisultati
        titolo="Scarichi merce"
        dati={scarichi}
        hasError={hasError}
        errorMessage={errorMessage}
        azioni={azioni}
        icone={icone}
        campi={campi}
        isStrutturePage={false}
        updateAction={null}
        postAction={null}
        formFields={null}
        canAdd={false}
      />
    </>
  );
}
