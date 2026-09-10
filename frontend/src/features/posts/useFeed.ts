import { useEffect, useRef, useState } from "react";
import { feedPageSchema } from "@petcircle/contracts";
import type { FeedPost } from "@petcircle/contracts";
import { apiGet } from "../../shared/api/query/query";
import { feedUrl } from "./posts.api";

const Pagination = 20;

export function useFeed() {
    const [items, setItems] = useState<FeedPost[]>([]);
    const [cursor, setCursor] = useState<string | undefined>(undefined);
    const [status, setStatus] = useState<"empty" | "loading" | "error" | "success">("empty");
    const [error, setError] = useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const isFetching = useRef(false);

    async function loadMore() {
        if (isFetching.current || !hasMore) return;

        isFetching.current = true;
        setIsLoading(true);
        setError(undefined);
        setStatus(items.length === 0 ? "loading" : "success");

        try {
            const result = await apiGet<unknown>(feedUrl(cursor, Pagination));
            if (result.ok === false) {
                setStatus("error");
                setError(result.error);
                return;
            }

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
