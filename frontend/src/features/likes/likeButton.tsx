import { LikeIcon } from "./likeIcon";
import { useLike } from "./useLikes";
import type { LikeButtonProps } from "./like.types";

export const LikeButton = (props: LikeButtonProps) => {
    const { liked, count, error, toggle } = useLike(props);

    return (
        <div className="flex items-center gap-2">
            <button
                type="button"
                onClick={toggle}
                aria-pressed={liked}
                aria-label={liked ? "Retirer le like" : "Aimer ce post"}
                className="text-[#525252] transition-opacity hover:opacity-70"
            >
                <LikeIcon liked={liked} likeCount={count} />
            </button>

            {error !== null && (
                <span role="status" className="text-[0.75rem] text-[#9e0015]">
                    {error}
                </span>
            )}
        </div>
    );
};
