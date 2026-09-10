import { useState, useEffect, useRef, useCallback } from "react";
import { feedPageSchema } from "@petcircle/contracts";
import type { FeedPost, FeedScope } from "@petcircle/contracts";
import { useEffect, useRef, useState } from "react";
import { feedPageSchema } from "@petcircle/contracts";
import type { FeedPost } from "@petcircle/contracts";
import { apiGet } from "../../shared/api/query/query";
import { pageUrl } from "./posts.api";

const PAGE_SIZE = 20;

// cursor pagination shared by the feed and a user profile, only the path changes
function usePostsPage(path: string, scope?: FeedScope) {
  const [items, setItems] = useState<FeedPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(true);

  // refs, not state: fetchPage reads them when it runs, a state would be stale in the closure
  const cursor = useRef<string | undefined>(undefined);
  const isFetching = useRef(false);
export function useFeed() {
    const [items, setItems] = useState<FeedPost[]>([]);
    const [cursor, setCursor] = useState<string | undefined>(undefined);
    const [status, setStatus] = useState<"empty" | "loading" | "error" | "success">("empty");
    const [error, setError] = useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const isFetching = useRef(false);

  const fetchPage = useCallback(async (signal?: AbortSignal): Promise<void> => {
    if (isFetching.current) {
      return;
    }
    async function loadMore() {
        if (isFetching.current || !hasMore) return;

    isFetching.current = true;
    setIsLoading(true);
        isFetching.current = true;
        setIsLoading(true);
        setError(undefined);
        setStatus(items.length === 0 ? "loading" : "success");

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
        try {
            const result = await apiGet<unknown>(feedUrl(cursor, Pagination));
            if (result.ok === false) {
                setStatus("error");
                setError(result.error);
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
    cursor.current = undefined;
    isFetching.current = false;

    void fetchPage(controller.signal);

    return () => controller.abort();
  }, [fetchPage]);

  return { items, isLoading, error, hasMore, loadMore: () => fetchPage() };
}

export function useFeed(scope: FeedScope) {
  return usePostsPage("/posts", scope);
}

export function useUserPosts(userId: string) {
  return usePostsPage(`/users/${encodeURIComponent(userId)}/posts`);
            const parsed = feedPageSchema.safeParse(result.data);
            if (!parsed.success) {
                setStatus("error");
                setError("La réponse du serveur est invalide.");
                return;
            }

            const nextCursor = parsed.data.nextCursor ?? undefined;
            setItems((previous) => [...previous, ...parsed.data.items]);
            setCursor(nextCursor);
            setHasMore(nextCursor !== undefined);
            setStatus(parsed.data.items.length === 0 && items.length === 0 ? "empty" : "success");
        } catch (cause: unknown) {
            setStatus("error");
            setError(cause instanceof Error ? cause.message : "Impossible de charger le fil.");
        } finally {
            isFetching.current = false;
            setIsLoading(false);
        }
    }

    useEffect(() => {
        void loadMore();
    }, []);

    return { items, status, error, isLoading, hasMore, loadMore };
}
