import { useDispatch, useSelector } from "react-redux";
import { ListaDettagli } from "../components/ListaDettagli.jsx";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { fetchScaricoById } from "../store/slices/sliceScarichi.js";

export function DettagliScarico() {
  const dispatch = useDispatch();
  const { scaricoId } = useParams();
  const selectedScarico = useSelector(
    (state) => state.scarichi.selectedScarico
  );
  const { hasError, errorMessage } = useSelector((state) => state.scarichi);

  const campi = ["nome prodotto", "codice", "quantità", "prezzo unitario"];

  useEffect(() => {
    dispatch(fetchScaricoById(scaricoId)).unwrap();
  }, []);

  const dati = {
    struttura: selectedScarico.nome_struttura,
    data: selectedScarico.data_scarico,
    prodotti: selectedScarico.prodotti,
  };

  return (
    <>
      <ListaDettagli
        dati={dati}
        campi={campi}
        hasError={hasError}
        errorMessage={errorMessage}
      />
    </>
  );
}
