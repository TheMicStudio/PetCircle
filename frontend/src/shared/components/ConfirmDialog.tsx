import { Button } from "./Button";

type ConfirmDialogProps = {
    open: boolean;
    title: string;
    confirmLabel: string;
    loading: boolean;
    onConfirm: () => void;
    onCancel: () => void;
};

export const ConfirmDialog = ({ open, title, confirmLabel, loading, onConfirm, onCancel }: ConfirmDialogProps) => {
    if (!open) {
        return null;
    }

    return (
        <dialog
            className="m-auto w-[calc(100%-2rem)] max-w-[24rem] rounded-[0.875rem] bg-pc-surface text-pc-ink backdrop:bg-[#26181066]"
            onClick={(event) => {
                if (event.target === event.currentTarget) onCancel();
            }}
            onClose={onCancel}
            ref={(node) => {
                if (node !== null && !node.open) node.showModal();
            }}
        >
            <div className="p-6">
                <p className="font-display text-[1.125rem] font-semibold">{title}</p>
                <div className="mt-5 flex justify-end gap-2">
                    <Button variant="secondary" onClick={onCancel}>
                        Annuler
                    </Button>
                    <Button disabled={loading} onClick={onConfirm}>
                        {confirmLabel}
                    </Button>
                </div>
            </div>
        </dialog>
    );
};
