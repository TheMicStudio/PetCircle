import { useState, useEffect, useRef } from "react";
import type { FeedPost, FeedPage } from "@petcircle/contracts";
import { apiGet } from "../../shared/api/query/query";
import { feedUrl } from "./posts.api";

const Pagination = 20;

export function useFeed() {
  const [items, setItems] = useState<FeedPost[]>([]);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [error, setError] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const isFetching = useRef(false);

  async function loadMore() {
      if (isFetching.current) {
          return;
      }

      if (!hasMore) {
          return;
      }

      isFetching.current = true;
      setIsLoading(true);

      const url = feedUrl(cursor, Pagination);
      const result = await apiGet<FeedPage>(url);

      if (result.ok === false) {
          isFetching.current = false;
          setIsLoading(false);
          return;
      }

      const nextCursor = result.data.nextCursor ?? undefined;

      setItems((prev) => [...prev, ...result.data.items]);
      setCursor(nextCursor);
      setHasMore(nextCursor !== undefined);

      isFetching.current = false;
      setIsLoading(false);
  }




  useEffect(() => { void loadMore(); },
  [])
  return { items, status, error, isLoading, hasMore , loadMore};


}
