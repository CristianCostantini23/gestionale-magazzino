import * as Dialog from "@radix-ui/react-dialog";
import FormModifica from "./FormModifica";

export default function ModalModifica({
  open,
  onOpenChange,
  formFields = {},
  onUpdateAction,
  title = "Modifica elemento",
  successMessage = "Elemento aggiornato con successo!",
  initialState,
  onCancel,
  onSuccess,
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg">
          <Dialog.Title className="text-lg font-bold mb-4">
            {title}
          </Dialog.Title>

          <FormModifica
            formFields={formFields}
            onUpdateAction={onUpdateAction}
            title={title}
            successMessage={successMessage}
            initialState={initialState}
            onCancel={onCancel}
            onSuccess={onSuccess}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
