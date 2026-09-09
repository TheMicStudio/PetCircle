import { useFeed } from "./useFeed";
import { PostList } from "./postList";
import { PostCreatePage } from "./postList";
import { LikeButton } from "../likes/likeButton";

export const Feed = () => {
  const feed = useFeed();

  return (
    <div className="min-h-screen bg-[#f1f1f1] p-6 [color-scheme:light]">
      <PostCreatePage />
      <div className="mx-auto w-full max-w-[36rem]">
        <h1 className="text-[1.5rem] font-semibold tracking-tight text-[#111111]">Fil</h1>

        <div className="mt-6">
          {feed.isLoading && feed.items.length === 0 && (
            <p className="text-[0.875rem] text-[#525252]">Chargement du fil...</p>
          )}

          {feed.error !== undefined && (
            <p className="rounded-[0.625rem] bg-[#ffc4be] px-3 py-2 text-[0.75rem] font-medium text-[#9e0015]">
              {feed.error}
            </p>
          )}

          {feed.items.length > 0 && <PostList items={feed.items} />}

          {feed.items.length === 0 && !feed.isLoading && feed.error === undefined && (
            <p className="text-[0.875rem] text-[#525252]">Aucun post pour le moment.</p>
          )}

          {feed.hasMore && feed.items.length > 0 && (
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
