import { useApiMutation } from "../api/mutation/useMutation";
import { TrashIcon } from "./icons";

type DeleteButtonProps = {
    path: string;
    label: string;
    onDeleted: () => void;
};

// shown to the author only, the API checks the author again anyway
export const DeleteButton = ({ path, label, onDeleted }: DeleteButtonProps) => {
    const remove = useApiMutation<void, void>("DELETE", path);
    const isLoading = remove.state.status === "loading";

    const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
        // a post card opens the post on click, the delete button must not do both
        event.stopPropagation();

        if (!window.confirm(`${label} ?`)) {
            return;
        }

        const result = await remove.mutate();

        // 204, no body to validate: only the status matters
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
                onClick={handleClick}
                type="button"
            >
                <TrashIcon />
            </button>
        </div>
    );
};
