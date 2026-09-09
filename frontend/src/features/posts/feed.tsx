import { useGetPosts } from "./usePosts";
import { PostCreatePage } from "./postList";
import { LikeButton } from "../likes/likeButton";

export const Feed = () => {
  const posts = useGetPosts();

  return (
    <div className="min-h-screen bg-[#f1f1f1] p-6 [color-scheme:light]">
      <PostCreatePage />
      <div className="mx-auto w-full max-w-[36rem]">
        <h1 className="text-[1.5rem] font-semibold tracking-tight text-[#111111]">Fil</h1>

        <div className="mt-6">
          {posts.status === "loading" && <p className="text-[0.875rem] text-[#525252]">Chargement du fil...</p>}

          {posts.status === "error" && (
            <p className="rounded-[0.625rem] bg-[#ffc4be] px-3 py-2 text-[0.75rem] font-medium text-[#9e0015]">
              {posts.message}
            </p>
          )}

          {posts.status === "success" &&
            (posts.data.items.length === 0 ? (
              <p className="text-[0.875rem] text-[#525252]">Aucun post pour le moment.</p>
            ) : (
              <div className="flex flex-col gap-4">
                {posts.data.items.map((post) => (
                  <div className="mt-3">
                      <LikeButton postId={post.id} likedByMe={post.likedByMe} likeCount={post.likeCount} />
                    </div>
                    
                    
                ))}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
