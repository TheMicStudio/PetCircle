import { useState } from "react";
import { useApiMutation } from "../api/mutation/useMutation";
import { ConfirmDialog } from "./ConfirmDialog";
import { TrashIcon } from "./icons";

type DeleteButtonProps = {
    path: string;
    label: string;
    onDeleted: () => void;
};

export const DeleteButton = ({ path, label, onDeleted }: DeleteButtonProps) => {
    const [confirming, setConfirming] = useState(false);
    const remove = useApiMutation<void, void>("DELETE", path);
    const isLoading = remove.state.status === "loading";

    const handleConfirm = async () => {
        const result = await remove.mutate();

        setConfirming(false);

        if (result.ok) {
            onDeleted();
        }
    };

    return (
        <div className="flex items-center gap-2">
            {remove.state.status === "error" && (
                <span role="alert" className="text-[0.75rem] font-medium text-pc-danger">
                    {remove.state.message}
                </span>
            )}

            <button
                aria-label={label}
                className="flex cursor-pointer rounded-[0.5625rem] p-2 text-pc-muted2 transition-colors hover:bg-pc-hover hover:text-pc-danger disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isLoading}
                onClick={(event) => {
                    event.stopPropagation();
                    setConfirming(true);
                }}
                type="button"
            >
                <TrashIcon />
            </button>

            <ConfirmDialog
                confirmLabel={isLoading ? "Suppression…" : "Supprimer"}
                loading={isLoading}
                onCancel={() => setConfirming(false)}
                onConfirm={() => void handleConfirm()}
                open={confirming}
                title={`${label} ?`}
            />
        </div>
    );
};
