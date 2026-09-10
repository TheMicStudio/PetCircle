import type { FeedScope } from "@petcircle/contracts";

// builds the query string of any cursor paginated list
export function pageUrl(
    path: string,
    cursor: string | undefined,
    limit: number,
    scope?: FeedScope,
): string {
    const params = new URLSearchParams();

    params.set('limit', String(limit));

    if (cursor !== undefined) {
        params.set('cursor', cursor);
    }

    // only the feed sends a scope, a user posts list is already filtered by its path
    if (scope !== undefined) {
        params.set('scope', scope);
    }

    return `${path}?${params.toString()}`;
}
