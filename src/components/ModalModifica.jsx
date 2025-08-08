import * as Dialog from "@radix-ui/react-dialog";
import Form from "./Form";

export default function ModalModifica({
  open,
  onOpenChange,
  fields,
  foreignKeys = {},
  onSubmitAction,
  initialData,
  title = "Modifica elemento",
  successMessage = "Elemento aggiornato con successo!",
}) {
  const mappedFields = fields.map((f) => {
    if (foreignKeys[f]) {
      const { dataUrl, labelField, valueField } = foreignKeys[f];
      return {
        name: f,
        label: f.replace(/_id$/, "").replace(/_/g, " "),
        type: "select",
        optionsUrl: dataUrl,
        optionLabel: labelField,
        optionValue: valueField,
        castToNumber: true,
      };
    }
    return {
      name: f,
      label: f.replace(/_/g, " "),
      type: "text",
    };
  });

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg">
          <Dialog.Title className="text-lg font-bold mb-4"></Dialog.Title>

          <Form
            fields={mappedFields}
            onSubmitAction={onSubmitAction}
            initialData={initialData}
            title={title}
            successMessage={successMessage}
          />

          <Dialog.Close asChild>
            <button className="mt-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
              Chiudi
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
