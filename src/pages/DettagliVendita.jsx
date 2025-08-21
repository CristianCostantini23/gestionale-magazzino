import { useDispatch, useSelector } from "react-redux";
import { ListaDettagli } from "../components/ListaDettagli.jsx";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchVenditaById } from "../store/slices/sliceVendite.js";

export function Dettaglivendita() {
  const dispatch = useDispatch();
  const { venditaId } = useParams();
  const selectedVendita = useSelector((state) => state.vendite.selectedVendita);
  const { hasError, errorMessage } = useSelector((state) => state.vendite);

  useEffect(() => {
    dispatch(fetchVenditaById(venditaId)).unwrap();
  }, []);

  const campi = ["nome prodotto", "codice", "quantità", "prezzo unitario"];

  const dati = {
    struttura: selectedVendita.nome_struttura,
    data: selectedVendita.data_vendita,
    prodotti: selectedVendita.prodotti,
  };

  return (
    <ListaDettagli
      dati={dati}
      campi={campi}
      hasError={hasError}
      errorMessage={errorMessage}
    />
  );
}
