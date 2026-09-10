import { API_BASE } from '../config';

export type MutationMethod = 'POST' | 'PUT' | 'DELETE';

export type FieldErrors = Record<string, string>;

export type ApiErrorResponse = {
    error?: string;
    fields?: FieldErrors;
};

export type ApiResult<T> =
    | {
        ok: true;
        data: T | undefined;
    }
    | {
        ok: false;
        status: number;
        error: string;
        fields: FieldErrors;
    };


export type MutationState<T> =
    | {
        status: 'idle';
    }
    | {
        status: 'loading';
    }
    | {
        status: 'empty';
    }
    | {
        status: 'success';
        data: T | undefined;
    }
    | {
        status: 'error';
        message: string;
        fields: FieldErrors;
    };

async function apiRequest<
    TResponse,
    TBody,
>(
    url: string,
    method: MutationMethod,
    body?: TBody,
): Promise<ApiResult<TResponse>> {
    const request: RequestInit = {
        method,
        // the token lives in an httpOnly cookie, fetch drops it without this
        credentials: 'include',
    };

    if (body !== undefined) {
        if (body instanceof FormData) {
            // no Content-Type: only the browser knows the multipart boundary
            request.body = body;
        } else {
            request.headers = { 'Content-Type': 'application/json' };
            request.body = JSON.stringify(body);
        }
    }

    const response = await fetch(`${API_BASE}${url}`, request);

    // DELETE answers 204 with an empty body, response.json() would throw on it
    if (response.status === 204) {
        return {
            ok: true,
            data: undefined,
        };
    }

    // fetch only rejects on network failure, a 4xx/5xx is a resolved promise
    if (!response.ok) {
        const errorBody: ApiErrorResponse =
            await response.json();

        // shape produced by errorHandler.ts, the ?? cover a body from elsewhere
        return {
            ok: false,
            status: response.status,
            error:
                errorBody.error ??
                `La requête a échoué avec le statut ${response.status}`,
            fields: errorBody.fields ?? {},
        };
    }

    const data: TResponse = await response.json();

    return {
        ok: true,
        data,
    };
}

export function apiPost<
    TResponse,
    TBody,
>(
    url: string,
    body?: TBody,
): Promise<ApiResult<TResponse>> {
    return apiRequest<TResponse, TBody>(
        url,
        'POST',
        body,
    );
}

export function apiPut<
    TResponse,
    TBody,
>(
    url: string,
    body?: TBody,
): Promise<ApiResult<TResponse>> {
    return apiRequest<TResponse, TBody>(
        url,
        'PUT',
        body,
    );
}

export function apiDelete<
    TResponse = void,
    TBody = undefined,
>(
    url: string,
    body?: TBody,
): Promise<ApiResult<TResponse>> {
    return apiRequest<TResponse, TBody>(
        url,
        'DELETE',
        body,
    );
}
