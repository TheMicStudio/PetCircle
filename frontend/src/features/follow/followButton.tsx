import { CollarIcon } from "../../shared/components/icons";

type FollowButtonProps = {
    following: boolean;
    error: string | null;
    onToggle: () => void;
};

// presentational only: the hook lives in the profile header, where the follower count is shown
export const FollowButton = ({ following, error, onToggle }: FollowButtonProps) => {
    return (
        <div className="flex flex-col items-center gap-1.5 sm:items-end">
            <button
                aria-pressed={following}
                className={
                    following
                        ? "flex cursor-pointer items-center gap-2 rounded-[0.75rem] bg-pc-sage px-5 py-3.5 text-[0.84375rem] font-bold text-pc-forest transition-colors hover:bg-pc-hover"
                        : "flex cursor-pointer items-center gap-2 rounded-[0.75rem] bg-pc-forest px-5 py-3.5 text-[0.84375rem] font-bold text-pc-surface transition-colors hover:bg-pc-forest2"
                }
                onClick={onToggle}
                type="button"
            >
                <CollarIcon />
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
