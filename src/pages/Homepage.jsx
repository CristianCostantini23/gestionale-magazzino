import { useDispatch, useSelector } from "react-redux";
import { GraficoVendite } from "../components/GraficoVendite.jsx";
import { useEffect } from "react";
import {
  fetchUltimoMovimento,
  fetchUltimoScarico,
} from "../store/slices/sliceHompage.js";
import { Truck, ArrowLeftRight, ListCollapse } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Homepage() {
  const ultimoScarico = useSelector((state) => state.homepage.ultimoScarico);
  const ultimoMovimento = useSelector(
    (state) => state.homepage.ultimoMovimento
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchUltimoScarico());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchUltimoMovimento());
  }, [dispatch]);

  return (
    <div className="flex flex-col justify-between items-center">
      <GraficoVendite />

      <div
        className={`rounded-lg bg-gradient-to-t from-gray-700 to-gray-500 text-white
              w-[80%] h-[25%] p-8 m-3
              hover:shadow-xl hover:shadow-gray-700 hover:scale-105
              transition-all duration-200 ease-in-out
              flex flex-col gap-2 justify-between
              box-content 
              items-start font-body`}
      >
        <h2 className="text-lg font-bold capitalize mb-2 flex items-center gap-2">
          <Truck /> Ultimo scarico
        </h2>

        {ultimoScarico.message ? (
          <div className="flex flex-row flex-wrap font-body">
            <span>{ultimoScarico.message}</span>
          </div>
        ) : (
          <div className="flex flex-row justify-between items-center w-full">
            <div className="flex flex-row flex-wrap font-body gap-3">
              <span>{ultimoScarico.struttura}</span>
              <span>{ultimoScarico.data}</span>
              <span>{ultimoScarico.fornitore}</span>
              <span>{ultimoScarico.documento}</span>
              <span>{ultimoScarico.note}</span>
            </div>

            <div className="relative group">
              <button
                className="p-2 rounded-full hover:bg-gray-600 transition"
                onClick={() => navigate(`/scarichi/${ultimoScarico.id}`)}
              >
                <ListCollapse />
              </button>
              <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 text-xs bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                dettagli scarico
              </span>
            </div>
          </div>
        )}
      </div>

      <div
        className={`rounded-lg bg-gradient-to-t from-gray-700 to-gray-500 text-white
              w-[80%] h-[25%] p-8 m-3
              hover:shadow-xl hover:shadow-gray-700 hover:scale-105
              transition-all duration-200 ease-in-out
              flex flex-col gap-2 justify-between
              box-content 
              items-start font-body`}
      >
        <h2 className="text-lg font-bold capitalize mb-2 flex items-center gap-2">
          <ArrowLeftRight /> Ultimo movimento
        </h2>

        {ultimoMovimento.message ? (
          <div className="flex flex-row flex-wrap font-body">
            <span>{ultimoMovimento.message}</span>
          </div>
        ) : (
          <div className="flex flex-row justify-between items-center w-full">
            <div className="flex flex-row flex-wrap font-body gap-3">
              <span>{ultimoMovimento.struttura}</span>
              <span>{ultimoMovimento.data}</span>
              <span>{ultimoMovimento.documento}</span>
              <span>{ultimoMovimento.note}</span>
            </div>

            <div className="relative group">
              <button
                className="p-2 rounded-full hover:bg-gray-600 transition"
                onClick={() => navigate(`/movimenti/${ultimoMovimento.id}`)}
              >
                <ListCollapse />
              </button>
              <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 text-xs bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                dettagli movimento
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
