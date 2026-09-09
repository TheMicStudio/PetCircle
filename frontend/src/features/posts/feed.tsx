import { useGetPosts } from "./usePosts";
import { PostCreatePage } from "./postList";
import { Link } from "react-router-dom";
import { useSession } from "../auth/session";

export const Feed = () => {
  const posts = useGetPosts();
  const { user } = useSession();


  return (
    <div className="min-h-screen bg-[#f1f1f1] p-6 [color-scheme:light]">
      <PostCreatePage />
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
              <p>y'a des posts ici</p>


            ))}
        </div>
      </div>
    </div>

  );
};
