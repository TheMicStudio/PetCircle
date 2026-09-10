import { Link } from "react-router-dom";
import type { FeedPost, PostAuthor } from "@petcircle/contracts";
import { PawIcon } from "../../shared/components/icons";
import { useSession } from "../auth/session";
import { FollowSuggestion } from "../follow/followSuggestion";
import { useFollowSuggestions } from "../follow/useFollowSuggestions";

const MAX_CANDIDATES = 6;
const MAX_SUGGESTIONS = 4;
const MAX_TOP_POSTS = 3;

// authors seen in the loaded feed, without me, first appearance wins
const authorsOf = (posts: FeedPost[], myId: string | undefined): PostAuthor[] => {
  const seen = new Set<string>();
  const authors: PostAuthor[] = [];

  for (const post of posts) {
    if (post.author.id === myId || seen.has(post.author.id)) continue;
    seen.add(post.author.id);
    authors.push(post.author);
  }

  return authors.slice(0, MAX_CANDIDATES);
};

const topOf = (posts: FeedPost[]): FeedPost[] =>
  [...posts]
    .filter((post) => post.likeCount > 0)
    .sort((a, b) => b.likeCount - a.likeCount)
    .slice(0, MAX_TOP_POSTS);

// Right rail of the feed. Everything here is derived from the posts already loaded, there is
// no discovery route in the API.
export const DiscoveryRail = ({ posts }: { posts: FeedPost[] }) => {
  const { user } = useSession();
  const suggestions = useFollowSuggestions(authorsOf(posts, user?.id), MAX_SUGGESTIONS);
  const top = topOf(posts);

  return (
    <div className="flex flex-col gap-4">
      {suggestions.length > 0 && (
        <section className="rounded-[0.875rem] bg-pc-surface p-[1.125rem]">
          <h3 className="mb-4 text-[0.9375rem] font-bold text-pc-ink">À suivre</h3>
          <ul className="flex flex-col gap-[0.9375rem]">
            {suggestions.map((profile) => (
              <FollowSuggestion key={profile.id} profile={profile} />
            ))}
          </ul>
        </section>
      )}

      {top.length > 0 && (
        <section className="rounded-[0.875rem] bg-pc-forest p-[1.125rem] text-[#f4eadc]">
          <h3 className="mb-1 text-[0.9375rem] font-bold">Top posts du fil</h3>
          <ul className="flex flex-col">
            {top.map((post) => (
              <li key={post.id}>
                <Link className="flex items-center gap-3 py-3 no-underline" to={`/posts/${post.id}`}>
                  {post.imageUrl !== null ? (
                    <img
                      alt=""
                      className="h-[2.875rem] w-[2.875rem] shrink-0 rounded-[0.5rem] bg-pc-photo object-cover"
                      src={post.imageUrl}
                    />
                  ) : (
                    <span className="flex h-[2.875rem] w-[2.875rem] shrink-0 items-center justify-center rounded-[0.5rem] bg-pc-forest2 text-[#f8c070]">
                      <PawIcon size={18} />
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="line-clamp-2 text-[0.84375rem] leading-[1.4] font-medium text-[#f4eadc]">
                      {post.content}
                    </span>
                    <span className="mt-1 block text-[0.71875rem] text-[#c9dcbf]">
                      {post.author.username} · {post.likeCount} patte{post.likeCount > 1 ? "s" : ""}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};
