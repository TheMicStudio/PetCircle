import type { FeedPost } from "@petcircle/contracts";


export const PostList = ({ items }: { items: FeedPost[] }) => {
  return (
    <ul className="flex flex-col gap-4">
      {items.map((post) => (
        <li
          key={post.id}
          className="rounded-[0.75rem] border border-solid border-[#00000014] bg-white p-4 shadow-[0_1px_2px_#0000000d]"
        >
          <div className="flex items-baseline justify-between">
            <span className="text-[0.875rem] font-medium text-[#111111]">{post.author.username}</span>
            <span className="text-[0.75rem] text-[#9e9e9e]">
              {new Date(post.createdAt).toLocaleDateString("fr-FR")}
            </span>
          </div>

          <p className="mt-2 text-[0.875rem] whitespace-pre-wrap text-[#111111]">{post.content}</p>

          {post.imageUrl !== null && (
            <img className="mt-3 w-full rounded-[0.5rem]" src={post.imageUrl} />
          )}

          <div className="mt-3 flex gap-4 text-[0.75rem] text-[#525252]">
            <span>{post.likeCount} j'aime</span>
            <span>{post.commentCount} commentaires</span>
          </div>
        </li>
      ))}
    </ul>
  );
};
