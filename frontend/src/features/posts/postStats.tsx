import { PawIcon } from "../../shared/components/icons";

// "342 pattes · 28 commentaires" line from the handoff, shared by the card and the detail
export const PostStats = ({ likeCount, commentCount }: { likeCount: number; commentCount: number }) => (
  <div className="flex items-center gap-2.5 text-[0.78125rem] text-pc-muted">
    <span className="flex items-center gap-1.5">
      <PawIcon className="text-pc-accent" />
      <span className="tabular-nums">
        {likeCount} patte{likeCount > 1 ? "s" : ""}
      </span>
    </span>
    <span aria-hidden="true">·</span>
    <span className="tabular-nums">
      {commentCount} commentaire{commentCount > 1 ? "s" : ""}
    </span>
  </div>
);
