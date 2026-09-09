import { useState } from "react";
import type { FeedScope } from "@petcircle/contracts";
import { useFeed } from "./useFeed";
import { PostList } from "./postList";
import { PostCreatePage } from "./postList";
import { Link } from "react-router-dom";
import { useSession } from "../auth/session";

const TABS: { value: FeedScope; label: string }[] = [
  { value: "all", label: "Tout" },
  { value: "following", label: "Abonnements" },
];

export const Feed = () => {
  const [scope, setScope] = useState<FeedScope>("all");
  const feed = useFeed(scope);
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

        {/* changing the scope changes the url, which resets the list on its own */}
        <div className="mt-4 flex gap-2">
          {TABS.map((tab) => (
            <button
              aria-pressed={scope === tab.value}
              className={
                scope === tab.value
                  ? "h-8 rounded-[0.5rem] bg-[#262626] px-3 text-[0.8125rem] font-medium text-white"
                  : "h-8 rounded-[0.5rem] border border-solid border-[#00000014] bg-white px-3 text-[0.8125rem] text-[#525252] transition-colors hover:text-[#111111]"
              }
              key={tab.value}
              onClick={() => setScope(tab.value)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-5">
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
            <p className="text-[0.875rem] text-[#525252]">
              {scope === "following"
                ? "Tu ne suis personne, ou personne n'a encore publié."
                : "Aucun post pour le moment."}
            </p>
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
