import type { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { useGetProfile } from "./useProfile";
import { useUserPosts } from "../posts/useFeed";
import { PostList } from "../posts/postList";
import { NotFound } from "../../shared/components/NotFound";
import { AppHeader } from "../../shared/components/AppHeader";
import { MobileNav } from "../../shared/components/MobileNav";
import { Inert } from "../../shared/components/Inert";
import { TrailIcon } from "../../shared/components/icons";
import { PROFILE_TABS } from "../../shared/showcase";
import { useSession } from "../auth/session";
import { ProfileHeader } from "./profileHeader";
import { PetCards } from "./petCards";

const MAX_GRID = 7;

const Screen = ({ children }: { children: ReactNode }) => (
  <div className="pc-app">
    <AppHeader />
    <div className="mx-auto w-full max-w-[71.25rem] px-4 pt-3.5 pb-28 sm:px-[clamp(1rem,3vw,2.125rem)] sm:pt-[clamp(0.875rem,2vw,1.5rem)] sm:pb-16">
      {children}
    </div>
    <MobileNav />
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
        <div className="h-[11.25rem] animate-pulse rounded-[1.125rem] bg-pc-sand sm:h-[clamp(11.25rem,25vw,21rem)]" />
        <p className="mt-6 text-[0.875rem] text-pc-muted">Chargement du profil…</p>
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
          className="rounded-[0.625rem] bg-pc-danger-bg px-3.5 py-2.5 text-[0.8125rem] font-medium text-pc-danger"
          role="alert"
        >
          {profile.message}
        </p>
      </Screen>
    );
  }

  // compare with the id returned by the API, not the raw one from the URL
  const isOwner = user !== null && user.id === profile.data.id;
  const withImage = posts.items.filter((post) => post.imageUrl !== null).slice(0, MAX_GRID);

  return (
    <Screen>
      <ProfileHeader profile={profile.data} isOwner={isOwner} />

      <div className="mt-9 mb-6 flex flex-wrap gap-[clamp(1.125rem,3vw,2rem)] px-[clamp(0.5rem,2vw,1.5rem)]">
        <h2 className="border-b-[3px] border-solid border-pc-cta px-0.5 pb-3 text-[0.9375rem] font-bold text-pc-ink">
          {isOwner ? "Mes publications" : "Publications"}
        </h2>
        {PROFILE_TABS.map((tab) => (
          <Inert className="px-0.5 pb-3 text-[0.9375rem] font-medium text-pc-muted2 hover:text-pc-ink" key={tab}>
            {tab}
          </Inert>
        ))}
      </div>

      {/* the photo grid of the handoff, fed by the posts that carry an image */}
      {withImage.length > 0 && (
        <ul className="mb-9 grid grid-cols-[repeat(auto-fit,minmax(6.5rem,1fr))] gap-3 px-[clamp(0.5rem,2vw,1.5rem)] sm:grid-cols-[repeat(auto-fit,minmax(9.375rem,1fr))]">
          {withImage.map((post, index) => (
            <li className={`aspect-square overflow-hidden bg-pc-photo ${index % 3 === 0 ? "rounded-[1rem]" : "rounded-[0.75rem]"}`} key={post.id}>
              <Link className="block h-full w-full" to={`/posts/${post.id}`}>
                <img alt="" className="h-full w-full object-cover" src={post.imageUrl ?? undefined} />
              </Link>
            </li>
          ))}
          <li>
            <Inert className="flex aspect-square w-full flex-col justify-between rounded-[0.75rem] bg-pc-sage p-4 text-left transition-colors hover:bg-[#deebd3]">
              <TrailIcon className="text-pc-forest" size={20} />
              <span className="font-display text-[1.125rem] leading-[1.15] font-semibold text-pc-forest2">
                Voir les
                <br />
                {profile.data.postCount}
              </span>
            </Inert>
          </li>
        </ul>
      )}

      <section className="mx-auto w-full max-w-[40rem]">
        <div>
          {posts.error !== undefined && (
            <p
              className="rounded-[0.625rem] bg-pc-danger-bg px-3.5 py-2.5 text-[0.8125rem] font-medium text-pc-danger"
              role="alert"
            >
              {posts.error}
            </p>
          )}

          {posts.status === "loading" && (
            <p className="text-[0.875rem] text-pc-muted">Chargement des posts…</p>
          )}

          {posts.items.length > 0 && <PostList items={posts.items} linkAuthor={false} />}

          {posts.status === "empty" && (
            <div className="rounded-[0.875rem] bg-pc-surface px-5 py-10 text-center">
              <p className="font-display text-[1.25rem] font-semibold text-pc-ink">
                {isOwner ? "Rien publié pour le moment" : "Aucune publication"}
              </p>
              <p className="mt-2 text-[0.875rem] text-pc-muted">
                {isOwner
                  ? "Ton premier post attend dans le fil."
                  : "Cet utilisateur n'a encore rien partagé."}
              </p>
            </div>
          )}

          {posts.hasMore && posts.items.length > 0 && (
            <button
              className="mt-4 w-full cursor-pointer rounded-[0.75rem] bg-pc-sand px-4 py-3 text-[0.875rem] font-semibold text-pc-ink transition-colors hover:bg-pc-hover2 disabled:cursor-not-allowed disabled:text-pc-faint"
              disabled={posts.isLoading}
              onClick={() => void posts.loadMore()}
              type="button"
            >
              {posts.isLoading ? "Chargement…" : "Charger plus"}
            </button>
          )}
        </div>
      </section>

      <PetCards />
    </Screen>
  );
};
