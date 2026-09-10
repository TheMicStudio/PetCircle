import type { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { useGetProfile } from "./useProfile";
import { useUserPosts } from "../posts/useFeed";
import { PostList } from "../posts/postList";
import { NotFound } from "../../shared/components/NotFound";
import { useSession } from "../auth/session";
import { ProfileHeader } from "./profileHeader";

const Screen = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen bg-[#f1f1f1] p-6 [color-scheme:light]">
    <div className="mx-auto w-full max-w-[36rem]">{children}</div>
  </div>
);

// one page, two contexts: the signed in user on his own profile, or a visitor
export const ProfilePage = () => {
  const { id } = useParams();
  const userId = id ?? "";

  const { user } = useSession();
  const profile = useGetProfile(userId);
  const posts = useUserPosts(userId);

  if (profile.status === "loading") {
    return (
      <Screen>
        <p className="text-[0.875rem] text-[#525252]">Chargement du profil...</p>
      </Screen>
    );
  }

  // must stay before the generic error branch, both match status 'error'
  if (profile.status === "error" && profile.httpStatus === 404) {
    return (
      <NotFound
        title="Profil introuvable"
        message="Cet utilisateur n'existe pas ou a supprimé son compte."
      />
    );
  }

  if (profile.status === "error") {
    return (
      <Screen>
        <p
          className="rounded-[0.625rem] bg-[#ffc4be] px-3 py-2 text-[0.75rem] font-medium text-[#9e0015]"
          role="alert"
        >
          {profile.message}
        </p>
      </Screen>
    );
  }

  // compare with the id returned by the API, not the raw one from the URL
  const isOwner = user !== null && user.id === profile.data.id;

  return (
    <Screen>
      <Link
        className="text-[0.875rem] text-[#525252] underline underline-offset-2 hover:text-[#111111]"
        to="/feed"
      >
        Retour au fil
      </Link>

      <ProfileHeader profile={profile.data} isOwner={isOwner} />

      <section className="mt-8">
        <h2 className="text-[0.75rem] font-medium tracking-[0.08em] text-[#9e9e9e] uppercase">
          {isOwner ? "Mes publications" : "Publications"}
        </h2>

        <div className="mt-3">
          {posts.error !== undefined && (
            <p
              className="rounded-[0.625rem] bg-[#ffc4be] px-3 py-2 text-[0.75rem] font-medium text-[#9e0015]"
              role="alert"
            >
              {posts.error}
            </p>
          )}

          {posts.isLoading && posts.items.length === 0 && (
            <p className="text-[0.875rem] text-[#525252]">Chargement des posts...</p>
          )}

          {posts.items.length > 0 && <PostList items={posts.items} linkAuthor={false} />}

          {posts.items.length === 0 && !posts.isLoading && posts.error === undefined && (
            <p className="text-[0.875rem] text-[#525252]">
              {isOwner
                ? "Tu n'as rien publié pour le moment."
                : "Cet utilisateur n'a rien publié."}
            </p>
          )}

          {posts.hasMore && posts.items.length > 0 && (
            <button
              className="mt-4 w-full rounded-[0.5rem] border border-solid border-[#00000014] bg-white px-3 py-2 text-[0.875rem] text-[#111111] disabled:opacity-50"
              disabled={posts.isLoading}
              onClick={() => void posts.loadMore()}
            >
              {posts.isLoading ? "Chargement..." : "Charger plus"}
            </button>
          )}
        </div>
      </section>
    </Screen>
  );
};
