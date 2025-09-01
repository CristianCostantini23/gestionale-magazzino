import { useState, useEffect } from "react";
import FormAggiunta from "../components/FormAggiunta.jsx";
import { postMovimento } from "../store/slices/sliceMovimenti.js";
import axios from "axios";

export default function AggiungiMovimento() {
  const [strutturaId, setStrutturaId] = useState("");
  const [prodotti, setProdotti] = useState([]);
  const [strutture, setStrutture] = useState([]);

  useEffect(() => {
    axios
      .get("/api/popola/strutture")
      .then((res) => setStrutture(res.data))
      .catch(() => setStrutture([]));
  }, []);

  useEffect(() => {
    if (strutturaId) {
      axios
        .get(`/api/popola/prodotti/${strutturaId}`)
        .then((res) =>
          setProdotti(
            res.data
              .filter((p) => p.quantita > 0)
              .map((p) => ({
                value: p.id,
                label: p.nome,
                quantita: p.quantita,
              }))
          )
        )
        .catch(() => setProdotti([]));
    }
  }, [strutturaId]);

  const campi = [
    {
      name: "strutturaOrigineId",
      label: "Struttura Origine",
      type: "select",
      required: true,
    },
    {
      name: "strutturaDestinazioneId",
      label: "Struttura Destinazione",
      type: "select",
      required: true,
    },
    {
      name: "dataTrasferimento",
      label: "Data del Movimento",
      type: "date",
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
    strutturaOrigineId: strutture.map((s) => ({ value: s.id, label: s.nome })),
    strutturaDestinazioneId: strutture.map((s) => ({
      value: s.id,
      label: s.nome,
    })),
    prodottoId: prodotti,
  };

  const handleStrutturaChange = (value) => {
    setProdotti([]);
    setStrutturaId(value);
  };

  return (
    <>
      <FormAggiunta
        titolo="Nuovo Movimento Merce"
        campi={campi}
        campiProdotti={["prodottoId", "quantita"]}
        options={options}
        onSubmitAction={postMovimento}
        onStrutturaOrigineChange={handleStrutturaChange}
      />
    </>
  );
}
