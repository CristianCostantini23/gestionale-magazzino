import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchMovimentoById } from "../store/slices/sliceMovimenti.js";
import { ListaDettagli } from "../components/ListaDettagli.jsx";

export function DettagliMovimento() {
  const dispatch = useDispatch();
  const { movimentoId } = useParams();
  const selectedMovimento = useSelector(
    (state) => state.movimenti.selectedMovimento
  );
  const { hasError, errorMessage } = useSelector((state) => state.movimenti);

  const campi = ["nome", "codice", "quantità"];

  useEffect(() => {
    dispatch(fetchMovimentoById(movimentoId)).unwrap();
  }, []);

  const dati = {
    struttura: `${selectedMovimento.struttura_origine} -> ${selectedMovimento.struttura_destinazione}`,
    data: selectedMovimento.data_trasferimento,
    prodotti: selectedMovimento.prodotti,
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
