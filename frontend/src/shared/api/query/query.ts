import { API_BASE } from '../config';

type ApiErrorResponse = {
    error?: string;
};

export type QueryResult<T> =
    | {
        ok: true;
        data: T;
    }
    | {
        ok: false;
        status: number;
        error: string;
    };

export async function apiGet<TResponse>(
    url: string,
    signal?: AbortSignal,
): Promise<QueryResult<TResponse>> {
    const response = await fetch(`${API_BASE}${url}`, {
        method: 'GET',
        credentials: 'include',
        signal,
    });

    if (!response.ok) {
        const errorBody: ApiErrorResponse = await response.json();

        return {
            ok: false,
            status: response.status,
            error:
                errorBody.error ??
                `La requête a échoué avec le statut ${response.status}`,
        };
    }

    const data: TResponse = await response.json();

    return {
        ok: true,
        data,
    };
}
