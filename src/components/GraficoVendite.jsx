import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDatiGraficoVendite } from "../store/slices/sliceHompage.js";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export function GraficoVendite() {
  const [query, setQuery] = useState("year");
  const datiGraficoVendite = useSelector(
    (state) => state.homepage.graficoVendite
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchDatiGraficoVendite(query)).unwrap();
  }, [dispatch, query]);

  return (
    <div className="flex flex-col gap-8 justify-between items-center w-full">
      <h1 className="font-title text-3xl font-bold text-center">
        Andamento vendite
      </h1>
      <div className="flex flex-row gap-4">
        <button
          onClick={() => {
            setQuery("year");
          }}
          className={`rounded-3xl bg-gradient-to-t from-gray-700 to-gray-500 ${
            query === "year"
              ? "text-blue-300 shadow-lg shadow-gray-700 scale-120"
              : "text-white"
          } p-3 transition-all duration-200 ease-in-out`}
        >
          Anno
        </button>
        <button
          onClick={() => {
            setQuery("quarter");
          }}
          className={`rounded-3xl bg-gradient-to-t from-gray-700 to-gray-500 ${
            query === "quarter"
              ? "text-blue-300 shadow-lg shadow-gray-700 scale-120"
              : "text-white"
          } p-3 transition-all duration-200 ease-in-out`}
        >
          Trimestre
        </button>
        <button
          onClick={() => {
            setQuery("month");
          }}
          className={`rounded-3xl bg-gradient-to-t from-gray-700 to-gray-500 ${
            query === "month"
              ? "text-blue-300 shadow-lg shadow-gray-700 scale-120"
              : "text-white"
          } p-3 transition-all duration-200 ease-in-out`}
        >
          Mese
        </button>
      </div>

      <ResponsiveContainer width="95%" height={350}>
        <LineChart data={datiGraficoVendite}>
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="label" tick={{ fill: "white" }} />
          <YAxis
            tick={{ fill: "white" }}
            tickFormatter={(value) => `€${value}`}
          />
          <Tooltip
            formatter={(value) => `€${value}`}
            contentStyle={{ backgroundColor: "#1f2937", borderRadius: "8px" }}
            labelStyle={{ color: "white" }}
          />
          <Legend wrapperStyle={{ color: "white" }} />
          <Line
            type="monotone"
            dataKey="totale"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
