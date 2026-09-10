import { Link, useNavigate } from 'react-router-dom';
import { useSession } from '../auth/session';
import type { FeedPost } from "@petcircle/contracts";
import { LikeButton } from '../likes/likeButton';
import { Avatar } from '../../shared/components/Avatar';
import { BarkIcon, TrashIcon } from '../../shared/components/icons';
import { formatRelativeDate } from '../../shared/formatDate';

// linkAuthor is off on a profile page: linking to the page you are already on is useless
export const PostList = ({
  items,
  linkAuthor = true,
}: {
  items: FeedPost[];
  linkAuthor?: boolean;
}) => {
  const { user } = useSession();
  const navigate = useNavigate();

  return (
    <ul className="flex flex-col gap-4">
      {items.map((post) => {
        // ownership is per post: the feed mixes several authors
        const isOwner = user !== null && user.id === post.author.id;

        return (
        <li
          key={post.id}
          onClick={() => navigate(`/posts/${post.id}`)}
          className="cursor-pointer overflow-hidden rounded-[0.875rem] bg-pc-surface"
        >
          <div className="flex items-center gap-3 px-[1.125rem] pt-4 pb-3">
            <Avatar username={post.author.username} />

            <div className="min-w-0 flex-1">
              {linkAuthor ? (
                <Link
                  className="text-[0.9375rem] font-bold text-pc-ink no-underline hover:underline hover:underline-offset-2"
                  // the whole card opens the post, the author link must not do both
                  onClick={(event) => event.stopPropagation()}
                  to={`/profile/${post.author.id}`}
                >
                  {post.author.username}
                </Link>
              ) : (
                <span className="text-[0.9375rem] font-bold text-pc-ink">{post.author.username}</span>
              )}
              <div className="mt-1 text-[0.75rem] text-pc-muted2">
                <time dateTime={post.createdAt}>{formatRelativeDate(post.createdAt)}</time>
              </div>
            </div>

            {isOwner && (
              <button
                aria-label="Supprimer ce post"
                className="flex cursor-pointer rounded-[0.5625rem] p-2 text-pc-muted2 transition-colors hover:bg-pc-hover hover:text-pc-danger"
                onClick={(event) => event.stopPropagation()}
                type="button"
              >
                <TrashIcon />
              </button>
            )}
          </div>

          <p className="px-[1.125rem] pb-3.5 text-[0.96875rem] leading-[1.6] whitespace-pre-wrap text-pc-ink2">
            {post.content}
          </p>

          {post.imageUrl !== null && (
            <div className="aspect-[4/3] bg-pc-photo">
              <img alt="" className="h-full w-full object-cover" src={post.imageUrl} />
            </div>
          )}

          <div className="h-px bg-pc-hair" />

          <div className="flex items-center gap-0.5 px-3 py-1.5">
            <LikeButton postId={post.id} likedByMe={post.likedByMe} likeCount={post.likeCount} />

            <Link
              className="flex flex-1 items-center justify-center gap-2 rounded-[0.5625rem] px-2 py-2.5 text-[0.8125rem] font-semibold text-pc-body no-underline transition-colors hover:bg-pc-sand"
              onClick={(event) => event.stopPropagation()}
              to={`/posts/${post.id}`}
            >
              <BarkIcon />
              Commenter
              <span className="text-pc-muted2 tabular-nums">{post.commentCount}</span>
            </Link>
          </div>
        </li>
        );
      })}
    </ul>
  );
};
