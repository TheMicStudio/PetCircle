type FollowButtonProps = {
    following: boolean;
    error: string | null;
    onToggle: () => void;
};

// presentational only: the hook lives in the profile header, where the follower count is shown
export const FollowButton = ({ following, error, onToggle }: FollowButtonProps) => {
    return (
        <div className="flex items-center gap-2">
            <button
                aria-pressed={following}
                className={
                    following
                        ? "h-9 rounded-[0.625rem] border border-solid border-[#00000014] bg-white px-4 text-[0.875rem] font-medium text-[#111111] transition-colors hover:border-[#00000029]"
                        : "h-9 rounded-[0.625rem] bg-[#262626] px-4 text-[0.875rem] font-medium text-white transition-colors hover:bg-[#3d3d3d] active:bg-[#525252]"
                }
                onClick={onToggle}
                type="button"
            >
                {following ? "Se désabonner" : "Suivre"}
            </button>

            {error !== null && (
                <span className="text-[0.75rem] text-[#9e0015]" role="status">
                    {error}
                </span>
            )}
        </div>
    );
};
