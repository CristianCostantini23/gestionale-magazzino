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

  if (hasError) {
    return (
      <div
        className="
          width-full
          bg-gradient-to-r from-red-800 to-red-600 text-white
          p-3
          rounded-lg
          shadow-xl shadow-gray-700
        "
      >
        <h1>{errorMessage}</h1>
      </div>
    );
  }

  if (!inventario) {
    return (
      <p className="text-center font-body italic m-8 text-xl">
        Caricamento inventario...
      </p>
    );
  }

  return (
    <>
      <div
        className="
          width-full
          bg-gradient-to-r from-gray-700 to-gray-500 text-white
          p-3
          rounded-lg
          shadow-xl shadow-gray-700
        "
      >
        <h1 className="font-title font-bold text-2xl uppercase ml-4">
          {inventario.nomeStruttura}
        </h1>

        <div
          className="
            flex flex-row justify-start gap-3 
            font-title font-bold text-xl
            p-4
          "
        >
          <h2>{inventario.tipoStruttura}</h2>
          <h2>{inventario.indirizzoStruttura}</h2>
        </div>
      </div>

      {inventario.inventario.length === 0 ? (
        <p className="text-center font-body italic m-8 text-xl">
          Questo inventario è al momento vuoto
        </p>
      ) : (
        <div className="mt-6 rounded-lg shadow-lg overflow-hidden">
          <div className="table w-full">
            <div className="table-header-group bg-gray-700 text-white font-title uppercase">
              <div className="table-row">
                <div className="table-cell px-4 py-2">Nome Prodotto</div>
                <div className="table-cell px-4 py-2">Descrizione</div>
                <div className="table-cell px-4 py-2">Codice</div>
                <div className="table-cell px-4 py-2 text-center">Quantità</div>
              </div>
            </div>

            <div className="table-row-group font-body bg-gray-50">
              {inventario.inventario.map((i, idx) => (
                <div
                  key={idx}
                  className={`table-row ${
                    idx % 2 === 0 ? "bg-gray-100" : "bg-gray-200"
                  } hover:bg-gray-300 transition`}
                >
                  <div className="table-cell px-4 py-2">{i.nome_prodotto}</div>
                  <div className="table-cell px-4 py-2">{i.descrizione}</div>
                  <div className="table-cell px-4 py-2">{i.codice}</div>
                  <div className="table-cell px-4 py-2 text-center font-semibold">
                    {i.quantita}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
