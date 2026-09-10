import { PawIcon } from "../../shared/components/icons";

type LikeButtonProps = {
    liked: boolean;
    error: string | null;
    onToggle: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

// presentational only: the hook lives in the card, where the like count is also shown
export const LikeButton = ({ liked, error, onToggle }: LikeButtonProps) => {
    return (
        <div className="flex min-w-0 flex-1 flex-col items-stretch">
            <button
                type="button"
                onClick={onToggle}
                aria-pressed={liked}
                aria-label={liked ? "Retirer le like" : "Aimer ce post"}
                className={`flex cursor-pointer items-center justify-center gap-2 rounded-[0.5625rem] px-2 py-2.5 text-[0.8125rem] font-semibold transition-colors hover:bg-pc-sand ${liked ? "text-pc-accent" : "text-pc-body"}`}
            >
                <PawIcon />
                Patte
            </button>

            {error !== null && (
                <output className="px-2 pb-1 text-center text-[0.6875rem] font-medium text-pc-danger">
                    {error}
                </output>
            )}
        </div>
    );
};
