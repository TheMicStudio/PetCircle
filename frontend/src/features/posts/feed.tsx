import { useState } from "react";
import type { FeedPost, FeedScope } from "@petcircle/contracts";
import { NavLink } from "react-router-dom";
import { useFeed } from "./useFeed";
import { PostList } from "./postList";
import { PostCreatePage } from "./postCreate";
import { useSession } from "../auth/session";
import { AppHeader } from "../../shared/components/AppHeader";
import { CollarIcon, DenIcon, DogHeadIcon, RailIcon } from "../../shared/components/icons";

const TABS: { value: FeedScope; label: string; icon?: boolean }[] = [
  { value: "all", label: "Tous les posts" },
  { value: "following", label: "Ma meute", icon: true },
];

const DESKTOP = "(min-width: 64rem)";

const navLinkClass = ({ isActive }: { isActive: boolean }): string =>
  `flex items-center gap-3 rounded-[0.625rem] px-3.5 py-3 text-[0.9375rem] no-underline transition-colors ${
    isActive ? "bg-pc-sage font-bold text-pc-forest" : "font-medium text-pc-body hover:bg-pc-hover hover:text-pc-ink"
  }`;

export const Feed = () => {
  const [scope, setScope] = useState<FeedScope>("all");
  const feed = useFeed(scope);
  const { user } = useSession();
  const [added, setAdded] = useState<FeedPost[]>([]);
  // the rail is a column on desktop and a drawer below, so it starts open only on desktop
  const [railOpen, setRailOpen] = useState(() => window.matchMedia(DESKTOP).matches);
  const posts = [...added, ...feed.items];

  return (
    <div className="min-h-screen bg-pc-page font-body text-pc-ink [color-scheme:light]">
      <AppHeader
        leading={
          <button
            aria-expanded={railOpen}
            aria-label="Navigation"
            className={`flex cursor-pointer rounded-[0.625rem] p-2.5 transition-colors ${railOpen ? "bg-pc-sage text-pc-forest" : "text-pc-body2 hover:bg-pc-hover hover:text-pc-ink"}`}
            onClick={() => setRailOpen((open) => !open)}
            type="button"
          >
            <RailIcon />
          </button>
        }
      />

      {railOpen && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-[85] bg-[#26181066] lg:hidden"
          onClick={() => setRailOpen(false)}
        />
      )}

      <div className="mx-auto flex max-w-[86rem] items-start gap-[clamp(1.125rem,2.4vw,2rem)] px-4 pt-4 pb-24 sm:px-[clamp(1rem,3vw,2.125rem)] sm:pt-[clamp(1rem,2.4vw,1.75rem)]">
        <aside
          className={`fixed inset-y-0 left-0 z-[90] flex w-[min(86vw,18.75rem)] flex-col gap-7 overflow-y-auto bg-pc-page px-4 py-5 transition-transform duration-300 lg:sticky lg:top-[4.25rem] lg:z-auto lg:w-[13.25rem] lg:shrink-0 lg:bg-transparent lg:px-0 lg:py-0 lg:transition-none ${railOpen ? "translate-x-0" : "-translate-x-full lg:hidden"}`}
        >
          <nav aria-label="Principale" className="flex flex-col gap-0.5">
            <NavLink className={navLinkClass} to="/feed">
              <DenIcon />
              Fil
            </NavLink>
            {user !== null && (
              <NavLink className={navLinkClass} to={`/profile/${user.id}`}>
                <DogHeadIcon className="text-pc-accent" size={18} />
                Mon profil
              </NavLink>
            )}
          </nav>

          <p className="mt-auto px-3.5 text-[0.75rem] leading-[1.7] text-pc-muted2">
            PetCircle
            <br />
            Pensé pour les animaux d'abord.
          </p>
        </aside>

        <main className="mx-auto flex w-full min-w-0 max-w-[40rem] flex-col gap-4">
          <PostCreatePage setAdded={setAdded} />

          {/* changing the scope changes the url, which resets the list on its own */}
          <div className="flex gap-[3px] self-start rounded-[0.6875rem] bg-pc-sand p-[3px]" role="group" aria-label="Filtrer le fil">
            {TABS.map((tab) => (
              <button
                aria-pressed={scope === tab.value}
                className={`flex cursor-pointer items-center gap-1.5 rounded-[0.5625rem] px-4 py-2.5 text-[0.78125rem] font-bold transition-colors ${
                  scope === tab.value ? "bg-pc-surface text-pc-ink" : "text-pc-body2 hover:text-pc-ink"
                }`}
                key={tab.value}
                onClick={() => setScope(tab.value)}
                type="button"
              >
                {tab.icon && <CollarIcon size={15} />}
                {tab.label}
              </button>
            ))}
          </div>

          {feed.status === "loading" && (
            <p className="px-1 text-[0.875rem] text-pc-muted">Chargement du fil…</p>
          )}

          {feed.error !== undefined && (
            <p className="rounded-[0.625rem] bg-pc-danger-bg px-3.5 py-2.5 text-[0.8125rem] font-medium text-pc-danger" role="alert">
              {feed.error}
            </p>
          )}

          {posts.length > 0 && <PostList items={posts} />}

          {posts.length === 0 && feed.status === "empty" && (
            <div className="rounded-[0.875rem] bg-pc-surface px-5 py-10 text-center">
              <p className="font-display text-[1.25rem] font-semibold text-pc-ink">
                {scope === "following" ? "Ta meute est silencieuse" : "Rien à renifler pour l'instant"}
              </p>
              <p className="mt-2 text-[0.875rem] text-pc-muted">
                {scope === "following"
                  ? "Tu ne suis personne, ou personne n'a encore publié."
                  : "Aucun post pour le moment. Sois le premier à publier."}
              </p>
            </div>
          )}

          {feed.hasMore && posts.length > 0 && (
            <button
              className="w-full cursor-pointer rounded-[0.75rem] bg-pc-sand px-4 py-3 text-[0.875rem] font-semibold text-pc-ink transition-colors hover:bg-pc-hover2 disabled:cursor-not-allowed disabled:text-pc-faint"
              disabled={feed.isLoading}
              onClick={() => void feed.loadMore()}
              type="button"
            >
              {feed.isLoading ? "Chargement…" : "Charger plus"}
            </button>
          )}
        </main>
      </div>
    </div>
  );
};
