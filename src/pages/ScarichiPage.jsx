import { useOutletContext } from "react-router-dom";
import Form from "../components/Form";
import Lista from "../components/Lista";
import {
  fetchAllScarichiMerce,
  postScaricoMerce,
} from "../store/slices/scarichiMerceSlice";
import { useCallback, useMemo } from "react";

export default function ScarichiPage() {
  const { section } = useOutletContext();

  const getElementAction = fetchAllScarichiMerce;
  const onSubmitAction = postScaricoMerce;

  const selector = useCallback((state) => state.scarichiMerce.scarichi, []);

  const config = {
    getElementAction,
    onSubmitAction,
    selector,
  };

  const listFields = useMemo(
    () => [
      "nome_fornitore",
      "nome_prodotto",
      "nome_entita",
      "quantità",
      "prezzo_acquisto",
      "prezzo_vendita",
      "data_arrivo",
    ],
    []
  );

  const formFields = useMemo(
    () => [
      {
        name: "fornitoreId",
        label: "Fornitore",
        type: "select",
        optionsUrl: "/api/suppliers",
        optionLabel: "nome",
        optionValue: "id",
        castToNumber: true,
      },
      {
        name: "prodottoId",
        label: "Prodotto",
        type: "select",
        optionsUrl: "/api/products",
        optionLabel: "nome",
        optionValue: "id",
        castToNumber: true,
      },
      {
        name: "entitaId",
        label: "Entità",
        type: "select",
        optionsUrl: "/api/entities",
        optionLabel: "nome",
        optionValue: "id",
        castToNumber: true,
      },
      {
        name: "quantita",
        label: "Quantità",
        type: "number",
        castToNumber: true,
      },
      {
        name: "prezzoAcquisto",
        label: "Prezzo di Acquisto",
        type: "number",
        castToNumber: true,
      },
      {
        name: "prezzoVendita",
        label: "Prezzo di Vendita",
        type: "number",
        castToNumber: true,
      },
    ],
    []
  );

  if (section === "list")
    return (
      <Lista
        {...config}
        fields={listFields}
        urlUpdateAction={undefined}
        foreignKeys={undefined}
        canDelete={false}
        canEdit={false}
        pageName="scarichi"
      />
    );

  if (section === "form")
    return (
      <Form
        {...config}
        fields={formFields}
        title="Aggiungi scarico"
        successMessage="Scarico aggiunto con successo!"
      />
    );

  return null;
}
