import { useFeed } from "./useFeed";
import { PostList } from "./postList";
import { PostCreatePage } from "./postCreate";
import { Link } from "react-router-dom";
import { useSession } from "../auth/session";
import { useState } from "react";
import type { FeedPost } from "@petcircle/contracts";

export const Feed = () => {
  const feed = useFeed();
  const { user } = useSession();
  const [added, setAdded] = useState<FeedPost[]>([]);
  const posts = [...added , ...feed.items];
  return (
    <div className="min-h-screen bg-[#f1f1f1] p-6 [color-scheme:light]">
      <PostCreatePage setAdded={setAdded} />
      <div className="mx-auto w-full max-w-[36rem]">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-[1.5rem] font-semibold tracking-tight text-[#111111]">Fil</h1>

          {user !== null && (
            <Link
              className="text-[0.875rem] font-medium text-[#111111] underline underline-offset-2 hover:text-[#525252]"
              to={`/profile/${user.id}`}
            >
              Voir mon profil
            </Link>
          )}
        </div>

        <div className="mt-6">
          {feed.isLoading && posts.length === 0 && (
            <p className="text-[0.875rem] text-[#525252]">Chargement du fil...</p>
          )}

          {feed.error !== undefined && (
            <p className="rounded-[0.625rem] bg-[#ffc4be] px-3 py-2 text-[0.75rem] font-medium text-[#9e0015]">
              {feed.error}
            </p>
          )}

          {posts.length > 0 && <PostList items={posts} />}

          {posts.length === 0 && !feed.isLoading && feed.error === undefined && (
            <p className="text-[0.875rem] text-[#525252]">Aucun post pour le moment.</p>
          )}

          {feed.hasMore && posts.length > 0 && (
            <button
              className="mt-4 w-full rounded-[0.5rem] border border-solid border-[#00000014] bg-white px-3 py-2 text-[0.875rem] text-[#111111] disabled:opacity-50"
              disabled={feed.isLoading}
              onClick={() => void feed.loadMore()}
            >
              {feed.isLoading ? "Chargement..." : "Charger plus"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
