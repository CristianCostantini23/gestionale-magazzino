import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ListaRisultati from "../components/ListaRisultati.jsx";
import { useNavigate } from "react-router-dom";
import { fetchVendite } from "../store/slices/sliceVendite.js";
import { ListCollapse, ShoppingCart } from "lucide-react";

export default function PaginaVendite() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const vendite = useSelector((state) => state.vendite.vendite);
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
      onClick: (item) => {
        console.log(item);
        navigate(`/vendite/${item.id}`);
      },
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
        postAction={null}
        formFields={null}
        canAdd={false}
      />
    </>
  );
}
