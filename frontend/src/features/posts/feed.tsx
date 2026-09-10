import { useEffect, useState } from "react";
import type { FeedPost, FeedScope } from "@petcircle/contracts";
import { useFeed } from "./useFeed";
import { PostList } from "./postList";
import { PostCreatePage } from "./postCreate";
import { DiscoveryRail } from "./discoveryRail";
import { FeedRail } from "./feedRail";
import { AppHeader } from "../../shared/components/AppHeader";
import { useOnVisible } from "../../shared/hooks/useOnVisible";
import { MobileNav } from "../../shared/components/MobileNav";
import { CollarIcon, RailIcon, RailRightIcon } from "../../shared/components/icons";

const TABS: { value: FeedScope; label: string; icon?: boolean }[] = [
  { value: "all", label: "Tous les posts" },
  { value: "following", label: "Ma meute", icon: true },
];

const DESKTOP = "(min-width: 64rem)";

const toggleClass = (open: boolean): string =>
  `flex cursor-pointer rounded-[0.625rem] p-2.5 transition-colors ${open ? "bg-pc-sage text-pc-forest" : "text-pc-body2 hover:bg-pc-hover hover:text-pc-ink"}`;

// in-flow columns on desktop, off-canvas drawers below
const RAIL_SIDE = {
  left: { place: "left-0 w-[min(86vw,18.75rem)] lg:w-[13.25rem]", closed: "-translate-x-full lg:hidden" },
  right: { place: "right-0 w-[min(90vw,20.75rem)] lg:w-[18.5rem]", closed: "translate-x-full lg:hidden" },
};

const railClass = (side: keyof typeof RAIL_SIDE, open: boolean): string =>
  `fixed inset-y-0 z-[90] flex flex-col gap-7 overflow-y-auto bg-pc-page px-4 py-5 transition-transform duration-300 lg:sticky lg:top-[4.25rem] lg:z-auto lg:max-h-[calc(100vh-4.25rem)] lg:shrink-0 lg:bg-transparent lg:px-0 lg:py-0 lg:transition-none ${RAIL_SIDE[side].place} ${open ? "translate-x-0" : RAIL_SIDE[side].closed}`;

export const Feed = () => {
  const [scope, setScope] = useState<FeedScope>("all");
  const feed = useFeed(scope);
  const [added, setAdded] = useState<FeedPost[]>([]);
  // the rails are columns on desktop and drawers below, so they start open only on desktop
  const [leftOpen, setLeftOpen] = useState(() => window.matchMedia(DESKTOP).matches);
  const [rightOpen, setRightOpen] = useState(() => window.matchMedia(DESKTOP).matches);
  const posts = [...added, ...feed.items];
  const loadMoreRef = useOnVisible(feed.loadMore, feed.hasMore);

  // crossing the desktop breakpoint: columns become drawers, and two open drawers would overlap
  useEffect(() => {
    const query = window.matchMedia(DESKTOP);
    const sync = (event: MediaQueryListEvent) => {
      setLeftOpen(event.matches);
      setRightOpen(event.matches);
    };

    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  // a deleted post can come from the feed or from the posts created on this page
  const handleDeleted = (id: string) => {
    feed.remove(id);
    setAdded((previous) => previous.filter((post) => post.id !== id));
  };

  // one drawer at a time below desktop, the screen is too narrow for two
  const toggleLeft = () => {
    setLeftOpen((open) => !open);
    if (!window.matchMedia(DESKTOP).matches) setRightOpen(false);
  };
  const toggleRight = () => {
    setRightOpen((open) => !open);
    if (!window.matchMedia(DESKTOP).matches) setLeftOpen(false);
  };
  const closeRails = () => {
    setLeftOpen(false);
    setRightOpen(false);
  };

  return (
    <div className="pc-app">
      <AppHeader
        leading={
          <button aria-expanded={leftOpen} aria-label="Navigation" className={toggleClass(leftOpen)} onClick={toggleLeft} type="button">
            <RailIcon />
          </button>
        }
        search
        trailing={
          <button aria-expanded={rightOpen} aria-label="Découverte" className={toggleClass(rightOpen)} onClick={toggleRight} type="button">
            <RailRightIcon />
          </button>
        }
      />

      {(leftOpen || rightOpen) && (
        <div aria-hidden="true" className="fixed inset-0 z-[85] bg-[#26181066] lg:hidden" onClick={closeRails} />
      )}

      <div className="mx-auto flex max-w-[86rem] items-start gap-[clamp(1.125rem,2.4vw,2rem)] px-4 pt-4 pb-32 sm:px-[clamp(1rem,3vw,2.125rem)] sm:pt-[clamp(1rem,2.4vw,1.75rem)] sm:pb-24">
        <aside aria-label="Navigation" className={railClass("left", leftOpen)}>
          <FeedRail />
        </aside>

        <main className="mx-auto flex w-full min-w-0 max-w-[42rem] flex-col gap-4">
          <PostCreatePage setAdded={setAdded} />

          {/* changing the scope changes the url, which resets the list on its own */}
          <div className="flex flex-wrap items-center gap-3.5">
          <fieldset className="m-0 flex min-w-0 gap-[3px] rounded-[0.6875rem] border-0 bg-pc-sand p-[3px]">
            <legend className="sr-only">Filtrer le fil</legend>
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
          </fieldset>
          {posts.length > 0 && (
            <span className="text-[0.78125rem] text-pc-muted2">
              {posts.length} moment{posts.length > 1 ? "s" : ""}{scope === "following" ? " de votre meute" : ""}
            </span>
          )}
          </div>

          {feed.status === "loading" && (
            <p className="px-1 text-[0.875rem] text-pc-muted">Chargement du fil…</p>
          )}

          {feed.error !== undefined && (
            <p className="rounded-[0.625rem] bg-pc-danger-bg px-3.5 py-2.5 text-[0.8125rem] font-medium text-pc-danger" role="alert">
              {feed.error}
            </p>
          )}

          {posts.length > 0 && <PostList items={posts} onDeleted={handleDeleted} />}

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

          {feed.isLoading && posts.length > 0 && (
            <p className="px-1 text-[0.875rem] text-pc-muted">Chargement…</p>
          )}

          {feed.hasMore && posts.length > 0 && <div ref={loadMoreRef} />}
        </main>

        <aside aria-label="Découverte" className={railClass("right", rightOpen)}>
          <DiscoveryRail posts={posts} />
        </aside>
      </div>

      <MobileNav />
    </div>
  );
};
