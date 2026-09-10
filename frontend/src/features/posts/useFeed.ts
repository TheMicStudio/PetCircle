import { useState, useEffect, useRef, useCallback } from "react";
import { feedPageSchema } from "@petcircle/contracts";
import type { FeedPost, FeedScope } from "@petcircle/contracts";
import { apiGet } from "../../shared/api/query/query";
import { pageUrl } from "./posts.api";

const PAGE_SIZE = 20;

export type FeedStatus = "empty" | "loading" | "error" | "success";

// cursor pagination shared by the feed and a user profile, only the path changes
function usePostsPage(path: string, scope?: FeedScope) {
  const [items, setItems] = useState<FeedPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(true);

  // refs, not state: fetchPage reads them when it runs, a state would be stale in the closure
  const cursor = useRef<string | undefined>(undefined);
  const isFetching = useRef(false);

  const fetchPage = useCallback(async (signal?: AbortSignal): Promise<void> => {
    if (isFetching.current) {
      return;
    }

    isFetching.current = true;
    setIsLoading(true);
    setError(undefined);

    try {
      const result = await apiGet<unknown>(pageUrl(path, cursor.current, PAGE_SIZE, scope), signal);

      if (result.ok === false) {
        setError(result.error);
        return;
      }

      const parsed = feedPageSchema.safeParse(result.data);

      // the body stays unknown until Zod validates it
      if (!parsed.success) {
        setError("Réponse inattendue du serveur.");
        return;
      }

      cursor.current = parsed.data.nextCursor ?? undefined;

      setItems((previous) => [...previous, ...parsed.data.items]);
      setHasMore(cursor.current !== undefined);
      setError(undefined);
    } catch (cause) {
      // the effect cleanup aborted this call, a newer one is already running
      if (signal?.aborted === true) {
        return;
      }

      setError(cause instanceof Error ? cause.message : "Erreur réseau.");
    } finally {
      if (signal?.aborted !== true) {
        setIsLoading(false);
        isFetching.current = false;
      }
    }
  }, [path, scope]);

  useEffect(() => {
    // StrictMode mounts twice in dev, aborting avoids loading the first page twice
    const controller = new AbortController();

    // a new path means another list: drop everything and start over
    setItems([]);
    setError(undefined);
    setHasMore(true);
    setIsLoading(true);
    cursor.current = undefined;
    isFetching.current = false;

    void fetchPage(controller.signal);

    return () => controller.abort();
  }, [fetchPage]);

  // derived, not a state: it can never drift from items / isLoading / error
  const status: FeedStatus =
    error !== undefined
      ? "error"
      : isLoading && items.length === 0
        ? "loading"
        : items.length === 0
          ? "empty"
          : "success";

  // drop a deleted post without reloading the list
  function remove(id: string): void {
    // the cursor is the id of the last loaded post, a deleted cursor makes the next page fail
    if (cursor.current === id) {
      cursor.current = items.filter((post) => post.id !== id).at(-1)?.id;
    }

    setItems((previous) => previous.filter((post) => post.id !== id));
  }

  // nothing left to load, the sentinel stays inert instead of refetching the last page
  const loadMore = useCallback((): Promise<void> => (hasMore ? fetchPage() : Promise.resolve()), [hasMore, fetchPage]);

  return {
    items,
    status,
    isLoading,
    error,
    hasMore,
    remove,
    loadMore,
  };
}

export function useFeed(scope: FeedScope) {
  return usePostsPage("/posts", scope);
}

export function useUserPosts(userId: string) {
  return usePostsPage(`/users/${encodeURIComponent(userId)}/posts`);
}
