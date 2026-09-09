// builds the query string of any cursor paginated list
export function pageUrl(path: string, cursor: string | undefined, limit: number): string {
    const params = new URLSearchParams();

    params.set('limit', String(limit));

    if (cursor !== undefined) {
        params.set('cursor', cursor);
    }

    return `${path}?${params.toString()}`;
}
