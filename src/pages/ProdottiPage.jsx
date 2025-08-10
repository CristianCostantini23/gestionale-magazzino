import { useOutletContext } from "react-router-dom";
import Form from "../components/Form";
import Lista from "../components/Lista";
import {
  deleteProdotto,
  fetchProdotti,
  postProdotto,
  updateProdotto,
} from "../store/slices/prodottiSlice";

export default function ProdottiPage() {
  const { section } = useOutletContext();

  const config = {
    getElementAction: fetchProdotti,
    onSubmitAction: postProdotto,
    onDeleteAction: deleteProdotto,
    selector: (state) => state.prodotti.prodotti,
  };

  const listFields = [
    "nome",
    "descrizione",
    "brand_id",
    "prezzo_acquisto",
    "prezzo_vendita",
  ];

  const formFields = [
    { name: "nome", label: "Nome prodotto", type: "text" },
    { name: "descrizione", label: "Descrizione", type: "text" },
    {
      name: "brandId",
      label: "Brand",
      type: "select",
      optionsUrl: "/api/brands",
      optionLabel: "nome",
      optionValue: "id",
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
  ];

  const foreignKeys = {
    brand_id: {
      dataUrl: "/api/brands",
      valueField: "id",
      labelField: "nome",
    },
  };

  if (section === "list")
    return (
      <Lista
        {...config}
        fields={listFields}
        foreignKeys={foreignKeys}
        formFields={formFields}
        urlUpdateAction="/prodotti"
        canDelete={true}
        canEdit={true}
        pageName="prodotti"
        onUpdateAction={updateProdotto}
      />
    );
  if (section === "form")
    return (
      <Form
        {...config}
        fields={formFields}
        title="Aggiungi un nuovo prodotto"
        successMessage="Prodotto creato con successo!"
      />
    );

  return null;
}
