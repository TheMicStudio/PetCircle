import { PawIcon } from "../../shared/components/icons";
import { useLike } from "./useLikes";
import type { LikeButtonProps } from "./like.types";

// "Patte" action from the handoff: the paw turns amber once liked, the count sits beside the label
export const LikeButton = (props: LikeButtonProps) => {
    const { liked, count, error, toggle } = useLike(props);

    return (
        <div className="flex min-w-0 flex-1 flex-col items-stretch">
            <button
                type="button"
                onClick={toggle}
                aria-pressed={liked}
                aria-label={liked ? "Retirer le like" : "Aimer ce post"}
                className={`flex cursor-pointer items-center justify-center gap-2 rounded-[0.5625rem] px-2 py-2.5 text-[0.8125rem] font-semibold transition-colors hover:bg-pc-sand ${liked ? "text-pc-accent" : "text-pc-body"}`}
            >
                <PawIcon />
                Patte
                <span className={`tabular-nums ${liked ? "text-pc-accent" : "text-pc-muted2"}`}>{count}</span>
            </button>

            {error !== null && (
                <span role="status" className="px-2 pb-1 text-center text-[0.6875rem] font-medium text-pc-danger">
                    {error}
                </span>
            )}
        </div>
    );
};
