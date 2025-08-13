import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStrutture } from "../store/slices/sliceStrutture";
import { Edit, Trash2, Boxes, Store, Warehouse } from "lucide-react";

export default function Homepage() {
  const dispatch = useDispatch();
  const [error, setError] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchStrutture()).unwrap();
      } catch (error) {
        console.log(error);
        setError("I dati relativi alle tue strutture non sono disponibili");
      }
    };

    fetchData();
  }, []);

  const strutture = useSelector((state) => state.strutture.strutture);

  return (
    <>
      <h1 className="font-extrabold text-5xl block text-center font-title my-5">
        Le tue strutture
      </h1>
      <div className="flex flex-row overflow-y-auto flex-wrap justify-center w-[100%] h-[80%]">
        {strutture.map((s) => (
          <div
            key={s.id}
            className="
                rounded-lg  
                bg-gradient-to-t from-gray-700 to-gray-500 
                text-white
                w-[80%] h-[25%] p-4 m-3
                hover:shadow-xl hover:shadow-gray-700 hover:scale-105
                transition-all duration-200 ease-in-out
                flex justify-between items-center
                font-body
            "
          >
            <div className="flex flex-col">
              {s.tipo === "negozio" && (
                <h2 className="text-lg font-bold capitalize mb-2">
                  <Store size={18} className="text-white" />
                  {s.tipo}
                </h2>
              )}
              {s.tipo === "magazzino" && (
                <h2 className="text-lg font-bold capitalize mb-2">
                  <Warehouse size={18} className="text-white" />
                  {s.tipo}
                </h2>
              )}

              <div className="flex justify-start gap-5 text-sm text-gray-200">
                <p>{s.nome}</p>
                <p>{s.indirizzo}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="relative group">
                <button className="p-2 rounded-full hover:bg-gray-600 transition">
                  <Edit size={18} />
                </button>
                <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 text-xs bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                  Modifica
                </span>
              </div>

              <div className="relative group">
                <button className="p-2 rounded-full hover:bg-gray-600 transition">
                  <Trash2 size={18} className="text-red-400" />
                </button>
                <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 text-xs bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                  Elimina
                </span>
              </div>

              <div className="relative group">
                <button className="p-2 rounded-full hover:bg-gray-600 transition">
                  <Boxes size={18} className="text-green-400" />
                </button>
                <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 text-xs bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                  Vedi Inventario
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
