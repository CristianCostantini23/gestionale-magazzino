import { useOutletContext } from "react-router-dom";
import Form from "../components/Form";
import Lista from "../components/Lista";
import {
  deleteEntita,
  fetchEntita,
  postEntita,
  updateEntita,
} from "../store/slices/entitaSlice";

export default function EntitaPage() {
  const { section } = useOutletContext();

  const config = {
    getElementAction: fetchEntita,
    onSubmitAction: postEntita,
    onDeleteAction: deleteEntita,
    selector: (state) => state.entita.entita,
  };

  const listFields = ["nome", "tipo", "indirizzo", "data_creazione"];

  const formFields = [
    { name: "nome", label: "Nome", type: "text" },
    { name: "tipo", label: "Tipo", type: "text" },
    { name: "indirizzo", label: "Indirizzo", type: "text" },
  ];

  const foreignKeys = {};

  if (section === "list")
    return (
      <Lista
        {...config}
        fields={listFields}
        foreignKeys={foreignKeys}
        urlUpdateAction="/entita"
        canDelete={true}
        canEdit={true}
        pageName="entita"
        onUpdateAction={updateEntita}
        formFields={formFields}
      />
    );
  if (section === "form")
    return (
      <Form
        {...config}
        fields={formFields}
        title="Aggiungi entità"
        successMessage="Entità aggiunta con successo!"
      />
    );

  return null;
}
