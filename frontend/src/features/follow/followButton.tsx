import { CollarIcon } from "../../shared/components/icons";

type FollowButtonProps = {
    following: boolean;
    error: string | null;
    onToggle: () => void;
    size?: "md" | "sm";
};

const SIZES = {
    md: "gap-2 rounded-[0.75rem] px-5 py-3.5 text-[0.84375rem]",
    sm: "gap-1.5 rounded-[0.5rem] px-3.5 py-2 text-[0.75rem]",
};

// presentational only: the hook lives in the profile header, where the follower count is shown
export const FollowButton = ({ following, error, onToggle, size = "md" }: FollowButtonProps) => {
    return (
        <div className="flex flex-col items-center gap-1.5 sm:items-end">
            <button
                aria-pressed={following}
                className={`flex cursor-pointer items-center font-bold transition-colors ${SIZES[size]} ${
                    following
                        ? "bg-pc-sage text-pc-forest hover:bg-pc-hover"
                        : "bg-pc-forest text-pc-surface hover:bg-pc-forest2"
                }`}
                onClick={onToggle}
                type="button"
            >
                {size === "md" && <CollarIcon />}
                {following ? "Abonné" : "Suivre"}
            </button>

            {error !== null && (
                <span className="text-[0.75rem] font-medium text-pc-danger" role="alert">
                    {error}
                </span>
            )}
        </div>
    );
};
