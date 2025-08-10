import { useOutletContext } from "react-router-dom";
import Form from "../components/Form";
import Lista from "../components/Lista";
import {
  deleteFornitore,
  fetchfornitori,
  postfornitore,
  updateFornitore,
} from "../store/slices/fornitoriSlice";

export default function EntitaPage() {
  const { section } = useOutletContext();

  const config = {
    getElementAction: fetchfornitori,
    onSubmitAction: postfornitore,
    onDeleteAction: deleteFornitore,
    selector: (state) => state.fornitori.fornitori,
  };

  const listFields = ["nome", "telefono", "email"];

  const formFields = [
    { name: "nome", label: "Nome", type: "text" },
    { name: "telefono", label: "Telefono", type: "text" },
    { name: "email", label: "Email", type: "text" },
  ];

  const foreignKeys = {};

  if (section === "list")
    return (
      <Lista
        {...config}
        fields={listFields}
        foreignKeys={foreignKeys}
        urlUpdateAction="/fornitori"
        canDelete={true}
        canEdit={true}
        pageName="fornitori"
        onUpdateAction={updateFornitore}
        formFields={formFields}
      />
    );
  if (section === "form")
    return (
      <Form
        {...config}
        fields={formFields}
        title="Aggiungi fornitore"
        successMessage="Fornitore aggiunto con successo!"
      />
    );

  return null;
}
