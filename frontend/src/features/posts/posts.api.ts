export function feedUrl(cursor: string | undefined, limit: number): string {
    const params = new URLSearchParams();

    params.set('limit', String(limit));

    if (cursor !== undefined) {
        params.set('cursor', cursor);
    }

    return `/posts?${params.toString()}`;
}
