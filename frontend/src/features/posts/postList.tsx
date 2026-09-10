import type { FeedPost } from "@petcircle/contracts";
import { PostCard } from './postCard';

// linkAuthor is off on a profile page: linking to the page you are already on is useless
export const PostList = ({
  items,
  linkAuthor = true,
}: {
  items: FeedPost[];
  linkAuthor?: boolean;
}) => (
  <ul className="flex flex-col gap-4">
    {items.map((post) => (
      <PostCard key={post.id} linkAuthor={linkAuthor} post={post} />
    ))}
  </ul>
);
