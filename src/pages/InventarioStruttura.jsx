import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchInventarioByStrutturaId } from "../store/slices/sliceInventari";

export default function InventarioStruttura() {
  const inventario = useSelector((state) => state.inventari.selectedInventario);
  const { hasError, errorMessage } = useSelector((state) => state.inventari);
  const { strutturaId } = useParams();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchInventarioByStrutturaId(strutturaId)).unwrap();
  }, [dispatch, strutturaId]);

  if (!inventario) {
    return <p>DA SISTEMARE!!!</p>;
  }

  return (
    <>
      <h1 className="font-title font-bold text-2xl">
        {inventario.nomeStruttura}
      </h1>

      <div className="flex flex-row justify-start gap-3 font-title font-bold text-xl">
        <h2>{inventario.tipoStruttura}</h2>
        <h2>{inventario.indirizzoStruttura}</h2>
      </div>

      {inventario.inventario.length === 0 ? (
        <p>Questo inventario è al momento vuoto</p>
      ) : (
        <div className="table w-full">
          <div className="table-header-group">
            <div className="table-row">
              <div className="table-cell">Nome Prodotto</div>
              <div className="table-cell">Descrizione</div>
              <div className="table-cell">Codice</div>
              <div className="table-cell">Quantità</div>
            </div>
          </div>
          <div className="table-row-group">
            {inventario.inventario.map((i) => (
              <div className="table-row">
                <div className="table-cell">{i.nome_prodotto}</div>
                <div className="table-cell">{i.descrizione}</div>
                <div className="table-cell">{i.codice}</div>
                <div className="table-cell">{i.quantita}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
