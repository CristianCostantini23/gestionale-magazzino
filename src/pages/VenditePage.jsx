import { useOutletContext } from "react-router-dom";
import Lista from "../components/Lista";
import { getDettagliVendite, postVendita } from "../store/slices/venditeSlice";
import FormVendite from "../components/FormVendite";

export default function VenditePage() {
  const { section } = useOutletContext();

  const config = {
    getElementAction: getDettagliVendite,
    onSubmitAction: postVendita,
    selector: (state) => state.vendite.vendite,
  };

  const listFields = [
    "entita",
    "prodotto",
    "quantità",
    "prezzo_unitario",
    "data_vendita",
  ];

  const foreignKeys = {};

  if (section === "list")
    return (
      <Lista
        {...config}
        fields={listFields}
        urlUpdateAction={undefined}
        canDelete={false}
        canEdit={false}
        pageName="vendite"
      />
    );
  if (section === "form") return <FormVendite />;

  return null;
}
