import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ListaRisultati from "../components/ListaRisultati.jsx";
import { useNavigate } from "react-router-dom";
import { ArrowLeftRight, ListCollapse } from "lucide-react";
import { fetchMovimenti } from "../store/slices/sliceMovimenti.js";

export default function PaginaMovimenti() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const movimenti = useSelector((state) => state.movimenti.movimenti);
  const { hasError, errorMessage } = useSelector((state) => state.movimenti);

  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    dispatch(fetchMovimenti()).unwrap();
  }, [dispatch]);

  const azioni = [
    {
      label: "Dettagli movimento",
      icon: <ListCollapse size={18} />,
      onClick: (item) => console.log("Dettagli", item),
    },
  ];

  const icone = {
    default: <ArrowLeftRight size={18} className="text-white" />,
  };

  const campi = [
    "struttura_origine",
    "struttura_destinazione",
    "data_trasferimento",
    "documento_riferimento",
    "note",
  ];

  return (
    <>
      <ListaRisultati
        titolo="Movimenti merce"
        dati={movimenti}
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
