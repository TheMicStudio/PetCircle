import type { FeedPost } from "@petcircle/contracts";
import { PostCard } from './postCard';

// linkAuthor is off on a profile page: linking to the page you are already on is useless
export const PostList = ({
  items,
  linkAuthor = true,
  onDeleted,
}: {
  items: FeedPost[];
  linkAuthor?: boolean;
  onDeleted: (id: string) => void;
}) => (
  <ul className="flex flex-col gap-4">
    {items.map((post) => (
      <PostCard key={post.id} linkAuthor={linkAuthor} onDeleted={() => onDeleted(post.id)} post={post} />
    ))}
  </ul>
);
