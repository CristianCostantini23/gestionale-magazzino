import { useState, useEffect } from "react";
import FormAggiunta from "../components/FormAggiunta.jsx";
import { postScarico } from "../store/slices/sliceScarichi.js";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchProdotti } from "../store/slices/sliceProdotti.js";
import { FormProdotti } from "../components/FormProdotti.jsx";

export default function AggiungiScarico() {
  const [strutturaId, setStrutturaId] = useState("");
  const [strutture, setStrutture] = useState([]);
  const [fornitori, setFornitori] = useState([]);

  const dispatch = useDispatch();
  const prodotti = useSelector((state) => state.prodotti.prodotti);

  useEffect(() => {
    dispatch(fetchProdotti()).unwrap();
  }, [dispatch]);

  useEffect(() => {
    axios
      .get("/api/popola/strutture")
      .then((res) => setStrutture(res.data))
      .catch(() => setStrutture([]));
  }, []);

  useEffect(() => {
    axios
      .get("/api/popola/fornitori")
      .then((res) => setFornitori(res.data))
      .catch(() => setFornitori([]));
  }, []);

  const campi = [
    {
      name: "strutturaId",
      label: "Struttura",
      type: "select",
      required: true,
    },
    {
      name: "dataScarico",
      label: "Data dello Scarico",
      type: "date",
      required: true,
    },
    {
      name: "fornitoreId",
      label: "Fornitore",
      type: "select",
      required: true,
    },
    {
      name: "documentoRiferimento",
      label: "Documento di Riferimento",
      type: "text",
      required: false,
    },
    {
      name: "note",
      label: "Note",
      type: "text",
      required: false,
    },
  ];

  const options = {
    strutturaId: strutture.map((s) => ({ value: s.id, label: s.nome })),
    prodottoId: prodotti.map((p) => ({ value: p.id, label: p.nome })),
    fornitoreId: fornitori.map((f) => ({ value: f.id, label: f.nome })),
  };

  return (
    <>
      <FormProdotti />

      <FormAggiunta
        titolo="Nuovo Scarico Merce"
        campi={campi}
        campiProdotti={["prodottoId", "quantita", "prezzoUnitario"]}
        options={options}
        onSubmitAction={postScarico}
        onStrutturaOrigineChange={null}
      />
    </>
  );
}
