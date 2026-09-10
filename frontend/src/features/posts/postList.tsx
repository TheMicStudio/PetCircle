import { Link, useNavigate } from 'react-router-dom';
import { useSession } from '../auth/session';
import type { FeedPost } from "@petcircle/contracts";
import { LikeButton } from '../likes/likeButton';
import { DeleteButton } from '../../shared/components/DeleteButton';

// linkAuthor is off on a profile page: linking to the page you are already on is useless
export const PostList = ({
  items,
  linkAuthor = true,
  onDeleted,
}: {
  items: FeedPost[];
  linkAuthor?: boolean;
  onDeleted: (id: string) => void;
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
          className="rounded-[0.75rem] border border-solid border-[#00000014] bg-white p-4 shadow-[0_1px_2px_#0000000d]"
        >
          <div className="flex items-baseline justify-between">
            {linkAuthor ? (
              <Link
                className="text-[0.875rem] font-medium text-[#111111] hover:underline hover:underline-offset-2"
                // the whole card opens the post, the author link must not do both
                onClick={(event) => event.stopPropagation()}
                to={`/profile/${post.author.id}`}
              >
                {post.author.username}
              </Link>
            ) : (
              <span className="text-[0.875rem] font-medium text-[#111111]">
                {post.author.username}
              </span>
            )}
            <span className="text-[0.75rem] text-[#9e9e9e]">
              {new Date(post.createdAt).toLocaleDateString("fr-FR")}
            </span>
          </div>

          <p className="mt-2 text-[0.875rem] whitespace-pre-wrap text-[#111111]">{post.content}</p>

          {post.imageUrl !== null && (
            <img className="mt-3 w-full rounded-[0.5rem]" src={post.imageUrl} />
          )}

          <div className="mt-3 flex items-center gap-4 text-[0.75rem] text-[#525252]">
            <LikeButton postId={post.id} likedByMe={post.likedByMe} likeCount={post.likeCount} />
            <span>{post.commentCount} commentaires</span>

            {isOwner && (
              <DeleteButton
                label="Supprimer ce post"
                onDeleted={() => onDeleted(post.id)}
                path={`/posts/${post.id}`}
              />
            )}
          </div>
        </li>
        );
      })}
    </ul>
  );
};
