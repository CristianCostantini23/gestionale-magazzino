import * as Dialog from "@radix-ui/react-dialog";

export default function ConfirmModal({ open, onClose, onConfirm, message }) {
  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 bg-white rounded-lg shadow-lg p-6 w-full max-w-sm transform -translate-x-1/2 -translate-y-1/2">
          <Dialog.Title className="text-lg font-semibold mb-4">
            Conferma eliminazione
          </Dialog.Title>
          <div className="mb-6">
            <p>{message}</p>
          </div>
          <div className="flex justify-end gap-2">
            <Dialog.Close asChild>
              <button
                onClick={() => onClose(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Annulla
              </button>
            </Dialog.Close>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Elimina
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
