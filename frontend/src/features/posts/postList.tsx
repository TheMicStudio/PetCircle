import { Link, useNavigate } from 'react-router-dom';
import { useSession } from '../auth/session';
import type { FeedPost } from "@petcircle/contracts";

const TrashIcon = () => (
  <svg
    aria-hidden="true"
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

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
            <span>{post.likeCount} j'aime</span>
            <span>{post.commentCount} commentaires</span>

            {isOwner && (
              <button
                aria-label="Supprimer ce post"
                className="ml-auto text-[#525252] transition-colors hover:text-[#9e0015]"
                onClick={(event) => event.stopPropagation()}
                type="button"
              >
                <TrashIcon />
              </button>
            )}
          </div>
        </li>
        );
      })}
    </ul>
  );
};
